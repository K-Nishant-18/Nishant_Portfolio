import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

pool.connect()
  .then((client) => {
    console.log('Connected to Neon PostgreSQL');
    client.release();
  })
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Global Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Initialize Tables
const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS guestbook (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log('Guestbook table ensured.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
};
initDB();

app.use(cors());
app.use(express.json());

// Swagger Documentation
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
console.log('Loading Swagger YAML...');
const swaggerDocument = YAML.load('./swagger.yaml');
console.log('Swagger Document Loaded:', swaggerDocument ? 'Yes' : 'No');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('Swagger Route Registered at /api/docs');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { name, email, company, phone, projectType, budget, timeline, description, requirements } = req.body;

    try {
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: 'New Collaboration Request',
        text: `You have received a new collaboration request:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}\nProject Type: ${projectType}\nBudget: ${budget}\nTimeline: ${timeline}\nDescription: ${description}\nRequirements: ${requirements}`,
      };
      await transporter.sendMail(mailOptions);
      res.status(201).json({ success: true, message: 'Collaboration request submitted!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to submit collaboration request.' });
    }
  }
);

// Guestbook endpoint
app.post('/api/guestbook',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    const { name, message } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING id',
        [name, message]
      );
      res.status(201).json({ success: true, message: 'Guestbook entry added!', id: result.rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to add guestbook entry.' });
    }
  }
);

app.get('/api/guestbook', async (req: Request, res: Response) => {
  console.log('GET /api/guestbook called');
  try {
    const result = await pool.query('SELECT * FROM guestbook ORDER BY created_at DESC');
    console.log('Query success, rows:', result.rowCount);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching guestbook:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch guestbook entries.' });
  }
});

app.delete('/api/guestbook/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM guestbook WHERE id = $1', [id]);
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});