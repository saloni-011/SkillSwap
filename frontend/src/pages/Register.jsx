import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.password) {
        return setError('Please fill in all required fields');
      }
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || 
                     (err.message === 'Network Error' ? 'Server is offline. Please start the backend.' : 'Registration failed. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
        style={{ maxWidth: '500px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)' }}>
            <UserPlus size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Create Account</h2>
          <p style={{ color: 'var(--gray)', fontWeight: '600', marginTop: '0.5rem' }}>Join the community and start exchanging skills.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="e.g. Saloni" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                name="email"
                type="email" 
                placeholder="saloni@example.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Password</label>
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ color: 'var(--gray)', fontWeight: '600' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800' }}>Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
