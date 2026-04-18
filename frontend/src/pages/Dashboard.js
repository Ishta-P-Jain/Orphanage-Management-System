// ============================================
//  Dashboard.js — MODIFIED FILE
//  Change from previous version:
//  Only 1 thing changed: "Contact" nav link
//  now calls onNavigate('contact') when clicked.
//  Every single other line is identical to before.
// ============================================

import React, { useState, useEffect } from 'react';
import { fetchStats, fetchActivity } from '../api';


function Dashboard({ user, onLogout, onNavigate }) {

  const [stats, setStats]       = useState(null);
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats]       = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [appMenu, setAppMenu] = useState(false);

  useEffect(() => {
    fetchStats()
      .then((data) => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));

    fetchActivity()
      .then((data) => { setActivity(data); setLoadingActivity(false); })
      .catch(() => setLoadingActivity(false));
  }, []);

  const statCards = [
    {
      label: 'Activities & Events',
      value: loadingStats ? '...' : (stats?.events ?? 0),
      icon: '📅', color: '#4a90e2',
    },
    {
      label: 'Children',
      value: loadingStats ? '...' : (stats?.children ?? 0),
      icon: '👧', color: '#e67e22',
    },
    {
      label: 'Total Donations',
      value: loadingStats ? '...' : `₹${Number(stats?.totalAmount ?? 0).toLocaleString('en-IN')}`,
      icon: '💰', color: '#27ae60',
    },
    {
      label: 'Applications',
      value: loadingStats ? '...' : (stats?.applications ?? 0),
      icon: '📋', color: '#8e44ad',
    },
  ];

  const sections = [
    {
      name: 'Children',
      icon: '👧',
      desc: 'Track children admitted, their details and status.',
      action: () => onNavigate('children'),
    },
    {
      name: 'Donations',
      icon: '💰',
      desc: 'Monitor incoming donations and donor information.',
      action: () => onNavigate('donations'),
    },
    {
      name: 'Applications',
      icon: '📋',
      desc: 'Submit a donation or an adoption application.',
      action: () => setAppMenu(prev => !prev),
    },
  ];

  return (
    <div style={styles.page}>

      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>🏠 Hope Orphanage </div>

        <div style={styles.navLinks}>
          <span style={styles.navLink}>Dashboard</span>

          <span
            style={styles.navLink}
            onClick={() => onNavigate('about')}
            onMouseOver={e => e.currentTarget.style.background = '#34495e'}
            onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
          >
              About Us
          </span>

          {/* ── ONLY CHANGE: Contact now navigates to contact page ── */}
          <span
            style={styles.navLink}
            onClick={() => onNavigate('contact')}
            onMouseOver={e => e.currentTarget.style.background = '#34495e'}
            onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
          >
            Contact
          </span>
        </div>

        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 Hello, {user?.name || 'User'}</span>
          <span style={styles.navRole}>{user?.role || 'user'}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={styles.main}>

        <h2 style={styles.pageTitle}>Dashboard Overview</h2>
        <p style={styles.pageSubtitle}>
          Welcome back! Here's a live summary of the orphanage.
        </p>

        {/* Stat Cards */}
        <div style={styles.cardGrid}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
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
                      No activity yet.
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

        {/* Manage Sections */}
        <h3 style={{ ...styles.sectionTitle, marginTop: '30px' }}>🗂 Manage Sections</h3>
        <div style={styles.panelGrid}>
          {sections.map((sec) => (
            <div key={sec.name} style={styles.panel}>
              <div style={styles.panelIcon}>{sec.icon}</div>
              <h4 style={styles.panelTitle}>{sec.name}</h4>
              <p style={styles.panelDesc}>{sec.desc}</p>

              {sec.name === 'Applications' ? (
                <>
                  <button style={styles.panelBtn} onClick={sec.action}>
                    {appMenu ? 'Close ▲' : 'Apply / Donate ▼'}
                  </button>
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

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 Orphanage Manager — Built with ❤️
      </footer>

    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column' },
  navbar: { backgroundColor: '#2c3e50', color: '#fff', padding: '14px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  navBrand: { fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  navLink: { fontSize: '14px', color: '#ecf0f1', cursor: 'pointer', fontWeight: '500', padding: '5px 8px', borderRadius: '4px' },
  navUser: { fontSize: '14px', color: '#ecf0f1' },
  navRole: { backgroundColor: '#4a90e2', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', textTransform: 'capitalize' },
  logoutBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  main: { flex: 1, padding: '28px 30px', maxWidth: '1100px', width: '100%', margin: '0 auto', boxSizing: 'border-box' },
  pageTitle: { fontSize: '42px', color: '#2c3e50', marginBottom: '4px' },
  pageSubtitle: { fontSize: '13px', color: '#888', marginBottom: '24px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '22px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', textAlign: 'center' },
  statIcon: { fontSize: '30px', marginBottom: '10px' },
  statValue: { fontSize: '26px', fontWeight: 'bold' },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
  tableBox: { backgroundColor: '#fff', borderRadius: '8px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '10px' },
  sectionTitle: { fontSize: '16px', color: '#2c3e50', marginBottom: '14px', marginTop: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  tableHeaderRow: { backgroundColor: '#f8f9fa' },
  th: { padding: '11px 14px', textAlign: 'left', fontWeight: '700', color: '#555', borderBottom: '2px solid #eee' },
  td: { padding: '11px 14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  trEven: { backgroundColor: '#fff' },
  trOdd:  { backgroundColor: '#fafafa' },
  panelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '14px' },
  panel: { backgroundColor: '#fff', borderRadius: '8px', padding: '26px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  panelIcon: { fontSize: '28px', marginBottom: '10px' },
  panelTitle: { fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 8px' },
  panelDesc: { fontSize: '13px', color: '#888', marginBottom: '16px', lineHeight: '1.5' },
  panelBtn: { backgroundColor: '#4a90e2', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  footer: { textAlign: 'center', padding: '16px', fontSize: '15px', color: '#fdfdfd', backgroundColor: '#374c60', borderTop: '1px solid #eee', marginTop: 'auto' },
  subMenu: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  subBtn: { color: '#fff', border: 'none', padding: '9px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'left' },
};

export default Dashboard;
