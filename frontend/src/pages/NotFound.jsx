import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fee2e2', color: '#ef4444', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
        <AlertCircle size={64} />
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Signal Lost in Static</h2>
      <p style={{ color: 'var(--gray)', maxWidth: '450px', marginBottom: '3rem' }}>
        The page you are looking for has been moved or purged from the database. 
        Don't worry, your progress is safe.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ArrowLeft size={18} /> Back to Learning
      </Link>
    </div>
  );
};

export default NotFound;
