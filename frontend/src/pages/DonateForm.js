// ============================================
//  DonateForm.js — MODIFIED FILE
//  Changes from previous version:
//  Added email OTP verification step.
//  Flow:
//    1. User fills email → clicks "Send OTP"
//    2. OTP arrives in inbox → user types it
//    3. User clicks "Verify OTP" → green tick appears
//    4. Submit button unlocks → user submits form
//  All existing fields and styles preserved.
// ============================================

import React, { useState } from 'react';
import { submitDonation, sendOtp, checkOtp } from '../api';

function DonateForm({ onBack }) {

  // ── Form field values ─────────────────────
  const [form, setForm] = useState({
    donor_name:  '',
    donor_email: '',
    amount:      '',
    message:     '',
    aadhaar:     '',
  });

  // ── OTP state ────────────────────────────
  const [otpSent,     setOtpSent]     = useState(false);   // true after "Send OTP" clicked
  const [otpValue,    setOtpValue]    = useState('');       // what user typed in OTP box
  const [otpStatus,   setOtpStatus]   = useState('idle');  // 'idle'|'sending'|'sent'|'verifying'|'verified'|'error'
  const [otpMessage,  setOtpMessage]  = useState('');      // feedback text under OTP field
  const [emailVerified, setEmailVerified] = useState(false); // true after OTP verified

  // ── Other UI state ────────────────────────
  const [aadhaarError, setAadhaarError] = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [result,       setResult]       = useState(null);

  // Update a form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // If user changes the email after verifying, reset verification
    if (name === 'donor_email') {
      setEmailVerified(false);
      setOtpSent(false);
      setOtpStatus('idle');
      setOtpMessage('');
      setOtpValue('');
    }
    if (name === 'aadhaar') setAadhaarError('');
  };

  // ── Step 1: Send OTP ──────────────────────
  const handleSendOtp = async () => {
    // Quick email format check before calling API
    if (!form.donor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donor_email)) {
      setOtpMessage('Please enter a valid email address first.');
      setOtpStatus('error');
      return;
    }

    setOtpStatus('sending');
    setOtpMessage('Sending OTP to your email...');

    const res = await sendOtp(form.donor_email);

    if (res.message && res.message.toLowerCase().includes('sent')) {
      setOtpSent(true);
      setOtpStatus('sent');
      setOtpMessage(res.message);
    } else {
      setOtpStatus('error');
      setOtpMessage(res.message || 'Failed to send OTP. Please try again.');
    }
  };

  // ── Step 2: Verify OTP ────────────────────
  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.trim().length !== 6) {
      setOtpMessage('Please enter the 6-digit OTP from your email.');
      setOtpStatus('error');
      return;
    }

    setOtpStatus('verifying');
    setOtpMessage('Verifying...');

    const res = await checkOtp(form.donor_email, otpValue);

    if (res.verified) {
      setEmailVerified(true);
      setOtpStatus('verified');
      setOtpMessage('✅ Email verified! You can now submit the form.');
    } else {
      setOtpStatus('error');
      setOtpMessage(res.message || 'Verification failed. Please try again.');
    }
  };

  // ── Final form submit ─────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    // Aadhaar check
    if (!/^\d{12}$/.test(form.aadhaar)) {
      setAadhaarError('Aadhaar must be exactly 12 digits (numbers only).');
      return;
    }

    setSubmitting(true);
    // Pass emailVerified flag so backend can double-check
    const res = await submitDonation({ ...form, emailVerified });
    setSubmitting(false);

    if (res.message && res.message.toLowerCase().includes('recorded')) {
      setResult({ ok: true, msg: res.message });
      // Reset everything
      setForm({ donor_name: '', donor_email: '', amount: '', message: '', aadhaar: '' });
      setOtpSent(false);
      setOtpValue('');
      setOtpStatus('idle');
      setOtpMessage('');
      setEmailVerified(false);
    } else {
      setResult({ ok: false, msg: res.message || 'Something went wrong.' });
    }
  };

  // Color for OTP status message
  const otpMsgColor = {
    sent:     '#4a90e2',
    verified: '#27ae60',
    error:    '#e74c3c',
    sending:  '#888',
    verifying:'#888',
    idle:     '#888',
  }[otpStatus] || '#888';

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>💰 Make a Donation</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>

          <p style={styles.intro}>
            Your donation helps us provide food, education, and care for children in need.
            Every rupee matters. 🙏
          </p>

          {/* Overall result alert */}
          {result && (
            <div style={{
              ...styles.alert,
              backgroundColor: result.ok ? '#e8f5e9' : '#fde8e8',
              color:           result.ok ? '#27ae60' : '#c0392b',
              border:          `1px solid ${result.ok ? '#c3e6cb' : '#f5c6cb'}`,
            }}>
              {result.ok ? '✅' : '❌'} {result.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <label style={styles.label}>Your Name *</label>
            <input
              style={styles.input}
              name="donor_name"
              type="text"
              placeholder="e.g. Ravi Kumar"
              value={form.donor_name}
              onChange={handleChange}
              required
            />

            {/* ── Email + Send OTP button ── */}
            <label style={styles.label}>Email Address *</label>
            <div style={styles.emailRow}>
              <input
                style={{ ...styles.input, flex: 1, margin: 0 }}
                name="donor_email"
                type="email"
                placeholder="e.g. ravi@gmail.com"
                value={form.donor_email}
                onChange={handleChange}
                required
                // Lock email after OTP is verified so it can't be changed
                readOnly={emailVerified}
              />
              <button
                type="button"
                style={{
                  ...styles.otpSendBtn,
                  // Grey out while sending or already verified
                  opacity: (otpStatus === 'sending' || emailVerified) ? 0.6 : 1,
                  cursor:  (otpStatus === 'sending' || emailVerified) ? 'not-allowed' : 'pointer',
                  backgroundColor: emailVerified ? '#27ae60' : '#4a90e2',
                }}
                onClick={handleSendOtp}
                disabled={otpStatus === 'sending' || emailVerified}
              >
                {emailVerified ? '✅ Verified' : otpStatus === 'sending' ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>

            {/* ── OTP input box — appears after OTP is sent ── */}
            {otpSent && !emailVerified && (
              <div style={styles.otpBox}>
                <label style={styles.label}>Enter OTP *</label>
                <p style={styles.otpHint}>
                  Check your inbox at <strong>{form.donor_email}</strong> for a 6-digit code.
                </p>
                <div style={styles.emailRow}>
                  <input
                    style={{ ...styles.input, flex: 1, margin: 0, letterSpacing: '6px', fontWeight: '700', fontSize: '18px' }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    value={otpValue}
                    onChange={(e) => {
                      setOtpValue(e.target.value);
                      setOtpMessage('');
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      ...styles.otpSendBtn,
                      backgroundColor: '#e67e22',
                      opacity: otpStatus === 'verifying' ? 0.6 : 1,
                    }}
                    onClick={handleVerifyOtp}
                    disabled={otpStatus === 'verifying'}
                  >
                    {otpStatus === 'verifying' ? 'Checking...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* OTP status message */}
            {otpMessage && (
              <p style={{ ...styles.otpMsg, color: otpMsgColor }}>{otpMessage}</p>
            )}

            {/* Amount */}
            <label style={styles.label}>Donation Amount (₹) *</label>
            <input
              style={styles.input}
              name="amount"
              type="number"
              placeholder="e.g. 500"
              min="1"
              value={form.amount}
              onChange={handleChange}
              required
            />

            {/* Aadhaar */}
            <label style={styles.label}>
              Aadhaar Number *
              <span style={styles.labelNote}> (12 digits, for identity verification)</span>
            </label>
            <input
              style={{ ...styles.input, borderColor: aadhaarError ? '#e74c3c' : '#ddd' }}
              name="aadhaar"
              type="text"
              inputMode="numeric"
              maxLength={12}
              placeholder="e.g. 123456789012"
              value={form.aadhaar}
              onChange={handleChange}
              required
            />
            {aadhaarError && <p style={styles.fieldError}>⚠️ {aadhaarError}</p>}
            <p style={styles.fieldHint}>🔒 Only last 4 digits are saved.</p>

            {/* Message */}
            <label style={styles.label}>Message / Purpose (optional)</label>
            <textarea
              style={{ ...styles.input, height: '90px', resize: 'vertical' }}
              name="message"
              placeholder="e.g. For children's education"
              value={form.message}
              onChange={handleChange}
            />

            {/* Submit — disabled until email is verified */}
            <button
              style={{
                ...styles.submitBtn,
                opacity:    emailVerified ? 1 : 0.5,
                cursor:     emailVerified ? 'pointer' : 'not-allowed',
              }}
              type="submit"
              disabled={!emailVerified || submitting}
            >
              {submitting ? 'Submitting...' : emailVerified ? '💰 Donate Now' : '🔒 Verify Email to Donate'}
            </button>

            {/* Helper text under the button */}
            {!emailVerified && (
              <p style={{ ...styles.fieldHint, textAlign: 'center', marginTop: '8px' }}>
                You must verify your email with an OTP before donating.
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  header:     { backgroundColor: '#2c3e50', padding: '16px 30px', display: 'flex', alignItems: 'center', gap: '16px' },
  backBtn:    { backgroundColor: 'transparent', color: '#ecf0f1', border: '1px solid #7f8c8d', padding: '7px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' },
  title:      { color: '#fff', fontSize: '20px', margin: 0 },
  content:    { padding: '30px', maxWidth: '540px', margin: '0 auto' },
  card:       { backgroundColor: '#fff', borderRadius: '10px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.09)' },
  intro:      { fontSize: '14px', color: '#666', marginBottom: '22px', lineHeight: '1.7' },
  alert:      { padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '18px' },
  label:      { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', margin: '14px 0 5px' },
  labelNote:  { fontWeight: '400', color: '#999', fontSize: '12px' },
  input:      { width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' },
  fieldError: { color: '#e74c3c', fontSize: '12px', margin: '5px 0 0', padding: 0 },
  fieldHint:  { color: '#888', fontSize: '12px', margin: '5px 0 0', padding: 0 },
  submitBtn:  { width: '100%', padding: '12px', marginTop: '22px', backgroundColor: '#27ae60', color: '#fff', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '6px', cursor: 'pointer' },

  // OTP-specific styles
  emailRow:   { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '5px' },
  otpSendBtn: { padding: '10px 14px', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' },
  otpBox:     { backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginTop: '12px' },
  otpHint:    { fontSize: '12px', color: '#888', margin: '4px 0 10px', lineHeight: '1.5' },
  otpMsg:     { fontSize: '13px', fontWeight: '600', margin: '8px 0 0', padding: 0 },
};

export default DonateForm;
