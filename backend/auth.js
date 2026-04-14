// ============================================
//  auth.js — Authentication Routes
//  POST /api/auth/register
//  POST /api/auth/login
// ============================================

const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('./db');
const { sendRegistrationEmail, sendLoginEmail } = require('./mailer');
require('dotenv').config();

// ─────────────────────────────────────────────────────────
//  REGISTER — POST /api/auth/register
//  Creates a new user account
// ─────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate: make sure all fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // 2. Check if this email is already registered
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    // 3. Hash the password (saltRounds = 10 is a good balance of speed vs security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the new user to the database
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // 5. Send registration confirmation email
    try {
      await sendRegistrationEmail(email, name);
    } catch (emailErr) {
      console.warn('⚠️  Registration email failed (registration still succeeded):', emailErr.message);
    }

    return res.status(201).json({ message: 'Registration successful! You can now log in.' });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


// ─────────────────────────────────────────────────────────
//  LOGIN — POST /api/auth/login
//  Verifies credentials and returns a JWT token
// ─────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate: both fields required
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 2. Look up user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (users.length === 0) {
      // Use a generic message so we don't reveal which field is wrong
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    // 3. Compare submitted password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Create a JWT token (valid for 1 day)
    const token = jwt.sign(
      {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Send login confirmation email
    try {
      await sendLoginEmail(user.email, user.name);
    } catch (emailErr) {
      console.warn('⚠️  Login email failed (login still succeeded):', emailErr.message);
    }

    // 6. Return token and safe user info (never return the password)
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
