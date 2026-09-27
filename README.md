<div align="center">
  <h1>✨ Interactive Developer Portfolio</h1>
  <p>A high-performance, immersive portfolio template built with <strong>React</strong>, <strong>GSAP</strong>, <strong>WebGL (OGL)</strong>, and an <strong>Express API</strong> for backend processing.</p>

  [![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Express](https://img.shields.io/badge/Express-API-grey?logo=express)](https://expressjs.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
</div>

---

## 📖 Overview

This repository contains the source code for an interactive and visually rich Developer Portfolio. Unlike standard static portfolios, this project bridges modern, high-end frontend animations with a robust Node.js backend. 

It is designed to serve as both an impressive personal showcase and a learning resource for full-stack developers looking to integrate **advanced scroll animations, 3D elements**, and **Serverless/Express APIs**.

---

## 🌟 Key Features

### Frontend (Client-Side)
- 🎭 **Smooth Scrolling:** Powered by [Lenis](https://lenis.studiofreight.com/) and Locomotive Scroll for a buttery, physics-based scrolling experience.
- ✨ **Cinematic Animations:** Deep integration of [GSAP](https://greensock.com/gsap/) and [Framer Motion](https://www.framer.com/motion/) for text reveals, parallax, and page transitions.
- � **WebGL / 3D Integration:** Leveraging `ogl` and `@splinetool/react-spline` to render lightweight 3D elements directly in the browser.
- 🎵 **Ambient Experience:** A custom music player background and a custom interactive cursor (`CustomCursor.tsx`).

### Backend (Server-Side)
- ⚙️ **Express API Layer:** A cohesive Node.js `/api` instance designed to handle heavy lifting, avoiding frontend bloat.
- 📧 **Email Integration:** Uses [Resend](https://resend.com/) for handling contact form submissions securely.
- �️ **Database Integration:** Pre-configured to interact with [Supabase](https://supabase.com/).

---

## � Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

### 1. Clone the repository
```bash
git clone https://github.com/K-Nishant-18/Nishant_Portfolio.git
cd Nishant_Portfolio
```

### 2. Install Dependencies
This project uses a monolithic structure where the frontend and API have their own dependencies.

```bash
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

### 3. Environment Variables
You will need to configure environment variables for both the frontend and backend.

Create a `.env` file in the **root directory**:
```env
# Root / Frontend Variables
# NOTE: do not set VITE_API_URL for production. It is inlined at build time, so a
# localhost value would make every visitor post to their own machine. Leave it
# unset and the frontend uses the same-origin /api route.
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the **`/api` directory** (local development only — in production these are set as Vercel environment variables):
```env
# Backend API Variables
DATABASE_URL=your_postgres_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_google_app_password
EMAIL_TO=where_notifications_are_sent
# Optional: x-admin-key for /api/messages and bulk guestbook deletes
ADMIN_API_KEY=some_long_random_string
# Optional: comma separated CORS allowlist (open when unset)
ALLOWED_ORIGINS=
```

### 4. Run the Development Server
You can launch both the React frontend and the Express backend concurrently using a single command:

```bash
npm run dev:all
```
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 📂 Architecture & Project Structure

Understanding where everything lives is key to modifying the portfolio to fit your needs.

```text
Nishant_Portfolio/
├── api/                        # Backend logic (Express.js, Vercel Function)
│   ├── server.ts               # Express app: middleware, routes, SMTP, Postgres
│   ├── [...path].ts            # Serverless entry, maps to /api/*
│   ├── swagger.yaml            # OpenAPI spec (served at /api/docs in dev)
│   └── package.json            # Backend dependencies
├── public/                     # Static global assets
│   ├── previews/               # PDF resumes and static images
│   └── audio/                  # Ambient background tracks
├── src/                        # Main Frontend Codebase (React/Vite)
│   ├── components/             # Reusable UI Blocks
│   │   ├── About.tsx           # Bio and Skills section
│   │   ├── CustomCursor.tsx    # GSAP powered custom cursor
│   │   ├── Hero.tsx            # Hero section
│   │   └── ...
│   ├── pages/                  # Full-page Views (Home, ProjectDetail)
│   ├── context/                # Global State (Theme & Music Context)
│   ├── styles/                 # Tailwind base and Global CSS
│   ├── App.tsx                 # Core Routing & Layout logic
│   └── main.tsx                # Bootstrap & Lenis setup
└── package.json                # Root tooling and concurrent scripts
```

---

## 🛠️ How to Customize

If you are cloning this to build your own portfolio, you should update the following key files:

1. **/src/components/About.tsx**: Update your personal bio, current employer, and technical skills list.
2. **/src/components/Projects.tsx**: Map your own project data, tags, and GitHub URLs here.
3. **/src/components/Hero.tsx**: Replace the Spline 3D URL if you want a custom 3D element.
4. **/api/server.ts**: Configure the notification recipient (`EMAIL_TO`) and the admin key used by `/api/messages`.

---

## � Deployment Guides

### Deploying to Vercel (frontend + API)
The frontend and the API deploy together as a single Vercel project. There is no
second service to host or maintain.

1. Push your code to GitHub and connect the repository to Vercel.
2. Leave **Build Command** as `npm run build` and **Output Directory** as `dist`.
3. Add the environment variables in **Project Settings → Environment Variables**:
   `DATABASE_URL`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, and optionally
   `ADMIN_API_KEY` and `ALLOWED_ORIGINS`. The API's runtime dependencies come from
   the root `package.json`, so there is no separate API install step.
4. Deploy. `vercel.json` rewrites every non-`/api` route to `index.html` (SPA
   routing); `/api/*` is served by the serverless function in `api/[...path].ts`.

Database migrations run automatically on first invocation: the function issues
`CREATE TABLE IF NOT EXISTS` for the `guestbook` and `contact_messages` tables.

### Running the API elsewhere
`api/server.ts` is a plain Express app, so it also runs on any Node host
(`cd api && npm run build && npm start`, listening on `PORT`, default 5000). The
`isDirectRun` guard means the listener only starts when the file is executed
directly, never when it is imported as a function handler.

---

## 📝 License

Distributed under the MIT License. You are free to use, modify, and distribute this codebase for your own portfolio.
