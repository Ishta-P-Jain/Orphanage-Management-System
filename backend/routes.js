// ============================================
//  routes.js — NEW FILE
//  All new API routes (stats, activity,
//  children, donations, applications)
//  Auth routes stay in auth.js — untouched.
// ============================================

const express = require('express');
const router  = express.Router();
const db      = require('./db');  // reuse existing db connection


// ─────────────────────────────────────────────
//  GET /api/stats
//  Returns live counts for the dashboard cards
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [[{ children }]]    = await db.query('SELECT COUNT(*) AS children    FROM children');
    const [[{ donations }]]   = await db.query('SELECT COUNT(*) AS donations   FROM donations');
    const [[{ applications }]]= await db.query('SELECT COUNT(*) AS applications FROM applications');
    const [[{ events }]]      = await db.query('SELECT COUNT(*) AS events      FROM events');

    // Total donation amount (sum of all amounts)
    const [[{ totalAmount }]] = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS totalAmount FROM donations'
    );

    res.json({ children, donations, applications, events, totalAmount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Could not fetch stats.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/activity
//  Returns the 8 most recent actions across
//  children, donations, and applications
// ─────────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    // Fetch recent records from each table and label them
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

    // Merge all, sort by date descending, take top 8
    const all = [...childRows, ...donationRows, ...appRows]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map(row => ({
        ...row,
        // Format date to YYYY-MM-DD string for clean display
        date: new Date(row.date).toISOString().split('T')[0],
      }));

    res.json(all);
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ message: 'Could not fetch activity.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/children
//  Returns all children records
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
//  GET /api/donations
//  Returns all donation records
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
//  POST /api/donations
//  Saves a new donation from the Donate form
// ─────────────────────────────────────────────
router.post('/donations', async (req, res) => {
  const { donor_name, donor_email, amount, message } = req.body;

  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({ message: 'Name, email, and amount are required.' });
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  try {
    await db.query(
      `INSERT INTO donations (donor_name, donor_email, amount, donation_type, purpose)
       VALUES (?, ?, ?, 'UPI', ?)`,
      [donor_name, donor_email, amount, message || null]
    );
    res.status(201).json({ message: 'Thank you! Your donation has been recorded.' });
  } catch (err) {
    console.error('Donation insert error:', err);
    res.status(500).json({ message: 'Could not save donation. Please try again.' });
  }
});


// ─────────────────────────────────────────────
//  GET /api/applications
//  Returns all applications
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
//  POST /api/applications
//  Saves a new adoption/visit application
// ─────────────────────────────────────────────
router.post('/applications', async (req, res) => {
  const { applicant_name, applicant_email, applicant_phone, application_type, message } = req.body;

  if (!applicant_name || !applicant_email || !application_type) {
    return res.status(400).json({ message: 'Name, email, and application type are required.' });
  }

  try {
    await db.query(
      `INSERT INTO applications (applicant_name, applicant_email, applicant_phone, application_type, message)
       VALUES (?, ?, ?, ?, ?)`,
      [applicant_name, applicant_email, applicant_phone || null, application_type, message || null]
    );
    res.status(201).json({ message: 'Application submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Application insert error:', err);
    res.status(500).json({ message: 'Could not submit application. Please try again.' });
  }
});


module.exports = router;
