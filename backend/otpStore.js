// ============================================
//  otpStore.js — NEW FILE
//  A simple in-memory OTP store.
//  Stores OTPs with a 10-minute expiry.
//  No database needed — lives in server memory.
//
//  Structure of each entry:
//  otpStore[email] = { otp: '483920', expiresAt: Date }
// ============================================

// The store — plain JS object, lives in memory
const store = {};

// OTP expires after 10 minutes
const OTP_EXPIRY_MS = 10 * 60 * 1000;

/**
 * Save an OTP for a given email.
 * Overwrites any existing OTP for that email.
 */
const saveOtp = (email, otp) => {
  store[email] = {
    otp,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  };
};

/**
 * Verify an OTP for a given email.
 * Returns: 'valid' | 'invalid' | 'expired' | 'not_found'
 */
const verifyOtp = (email, otp) => {
  const entry = store[email];

  if (!entry) return 'not_found';                      // never sent an OTP
  if (new Date() > entry.expiresAt) {
    delete store[email];                               // clean up expired entry
    return 'expired';
  }
  if (entry.otp !== otp) return 'invalid';             // wrong code

  // OTP is correct — delete it so it can't be reused
  delete store[email];
  return 'valid';
};

/**
 * Generate a random 6-digit OTP string.
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { saveOtp, verifyOtp, generateOtp };
