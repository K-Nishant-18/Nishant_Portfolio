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
- 🎨 **WebGL / 3D Integration:** Leveraging `ogl` and `@splinetool/react-spline` to render lightweight 3D elements directly in the browser.
- 🎵 **Ambient Experience:** A custom music player background and a custom interactive cursor (`CustomCursor.tsx`).

### Backend (Server-Side)
- ⚙️ **Express API Layer:** A cohesive Node.js `/api` instance designed to handle heavy lifting, avoiding frontend bloat.
- 📧 **Email Integration:** Uses [Resend](https://resend.com/) for handling contact form submissions securely.
- 🗄️ **Database Integration:** Pre-configured to interact with [Supabase](https://supabase.com/).

---

## 🚀 Getting Started

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
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create a `.env` file in the **`/api` directory**:
```env
# Backend API Variables
PORT=5000
RESEND_API_KEY=your_resend_email_api_key
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
├── api/                        # Backend logic (Express.js)
│   ├── routes/                 # API endpoints (e.g., mail, guestbook)
│   ├── index.ts                # Express setup and entry point
│   └── package.json            # Backend dependencies
├── public/                     # Static global assets
│   ├── previews/               # PDF resumes and static images
│   └── audio/                  # Ambient background tracks
├── src/                        # Main Frontend Codebase (React/Vite)
│   ├── components/             # Reusable UI Blocks
│   │   ├── About.tsx           # Bio and Skills section
│   │   ├── CustomCursor.tsx    # GSAP powered custom cursor
│   │   ├── Hero.tsx            # Spline 3D Hero section
│   │   ├── SystemArchitecture.tsx # Architecture diagram visualizer
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
4. **/api/routes/**: Configure your `To:` email addressed in the Resend integration blocks.

---

## 📦 Deployment Guides

### Deploying the Frontend (Vercel or Netlify)
1. Push your code to GitHub.
2. Connect the repository to Vercel/Netlify.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Ensure you add your `VITE_` prefixed environment variables in the Vercel/Netlify dashboard.

### Deploying the Backend
The `/api` folder is designed as a standalone Node.js microservice. You can:
1. Dockerize it using the included `Dockerfile` and deploy to AWS ECS, Render, or Railway.
2. Or let Vercel handle it as Serverless Functions (ensure you have a `vercel.json` configured properly).

---

## 📝 License

Distributed under the MIT License. You are free to use, modify, and distribute this codebase for your own portfolio.
