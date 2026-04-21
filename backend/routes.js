// ============================================
//  routes.js — MODIFIED FILE
//  Changes:
//  1. POST /api/donations — completely rewritten
//     for offline donation system. Accepts all
//     4 donation types: Money/Food/Clothes/Scholarship.
//     Amount only required when type = Money.
//     Stores phone, type, description, visit_date.
//  2. GET /api/donations — returns new columns
//  3. GET /api/stats — counts ALL donation entries
//     not just money
//  4. GET /api/activity — updated label text
//  All other routes unchanged.
// ============================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');
const { sendDonationEmail, sendApplicationEmail, sendOtpEmail } = require('./mailer');
const { saveOtp, verifyOtp, generateOtp } = require('./otpStore');

// ── Aadhaar helpers (unchanged) ───────────────
const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
const maskAadhaar     = (aadhaar) => '********' + aadhaar.slice(-4);

// ── Valid donation types ──────────────────────
const VALID_TYPES = ['Money', 'Food', 'Clothes', 'Scholarship'];


// ─────────────────────────────────────────────
//  POST /api/verify/send-otp  (UNCHANGED)
// ─────────────────────────────────────────────
router.post('/verify/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  try {
    const otp = generateOtp();
    saveOtp(email, otp);
    await sendOtpEmail(email, otp);
    return res.json({ message: `A 6-digit OTP has been sent to ${email}. Please check your inbox.` });
  } catch (err) {
    console.error('Send OTP error:', err.message);
    return res.status(500).json({ message: 'Could not send OTP email. Please try again.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/verify/check-otp  (UNCHANGED)
// ─────────────────────────────────────────────
router.post('/verify/check-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

  const result = verifyOtp(email, otp.trim());
  if (result === 'valid')     return res.json({ verified: true, message: 'Email verified successfully!' });
  if (result === 'expired')   return res.status(400).json({ verified: false, message: 'OTP has expired. Please request a new one.' });
  if (result === 'not_found') return res.status(400).json({ verified: false, message: 'No OTP found. Please request one first.' });
  return res.status(400).json({ verified: false, message: 'Incorrect OTP. Please try again.' });
});


// ─────────────────────────────────────────────
//  GET /api/stats  (MODIFIED)
//  Now counts ALL donation entries regardless of
//  type (not just money), and also counts money total
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [[{ children }]]     = await db.query('SELECT COUNT(*) AS children    FROM children');
    const [[{ donations }]]    = await db.query('SELECT COUNT(*) AS donations   FROM donations');
    const [[{ applications }]] = await db.query('SELECT COUNT(*) AS applications FROM applications');
    const [[{ events }]]       = await db.query('SELECT COUNT(*) AS events      FROM events');

    // Sum only money donations (amount may be NULL for non-money types)
    const [[{ totalAmount }]] = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalAmount
       FROM donations WHERE type = 'Money' OR type IS NULL`
    );

    res.json({ children, donations, applications, events, totalAmount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Could not fetch stats.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/activity  (MODIFIED)
//  Updated donation label to "Donation Scheduled"
// ─────────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const [childRows] = await db.query(
      `SELECT 'Child' AS type, full_name AS name, status AS detail, created_at AS date
       FROM children ORDER BY created_at DESC LIMIT 4`
    );

    // Show donation type in the detail column
    const [donationRows] = await db.query(
      `SELECT 'Donation Scheduled' AS type, donor_name AS name,
              CONCAT(COALESCE(type,'Money'), ' donation') AS detail, donated_at AS date
       FROM donations ORDER BY donated_at DESC LIMIT 4`
    );

    const [appRows] = await db.query(
      `SELECT 'Adoption Request' AS type, applicant_name AS name, status AS detail, submitted_at AS date
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
//  GET /api/donations  (MODIFIED)
//  Now returns all new columns
// ─────────────────────────────────────────────
router.get('/donations', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, donor_name, donor_email, phone, type, description,
              amount, visit_date, mode, donated_at
       FROM donations ORDER BY donated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Donations fetch error:', err);
    res.status(500).json({ message: 'Could not fetch donations.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/donations  (FULLY REWRITTEN)
//  Now handles offline donations of 4 types.
//  Amount is only required for Money donations.
//  Stores phone, type, description, visit_date.
// ─────────────────────────────────────────────
router.post('/donations', async (req, res) => {
  const {
    donor_name,
    donor_email,
    phone,
    type,           // 'Money' | 'Food' | 'Clothes' | 'Scholarship'
    description,
    amount,
    visit_date,
    message,
    aadhaar,
    emailVerified,
  } = req.body;

  // 1. Email must be verified via OTP
  if (!emailVerified) {
    return res.status(400).json({
      message: 'Please verify your email address with the OTP before submitting.'
    });
  }

  // 2. Required fields
  if (!donor_name || !donor_email || !type || !visit_date) {
    return res.status(400).json({
      message: 'Name, email, donation type, and preferred visit date are required.'
    });
  }

  // 3. Validate donation type
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Invalid donation type selected.' });
  }

  // 4. Amount required only for Money donations
  if (type === 'Money') {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Please enter a valid donation amount.' });
    }
  }

  // 5. Aadhaar validation
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    const maskedAadhaar = maskAadhaar(aadhaar);
    const finalAmount   = type === 'Money' ? Number(amount) : null;

    await db.query(
      `INSERT INTO donations
         (donor_name, donor_email, phone, type, description, amount,
          visit_date, mode, purpose, aadhaar_masked, donation_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'offline', ?, ?, ?)`,
      [
        donor_name,
        donor_email,
        phone        || null,
        type,
        description  || null,
        finalAmount,
        visit_date,
        message      || null,
        maskedAadhaar,
        type,                  // also store in legacy donation_type column
      ]
    );

    // Send confirmation email (non-blocking)
    try {
      await sendDonationEmail(donor_email, donor_name, finalAmount || 0, type, visit_date);
    } catch (emailErr) {
      console.warn('Donation email failed (donation still saved):', emailErr.message);
    }

    res.status(201).json({
      message: `Thank you! Please visit the orphanage on ${new Date(visit_date).toLocaleDateString('en-IN')} to complete your ${type.toLowerCase()} donation.`
    });

  } catch (err) {
    console.error('Donation insert error:', err.message);
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
//  POST /api/applications  (UNCHANGED)
// ─────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const { applicant_name, applicant_email, applicant_phone, application_type, message, aadhaar, emailVerified } = req.body;

  if (!emailVerified) {
    return res.status(400).json({ message: 'Please verify your email address with the OTP before submitting.' });
  }
  if (!applicant_name || !applicant_email || !application_type) {
    return res.status(400).json({ message: 'Name, email, and application type are required.' });
  }
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits (numbers only).' });
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
      console.warn('Application email failed:', emailErr.message);
    }
    res.status(201).json({ message: 'Application submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Application insert error:', err);
    res.status(500).json({ message: 'Could not submit application. Please try again.' });
  }
});


module.exports = router;
