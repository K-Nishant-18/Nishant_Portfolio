# Changelog

This file logs all activity performed on the project: changes, additions, removals, and fixes.

## 2026-09-20 — Dev stats fixes (Round 3b)

**Goal:** Fix two wrong metrics on the Dev Activity section: total stars was doubled, and Profile Views showed 0 instead of the real komarev/ghpvc count.

### Changed: `src/components/DevActivity.tsx`

1. **Total stars double-count** — when the GitHub stats SVG parser returned nothing, the fallback block re-added `stargazers_count`/`forks_count` on top of the values already summed in the main stats loop (66 instead of 33). Removed the duplicate additions; stars/forks are now counted exactly once.
2. **Profile Views** — the counter is displayed as a **number** again, extracted from the komarev badge. The browser cannot read the badge directly (komarev sends no CORS headers), so the frontend fetches `/api/profile-views` on the Express API, which proxies the komarev SVG and parses the last `<text>` node into a number (`{ views }`). Final version tries three sources in order so the number always resolves: local dev API (`localhost:5000`) → Vercel-rewritten relative `/api/profile-views` → the direct Render API (`https://nishant-portfolio-1.onrender.com/api/profile-views`, confirmed CORS-open with `Access-Control-Allow-Origin: *`). Went round-trip: used raw badge `<img>` briefly, then reverted to backend-extracted number per user request. The `/api/profile-views` endpoint already existed in `api/index.ts` and needs no changes.

### Verification

- Live backend `https://nishant-portfolio-1.onrender.com/api/profile-views` → returns `{ views: 4266 }` (matches komarev badge count 4,266). `vercel.json` rewrite to that service is confirmed correct.
- `npm run build` → passes.
- `npm run lint` → 0 errors, 0 warnings.
- **Deploy note:** dev requires the local API running (`localhost:5000`); prod requires redeploying the frontend (the previously-deployed build's `/api/profile-views` call may have 404'd or the API was cold).

## 2026-09-20 — Quality gate hardening (Round 3)

**Goal:** Make TypeScript and ESLint strict-clean, fix the Hero `startAnimation` bug, fix the PWA icon paths, and gate CI on lint + typecheck. This closes out the live-component lint backlog from Round 1/2.

### Changed: `src/components/Hero.tsx`

- Added `HeroProps` with `startAnimation?: boolean` (default `true`). All entrance animations (word reveal, photo outlines/images, arrow, `hero-meta`, `quotes-container`) are now gated on it — programmatic navigation via route transitions no longer replays the full hero entrance.
- `transitionSettings: any` → typed as `Transition` (GSAP), with `import type { Transition }`.

### Changed: unused-var lint fixes (live components)

- `Loader.tsx` — removed unused `useTheme` import and `isDark` destructure.
- `RepoCard.tsx` — removed unused `updated` from destructure (kept in the interface).
- `ScrollRevealText.tsx` — now actually uses the `duration` prop (was being passed but ignored, hardcoded `0.8`); added `duration` to effect deps.
- `Navigation.tsx` — removed dead `@ts-ignore` comment (obsolete once `allowJs` was enabled).
- `Contact.tsx` — removed unused `ScrollTrigger` and `FiArrowUpRight` imports.
- `Skills.tsx` — removed unused `logoContainerRef` / `logoContainerRef2`.
- `pages/Projects.tsx` — removed unused `FiGithub` / `FiExternalLink` imports.
- `pages/GuestBook.tsx` — `catch` without unused binding; also removed a duplicate `opacity` key in the GSAP hero-reveal tween.

### Changed: `src/components/DevActivity.tsx`

- Added `GHRepo` interface; both `forEach((repo: any) =>` now use `GHRepo`.
- Removed shadowing inner `totalStars` / `totalForks` redeclaration (was hiding the outer accumulators, producing 0).
- `reduce` for All Time Contributions now typed `(a: number, b: number) => a + b, 0` over a `Record<string, number>`.
- `catch (err: any)` → `catch (err)` with `err instanceof Error` message extraction.

### Changed: effect-dependency lint warnings

- `Certifications.tsx` — `runLerp` wrapped in `useCallback`, added to the rAF effect deps.
- `MermaidDiagram.tsx` — `maxWidth` added to effect deps.
- `GuestBook.tsx` — `fetchEntries` wrapped in `useCallback` (declared before the effect) and added to deps.

### Changed: `.jsx` transition modules

