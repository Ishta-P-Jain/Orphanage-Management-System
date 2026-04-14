// ============================================
//  App.js — Root Component
//  Controls which page is shown using state.
//  No React Router — just simple state switching.
// ============================================

import React, { useState, useEffect } from 'react';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // Current page: 'login' | 'register' | 'dashboard'
  const [page, setPage] = useState('login');

  // The logged-in user object (from backend)
  const [user, setUser] = useState(null);

  // On first load — check if user already logged in (token in localStorage)
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      // Token exists → restore session and go straight to dashboard
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  // Called by Login page after successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  // Called by Dashboard when user clicks Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  // Render the correct page
  return (
    <>
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage('register')}
        />
      )}

      {page === 'register' && (
        <Register
          onSwitchToLogin={() => setPage('login')}
        />
      )}

      {page === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
