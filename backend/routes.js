// ============================================
//  routes.js — MODIFIED FILE
//
//  ROOT CAUSE OF "Could not save donation":
//  The INSERT was writing to BOTH:
//    donation_type  (old ENUM column: Cash/UPI/etc.)
//    type           (new VARCHAR column: Money/Food/etc.)
//  MySQL rejected 'Money' into the ENUM — causing crash.
//
//  FIX: INSERT now writes ONLY to `type` (the new column).
//  `donation_type` is no longer used in any INSERT.
//  After running MASTER_fix.sql, donation_type becomes a
//  plain VARCHAR so old data still works, but new inserts
//  only use the `type` column going forward.
//
//  All other routes are completely unchanged.
// ============================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');
const { sendDonationEmail, sendApplicationEmail, sendOtpEmail } = require('./mailer');
const { saveOtp, verifyOtp, generateOtp } = require('./otpStore');

// Aadhaar helpers
const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
const maskAadhaar     = (aadhaar) => '****' + aadhaar.slice(-4);

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
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }
  const result = verifyOtp(email, otp.trim());
  if (result === 'valid')     return res.json({ verified: true, message: 'Email verified successfully!' });
  if (result === 'expired')   return res.status(400).json({ verified: false, message: 'OTP has expired. Please request a new one.' });
  if (result === 'not_found') return res.status(400).json({ verified: false, message: 'No OTP found. Please request one first.' });
  return res.status(400).json({ verified: false, message: 'Incorrect OTP. Please try again.' });
});


