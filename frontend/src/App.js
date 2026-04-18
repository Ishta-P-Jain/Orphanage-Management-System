// ============================================
//  App.js — MODIFIED FILE
//  Change from previous version:
//  1. Added import for ContactUs
//  2. Added 'contact' to page state comment
//  3. Added {page === 'contact'} render block
//  All other logic is completely untouched.
// ============================================

import React, { useState, useEffect } from 'react';

// Existing pages — untouched
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Children  from './pages/Children';
import Donations from './pages/Donations';
import DonateForm from './pages/DonateForm';
import AdoptForm  from './pages/AdoptForm';
import AboutUs from './pages/AboutUs';

// NEW import
import ContactUs from './pages/ContactUs';

function App() {
  // All pages:
  // 'login' | 'register' | 'dashboard' |
  // 'children' | 'donations' | 'donate' | 'adopt' | 'contact'
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  const handleNavigate = (navigateTo) => {
    setPage(navigateTo);
  };

  const handleBack = () => {
    setPage('dashboard');
  };

  return (
    <>
      {page === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setPage('register')}
        />
      )}
      {page === 'register' && (
        <Register onSwitchToLogin={() => setPage('login')} />
      )}
      {page === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {page === 'children'  && <Children  onBack={handleBack} />}
      {page === 'donations' && <Donations onBack={handleBack} />}
      {page === 'donate'    && <DonateForm onBack={handleBack} />}
      {page === 'adopt'     && <AdoptForm  onBack={handleBack} />}

      {/* NEW — Contact Us page */}
      {page === 'about' && <AboutUs />}
      
      {page === 'contact'   && <ContactUs  onBack={handleBack} />}
    </>
  );
}

export default App;
