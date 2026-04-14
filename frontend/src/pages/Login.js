// ============================================
//  Login.js — User Login Page
// ============================================

import React, { useState } from 'react';
import { loginUser } from '../api';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  // Form fields
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await loginUser({ email, password });

    setLoading(false);

    if (result.token) {
      // Save JWT and user info to localStorage so they persist on refresh
      localStorage.setItem('token', result.token);
      localStorage.setItem('user',  JSON.stringify(result.user));

      // Tell App.js to switch to the dashboard
      onLoginSuccess(result.user);
    } else {
      setMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.logo}>🏠</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to manage the orphanage</p>

        {/* Error message */}
        {message && (
          <div style={styles.alert}>
            ❌ {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Switch page */}
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={onSwitchToRegister}>
            Register here
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
    backgroundColor: '#fde8e8',
    color: '#c0392b',
    border: '1px solid #f5c6cb',
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

export default Login;
