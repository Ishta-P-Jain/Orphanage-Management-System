// ============================================
//  routes.js — MODIFIED FILE
//  Changes from previous version:
//  1. Added POST /api/verify/send-otp
//     → generates OTP, emails it, stores in memory
//  2. Added POST /api/verify/check-otp
//     → validates the OTP the user typed in
//  3. POST /api/donations — checks emailVerified flag
//  4. POST /api/applications — checks emailVerified flag
//  All GET routes are completely untouched.
// ============================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');
const { sendDonationEmail, sendApplicationEmail, sendOtpEmail } = require('./mailer');
const { saveOtp, verifyOtp, generateOtp } = require('./otpStore');

// ── Aadhaar helpers (unchanged) ───────────────
const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
const maskAadhaar     = (aadhaar) => '********' + aadhaar.slice(-4);


// ─────────────────────────────────────────────
//  POST /api/verify/send-otp  ← NEW
//  Step 1: User clicks "Send OTP" button.
//  Generates a 6-digit OTP, saves it in memory
//  with 10-min expiry, then emails it.
// ─────────────────────────────────────────────
router.post('/verify/send-otp', async (req, res) => {
  const { email } = req.body;

  // Basic email format check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const otp = generateOtp();  // e.g. "847203"
    saveOtp(email, otp);        // store with 10-min expiry

    // Send OTP email
    await sendOtpEmail(email, otp);

    console.log(`OTP sent to ${email}`); // log for debugging (remove in production)

    return res.json({
      message: `A 6-digit OTP has been sent to ${email}. Please check your inbox.`,
    });
  } catch (err) {
    console.error('Send OTP error:', err.message);
    return res.status(500).json({
      message: 'Could not send OTP email. Please check your email address and try again.',
    });
  }
});


// ─────────────────────────────────────────────
//  POST /api/verify/check-otp  ← NEW
//  Step 2: User types the OTP they received.
//  Returns { verified: true } or an error.
// ─────────────────────────────────────────────
router.post('/verify/check-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const result = verifyOtp(email, otp.trim());

  if (result === 'valid') {
    return res.json({ verified: true, message: 'Email verified successfully!' });
  }
  if (result === 'expired') {
    return res.status(400).json({ verified: false, message: 'OTP has expired. Please request a new one.' });
  }
  if (result === 'not_found') {
    return res.status(400).json({ verified: false, message: 'No OTP found for this email. Please request one first.' });
  }
  // result === 'invalid'
  return res.status(400).json({ verified: false, message: 'Incorrect OTP. Please try again.' });
});


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
//  Added: emailVerified check before saving.
//  User must verify email via OTP first.
// ─────────────────────────────────────────────
router.post('/donations', async (req, res) => {
  const { donor_name, donor_email, amount, message, aadhaar, emailVerified } = req.body;

  // 1. Check email was verified via OTP
  // The frontend sends emailVerified: true only after /check-otp returned verified: true
  if (!emailVerified) {
    return res.status(400).json({
      message: 'Please verify your email address with the OTP before submitting.'
    });
  }

  // 2. Basic field validation
  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({ message: 'Name, email, and amount are required.' });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  // 3. Aadhaar validation
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    const maskedAadhaar = maskAadhaar(aadhaar);

    await db.query(
      `INSERT INTO donations (donor_name, donor_email, amount, donation_type, purpose, aadhaar_masked)
       VALUES (?, ?, ?, 'UPI', ?, ?)`,
      [donor_name, donor_email, amount, message || null, maskedAadhaar]
    );

    try {
      await sendDonationEmail(donor_email, donor_name, amount);
    } catch (emailErr) {
      console.warn('Donation confirmation email failed:', emailErr.message);
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
//  Added: emailVerified check before saving.
// ─────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const { applicant_name, applicant_email, applicant_phone, application_type, message, aadhaar, emailVerified } = req.body;

  // 1. Check email was verified via OTP
  if (!emailVerified) {
    return res.status(400).json({
      message: 'Please verify your email address with the OTP before submitting.'
    });
  }

  // 2. Basic field validation
  if (!applicant_name || !applicant_email || !application_type) {
    return res.status(400).json({ message: 'Name, email, and application type are required.' });
  }

  // 3. Aadhaar validation
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    const maskedAadhaar = maskAadhaar(aadhaar);

    await db.query(
      `INSERT INTO applications
         (applicant_name, applicant_email, applicant_phone, application_type, message, aadhaar_masked)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [applicant_name, applicant_email, applicant_phone || null, application_type, message || null, maskedAadhaar]
    );

    try {
      await sendApplicationEmail(applicant_email, applicant_name, application_type);
    } catch (emailErr) {
      console.warn('Application confirmation email failed:', emailErr.message);
    }

    res.status(201).json({ message: 'Application submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Application insert error:', err);
    res.status(500).json({ message: 'Could not submit application. Please try again.' });
  }
});


module.exports = router;
