import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Collaboration Schema & Model (extended)
const collaborationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String },
  projectType: { type: String },
  budget: { type: String },
  timeline: { type: String },
  description: { type: String },
  requirements: { type: String },
  date: { type: Date, default: Date.now },
});
const Collaboration = mongoose.model('Collaboration', collaborationSchema);

// Guestbook Schema & Model (extended)
const guestbookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  company: { type: String },
  role: { type: String },
  message: { type: String, required: true },
  rating: { type: Number },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});
const Guestbook = mongoose.model('Guestbook', guestbookSchema);

// Test endpoint
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript backend!' });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Collaboration endpoint with validation (extended)
app.post('/api/collaborate',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('company').optional().isString(),
    body('phone').optional().isString(),
    body('projectType').optional().isString(),
    body('budget').optional().isString(),
    body('timeline').optional().isString(),
    body('description').optional().isString(),
    body('requirements').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    try {
      const { name, email, company, phone, projectType, budget, timeline, description, requirements } = req.body;
      const collab = new Collaboration({ name, email, company, phone, projectType, budget, timeline, description, requirements });
      await collab.save();

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
      res.status(500).json({ success: false, error: 'Failed to submit collaboration request.' });
    }
  }
);

// Guestbook endpoint with validation (extended)
app.post('/api/guestbook',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('company').optional().isString(),
    body('role').optional().isString(),
    body('message').notEmpty().withMessage('Message is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    try {
      const { name, email, company, role, message, rating } = req.body;
      const entry = new Guestbook({ name, email, company, role, message, rating });
      await entry.save();
      res.status(201).json({ success: true, message: 'Guestbook entry added!' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to add guestbook entry.' });
    }
  }
);

app.get('/api/guestbook', async (req: Request, res: Response) => {
  try {
    const entries = await Guestbook.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch guestbook entries.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 