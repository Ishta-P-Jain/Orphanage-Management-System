// ============================================
//  ContactUs.js — NEW FILE
//  Simple contact information page.
//  Shows dummy orphanage contact details.
//  No backend needed — purely static display.
// ============================================

import React from 'react';

function ContactUs({ onBack }) {

  // Orphanage contact details — edit these as needed
  const info = {
    name:    'Hope Orphanage',
    tagline: 'Giving every child a home, a heart, and a future.',
    address: '12, MG Road, Karkala, Udupi – 560127, Karnataka, India',
    phone:   '+91 98765 43210',
    altPhone:'+91 80123 45678',
    email:   'support@hopeorphanage.com',
    website: 'www.hopeorphanage.com',
    hours:   'Monday – Saturday: 9:00 AM – 6:00 PM',
    closed:  'Sundays & Public Holidays',
  };

  // Individual contact cards to display in a grid
  const contactCards = [
    {
      icon: '📍',
      title: 'Our Address',
      lines: [info.address],
      color: '#e74c3c',
    },
    {
      icon: '📞',
      title: 'Phone Numbers',
      lines: [info.phone, info.altPhone],
      color: '#27ae60',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      lines: [info.email],
      color: '#4a90e2',
    },
    {
      icon: '🕐',
      title: 'Working Hours',
      lines: [info.hours, `Closed: ${info.closed}`],
      color: '#e67e22',
    },
  ];

  return (
    <div style={styles.page}>

      {/* ── Header bar (matches rest of app) ── */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        <h2 style={styles.headerTitle}>📬 Contact Us</h2>
      </div>

      <div style={styles.content}>

        {/* ── Hero section ── */}
        <div style={styles.hero}>
          <div style={styles.heroIcon}>🏠</div>
          <h1 style={styles.heroName}>{info.name}</h1>
          <p style={styles.heroTagline}>{info.tagline}</p>
        </div>

        {/* ── Contact info cards ── */}
        <div style={styles.cardGrid}>
          {contactCards.map((card) => (
            <div key={card.title} style={styles.card}>
              <div style={{ ...styles.cardIconBox, backgroundColor: card.color + '18', color: card.color }}>
                {card.icon}
              </div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              {card.lines.map((line, i) => (
                <p key={i} style={styles.cardLine}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* ── Map placeholder (static, no API needed) ── */}
        <div style={styles.mapBox}>
          <h3 style={styles.mapTitle}>📌 Find Us</h3>
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapPin}>📍</div>
            <p style={styles.mapText}>
              Hope Orphanage<br />
              12, MG Road, Koramangala<br />
              Bangalore – 560034
            </p>
            <a
              href="https://maps.google.com/?q=Koramangala+Bangalore"
              target="_blank"
              rel="noreferrer"
              style={styles.mapLink}
            >
              Open in Google Maps →
            </a>
          </div>
        </div>

        {/* ── Quick message note ── */}
        <div style={styles.noteBox}>
          <strong>💡 Want to reach us?</strong> You can call or email us during working hours.
          For urgent matters, please call <strong>{info.phone}</strong>.
          We typically respond to emails within <strong>24 hours</strong>.
        </div>

      </div>
    </div>
  );
}

const styles = {
  page:    { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },

  /* Header */
  header:  {
    backgroundColor: '#2c3e50', padding: '16px 30px',
    display: 'flex', alignItems: 'center', gap: '16px',
  },
  backBtn: {
    backgroundColor: 'transparent', color: '#ecf0f1', border: '1px solid #7f8c8d',
    padding: '7px 14px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px',
  },
  headerTitle: { color: '#fff', fontSize: '20px', margin: 0 },

  /* Content area */
  content: { padding: '30px', maxWidth: '900px', margin: '0 auto' },

  /* Hero */
  hero: {
    textAlign: 'center', padding: '36px 20px 28px',
    backgroundColor: '#fff', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '24px',
  },
  heroIcon:    { fontSize: '52px', marginBottom: '10px' },
  heroName:    { fontSize: '26px', fontWeight: '800', color: '#2c3e50', margin: '0 0 8px' },
  heroTagline: { fontSize: '14px', color: '#888', margin: 0 },

  /* Contact cards grid */
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '18px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '22px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  cardIconBox: {
    width: '46px', height: '46px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '12px',
  },
  cardTitle: { fontSize: '14px', fontWeight: '700', color: '#2c3e50', margin: '0 0 8px' },
  cardLine:  { fontSize: '13px', color: '#666', margin: '3px 0', lineHeight: '1.6' },

  /* Map box */
  mapBox: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '22px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '20px',
  },
  mapTitle: { fontSize: '15px', fontWeight: '700', color: '#2c3e50', margin: '0 0 14px' },
  mapPlaceholder: {
    backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px dashed #ddd',
    padding: '30px 20px', textAlign: 'center',
  },
  mapPin:  { fontSize: '36px', marginBottom: '10px' },
  mapText: { fontSize: '14px', color: '#555', lineHeight: '1.8', margin: '0 0 14px' },
  mapLink: {
    backgroundColor: '#4a90e2', color: '#fff', padding: '9px 18px',
    borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600',
  },

  /* Note box */
  noteBox: {
    backgroundColor: '#eaf4ff', border: '1px solid #bee3f8', borderRadius: '8px',
    padding: '14px 18px', fontSize: '13px', color: '#2c3e50', lineHeight: '1.7',
  },
};

export default ContactUs;
