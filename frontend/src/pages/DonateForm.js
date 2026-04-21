// ============================================
//  DonateForm.js — MODIFIED FILE
//  Completely rewritten form for offline donations.
//  Supports 4 types: Money / Food / Clothes / Scholarship
//  Amount field only appears when type = Money.
//  Submit button says "Request Donation Appointment"
//  Success message: "Thank you! Please visit on [date]"
//  OTP email verification kept exactly as before.
// ============================================

import React, { useState } from 'react';
import { submitDonation, sendOtp, checkOtp } from '../api';

// Badge color per donation type
const TYPE_COLORS = {
  Money:       { bg: '#eafaf1', text: '#27ae60', border: '#27ae60' },
  Food:        { bg: '#fef9e7', text: '#e67e22', border: '#e67e22' },
  Clothes:     { bg: '#eaf4ff', text: '#4a90e2', border: '#4a90e2' },
  Scholarship: { bg: '#f5eef8', text: '#8e44ad', border: '#8e44ad' },
};

function DonateForm({ onBack }) {

  const [form, setForm] = useState({
    donor_name:  '',
    donor_email: '',
    phone:       '',
    type:        'Money',      // default donation type
    description: '',
    amount:      '',
    visit_date:  '',
    message:     '',
    aadhaar:     '',
  });

  // OTP state
  const [otpSent,       setOtpSent]       = useState(false);
  const [otpValue,      setOtpValue]      = useState('');
  const [otpStatus,     setOtpStatus]     = useState('idle');
  const [otpMessage,    setOtpMessage]    = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // Other UI state
  const [aadhaarError, setAadhaarError] = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [result,       setResult]       = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'donor_email') {
      // Reset OTP if email changes
      setEmailVerified(false); setOtpSent(false);
      setOtpStatus('idle');    setOtpMessage(''); setOtpValue('');
    }
    if (name === 'aadhaar') setAadhaarError('');
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!form.donor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donor_email)) {
      setOtpMessage('Please enter a valid email address first.');
      setOtpStatus('error'); return;
    }
    setOtpStatus('sending'); setOtpMessage('Sending OTP...');
    const res = await sendOtp(form.donor_email);
    if (res.message && res.message.toLowerCase().includes('sent')) {
      setOtpSent(true); setOtpStatus('sent'); setOtpMessage(res.message);
    } else {
      setOtpStatus('error'); setOtpMessage(res.message || 'Failed to send OTP.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.trim().length !== 6) {
      setOtpMessage('Please enter the 6-digit OTP.'); setOtpStatus('error'); return;
    }
    setOtpStatus('verifying'); setOtpMessage('Verifying...');
    const res = await checkOtp(form.donor_email, otpValue);
    if (res.verified) {
      setEmailVerified(true); setOtpStatus('verified');
      setOtpMessage('✅ Email verified! You can now submit the form.');
    } else {
      setOtpStatus('error'); setOtpMessage(res.message || 'Verification failed.');
    }
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!/^\d{12}$/.test(form.aadhaar)) {
      setAadhaarError('Aadhaar must be exactly 12 digits (numbers only).');
      return;
    }

    setSubmitting(true);
    const res = await submitDonation({ ...form, emailVerified });
    setSubmitting(false);

    // Success check: backend returns "Thank you! Please visit..."
    if (res.message && res.message.toLowerCase().includes('thank you')) {
      setResult({ ok: true, msg: res.message });
      setForm({ donor_name: '', donor_email: '', phone: '', type: 'Money', description: '', amount: '', visit_date: '', message: '', aadhaar: '' });
      setOtpSent(false); setOtpValue(''); setOtpStatus('idle'); setOtpMessage(''); setEmailVerified(false);
    } else {
      setResult({ ok: false, msg: res.message || 'Something went wrong.' });
    }
  };

  const otpMsgColor = { sent: '#4a90e2', verified: '#27ae60', error: '#e74c3c', sending: '#888', verifying: '#888', idle: '#888' }[otpStatus];
  const selectedTypeStyle = TYPE_COLORS[form.type] || TYPE_COLORS.Money;

  // Today's date string for min attribute on visit_date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>🏠 Request Donation Appointment</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>

          <p style={styles.intro}>
            We accept offline donations. Fill in the form below and visit us on your preferred date. 🙏
          </p>

          {/* Result alert */}
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
            <input style={styles.input} name="donor_name" type="text"
              placeholder="e.g. Ravi Kumar" value={form.donor_name}
              onChange={handleChange} required />

            {/* Email + OTP */}
            <label style={styles.label}>Email Address *</label>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, flex: 1, margin: 0 }}
                name="donor_email" type="email"
                placeholder="e.g. ravi@gmail.com"
                value={form.donor_email}
                onChange={handleChange} required
                readOnly={emailVerified}
              />
              <button type="button" onClick={handleSendOtp}
                disabled={otpStatus === 'sending' || emailVerified}
                style={{ ...styles.otpBtn,
                  backgroundColor: emailVerified ? '#27ae60' : '#4a90e2',
                  opacity: (otpStatus === 'sending' || emailVerified) ? 0.6 : 1,
                }}>
                {emailVerified ? '✅ Verified' : otpStatus === 'sending' ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>

            {/* OTP input box */}
            {otpSent && !emailVerified && (
              <div style={styles.otpBox}>
                <label style={styles.label}>Enter OTP *</label>
                <p style={styles.hint}>Check your inbox at <strong>{form.donor_email}</strong></p>
                <div style={styles.row}>
                  <input style={{ ...styles.input, flex: 1, margin: 0, letterSpacing: '6px', fontWeight: '700', fontSize: '18px' }}
                    type="text" inputMode="numeric" maxLength={6}
                    placeholder="_ _ _ _ _ _" value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value); setOtpMessage(''); }} />
                  <button type="button" onClick={handleVerifyOtp}
                    disabled={otpStatus === 'verifying'}
                    style={{ ...styles.otpBtn, backgroundColor: '#e67e22', opacity: otpStatus === 'verifying' ? 0.6 : 1 }}>
                    {otpStatus === 'verifying' ? 'Checking...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}
            {otpMessage && <p style={{ ...styles.hint, color: otpMsgColor, fontWeight: '600', marginTop: '6px' }}>{otpMessage}</p>}

            {/* Phone */}
            <label style={styles.label}>Phone Number</label>
            <input style={styles.input} name="phone" type="tel"
              placeholder="e.g. 9876543210" value={form.phone}
              onChange={handleChange} />

            {/* Donation Type */}
            <label style={styles.label}>Donation Type *</label>
            <div style={styles.typeGrid}>
              {['Money', 'Food', 'Clothes', 'Scholarship'].map((t) => {
                const c = TYPE_COLORS[t];
                const selected = form.type === t;
                return (
                  <button key={t} type="button"
                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                    style={{
                      padding: '9px 0', borderRadius: '6px', fontSize: '13px',
                      fontWeight: '700', cursor: 'pointer',
                      backgroundColor: selected ? c.bg      : '#f8f9fa',
                      color:           selected ? c.text    : '#888',
                      border:          selected ? `2px solid ${c.border}` : '2px solid #e0e0e0',
                    }}>
                    { t === 'Money' ? '💰' : t === 'Food' ? '🍚' : t === 'Clothes' ? '👕' : '📚' } {t}
                  </button>
                );
              })}
            </div>

            {/* Amount — only for Money */}
            {form.type === 'Money' && (
              <>
                <label style={styles.label}>Donation Amount (₹) *</label>
                <input style={styles.input} name="amount" type="number"
                  placeholder="e.g. 500" min="1"
                  value={form.amount} onChange={handleChange} required />
              </>
            )}

            {/* Description */}
            <label style={styles.label}>
              Description {form.type !== 'Money' ? '*' : '(optional)'}
              <span style={styles.labelNote}> — e.g. "10kg rice", "winter clothes for 5 children"</span>
            </label>
            <input style={styles.input} name="description" type="text"
              placeholder={
                form.type === 'Food'        ? 'e.g. 10kg rice, 5kg dal' :
                form.type === 'Clothes'     ? 'e.g. 10 winter jackets for boys' :
                form.type === 'Scholarship' ? 'e.g. school fees for 2 children' :
                'e.g. General donation'
              }
              value={form.description} onChange={handleChange}
              required={form.type !== 'Money'} />

            {/* Preferred Visit Date */}
            <label style={styles.label}>Preferred Visit Date *</label>
            <input style={styles.input} name="visit_date" type="date"
              min={today} value={form.visit_date}
              onChange={handleChange} required />
            <p style={styles.hint}>📍 You will bring the donation to our orphanage on this date.</p>

            {/* Aadhaar */}
            <label style={styles.label}>
              Aadhaar Number *
              <span style={styles.labelNote}> (12 digits, for identity verification)</span>
            </label>
            <input style={{ ...styles.input, borderColor: aadhaarError ? '#e74c3c' : '#ddd' }}
              name="aadhaar" type="text" inputMode="numeric" maxLength={12}
              placeholder="e.g. 123456789012"
              value={form.aadhaar} onChange={handleChange} required />
            {aadhaarError && <p style={styles.fieldError}>⚠️ {aadhaarError}</p>}
            <p style={styles.hint}>🔒 Only last 4 digits are saved.</p>

            {/* Message */}
            <label style={styles.label}>Message (optional)</label>
            <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              name="message" placeholder="Any additional message..."
              value={form.message} onChange={handleChange} />

            {/* Submit */}
            <button type="submit" disabled={!emailVerified || submitting}
              style={{ ...styles.submitBtn, opacity: emailVerified ? 1 : 0.5, cursor: emailVerified ? 'pointer' : 'not-allowed' }}>
              {submitting ? 'Submitting...' : emailVerified ? '🏠 Request Donation Appointment' : '🔒 Verify Email to Continue'}
            </button>
            {!emailVerified && (
              <p style={{ ...styles.hint, textAlign: 'center', marginTop: '8px' }}>
                You must verify your email with an OTP before submitting.
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
  title:      { color: '#fff', fontSize: '18px', margin: 0 },
  content:    { padding: '30px', maxWidth: '560px', margin: '0 auto' },
  card:       { backgroundColor: '#fff', borderRadius: '10px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.09)' },
  intro:      { fontSize: '14px', color: '#666', marginBottom: '22px', lineHeight: '1.7' },
  alert:      { padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '18px', lineHeight: '1.6' },
  label:      { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', margin: '16px 0 5px' },
  labelNote:  { fontWeight: '400', color: '#999', fontSize: '12px' },
  input:      { width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' },
  fieldError: { color: '#e74c3c', fontSize: '12px', margin: '5px 0 0' },
  hint:       { color: '#888', fontSize: '12px', margin: '5px 0 0' },
  row:        { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '5px' },
  otpBtn:     { padding: '10px 14px', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' },
  otpBox:     { backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginTop: '10px' },
  typeGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginTop: '6px' },
  submitBtn:  { width: '100%', padding: '13px', marginTop: '24px', backgroundColor: '#27ae60', color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default DonateForm;
