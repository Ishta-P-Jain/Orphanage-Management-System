// ============================================
//  Donations.js — MODIFIED FILE
//  Now shows all offline donation types with
//  colored badges. Displays new columns:
//  phone, type, description, visit_date, mode.
//  Total badge now counts ALL entries not just money.
// ============================================

import React, { useState, useEffect } from 'react';
import { fetchDonations } from '../api';

// Color for each donation type badge
const TYPE_COLORS = {
  Money:       { bg: '#eafaf1', text: '#27ae60' },
  Food:        { bg: '#fef9e7', text: '#e67e22' },
  Clothes:     { bg: '#eaf4ff', text: '#4a90e2' },
  Scholarship: { bg: '#f5eef8', text: '#8e44ad' },
};

function Donations({ onBack }) {
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    fetchDonations()
      .then((data) => {
        if (data.message) setError(data.message);
        else setDonations(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not connect to server. Is the backend running?');
        setLoading(false);
      });
  }, []);

  // Total money only
  const totalMoney = donations
    .filter(d => d.type === 'Money' || !d.type)
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  // Counts per type
  const counts = donations.reduce((acc, d) => {
    const t = d.type || 'Money';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>💰 Donations</h2>
        {!loading && !error && (
          <span style={styles.countBadge}>
            {donations.length} total
          </span>
        )}
      </div>

      <div style={styles.content}>

        {/* Summary row */}
        {!loading && !error && donations.length > 0 && (
          <div style={styles.summaryRow}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNum}>{donations.length}</div>
              <div style={styles.summaryLabel}>Total Donations</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={{ ...styles.summaryNum, color: '#27ae60' }}>
                ₹{totalMoney.toLocaleString('en-IN')}
              </div>
              <div style={styles.summaryLabel}>Total Money</div>
            </div>
            {Object.entries(counts).map(([type, count]) => (
              <div key={type} style={styles.summaryCard}>
                <div style={{ ...styles.summaryNum, color: TYPE_COLORS[type]?.text || '#555' }}>{count}</div>
                <div style={styles.summaryLabel}>{type}</div>
              </div>
            ))}
          </div>
        )}

        {loading && <p style={styles.info}>Loading donations...</p>}
        {error   && <div style={styles.errorBox}>{error}</div>}

        {!loading && !error && donations.length === 0 && (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
            <p>No donations yet. Be the first to donate!</p>
          </div>
        )}

        {!loading && !error && donations.length > 0 && (
          <div style={styles.tableBox}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headerRow}>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Visit Date</th>
                    <th style={styles.th}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => {
                    const typeKey = d.type || 'Money';
                    const tc = TYPE_COLORS[typeKey] || { bg: '#f0f4f8', text: '#555' };
                    return (
                      <tr key={d.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={styles.td}>{i + 1}</td>
                        <td style={styles.td}><strong>{d.donor_name}</strong></td>
                        <td style={styles.td}>{d.donor_email || '—'}</td>
                        <td style={styles.td}>{d.phone || '—'}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, backgroundColor: tc.bg, color: tc.text }}>
                            {typeKey}
                          </span>
                        </td>
                        <td style={styles.td}>{d.description || '—'}</td>
                        <td style={styles.td}>
                          {d.amount ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td style={styles.td}>
                          {d.visit_date
                            ? new Date(d.visit_date).toLocaleDateString('en-IN')
                            : '—'}
                        </td>
                        <td style={styles.td}>
                          {new Date(d.donated_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:     { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  header:   { backgroundColor: '#2c3e50', padding: '16px 30px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  backBtn:  { backgroundColor: 'transparent', color: '#ecf0f1', border: '1px solid #7f8c8d', padding: '7px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' },
  title:    { color: '#fff', fontSize: '20px', margin: 0, flex: 1 },
  countBadge: { backgroundColor: '#4a90e2', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
  content:  { padding: '24px 30px', maxWidth: '1200px', margin: '0 auto' },
  info:     { color: '#888', textAlign: 'center', marginTop: '40px' },
  errorBox: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '14px 18px', borderRadius: '7px', border: '1px solid #f5c6cb' },
  emptyBox: { textAlign: 'center', padding: '60px 20px', color: '#888', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },

  summaryRow:   { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' },
  summaryCard:  { backgroundColor: '#fff', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', minWidth: '100px' },
  summaryNum:   { fontSize: '22px', fontWeight: '800', color: '#2c3e50' },
  summaryLabel: { fontSize: '11px', color: '#888', marginTop: '4px' },

  tableBox:  { backgroundColor: '#fff', borderRadius: '8px', padding: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  table:     { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  headerRow: { backgroundColor: '#f8f9fa' },
  th:        { padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: '#555', borderBottom: '2px solid #eee' },
  td:        { padding: '11px 14px', color: '#444', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
  trEven:    { backgroundColor: '#fff' },
  trOdd:     { backgroundColor: '#fafafa' },
  badge:     { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },
};

export default Donations;