- `components/TransitionLink.jsx` — now forwards extra props (`style`, etc.) to the `<a>`; `onClick` optional. Navigation's `cursor: 'none'` styling now actually renders.
- `context/TransitionContext.jsx` — hooked files are now linted and type-checked.

### Changed: toolchain hardening

- `package.json` — `"build": "tsc -b && vite build"`: TypeScript now fails the build on type errors.
- `eslint.config.js` — `files` now covers `**/*.{ts,tsx,jsx}`; react-refresh `allowExportNames: ['useTheme', 'useMusic', 'useTransition']`.
- `tsconfig.app.json` — `"allowJs": true` so the `.jsx` transition modules are type-included (no hand-written declarations needed).
- `index.html` + `vite.config.ts` — corrected PWA icon/favicon paths `/public/Logo.png` → `/Logo.png` (previously 404 in production).
- `.github/workflows/ci.yml` — added `Typecheck` (`npx tsc -b`) and `Lint` steps before `Build`.

**Note:** enabling `tsc -b` finally surfaced type errors `tsc --noEmit` (solution-file tsconfig) had been silently skipping — e.g. unsupported `style` prop on `TransitionLink`, implicit-`any` raf/ticker callbacks in `App.tsx` (now typed `time: number`).

### Verification

- `npm run lint` → **0 errors, 0 warnings** (was 19 errors / 5 warnings).
- `npm run build` → `tsc -b` + `vite build` pass (PWA `generateSW`, 55 precached entries).
- `api` → `npm run build` (tsc) passes.

## 2026-09-20 — API security hardening (Round 2)

**Note:** `K-Nishant-18e` in the profile-views counter (`api/index.ts`) is **intentional** — kept as-is, removed from the fix backlog.

**Goal:** Close the critical API holes identified in the audit: unauthenticated deletes, public email exposure, no rate limiting, wide-open CORS, and unlimited input lengths.

### Changed: `api/index.ts`

1. **Delete auth (was unauthenticated)** — `DELETE /api/guestbook/:id` now requires one of:
   - `Authorization: Bearer <editToken>` — a per-entry token returned when the entry was created, and
   - `x-admin-key: <ADMIN_API_KEY>` — optional server admin key (env var), compared in constant time (`crypto.timingSafeEqual`).
   Returns `401` (missing token), `403` (wrong token), `400` (invalid id).
2. **Privacy** — `GET /api/guestbook` no longer returns `email` (or `edit_token`); `SELECT` narrowed to `id, name, message, avatar, created_at`.
3. **Edit-token issuance** — `POST /api/guestbook` generates a `crypto.randomBytes(24)` base64url token, stores it in a new `edit_token` column, and returns it as `editToken`. DB migration added via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS edit_token`.
4. **Rate limiting** — `express-rate-limit`: general `/api` 120/15min, write (POST guestbook/collaborate) 20/15min, delete 30/15min. Returns `429`.
5. **CORS** — now driven by env var `ALLOWED_ORIGINS` (comma-separated). Open by default for dev; logs a warning and blocks once configured.
6. **Bodies** — `express.json({ limit: '10kb' })`.
7. **Validation** — max lengths added: name 80, message 1000, email 120, description/requirements 2000 on `/api/collaborate`.
8. **Security headers** — added `helmet` (CSP relaxed so Swagger UI CDN assets still load).

### Added: `api/package.json` dependencies

`express-rate-limit@^8.7.0`, `helmet@^8.3.0` (lockfile updated via `npm install`).

### Added: `api/swagger.yaml`

Rewrote to document the real API: `GET/POST /guestbook`, `DELETE /guestbook/{id}` (with auth requirements), `POST /collaborate`, `429` responses, and max-length properties. Bumped version to 1.1.0.

### Added: `api/.env` placeholders (local, gitignored)

`ADMIN_API_KEY=` (set a strong random value in production) and `ALLOWED_ORIGINS=` (set your frontend origin, e.g. `https://nishant-portfolio.vercel.app`).

### Added: `src/lib/guestbook.ts` (new shared module)

`loadMyEntries()` / `saveMyEntries()` — reads/writes the browser's own entries (`{ id, editToken }`). Legacy numeric-ID entries (pre-token era) are dropped during load because they can no longer be deleted server-side.

### Changed: `src/pages/GuestBook.tsx` and `src/components/FloatingGuestbook.tsx`

- Replaced `myEntryIds: number[]` (localStorage) with `myEntries: MyEntry[]` via the shared module.
- Delete now sends `Authorization: Bearer <editToken>`; only shows the delete action for entries this browser has a valid token for.
- POST response now stores `{ id, editToken }`.
- Removed debug logs that printed user email/payloads (`console.log('[Guestbook Submit] Sending payload:', payload)` and `console.log('[Google Auth] Profile fetched:', profile)`).

