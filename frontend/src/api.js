// ============================================
//  api.js — Centralised API Functions
//  All fetch() calls to the backend live here
// ============================================

const BASE_URL = 'http://localhost:5000/api/auth';

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ message: string }>}
 */
export const registerUser = async (data) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  return response.json();
};

/**
 * Log in an existing user
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ message: string, token?: string, user?: object }>}
 */
export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  return response.json();
};
