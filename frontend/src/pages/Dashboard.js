// ============================================
//  Dashboard.js — Visual-only Dashboard
//  No backend connection. Static display only.
// ============================================

import React from 'react';

function Dashboard({ user, onLogout }) {

  // ── Static summary numbers (visual only) ──
  const stats = [
    { label: 'Total Users',   value: '24',        icon: '👤', color: '#4a90e2' },
    { label: 'Children',      value: '58',        icon: '👧', color: '#e67e22' },
    { label: 'Donations',     value: '₹1,20,500', icon: '💰', color: '#27ae60' },
    { label: 'Applications',  value: '13',        icon: '📋', color: '#8e44ad' },
  ];

  // ── Static recent activity rows ──
  const recentActivity = [
    { type: 'User',        name: 'Ravi Kumar',   detail: 'Registered',  date: '2024-04-10' },
    { type: 'Donation',    name: 'Anonymous',    detail: '₹5,000',      date: '2024-04-09' },
    { type: 'Application', name: 'Meena Sharma', detail: 'Pending',     date: '2024-04-08' },
    { type: 'Child',       name: 'Arun (Age 7)', detail: 'Admitted',    date: '2024-04-07' },
    { type: 'User',        name: 'Priya Nair',   detail: 'Registered',  date: '2024-04-06' },
  ];

  // ── Management section panels ──
  const sections = [
    { name: 'Users',        icon: '👤', desc: 'View and manage all registered users and their roles.' },
    { name: 'Children',     icon: '👧', desc: 'Track children admitted, their details and status.' },
    { name: 'Donations',    icon: '💰', desc: 'Monitor incoming donations and donor information.' },
    { name: 'Applications', icon: '📋', desc: 'Review and process adoption and support applications.' },
  ];

  return (
    <div style={styles.page}>

      {/* ── Top Navigation Bar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>🏠 Orphanage Manager</div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 Hello, {user?.name || 'User'}</span>
          <span style={styles.navRole}>{user?.role || 'user'}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main style={styles.main}>

        {/* Page heading */}
        <h2 style={styles.pageTitle}>Dashboard Overview</h2>
        <p style={styles.pageSubtitle}>
          Welcome back! Here's a quick summary of the orphanage.
        </p>

        {/* ── Stat Cards ── */}
        <div style={styles.cardGrid}>
          {stats.map((stat) => (
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

        {/* ── Recent Activity Table ── */}
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
                {recentActivity.map((row, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{row.type}</td>
                    <td style={styles.td}>{row.name}</td>
                    <td style={styles.td}>{row.detail}</td>
                    <td style={styles.td}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Management Section Panels ── */}
        <h3 style={{ ...styles.sectionTitle, marginTop: '30px' }}>🗂 Manage Sections</h3>
        <div style={styles.panelGrid}>
          {sections.map((sec) => (
            <div key={sec.name} style={styles.panel}>
              <div style={styles.panelIcon}>{sec.icon}</div>
              <h4 style={styles.panelTitle}>{sec.name}</h4>
              <p style={styles.panelDesc}>{sec.desc}</p>
              <button style={styles.panelBtn}>View {sec.name}</button>
            </div>
          ))}
        </div>

      </main>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        © 2024 Orphanage Manager — Built with ❤️
      </footer>

    </div>
  );
}

// ── Inline Styles ─────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },

  /* Navbar */
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
  navBrand: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  navUser: {
    fontSize: '14px',
    color: '#ecf0f1',
  },
  navRole: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '12px',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },

  /* Main */
  main: {
    flex: 1,
    padding: '28px 30px',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  pageTitle: {
    fontSize: '22px',
    color: '#2c3e50',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '24px',
  },

  /* Stat Cards */
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '22px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    textAlign: 'center',
  },
  statIcon:  { fontSize: '30px', marginBottom: '10px' },
  statValue: { fontSize: '26px', fontWeight: 'bold' },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },

  /* Table */
  tableBox: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '22px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    marginBottom: '10px',
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#2c3e50',
    marginBottom: '14px',
    marginTop: 0,
  },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  tableHeaderRow: { backgroundColor: '#f8f9fa' },
  th: {
    padding: '11px 14px',
    textAlign: 'left',
    fontWeight: '700',
    color: '#555',
    borderBottom: '2px solid #eee',
  },
  td:      { padding: '11px 14px', color: '#444', borderBottom: '1px solid #f0f0f0' },
  trEven:  { backgroundColor: '#fff' },
  trOdd:   { backgroundColor: '#fafafa' },

  /* Section Panels */
  panelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '14px',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '22px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  panelIcon:  { fontSize: '28px', marginBottom: '10px' },
  panelTitle: { fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 8px' },
  panelDesc:  { fontSize: '13px', color: '#888', marginBottom: '16px', lineHeight: '1.5' },
  panelBtn: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },

  /* Footer */
  footer: {
    textAlign: 'center',
    padding: '16px',
    fontSize: '12px',
    color: '#aaa',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    marginTop: 'auto',
  },
};

export default Dashboard;
