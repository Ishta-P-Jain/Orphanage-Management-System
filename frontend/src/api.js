// ============================================
//  api.js — MODIFIED FILE
//  Change: 2 new OTP functions added at bottom.
//  All existing functions are word-for-word
//  identical to the previous version.
// ============================================

const BASE_URL = 'http://localhost:5000/api';

// ── EXISTING FUNCTIONS (unchanged) ───────────

export const registerUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
};

export const fetchActivity = async () => {
  const res = await fetch(`${BASE_URL}/activity`);
  return res.json();
};

export const fetchChildren = async () => {
  const res = await fetch(`${BASE_URL}/children`);
  return res.json();
};

export const fetchDonations = async () => {
  const res = await fetch(`${BASE_URL}/donations`);
  return res.json();
};

export const submitDonation = async (data) => {
  const res = await fetch(`${BASE_URL}/donations`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchApplications = async () => {
  const res = await fetch(`${BASE_URL}/applications`);
  return res.json();
};

export const submitApplication = async (data) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ── NEW OTP FUNCTIONS ─────────────────────────

/**
 * Step 1 — Request an OTP for the given email.
 * Backend generates a 6-digit code and emails it.
 * @param {string} email
 */
export const sendOtp = async (email) => {
  const res = await fetch(`${BASE_URL}/verify/send-otp`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

/**
 * Step 2 — Submit the OTP the user received.
 * Returns { verified: true } on success.
 * @param {string} email
 * @param {string} otp
 */
export const checkOtp = async (email, otp) => {
  const res = await fetch(`${BASE_URL}/verify/check-otp`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};
