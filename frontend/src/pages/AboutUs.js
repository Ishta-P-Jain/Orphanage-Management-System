// ============================================
//  AboutUs.js — MODIFIED FILE
//  Changes from uploaded version:
//  1. Added onBack prop + "← Back" button
//  2. Changed "2024" → "2026" in footer
//  3. Changed "Orphanage Manager" → "Hope Orphanage"
//  All content cards are identical.
// ============================================

import React from 'react';

function AboutUs({ onBack }) {
  return (
    <div style={styles.page}>

      {/* ── Header bar (matches all other pages) ── */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.headerTitle}>🏠 About Us</h2>
      </div>

      {/* ── Page content ── */}
      <div style={styles.container}>

        <h2 style={styles.title}>About Hope Orphanage</h2>
        <p style={styles.subtitle}>
          Dedicated to providing care, love, and opportunities to children in need.
        </p>

        {/* Intro */}
        <div style={styles.card}>
          <h3 style={styles.heading}>🏠 Our Mission</h3>
          <p style={styles.text}>
            Hope Orphanage is committed to supporting orphans and vulnerable children by providing
            shelter, education, healthcare, and emotional support. Our goal is to create a nurturing
            environment where every child can grow with dignity and opportunity.
          </p>
        </div>

        {/* Sections grid */}
        <div style={styles.grid}>

          <div style={styles.card}>
            <h4 style={styles.heading}>🌱 Hope Community Village</h4>
            <p style={styles.text}>
              Offers long-term family care to children by providing a loving home, education, and life
              opportunities. Operates under a Private Charity Partnership model and welcomes donations.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.heading}>📚 HOPE Worldwide India</h4>
            <p style={styles.text}>
              Focuses on sustainable health and education programs including vocational training,
              elderly care, and disaster relief, empowering communities across India.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.heading}>👧 Homes of Hope India</h4>
            <p style={styles.text}>
              Transforms lives of marginalized girls by rescuing them from the streets and providing
              shelter, food, education, and a safe environment for a better future.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.heading}>🤝 India Hope</h4>
            <p style={styles.text}>
              Supports orphans and needy children with food, clothing, education, and care. Also helps
              elderly individuals and those suffering from serious illnesses.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.heading}>🌍 Hope and Homes for Children</h4>
            <p style={styles.text}>
              A global movement working to transition children from institutions into family-based care,
              ensuring a better and more personal upbringing.
            </p>
          </div>

        </div>

        {/* Closing */}
        <div style={styles.card}>
          <p style={styles.text}>
            These organizations work tirelessly to provide hope, care, and opportunities to children in need,
            ensuring they grow into independent and successful individuals.
          </p>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        © 2026 Hope Orphanage — Built with ❤️
      </footer>

    </div>
  );
}

const styles = {
  /* Outer page wrapper — same dark header as all other pages */
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },

  /* Dark header bar with back button */
  header: {
    backgroundColor: '#2c3e50',
    padding: '16px 30px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#ecf0f1',
    border: '1px solid #7f8c8d',
    padding: '7px 14px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  headerTitle: {
    color: '#fff',
    fontSize: '20px',
    margin: 0,
  },

  /* Scrollable content area */
  container: {
    flex: 1,
    padding: '28px 30px',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },

  title: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    marginBottom: '15px',
  },
  heading: {
    fontSize: '16px',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  text: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.6',
  },

  /* Footer */
  footer: {
    textAlign: 'center',
    padding: '16px',
    fontSize: '15px',
    color: '#fdfdfd',
    backgroundColor: '#374c60',
    borderTop: '1px solid #eee',
    marginTop: 'auto',
  },
};

export default AboutUs;
