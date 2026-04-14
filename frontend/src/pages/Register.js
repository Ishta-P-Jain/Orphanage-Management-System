// ============================================
//  Register.js — User Registration Page
// ============================================

import React, { useState } from 'react';
import { registerUser } from '../api';

function Register({ onSwitchToLogin }) {
  // Form field values
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await registerUser({ name, email, password });

    setLoading(false);

    if (result.message && result.message.toLowerCase().includes('successful')) {
      // Success — show green message and clear form
      setIsError(false);
      setMessage(result.message);
      setName('');
      setEmail('');
      setPassword('');
    } else {
      // Error — show red message
      setIsError(true);
      setMessage(result.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.logo}>🏠</div>
        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Join our orphanage support community</p>

        {/* Alert message */}
        {message && (
          <div style={{
            ...styles.alert,
            backgroundColor: isError ? '#fde8e8' : '#e8f5e9',
            color:           isError ? '#c0392b' : '#27ae60',
            border:          `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`,
          }}>
            {isError ? '❌' : '✅'} {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Ravi Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="e.g. ravi@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Switch page */}
        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={onSwitchToLogin}>
            Log in here
          </span>
        </p>

      </div>
    </div>
  );
}

// ── Inline Styles ─────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  logo: {
    fontSize: '40px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  title: {
    textAlign: 'center',
    fontSize: '22px',
    color: '#2c3e50',
    margin: '0 0 4px',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#888',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '5px',
    marginTop: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '22px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  alert: {
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
    marginTop: '22px',
  },
  link: {
    color: '#4a90e2',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
  },
};

export default Register;
