// Optional email notification — only runs if EMAIL_USER / EMAIL_PASS are
// set as environment variables. Submissions are always saved to Supabase
// regardless of whether email is configured.

let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // a Gmail App Password, not the normal password
    },
  });
}

async function emailSubmission(subject, payload) {
  if (!transporter) return; // email not configured — Supabase save still happened
  const body = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject,
    text: body,
  });
}

module.exports = { emailSubmission };
