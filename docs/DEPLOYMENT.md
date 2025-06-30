# Deployment Guide

## Overview

This guide covers deploying the portfolio website to various hosting platforms with optimal configuration for performance and SEO.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from project root
   vercel
   ```

2. **Configuration**
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

2. **Redirects Configuration**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### GitHub Pages

1. **GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 🔧 Build Configuration

### Environment Variables

Create `.env.production`:
```env
VITE_APP_TITLE=Kumar Nishant - Full Stack Developer
VITE_APP_DESCRIPTION=Full-Stack Developer specializing in Java Spring Boot and React.js
VITE_APP_URL=https://your-domain.com
VITE_CONTACT_EMAIL=me.knishant@gmail.com
```

### Vite Configuration

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Change for GitHub Pages: '/repository-name/'
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['gsap', 'lenis'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
});
```

### Image Optimization

1. **WebP Conversion**
   ```bash
   # Install sharp for image processing
   npm install --save-dev sharp
   ```

2. **Responsive Images**
   ```tsx
   <img
     src="image.webp"
     srcSet="image-400.webp 400w, image-800.webp 800w"
     sizes="(max-width: 768px) 400px, 800px"
     alt="Description"
   />
   ```

### Code Splitting

```tsx
// Lazy load pages
const Projects = lazy(() => import('./pages/Projects'));
const GuestBook = lazy(() => import('./pages/GuestBook'));
const Collaborate = lazy(() => import('./pages/Collaborate'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/projects" element={<Projects />} />
    <Route path="/guestbook" element={<GuestBook />} />
    <Route path="/collaborate" element={<Collaborate />} />
  </Routes>
</Suspense>
```

## 🔍 SEO Configuration

### Meta Tags

Update `index.html`:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>Kumar Nishant - Full Stack Developer</title>
  <meta name="title" content="Kumar Nishant - Full Stack Developer">
  <meta name="description" content="Full-Stack Developer specializing in Java Spring Boot and React.js. Building scalable, secure web applications.">
  <meta name="keywords" content="Full Stack Developer, Java, Spring Boot, React, Web Development">
  <meta name="author" content="Kumar Nishant">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://your-domain.com/">
  <meta property="og:title" content="Kumar Nishant - Full Stack Developer">
  <meta property="og:description" content="Full-Stack Developer specializing in Java Spring Boot and React.js">
  <meta property="og:image" content="https://your-domain.com/og-image.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://your-domain.com/">
  <meta property="twitter:title" content="Kumar Nishant - Full Stack Developer">
  <meta property="twitter:description" content="Full-Stack Developer specializing in Java Spring Boot and React.js">
  <meta property="twitter:image" content="https://your-domain.com/og-image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://your-domain.com/">
</head>
```

### Sitemap Generation

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-12-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/projects</loc>
    <lastmod>2024-12-15</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/guestbook</loc>
    <lastmod>2024-12-15</lastmod>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://your-domain.com/collaborate</loc>
    <lastmod>2024-12-15</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>
```

### Robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

## 🔒 Security Headers

### Netlify Headers

Create `public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
```

### Vercel Headers

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📈 Analytics Setup

### Google Analytics 4

1. **Install gtag**
   ```bash
   npm install gtag
   ```

2. **Add to main.tsx**
   ```tsx
   import { gtag } from 'gtag';
   
   // Initialize GA4
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

### Performance Monitoring

```tsx
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🧪 Pre-deployment Checklist

### Performance
- [ ] Bundle size under 1MB
- [ ] Images optimized (WebP format)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing

### SEO
- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt created
- [ ] Canonical URLs set

### Functionality
- [ ] All routes working
- [ ] Forms submitting correctly
- [ ] Theme toggle working
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Security
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] No sensitive data exposed
- [ ] Dependencies updated

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile Optimization

### PWA Configuration

Create `public/manifest.json`:
```json
{
  "name": "Kumar Nishant - Portfolio",
  "short_name": "KN Portfolio",
  "description": "Full-Stack Developer Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔍 Monitoring & Maintenance

### Error Tracking

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

### Uptime Monitoring

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring features
- **StatusPage**: Status page for users

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Routing Issues**
   - Ensure proper redirects configuration
   - Check base URL in vite.config.ts
   - Verify React Router setup

3. **Performance Issues**
   - Analyze bundle size
   - Optimize images
   - Enable compression

4. **SEO Problems**
   - Verify meta tags
   - Check sitemap accessibility
   - Test with Google Search Console

---

For additional support, refer to the platform-specific documentation or create an issue in the repository.