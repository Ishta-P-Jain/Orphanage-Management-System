// ============================================
//  AdoptForm.js — NEW FILE
//  Form to submit an adoption application.
//  POSTs to /api/applications
// ============================================

import React, { useState } from 'react';
import { submitApplication } from '../api';

function AdoptForm({ onBack }) {
  const [form, setForm] = useState({
    applicant_name:  '',
    applicant_email: '',
    applicant_phone: '',
    application_type: 'Adoption',   // default type
    message:         '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await submitApplication(form);
    setSubmitting(false);

    if (res.message && res.message.toLowerCase().includes('submitted')) {
      setResult({ ok: true, msg: res.message });
      setForm({ applicant_name: '', applicant_email: '', applicant_phone: '', application_type: 'Adoption', message: '' });
    } else {
      setResult({ ok: false, msg: res.message || 'Something went wrong.' });
    }
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>👶 Adoption Application</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <p style={styles.intro}>
            We welcome loving families to give children a forever home.
            Fill in your details and our team will contact you within 3–5 working days. 🏠
          </p>

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
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              name="applicant_name"
              type="text"
              placeholder="e.g. Meena Sharma"
              value={form.applicant_name}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Email Address *</label>
            <input
              style={styles.input}
              name="applicant_email"
              type="email"
              placeholder="e.g. meena@gmail.com"
              value={form.applicant_email}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              name="applicant_phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.applicant_phone}
              onChange={handleChange}
            />

            <label style={styles.label}>Application Type *</label>
            <select
              style={styles.input}
              name="application_type"
              value={form.application_type}
              onChange={handleChange}
              required
            >
              <option value="Adoption">Adoption</option>
              <option value="Foster Care">Foster Care</option>
              <option value="Sponsorship">Sponsorship</option>
              <option value="Volunteering">Volunteering</option>
            </select>

            <label style={styles.label}>Message / Reason (optional)</label>
            <textarea
              style={{ ...styles.input, height: '100px', resize: 'vertical' }}
              name="message"
              placeholder="Tell us about yourself and why you'd like to adopt..."
              value={form.message}
              onChange={handleChange}
            />

            <button style={styles.submitBtn} type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : '📋 Submit Application'}
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
    width: '100%', padding: '12px', marginTop: '22px', backgroundColor: '#8e44ad',
    color: '#fff', fontSize: '15px', fontWeight: '700', border: 'none',
    borderRadius: '6px', cursor: 'pointer',
  },
};

export default AdoptForm;