// ─────────────────────────────────────────────
//  GET /api/stats  (UNCHANGED)
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [[{ children }]]     = await db.query('SELECT COUNT(*) AS children     FROM children');
    const [[{ donations }]]    = await db.query('SELECT COUNT(*) AS donations    FROM donations');
    const [[{ applications }]] = await db.query('SELECT COUNT(*) AS applications FROM applications');
    const [[{ events }]]       = await db.query('SELECT COUNT(*) AS events       FROM events');
    const [[{ totalAmount }]]  = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS totalAmount
       FROM donations WHERE type = 'Money' OR type IS NULL`
    );
    res.json({ children, donations, applications, events, totalAmount });
  } catch (err) {
    console.error('Stats error:', err.message);
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
      `SELECT 'Donation Scheduled' AS type, donor_name AS name,
              CONCAT(COALESCE(type, 'Money'), ' donation') AS detail,
              donated_at AS date
       FROM donations ORDER BY donated_at DESC LIMIT 4`
    );
    const [appRows] = await db.query(
      `SELECT 'Adoption Request' AS type, applicant_name AS name,
              status AS detail, submitted_at AS date
       FROM applications ORDER BY submitted_at DESC LIMIT 4`
    );
    const all = [...childRows, ...donationRows, ...appRows]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] }));
    res.json(all);
  } catch (err) {
    console.error('Activity error:', err.message);
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
    console.error('Children fetch error:', err.message);
    res.status(500).json({ message: 'Could not fetch children.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/donations  (UNCHANGED)
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
    console.error('Donations fetch error:', err.message);
    res.status(500).json({ message: 'Could not fetch donations.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/donations  (FIXED)
//
//  THE FIX: Removed `donation_type` from INSERT.
//  Previously the query inserted into BOTH `type`
//  AND `donation_type`. The `donation_type` column
//  was an ENUM('Cash','Bank Transfer','UPI','Cheque','Kind')
//  so writing 'Money' into it caused MySQL to crash.
//  Now we only write to `type` (plain VARCHAR).
// ─────────────────────────────────────────────
router.post('/donations', async (req, res) => {
  const {
    donor_name, donor_email, phone,
    type, description, amount,
    visit_date, message, aadhaar, emailVerified,
  } = req.body;

  // 1. Email must be verified via OTP
  if (!emailVerified) {
    return res.status(400).json({
      message: 'Please verify your email address with the OTP before submitting.'
    });
  }

  // 2. Always-required fields
  if (!donor_name || !donor_email || !type || !visit_date) {
    return res.status(400).json({
      message: 'Name, email, donation type, and preferred visit date are required.'
    });
  }

  // 3. Type must be one of the 4 valid options
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Invalid donation type selected.' });
  }

  // 4. Amount is required ONLY for Money donations
  if (type === 'Money' && (!amount || isNaN(amount) || Number(amount) <= 0)) {
    return res.status(400).json({
      message: 'Please enter a valid donation amount for Money donations.'
    });
  }

  // 5. Description is required for non-Money donations
  if (type !== 'Money' && !description) {
    return res.status(400).json({
      message: 'Please describe what you are donating (e.g. "10kg rice", "5 winter jackets").'
    });
  }

  // 6. Aadhaar must be exactly 12 digits
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    const maskedAadhaar = maskAadhaar(aadhaar);
    const finalAmount   = (type === 'Money') ? Number(amount) : null;

    // ── FIXED INSERT ──────────────────────────────────────────
    // Columns used here: all exist after MASTER_fix.sql is run.
    // NOTE: `donation_type` is intentionally NOT included —
    // it was the old ENUM column that crashed inserts of 'Money'.
    // We use `type` (VARCHAR) instead for all new records.
    // ─────────────────────────────────────────────────────────
    await db.query(
      `INSERT INTO donations
         (donor_name, donor_email, phone, type, description,
          amount, visit_date, mode, purpose, aadhaar_masked)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'offline', ?, ?)`,
      [
        donor_name,
        donor_email,
        phone       || null,
        type,                  // 'Money' / 'Food' / 'Clothes' / 'Scholarship'
        description || null,
        finalAmount,           // NULL for non-money types
        visit_date,
        message     || null,   // stored as purpose
        maskedAadhaar,         // e.g. '****9012'
      ]
    );

    // Send confirmation email — failure here won't break the save
    try {
      await sendDonationEmail(donor_email, donor_name, finalAmount || 0, type, visit_date);
    } catch (emailErr) {
      console.warn('Donation email failed (donation still saved):', emailErr.message);
    }

    const visitFormatted = new Date(visit_date).toLocaleDateString('en-IN');
    return res.status(201).json({
      message: `Thank you! Please visit the orphanage on ${visitFormatted} to complete your ${type.toLowerCase()} donation.`
    });

  } catch (err) {
    // Print the real MySQL error in your terminal so you can debug
    console.error('═══ Donation DB Error ═══════════════════');
    console.error('Error  :', err.message);
    console.error('Code   :', err.code);
    console.error('SQL    :', err.sql);
    console.error('═════════════════════════════════════════');
    return res.status(500).json({
      message: 'Could not save donation. Please try again.'
    });
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
    console.error('Applications fetch error:', err.message);
    res.status(500).json({ message: 'Could not fetch applications.' });
  }
});


// ─────────────────────────────────────────────
//  POST /api/applications  (UNCHANGED)
// ─────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const {
    applicant_name, applicant_email, applicant_phone,
    application_type, message, aadhaar, emailVerified,
  } = req.body;

  if (!emailVerified) {
    return res.status(400).json({
      message: 'Please verify your email address with the OTP before submitting.'
    });
  }
  if (!applicant_name || !applicant_email || !application_type) {
    return res.status(400).json({
      message: 'Full name, email address, and application type are required.'
    });
  }
  if (!aadhaar || !validateAadhaar(aadhaar)) {
    return res.status(400).json({
      message: 'Aadhaar number must be exactly 12 digits (numbers only).'
    });
  }

  try {
    const maskedAadhaar = maskAadhaar(aadhaar);
    await db.query(
      `INSERT INTO applications
         (applicant_name, applicant_email, applicant_phone,
          application_type, message, aadhaar_masked)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        applicant_name,
        applicant_email,
        applicant_phone || null,
        application_type,
        message         || null,
        maskedAadhaar,
      ]
    );
    try {
      await sendApplicationEmail(applicant_email, applicant_name, application_type);
    } catch (emailErr) {
      console.warn('Application email failed (application still saved):', emailErr.message);
    }
    return res.status(201).json({
      message: 'Application submitted successfully! We will contact you soon.'
    });
  } catch (err) {
    console.error('Application insert error:', err.message);
    return res.status(500).json({
      message: 'Could not submit application. Please try again.'
    });
  }
});


module.exports = router;
