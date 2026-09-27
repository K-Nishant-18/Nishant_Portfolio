// Vercel Serverless Function entry.
// `[...path]` maps to /api/* so every backend route keeps working at the same
// URLs the frontend already uses (/api/guestbook, /api/collaborate, ...).
import app from './server';

export default app;
