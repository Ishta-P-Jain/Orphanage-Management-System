// ============================================
//  App.js — MODIFIED FILE
//  Changes from original:
//  1. Added new page states: children, donations,
//     donate, adopt
//  2. Passes onNavigate prop to Dashboard
//  3. Passes onBack prop to all new pages
//  Login, Register logic is 100% untouched.
// ============================================

import React, { useState, useEffect } from 'react';

// Existing pages — untouched
import Login    from './pages/Login';
import Register from './pages/Register';

// Modified dashboard
import Dashboard from './pages/Dashboard';

// New pages
import Children  from './pages/Children';
import Donations from './pages/Donations';
import DonateForm from './pages/DonateForm';
import AdoptForm  from './pages/AdoptForm';

function App() {
  // All possible pages:
  // 'login' | 'register' | 'dashboard' |
  // 'children' | 'donations' | 'donate' | 'adopt'
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  // On first load — restore session from localStorage if available
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  // Called by Login on success
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  // Called by Dashboard logout button
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  // Called by Dashboard section buttons
  // navigateTo = 'children' | 'donations' | 'donate' | 'adopt'
  const handleNavigate = (navigateTo) => {
    setPage(navigateTo);
  };

  // Called by Back buttons on inner pages
  const handleBack = () => {
    setPage('dashboard');
  };

  return (
    <>
      {/* ── Existing auth pages (unchanged) ── */}
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register onSwitchToLogin={() => setPage('login')} />
      )}

      {/* ── Dashboard (now receives onNavigate) ── */}
      {page === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {/* ── New pages ── */}
      {page === 'children'  && <Children  onBack={handleBack} />}
      {page === 'donations' && <Donations onBack={handleBack} />}
      {page === 'donate'    && <DonateForm onBack={handleBack} />}
      {page === 'adopt'     && <AdoptForm  onBack={handleBack} />}
    </>
  );
}

export default App;
