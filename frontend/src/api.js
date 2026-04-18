// ============================================
//  api.js — MODIFIED FILE
//  Existing auth functions kept exactly as-is.
//  New fetch functions added below.
// ============================================

const BASE_URL = 'http://localhost:5000/api';

// ── EXISTING (do not change these) ───────────

export const registerUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// ── NEW API FUNCTIONS ─────────────────────────

// Fetch live stat counts for dashboard cards
export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
};

// Fetch recent activity for dashboard table
export const fetchActivity = async () => {
  const res = await fetch(`${BASE_URL}/activity`);
  return res.json();
};

// Fetch all children
export const fetchChildren = async () => {
  const res = await fetch(`${BASE_URL}/children`);
  return res.json();
};

// Fetch all donations
export const fetchDonations = async () => {
  const res = await fetch(`${BASE_URL}/donations`);
  return res.json();
};

// Submit a new donation
export const submitDonation = async (data) => {
  const res = await fetch(`${BASE_URL}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Fetch all applications
export const fetchApplications = async () => {
  const res = await fetch(`${BASE_URL}/applications`);
  return res.json();
};

// Submit a new application (adopt or volunteer)
export const submitApplication = async (data) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
