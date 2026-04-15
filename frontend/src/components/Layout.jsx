import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer glass-card" style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', opacity: 0.8 }}>
        <p>&copy; 2026 SkillSwap. Empowering learners worldwide.</p>
      </footer>
    </div>
  );
};

export default Layout;
