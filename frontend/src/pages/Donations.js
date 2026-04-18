// ============================================
//  Donations.js — NEW FILE
//  Shows all donations from the backend.
//  Read-only table view.
// ============================================

import React, { useState, useEffect } from 'react';
import { fetchDonations } from '../api';

function Donations({ onBack }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

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

  // Calculate total amount
  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>💰 Donations</h2>
        {!loading && !error && (
          <span style={styles.totalBadge}>
            Total: ₹{total.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <div style={styles.content}>

        {loading && <p style={styles.info}>Loading donations...</p>}

        {error && <div style={styles.errorBox}>{error}</div>}

        {!loading && !error && donations.length === 0 && (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: '48px' }}>💰</div>
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
                    <th style={styles.th}>Donor Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Purpose</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={d.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{i + 1}</td>
                      <td style={styles.td}><strong>{d.donor_name}</strong></td>
                      <td style={styles.td}>{d.donor_email || '—'}</td>
                      <td style={{ ...styles.td, color: '#27ae60', fontWeight: '700' }}>
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td style={styles.td}>{d.donation_type || '—'}</td>
                      <td style={styles.td}>{d.purpose || '—'}</td>
                      <td style={styles.td}>
                        {new Date(d.donated_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
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
  page:    { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  header:  {
    backgroundColor: '#2c3e50', padding: '16px 30px',
    display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
  },
  backBtn: {
    backgroundColor: 'transparent', color: '#ecf0f1', border: '1px solid #7f8c8d',
    padding: '7px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  title:      { color: '#fff', fontSize: '20px', margin: 0, flex: 1 },
  totalBadge: {
    backgroundColor: '#27ae60', color: '#fff', padding: '6px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '700',
  },
  content:  { padding: '28px 30px', maxWidth: '1100px', margin: '0 auto' },
  info:     { color: '#888', textAlign: 'center', marginTop: '40px' },
  errorBox: {
    backgroundColor: '#fde8e8', color: '#c0392b', padding: '14px 18px',
    borderRadius: '7px', border: '1px solid #f5c6cb',
  },
  emptyBox: {
    textAlign: 'center', padding: '60px 20px', color: '#888',
    backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  tableBox: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '6px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  table:     { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  headerRow: { backgroundColor: '#f8f9fa' },
  th: {
    padding: '12px 14px', textAlign: 'left', fontWeight: '700',
    color: '#555', borderBottom: '2px solid #eee',
  },
  td:     { padding: '11px 14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  trEven: { backgroundColor: '#fff' },
  trOdd:  { backgroundColor: '#fafafa' },
};

export default Donations;
