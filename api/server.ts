import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Detect serverless (Vercel). Used to skip the HTTP listener and to tighten
// timeouts so a request always finishes inside the function's execution limit.
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Behind the Vercel proxy, `req.ip` is the proxy's address unless trust proxy is
// enabled, which would make the rate limiter apply per proxy instead of per
// visitor.
app.set('trust proxy', 1);

// PostgreSQL Connection
// Pool is deliberately tiny: a serverless instance handles a few concurrent
// requests at most, and Neon should not be saturated by idle connections.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  max: 2,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
  allowExitOnIdle: true,
});

pool.connect()
  .then((client) => {
    console.log('Connected to Neon PostgreSQL');
    client.release();
  })
  .catch((err) => console.error('PostgreSQL connection error:', err));

// ── Security middleware ──────────────────────────────────────────────

// Basic security headers (CSP is relaxed so Swagger UI keeps loading)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
      imgSrc: ["'self'", 'data:', 'https://unpkg.com'],
      fontSrc: ["'self'", 'data:', 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
    },
  },
}));

// CORS: open by default (dev). Set ALLOWED_ORIGINS (comma separated) to enforce.
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map((o) => o.trim()).filter(Boolean);
const useCorsWhitelist = configuredOrigins.length > 0;
app.use(cors({
  origin: (origin, callback) => {
    if (!useCorsWhitelist || !origin || configuredOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Origin not allowed by CORS'));
    }
  },
}));

