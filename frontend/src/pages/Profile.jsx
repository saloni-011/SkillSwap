import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Book, Star } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ width: '100px', height: '100px', background: 'var(--primary)', borderRadius: '30px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900 }}>
            {user?.name?.[0]}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{user?.name}</h1>
            <p style={{ color: 'var(--gray)', fontWeight: 600 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
              <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>{user?.role?.toUpperCase()}</span>
              {user?.role === 'mentor' && <span className="badge">Verified Instructor</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <div>
            <div className="pw-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}><Star size={20} color="var(--secondary)" /> My Career Goal</h3>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', borderLeft: '5px solid var(--secondary)' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--dark)' }}>"Become a good educator and mentor souls."</p>
              </div>
            </div>

            <div className="pw-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}><Book size={20} color="var(--primary)" /> Mastery & Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem' }}>
                {['MERN Stack', 'System Design', 'Cloud Computing'].map((sk, i) => (
                  <span key={i} style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}>{sk}</span>
                ))}
              </div>
              <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary)', width: '85%', height: '100%' }}></div>
              </div>
              <p style={{ fontSize: '12px', marginTop: '8px', fontWeight: 600, color: 'var(--gray)' }}>85% overall mastery in active skills</p>
            </div>
          </div>

          <div>
            <div className="pw-card" style={{ height: '100%' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}><Shield size={20} color="#10b981" /> Certifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Java Developer Certificate', issuer: 'Oracle Academy', year: '2025' },
                  { name: 'MERN Stack Certificate', issuer: 'SkillSwap Pro', year: '2026' }
                ].map((cert, i) => (
                  <div key={i} style={{ padding: '1rem', border: '1px dashed #cbd5e1', borderRadius: '12px', background: '#fdfdfd' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{cert.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Issued by {cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
