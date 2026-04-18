// ============================================
//  Dashboard.js — MODIFIED FILE
//  Changes from original:
//  1. Fetches real stats from GET /api/stats
//  2. Fetches real activity from GET /api/activity
//  3. "Total Users" card replaced with "Events"
//  4. Section buttons now call onNavigate()
//  5. Applications panel shows Donate/Adopt options
//  All styles from your original file preserved.
// ============================================

import React, { useState, useEffect } from 'react';
import { fetchStats, fetchActivity } from '../api';

function Dashboard({ user, onLogout, onNavigate }) {

  // ── Live data from backend ────────────────
  const [stats, setStats]       = useState(null);   // null = loading
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats]       = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // ── Applications panel sub-menu ──────────
  // null = hidden, 'choose' = show Donate/Adopt buttons
  const [appMenu, setAppMenu] = useState(false);



  // Fetch stats and activity when dashboard mounts
  useEffect(() => {
    fetchStats()
      .then((data) => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));

    fetchActivity()
      .then((data) => { setActivity(data); setLoadingActivity(false); })
      .catch(() => setLoadingActivity(false));
  }, []);

  // ── Build stat cards from live data ──────
  // Falls back to '...' while loading
  const statCards = [
    {
      label: 'Activities & Events',
      value: loadingStats ? '...' : (stats?.events ?? 0),
      icon: '📅',
      color: '#4a90e2',
    },
    {
      label: 'Children',
      value: loadingStats ? '...' : (stats?.children ?? 0),
      icon: '👧',
      color: '#e67e22',
    },
    {
      label: 'Total Donations',
      value: loadingStats ? '...' : `₹${Number(stats?.totalAmount ?? 0).toLocaleString('en-IN')}`,
      icon: '💰',
      color: '#27ae60',
    },
    {
      label: 'Applications',
      value: loadingStats ? '...' : (stats?.applications ?? 0),
      icon: '📋',
      color: '#8e44ad',
    },
  ];

  // ── Section panels ────────────────────────
  const sections = [
    {
      name: 'Children',
      icon: '👧',
      desc: 'Track children admitted, their details and status.',
      action: () => onNavigate('children'),       // goes to Children.js page
    },
    {
      name: 'Donations',
      icon: '💰',
      desc: 'Monitor incoming donations and donor information.',
      action: () => onNavigate('donations'),      // goes to Donations.js page
    },
    {
      name: 'Applications',
      icon: '📋',
      desc: 'Submit a donation or an adoption application.',
      action: () => setAppMenu(prev => !prev),    // toggles sub-menu inline
    },
  ];

  return (
    <div style={styles.page}>

      {/* ── Navbar (your original code, untouched) ── */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>🏠 Orphanage Manager</div>

        <div style={styles.navLinks}>
          <span style={styles.navLink}>Dashboard</span>
          
          <span
            style={styles.navLink}
            onMouseOver={e => e.target.style.background = '#34495e'}
            onMouseOut={e  => e.target.style.background = 'transparent'}
          >
            About Us
          </span>
          <span style={styles.navLink}>Contact Us</span>
        </div>

        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 Hello, {user?.name || 'User'}</span>
          <span style={styles.navRole}>{user?.role || 'user'}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={styles.main}>
   
        {/* ── Stat Cards (now dynamic) ── */}
        <div style={styles.cardGrid}>
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Recent Activity (now dynamic) ── */}
        <div style={styles.tableBox}>
          <h3 style={styles.sectionTitle}>📅 Recent Activity</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Detail / Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {loadingActivity ? (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>
                      Loading activity...
                    </td>
                  </tr>
                ) : activity.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>
                      No activity yet. Add children, donations, or applications to see them here.
                    </td>
                  </tr>
                ) : (
                  activity.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{row.type}</td>
                      <td style={styles.td}>{row.name}</td>
                      <td style={styles.td}>{row.detail}</td>
                      <td style={styles.td}>{row.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Manage Sections (now functional) ── */}
        <h3 style={{ ...styles.sectionTitle, marginTop: '30px' }}>🗂 Manage Sections</h3>
        <div style={styles.panelGrid}>
          {sections.map((sec) => (
            <div key={sec.name} style={styles.panel}>
              <div style={styles.panelIcon}>{sec.icon}</div>
              <h4 style={styles.panelTitle}>{sec.name}</h4>
              <p style={styles.panelDesc}>{sec.desc}</p>

              {/* Applications panel: show Donate / Adopt sub-buttons */}
              {sec.name === 'Applications' ? (
                <>
                  <button style={styles.panelBtn} onClick={sec.action}>
                    {appMenu ? 'Close ▲' : 'Apply / Donate ▼'}
                  </button>

                  {/* Sub-menu — shown only when toggled */}
                  {appMenu && (
                    <div style={styles.subMenu}>
                      <button
                        style={{ ...styles.subBtn, backgroundColor: '#27ae60' }}
                        onClick={() => onNavigate('donate')}
                      >
                        💰 Make a Donation
                      </button>
                      <button
                        style={{ ...styles.subBtn, backgroundColor: '#8e44ad' }}
                        onClick={() => onNavigate('adopt')}
                      >
                        👶 Apply to Adopt
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button style={styles.panelBtn} onClick={sec.action}>
                  View {sec.name}
                </button>
              )}
            </div>
          ))}
        </div>

      </main>

      {/* ── Footer (your original, untouched) ── */}
      <footer style={styles.footer}>
        © 2026 Orphanage Manager — Built with ❤️
      </footer>

    </div>
  );
}

// ── Styles (your original styles preserved exactly) ──
// Only new styles added at the bottom
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '14px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  navBrand: { fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  navLink: {
    fontSize: '14px', color: '#ecf0f1', cursor: 'pointer',
    fontWeight: '500', padding: '5px 8px', borderRadius: '4px',
  },
  navUser: { fontSize: '14px', color: '#ecf0f1' },
  navRole: {
    backgroundColor: '#4a90e2', color: '#fff', fontSize: '11px',
    padding: '3px 8px', borderRadius: '12px', textTransform: 'capitalize',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '5px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
  },
  main: {
    flex: 1, padding: '28px 30px', maxWidth: '1100px',
    width: '100%', margin: '0 auto', boxSizing: 'border-box',
  },
  pageTitle: { fontSize: '42px', color: '#2c3e50', marginBottom: '4px' },
  pageSubtitle: { fontSize: '13px', color: '#888', marginBottom: '24px' },
  cardGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px', marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '22px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', textAlign: 'center',
  },
  statIcon:  { fontSize: '30px', marginBottom: '10px' },
  statValue: { fontSize: '26px', fontWeight: 'bold' },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
  tableBox: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '22px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '10px',
  },
  sectionTitle: { fontSize: '16px', color: '#2c3e50', marginBottom: '14px', marginTop: 0 },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  tableHeaderRow: { backgroundColor: '#f8f9fa' },
  th: {
    padding: '11px 14px', textAlign: 'left', fontWeight: '700',
    color: '#555', borderBottom: '2px solid #eee',
  },
  td:     { padding: '11px 14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  trEven: { backgroundColor: '#fff' },
  trOdd:  { backgroundColor: '#fafafa' },
  panelGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px', marginTop: '14px',
  },
  panel: {
    backgroundColor: '#fff', borderRadius: '8px',
    padding: '26px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  panelIcon:  { fontSize: '28px', marginBottom: '10px' },
  panelTitle: { fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 8px' },
  panelDesc:  { fontSize: '13px', color: '#888', marginBottom: '16px', lineHeight: '1.5' },
  panelBtn: {
    backgroundColor: '#4a90e2', color: '#fff', border: 'none',
    padding: '9px 16px', borderRadius: '5px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
  },
  footer: {
    textAlign: 'center', padding: '16px', fontSize: '15px',
    color: '#fdfdfd', backgroundColor: '#374c60',
    borderTop: '1px solid #eee', marginTop: 'auto',
  },

  // ── NEW styles for Applications sub-menu ──
  subMenu: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  subBtn: {
    color: '#fff',
    border: 'none',
    padding: '9px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'left',
  },
};

export default Dashboard;
