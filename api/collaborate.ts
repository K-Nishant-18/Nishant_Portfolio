import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  // Store in Supabase
  const { error: dbError } = await supabase.from('collaborations').insert([data]);
  if (dbError) {
    return res.status(500).json({ success: false, message: 'Database error', error: dbError.message });
  }

  // Send email via Resend
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.RESEND_TO!,
      subject: 'New Collaboration Request',
      html: `<h2>New Collaboration Request</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Company:</b> ${data.company}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Project Type:</b> ${data.projectType}</p>
        <p><b>Budget:</b> ${data.budget}</p>
        <p><b>Timeline:</b> ${data.timeline}</p>
        <p><b>Description:</b> ${data.description}</p>
        <p><b>Requirements:</b> ${data.requirements}</p>`
    });
  } catch (emailError) {
    return res.status(500).json({ success: false, message: 'Email error', error: (emailError as Error).message });
  }

  return res.status(200).json({ success: true, message: 'Collaboration request received and email sent!' });
} 