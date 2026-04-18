// ============================================
//  routes.js — MODIFIED FILE
//  Changes from previous version:
//  1. POST /api/donations — added aadhaar validation
//     + sends confirmation email after success
//  2. POST /api/applications — added aadhaar validation
//     + sends confirmation email after success
//  All GET routes are completely untouched.
// ============================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');
const { sendDonationEmail, sendApplicationEmail } = require('./mailer');

// ── Aadhaar validation helper ─────────────────
// Must be exactly 12 digits, numbers only.
// We do NOT store the real number — we store a
// masked version: first 8 digits replaced with *
// e.g. "123456789012" → "********9012"
const validateAadhaar = (aadhaar) => {
  return /^\d{12}$/.test(aadhaar);   // regex: exactly 12 digits
};

const maskAadhaar = (aadhaar) => {
  // Show only last 4 digits for storage safety
  return '********' + aadhaar.slice(-4);
};


// ─────────────────────────────────────────────
//  GET /api/stats  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [[{ children }]]     = await db.query('SELECT COUNT(*) AS children    FROM children');
    const [[{ donations }]]    = await db.query('SELECT COUNT(*) AS donations   FROM donations');
    const [[{ applications }]] = await db.query('SELECT COUNT(*) AS applications FROM applications');
    const [[{ events }]]       = await db.query('SELECT COUNT(*) AS events      FROM events');
    const [[{ totalAmount }]]  = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS totalAmount FROM donations'
    );
    res.json({ children, donations, applications, events, totalAmount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Could not fetch stats.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/activity  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const [childRows] = await db.query(
      `SELECT 'Child' AS type, full_name AS name, status AS detail, created_at AS date
       FROM children ORDER BY created_at DESC LIMIT 4`
    );
    const [donationRows] = await db.query(
      `SELECT 'Donation' AS type, donor_name AS name,
              CONCAT('₹', FORMAT(amount,0)) AS detail, donated_at AS date
       FROM donations ORDER BY donated_at DESC LIMIT 4`
    );
    const [appRows] = await db.query(
      `SELECT 'Application' AS type, applicant_name AS name, status AS detail, submitted_at AS date
       FROM applications ORDER BY submitted_at DESC LIMIT 4`
    );
    const all = [...childRows, ...donationRows, ...appRows]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] }));
    res.json(all);
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ message: 'Could not fetch activity.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/children  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/children', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, date_of_birth, gender, admission_date,
              health_status, education_level, status
       FROM children ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Children fetch error:', err);
    res.status(500).json({ message: 'Could not fetch children.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/donations  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/donations', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, donor_name, donor_email, amount, donation_type, purpose, donated_at
       FROM donations ORDER BY donated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Donations fetch error:', err);
    res.status(500).json({ message: 'Could not fetch donations.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/donations  (MODIFIED)
//  Added: aadhaar validation + email after save
// ─────────────────────────────────────────────
router.post('/donations', async (req, res) => {
  const { donor_name, donor_email, amount, message, aadhaar } = req.body;

  // 1. Basic field validation
  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({ message: 'Name, email, and amount are required.' });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  // 2. Aadhaar validation — must be exactly 12 digits
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    // 3. Store masked Aadhaar (never store full number in plain text)
    const maskedAadhaar = maskAadhaar(aadhaar);

    await db.query(
      `INSERT INTO donations (donor_name, donor_email, amount, donation_type, purpose, aadhaar_masked)
       VALUES (?, ?, ?, 'UPI', ?, ?)`,
      [donor_name, donor_email, amount, message || null, maskedAadhaar]
    );

    // 4. Send confirmation email (non-blocking — won't fail the request if email fails)
    try {
      await sendDonationEmail(donor_email, donor_name, amount);
    } catch (emailErr) {
      console.warn('Donation email failed (donation still saved):', emailErr.message);
    }

    res.status(201).json({ message: 'Thank you! Your donation has been recorded.' });
  } catch (err) {
    console.error('Donation insert error:', err);
    res.status(500).json({ message: 'Could not save donation. Please try again.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/applications  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/applications', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, applicant_name, applicant_email, applicant_phone,
              application_type, status, submitted_at
       FROM applications ORDER BY submitted_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Applications fetch error:', err);
    res.status(500).json({ message: 'Could not fetch applications.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/applications  (MODIFIED)
//  Added: aadhaar validation + email after save
// ─────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const { applicant_name, applicant_email, applicant_phone, application_type, message, aadhaar } = req.body;

  // 1. Basic field validation
  if (!applicant_name || !applicant_email || !application_type) {
    return res.status(400).json({ message: 'Name, email, and application type are required.' });
  }

  // 2. Aadhaar validation — must be exactly 12 digits
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    // 3. Store masked Aadhaar
    const maskedAadhaar = maskAadhaar(aadhaar);

    await db.query(
      `INSERT INTO applications
         (applicant_name, applicant_email, applicant_phone, application_type, message, aadhaar_masked)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [applicant_name, applicant_email, applicant_phone || null, application_type, message || null, maskedAadhaar]
    );

    // 4. Send confirmation email
    try {
      await sendApplicationEmail(applicant_email, applicant_name, application_type);
    } catch (emailErr) {
      console.warn('Application email failed (application still saved):', emailErr.message);
    }

    res.status(201).json({ message: 'Application submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Application insert error:', err);
    res.status(500).json({ message: 'Could not submit application. Please try again.' });
  }
});


module.exports = router;
