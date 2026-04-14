// ============================================
//  server.js — Main Express Server
//  Entry point for the entire backend
// ============================================

const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const authRoutes = require('./auth');
const { sendRegistrationEmail, sendLoginEmail } = require('./mailer');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Auth routes (/api/auth/register and /api/auth/login)
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Orphanage API is running on port ' + PORT);
});

// ── TEST EMAIL ROUTE ──────────────────────────
// Use this to check if your email is working.
// Open your browser and go to:
//   http://localhost:5000/api/test-email?email=youremail@gmail.com
//
// If you receive a test email -> email is working!
// If not -> check your .env file (EMAIL_USER and EMAIL_PASS)
app.get('/api/test-email', async (req, res) => {
  const testEmail = req.query.email;

  if (!testEmail) {
    return res.status(400).json({
      message: 'Please provide an email. Example: /api/test-email?email=you@gmail.com'
    });
  }

  try {
    // Send a test registration email
    await sendRegistrationEmail(testEmail, 'Test User');
    return res.json({
      success: true,
      message: 'Test email sent! Check your inbox (and spam folder) at: ' + testEmail
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email failed: ' + error.message,
      fix: 'Check EMAIL_USER and EMAIL_PASS in your backend/.env file. Make sure you use a Gmail App Password.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
  console.log('Test email at:   http://localhost:' + PORT + '/api/test-email?email=YOUR_EMAIL');
});
