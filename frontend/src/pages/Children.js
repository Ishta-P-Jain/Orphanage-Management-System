// ============================================
//  Children.js — NEW FILE
//  Shows all children fetched from the backend.
//  Each child is displayed as a card.
// ============================================

import React, { useState, useEffect } from 'react';
import { fetchChildren } from '../api';

function Children({ onBack }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Fetch children from backend when page loads
  useEffect(() => {
    fetchChildren()
      .then((data) => {
        // If backend returned an error object, show message
        if (data.message) { setError(data.message); }
        else { setChildren(data); }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not connect to server. Is the backend running?');
        setLoading(false);
      });
  }, []);

  // Helper: colour badge based on child status
  const statusColor = (status) => {
    switch (status) {
      case 'Active':      return { bg: '#e8f5e9', text: '#27ae60' };
      case 'Adopted':     return { bg: '#e3f2fd', text: '#1976d2' };
      case 'Transferred': return { bg: '#fff8e1', text: '#f57f17' };
      default:            return { bg: '#fce4ec', text: '#c62828' };
    }
  };

  return (
    <div style={styles.page}>

      {/* Header bar */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.title}>👧 Children</h2>
        <span style={styles.count}>
          {loading ? '' : `${children.length} record${children.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div style={styles.content}>

        {/* Loading state */}
        {loading && <p style={styles.info}>Loading children...</p>}

        {/* Error state */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Empty state */}
        {!loading && !error && children.length === 0 && (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: '48px' }}>👧</div>
            <p>No children records found. Add some via the database or API.</p>
          </div>
        )}

        {/* Children cards grid */}
        {!loading && !error && children.length > 0 && (
          <div style={styles.grid}>
            {children.map((child) => {
              const badge = statusColor(child.status);
              // Calculate age from date_of_birth
              const age = child.date_of_birth
                ? Math.floor((new Date() - new Date(child.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
                : null;

              return (
                <div key={child.id} style={styles.card}>
                  {/* Avatar placeholder */}
                  <div style={styles.avatar}>
                    {child.gender === 'Female' ? '👧' : child.gender === 'Male' ? '👦' : '🧒'}
                  </div>

                  <h3 style={styles.childName}>{child.full_name}</h3>

                  {/* Status badge */}
                  <span style={{ ...styles.badge, backgroundColor: badge.bg, color: badge.text }}>
                    {child.status}
                  </span>

                  <div style={styles.details}>
                    {age !== null && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailKey}>Age</span>
                        <span>{age} years</span>
                      </div>
                    )}
                    <div style={styles.detailRow}>
                      <span style={styles.detailKey}>Gender</span>
                      <span>{child.gender || '—'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailKey}>Education</span>
                      <span>{child.education_level || '—'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailKey}>Health</span>
                      <span>{child.health_status || '—'}</span>
                    </div>
                    {child.admission_date && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailKey}>Admitted</span>
                        <span>{new Date(child.admission_date).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
  title:   { color: '#fff', fontSize: '20px', margin: 0, flex: 1 },
  count:   { color: '#95a5a6', fontSize: '13px' },
  content: { padding: '28px 30px', maxWidth: '1100px', margin: '0 auto' },
  info:    { color: '#888', textAlign: 'center', marginTop: '40px' },
  errorBox: {
    backgroundColor: '#fde8e8', color: '#c0392b', padding: '14px 18px',
    borderRadius: '7px', border: '1px solid #f5c6cb', marginBottom: '20px',
  },
  emptyBox: {
    textAlign: 'center', padding: '60px 20px', color: '#888',
    backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '24px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', textAlign: 'center',
  },
  avatar:    { fontSize: '48px', marginBottom: '10px' },
  childName: { fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 8px' },
  badge: {
    display: 'inline-block', fontSize: '11px', fontWeight: '700',
    padding: '3px 10px', borderRadius: '12px', marginBottom: '14px',
  },
  details:   { textAlign: 'left', fontSize: '13px', color: '#555' },
  detailRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '5px 0', borderBottom: '1px solid #f0f0f0',
  },
  detailKey: { fontWeight: '600', color: '#888' },
};

export default Children;