app.use(express.json({ limit: '10kb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

app.use('/api', generalLimiter);

// Global Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Constant-time string comparison for the admin key
const safeEqual = (a: string, b: string): boolean => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

const isAdminRequest = (req: Request): boolean => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const headerKey = req.headers['x-admin-key'] as string | undefined;
  return (!!bearer && safeEqual(bearer, adminKey)) || (!!headerKey && safeEqual(headerKey, adminKey));
};

// Initialize Tables
const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS guestbook (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                email TEXT,
                avatar TEXT,
                edit_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS email TEXT;
            ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS avatar TEXT;
            ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS edit_token TEXT;

            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                project_type TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS project_type TEXT;
        `);
    console.log('Guestbook + contact tables ensured.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
};
initDB();

// Swagger Documentation
// swagger.yaml is not part of a serverless bundle, so the docs route is only
// mounted when the file can actually be read from disk (i.e. local dev).
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
try {
  const swaggerDocument = YAML.load('./swagger.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI mounted at /api/docs');
} catch {
  console.warn('Swagger UI disabled (swagger.yaml not available in this environment).');
}

// Setup Nodemailer transporter
// Port 587 (STARTTLS) is used instead of nodemailer's `service: 'gmail'` default of 465,
// because cloud hosts frequently black-hole outbound 465, which makes sendMail hang
// until the caller's proxy times out. Timeouts guarantee a fast failure so a mail
// outage can never take down the request.
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const hasMailCredentials = Boolean(EMAIL_USER && EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: EMAIL_USER,
    // App passwords are displayed in 4-character groups ("abcd efgh ijkl mnop").
    // Strip whitespace so a copy-paste with spaces still authenticates.
    pass: (EMAIL_PASS || '').replace(/\s+/g, ''),
  },
  connectionTimeout: isServerless ? 5000 : 10000,
  greetingTimeout: isServerless ? 5000 : 10000,
  socketTimeout: isServerless ? 5000 : 15000,
});

// Test endpoint
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript backend (Neon DB)!' });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Collaboration endpoint (Email only for now, DB optional or future)
app.post('/api/collaborate',
  writeLimiter,
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name must be 80 characters or fewer'),
    body('email').isEmail().withMessage('Valid email is required').isLength({ max: 120 }).withMessage('Email must be 120 characters or fewer'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Description must be 2000 characters or fewer'),
    body('requirements').optional().isLength({ max: 2000 }).withMessage('Requirements must be 2000 characters or fewer'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { name, email, company, phone, projectType, budget, timeline, description, requirements } = req.body;

    // 1. Persist first — the message must survive even if SMTP is down.
    try {
      await pool.query(
        'INSERT INTO contact_messages (name, email, project_type, description) VALUES ($1, $2, $3, $4)',
        [name, email, projectType || null, description || null]
      );
    } catch (err) {
      console.error('Failed to store contact message:', err);
      res.status(500).json({ success: false, error: 'Failed to store your message. Please try again.' });
      return;
    }

    // 2. Notify by email — best effort, never fatal.
    if (!hasMailCredentials) {
      console.warn('[Mail] EMAIL_USER/EMAIL_PASS are not set; skipping notification. Message is stored in the DB.');
    } else {
      try {
        const mailOptions = {
          from: EMAIL_USER,
          to: process.env.EMAIL_TO || EMAIL_USER,
          subject: 'New Collaboration Request',
          text: `You have received a new collaboration request:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}\nProject Type: ${projectType}\nBudget: ${budget}\nTimeline: ${timeline}\nDescription: ${description}\nRequirements: ${requirements}`,
        };
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error('[Mail] Notification failed (message is still stored in the DB):', err);
      }
    }

    res.status(201).json({ success: true, message: 'Collaboration request submitted!' });
  }
);

// Read stored contact messages (admin key required)
app.get('/api/messages', async (req: Request, res: Response) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ success: false, error: 'Not authorized.' });
    return;
  }
  try {
    const result = await pool.query('SELECT id, name, email, project_type, description, created_at FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

// Guestbook endpoint
app.post('/api/guestbook',
  writeLimiter,
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name must be 80 characters or fewer'),
    body('message').notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message must be 1000 characters or fewer'),
    body('email').optional().isEmail().withMessage('Valid email is required').isLength({ max: 120 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { name, message, email, avatar } = req.body;
    const editToken = crypto.randomBytes(24).toString('base64url');
    try {
      const result = await pool.query(
        'INSERT INTO guestbook (name, message, email, avatar, edit_token) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, message, email || null, avatar || null, editToken]
      );
      res.status(201).json({
        success: true,
        message: 'Guestbook entry added!',
        id: result.rows[0].id,
        editToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to add guestbook entry.' });
    }
  }
);

// Public list (never exposes email or edit_token)
app.get('/api/guestbook', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, name, message, avatar, created_at FROM guestbook ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching guestbook:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch guestbook entries.' });
  }
});

// Delete requires either the per-entry edit token (Bearer) or the admin API key
app.delete('/api/guestbook/:id', deleteLimiter, async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    res.status(400).json({ success: false, error: 'Invalid entry id.' });
    return;
  }
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  if (!bearer) {
    res.status(401).json({ success: false, error: 'Missing authorization token.' });
    return;
  }

  try {
    if (isAdminRequest(req)) {
      await pool.query('DELETE FROM guestbook WHERE id = $1', [id]);
      res.json({ success: true, message: 'Entry deleted' });
      return;
    }

    const result = await pool.query(
      'DELETE FROM guestbook WHERE id = $1 AND edit_token = $2 RETURNING id',
      [id, bearer]
    );
    if (result.rowCount === 0) {
      res.status(403).json({ success: false, error: 'Not authorized to delete this entry.' });
      return;
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    console.error('Error deleting guestbook entry:', err);
    res.status(500).json({ success: false, error: 'Failed to delete entry.' });
  }
});

app.get('/api/profile-views', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://komarev.com/ghpvc/?username=K-Nishant-18e&label=PROFILE+VIEWS&style=flat', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Komarev: ${response.statusText}`);
    }

    const svgText = await response.text();
    // Simple regex to find the number in the SVG
    // Looking for the last occurrence of a number in text tags usually
    // The SVG structure roughly has: <text ...>3,523</text>
    // We can strip commas and look for digits

    // Logic from frontend was: last text node.
    // Regex strategy:
    const matches = svgText.match(/>\s*([\d,]+)\s*<\/text>/g);
    let views = 0;
    if (matches && matches.length > 0) {
      // Get the last match
      const lastMatch = matches[matches.length - 1];
      // Extract number string
      const numberStr = lastMatch.replace(/<\/?text>|>|\s|,/g, '');
      const parsed = parseInt(numberStr, 10);
      if (!isNaN(parsed)) {
        views = parsed;
      }
    }

    res.json({ views });

  } catch (error) {
    console.error('Error fetching profile views:', error);
    res.status(500).json({ error: 'Failed to fetch profile views' });
  }
});

app.get('/api/commit-stats', async (req: Request, res: Response) => {
  try {
    // We use the same username "K-Nishant-18" as seen in the frontend code for this card
    // The previous URL was: https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=K-Nishant-18
    const response = await fetch(`https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=K-Nishant-18&t=${new Date().getTime()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch commit stats: ${response.statusText}`);
    }

    const svgText = await response.text();
    // Return the SVG text in a JSON object so the frontend can parse it
    res.json({ svg: svgText });

  } catch (error) {
    console.error('Error fetching commit stats:', error);
    res.status(500).json({ error: 'Failed to fetch commit stats' });
  }
});

// Local development entry point. On Vercel the app is invoked as a serverless
// function handler (see api/[...path].ts) and must never open a listener.
const isDirectRun =
  !isServerless && typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module;

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;