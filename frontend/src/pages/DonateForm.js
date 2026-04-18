// ============================================
//  DonateForm.js — NEW FILE
//  Form to submit a new donation.
//  POSTs to /api/donations
// ============================================

import React, { useState } from 'react';
import { submitDonation } from '../api';

function DonateForm({ onBack }) {
  const [form, setForm] = useState({
    donor_name:  '',
    donor_email: '',
    amount:      '',
    message:     '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null); // { ok: bool, msg: string }

  // Update a single form field
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await submitDonation(form);
    setSubmitting(false);

    if (res.message && res.message.toLowerCase().includes('recorded')) {
      setResult({ ok: true, msg: res.message });
      // Reset form on success
      setForm({ donor_name: '', donor_email: '', amount: '', message: '' });
    } else {
      setResult({ ok: false, msg: res.message || 'Something went wrong.' });
    }
  };

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

          {/* Result message */}
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

            <label style={styles.label}>Email Address *</label>
            <input
              style={styles.input}
              name="donor_email"
              type="email"
              placeholder="e.g. ravi@gmail.com"
              value={form.donor_email}
              onChange={handleChange}
              required
            />

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

            <label style={styles.label}>Message / Purpose (optional)</label>
            <textarea
              style={{ ...styles.input, height: '90px', resize: 'vertical' }}
              name="message"
              placeholder="e.g. For children's education"
              value={form.message}
              onChange={handleChange}
            />

            <button style={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : '💰 Donate Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  header:  {
    backgroundColor: '#2c3e50', padding: '16px 30px',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  backBtn: {
    backgroundColor: 'transparent', color: '#ecf0f1', border: '1px solid #7f8c8d',
    padding: '7px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  title:     { color: '#fff', fontSize: '20px', margin: 0 },
  content:   { padding: '30px', maxWidth: '540px', margin: '0 auto' },
  card:      {
    backgroundColor: '#fff', borderRadius: '10px', padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
  },
  intro:     { fontSize: '14px', color: '#666', marginBottom: '22px', lineHeight: '1.7' },
  alert:     { padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '18px' },
  label:     { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', margin: '14px 0 5px' },
  input:     {
    width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #ddd',
    borderRadius: '6px', boxSizing: 'border-box', outline: 'none',
  },
  submitBtn: {
    width: '100%', padding: '12px', marginTop: '22px', backgroundColor: '#27ae60',
    color: '#fff', fontSize: '15px', fontWeight: '700', border: 'none',
    borderRadius: '6px', cursor: 'pointer',
  },
};

export default DonateForm;
