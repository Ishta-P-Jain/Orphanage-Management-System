// ============================================
//  server.js — MODIFIED FILE
//  Only change: added the new /api routes.
//  Auth routes (/api/auth) are untouched.
// ============================================

const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const authRoutes = require('./auth');       // existing — untouched
const apiRoutes  = require('./routes');     // NEW — all new feature routes

const { sendRegistrationEmail, sendLoginEmail } = require('./mailer');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Existing auth routes — NOT modified
app.use('/api/auth', authRoutes);

// NEW routes for children, donations, applications, stats, activity
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Orphanage API is running on port ' + PORT);
});

// Email test helper (from previous version)
app.get('/api/test-email', async (req, res) => {
  const testEmail = req.query.email;
  if (!testEmail) {
    return res.status(400).json({ message: 'Usage: /api/test-email?email=you@gmail.com' });
  }
  try {
    await sendRegistrationEmail(testEmail, 'Test User');
    res.json({ success: true, message: 'Test email sent to ' + testEmail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
