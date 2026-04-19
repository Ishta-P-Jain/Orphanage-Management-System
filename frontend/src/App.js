// ============================================
//  App.js — MODIFIED FILE
//  Changes from previous version:
//  1. Added import for AboutUs
//  2. Added 'about' to page list comment
//  3. Added {page === 'about'} render block
//  All other logic is word-for-word identical.
// ============================================

import React, { useState, useEffect } from 'react';

import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Children   from './pages/Children';
import Donations  from './pages/Donations';
import DonateForm from './pages/DonateForm';
import AdoptForm  from './pages/AdoptForm';
import ContactUs  from './pages/ContactUs';

// NEW
import AboutUs from './pages/AboutUs';

function App() {
  // All pages:
  // 'login' | 'register' | 'dashboard' |
  // 'children' | 'donations' | 'donate' | 'adopt' | 'contact' | 'about'
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

  const handleNavigate = (navigateTo) => setPage(navigateTo);
  const handleBack     = ()           => setPage('dashboard');

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
      {page === 'contact'   && <ContactUs  onBack={handleBack} />}

      {/* NEW — About Us page */}
      {page === 'about'     && <AboutUs    onBack={handleBack} />}
    </>
  );
}

export default App;