### Verification

- `api`: `npm run build` (tsc) → passes.
- Frontend: `npx tsc --noEmit` → passes; `npm run build` → passes; `npm run lint` → unchanged 19 errors / 5 warnings (all pre-existing in live components; no new issues introduced).

### Backlog note

- Remaining lint errors/warnings are in live components (`Contact`, `DevActivity`, `Hero`, `Loader`, `Navigation`, `RepoCard`, `ScrollRevealText`, `Skills`, `GuestBook`, `Projects`) — planned cleanup round.
- Next up (Round 3 candidates): Hero `startAnimation` bug, build script `tsc -b && vite build` + ESLint for `.jsx`, PWA icon fix, wire frontend contact form to the existing `/api/collaborate` endpoint.

## 2026-09-20 — Dead code removal (Round 1)

**Goal:** Remove source files and assets that are never imported or referenced, to reduce clutter, eliminate the broken file, and clean lint output.

### Removed files (never imported/referenced in the codebase)

| File | LOC | Reason |
|---|---|---|
| `src/components/Blog.tsx` | 114 | Unused; homepage uses `BlogSection.tsx` instead |
| `src/components/Collaborate.tsx` | 54 | Never imported **and contained a syntax error** (`const sectionRef` declared twice + dangling `.fromTo(`) |
| `src/components/FloatingShapes.tsx` | 66 | Never imported |
| `src/components/SystemArchitecture.tsx` | 98 | Never imported (only referenced in README docs) |
| `src/components/SplitText/SplitText.tsx` | 148 | Never imported (word-split effect duplicated elsewhere) |
| `src/components/DarkVeil/DarkVeil.tsx` | 149 | Never imported; was the only consumer of the now-removed `ogl` dependency |
| `src/components/Testimonials.tsx` | 123 | Never imported; file was 100% commented out |
| `src/components/Timeline.tsx` | 184 | Imported by `Home.tsx` but JSX was commented out; unused |
| `src/components/TestimonialPreview.tsx` | 98 | Imported by `Home.tsx` but JSX was commented out; unused |
| `src/hooks/useIsTouchDevice.ts` | 22 | Never imported; touch detection re-copied in 2 components |

**Total removed:** ~1,056 lines of dead source code.
Also removed the now-empty `src/components/SplitText/` and `src/components/DarkVeil/` directories.

### Changed files

- `src/pages/Home.tsx`: removed unused imports for `Timeline` and `TestimonialPreview` and their commented-out JSX.
- `README.md`: removed `SystemArchitecture.tsx` from the project-structure tree.
- `docs/README.md`: removed `Collaborate` page, `Timeline`/`Testimonials` components from lists and structure tree.
- `docs/DEPLOYMENT.md`: removed the `Collaborate` lazy-import snippet.

### Removed dead public assets (unreferenced)

- `public/loader2.gif`
- `public/loader_old.gif`
- `public/loader2_old.gif`
- `public/Logo-loader.mp4`

### Pruned unused dependencies from `package.json` (10 packages, never imported)

`@fontsource/syncopate`, `@splinetool/react-spline`, `@studio-freight/lenis`, `@supabase/supabase-js`, `axios`, `locomotive-scroll`, `lucide-react`, `ogl`, `poppins`, `resend`.

Ran `npm install` — removed 60 packages from `node_modules`, lockfile updated.

### Verification

- `npx tsc --noEmit` → passes, no errors.
- `npm run lint` → improved from **25 errors / 5 warnings → 19 errors / 5 warnings** (the parse error in `Collaborate.tsx` and the dead-file unused imports are gone). Remaining errors are in live components (`Contact.tsx`, `DevActivity.tsx`, `Hero.tsx`, `Loader.tsx`, `Navigation.tsx`, `RepoCard.tsx`, `ScrollRevealText.tsx`, `Skills.tsx`, `GuestBook.tsx`, `Projects.tsx`) — to be fixed in a later cleanup round.
- `npm run build` → succeeds. Note: main bundle size is unchanged (~1.09 MB / 330 KB gzip) because the removed packages were already tree-shaken (nothing imported them); further reduction requires route-level code-splitting (future task).

### Newly noticed (not yet addressed, for the backlog)

- `npm audit` reports **40 vulnerabilities** (3 low, 10 moderate, 25 high, 2 critical) in the dependency tree — needs review/upgrade.