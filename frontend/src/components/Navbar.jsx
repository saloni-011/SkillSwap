import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout, Search, MessageSquare, Calendar, User, Shield, Zap, Target } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Zap size={22} fill="white" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1a1a1b', letterSpacing: '-0.04em' }}>
              Skill<span style={{ color: 'var(--primary)' }}>Swap</span>
            </span>
          </Link>

          {/* PW Search Style */}
          <div style={{ position: 'relative', width: '300px' }} className="nav-search">
            <input 
              type="text" 
              placeholder="Search for skills, mentors..." 
              style={{ width: '100%', padding: '10px 15px 10px 40px', background: '#f0f4ff', border: 'none', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active-nav' : ''}`}>Home</Link>
          {user ? (
            <>
              <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active-nav' : ''}`}>Discovery</Link>
              <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active-nav' : ''}`}>Chat</Link>
              <Link to="/scheduler" className={`nav-link ${isActive('/scheduler') ? 'active-nav' : ''}`}>Sessions</Link>
              
              <div style={{ height: '30px', width: '1px', background: '#e5e7eb', margin: '0 5px' }}></div>
              
              <div className="account-dropdown-container" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '10px' }} className="profile-btn">
                   <div style={{ width: '36px', height: '36px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}>
                      {user?.name?.[0] || 'U'}
                   </div>
                   <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--dark)' }}>Me</span>
                </div>
                
                <div className="dropdown-menu">
                   <Link to="/dashboard"><Layout size={16} /> My Dashboard</Link>
                   <Link to="/profile/goals" style={{ color: 'var(--primary)' }}><Target size={16} /> My Goals & Skills</Link>
                   <Link to="/profile"><User size={16} /> Profile</Link>
                   {user.role === 'admin' && (
                     <Link to="/admin" style={{ color: '#10b981' }}><Shield size={16} /> Admin Panel</Link>
                   )}
                   <hr />
                   <button onClick={handleLogout} style={{ color: '#ef4444' }}><LogOut size={16} /> Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '10px 25px', fontSize: '14px', fontWeight: '800' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 25px', fontSize: '14px', fontWeight: '800' }}>Register</Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        .nav-link {
          text-decoration: none;
          color: #4b5563;
          font-weight: 700;
          font-size: 14px;
          transition: 0.2s;
        }
        .nav-link:hover, .active-nav {
          color: var(--primary);
        }
        .profile-btn:hover {
          background: #f0f4ff;
        }
        .account-dropdown-container:hover .dropdown-menu {
          display: block;
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          min-width: 200px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 10px;
          z-index: 100;
          border: 1px solid #f1f5f9;
        }
        .dropdown-menu a, .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          text-decoration: none;
          color: var(--dark);
          font-weight: 600;
          font-size: 14px;
          border-radius: 8px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-menu a:hover, .dropdown-menu button:hover {
          background: #f8fafc;
        }
        .dropdown-menu hr {
          margin: 8px 0;
          border: none;
          border-top: 1px solid #f1f5f9;
        }
        @media (max-width: 900px) {
          .nav-search { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
