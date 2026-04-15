import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Trash2, Edit3, User, Sparkles, BookOpen, Star, ArrowRight, 
  Play, Layout, Users, Settings, Zap, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('My Dashboard');
  const [suggestions, setSuggestions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [skillForm, setSkillForm] = useState({ name: '', level: 'Beginner', type: 'teach' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get('/users/suggestions');
        setSuggestions(data);
      } catch (err) {
        console.error('Failed to fetch suggestions');
      }
    };
    const fetchNetwork = async () => {
      try {
        const { data } = await api.get('/matches');
        setMatches(data.filter(m => m.status === 'accepted'));
      } catch (err) {
        console.error('Failed to fetch network');
      }
    };

    if (user) {
      fetchSuggestions();
      fetchNetwork();
    }
  }, [user]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name || !user) return;

    const updatedSkillsOffered = [...user.skillsOffered];
    const updatedSkillsWanted = [...user.skillsWanted];

    if (skillForm.type === 'teach') {
      updatedSkillsOffered.push({ name: skillForm.name, level: skillForm.level });
    } else {
      updatedSkillsWanted.push({ name: skillForm.name, level: skillForm.level });
    }

    try {
      setLoading(true);
      await updateProfile({
        skillsOffered: updatedSkillsOffered,
        skillsWanted: updatedSkillsWanted
      });
      setSkillForm({ name: '', level: 'Beginner', type: 'teach' });
    } catch (err) {
      alert('Error updating skills');
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (index, type) => {
    if (!user) return;
    const updatedSkillsOffered = [...user.skillsOffered];
    const updatedSkillsWanted = [...user.skillsWanted];

    if (type === 'teach') {
      updatedSkillsOffered.splice(index, 1);
    } else {
      updatedSkillsWanted.splice(index, 1);
    }

    try {
      await updateProfile({
        skillsOffered: updatedSkillsOffered,
        skillsWanted: updatedSkillsWanted
      });
    } catch (err) {
      alert('Error removing skill');
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '1rem' }}>
        <div className="loader"></div>
        <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Syncing your progress...</p>
      </div>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="pw-card" style={{ marginBottom: '30px', background: 'linear-gradient(to right, #5a4bda, #7e72e2)', color: 'white', border: 'none', padding: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Shabaash, {user?.name?.split(' ')[0]}! 👋</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Success doesn't just happen, it's meticulously planned.</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px 25px', borderRadius: '1.5rem', backdropFilter: 'blur(10px)' }}>
            <small style={{ fontWeight: 700, letterSpacing: '0.05em' }}>SKILL RATING</small>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginTop: '5px' }}>⭐ {user?.rating?.toFixed(1) || '0.0'}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px 25px', borderRadius: '1.5rem', backdropFilter: 'blur(10px)' }}>
            <small style={{ fontWeight: 700, letterSpacing: '0.05em' }}>SESSIONS</small>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginTop: '5px' }}>12</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px 25px', borderRadius: '1.5rem', backdropFilter: 'blur(10px)' }}>
            <small style={{ fontWeight: 700, letterSpacing: '0.05em' }}>LEARNING TIME</small>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginTop: '5px' }}>42h</div>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="var(--primary)" /> Smart Matches for You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {suggestions.map((sug) => (
            <div key={sug._id} className="pw-card mentor-card" style={{ padding: 0, overflow: 'hidden', background: 'white', transition: 'transform 0.3s' }}>
              <div style={{ background: '#f8fafc', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '25px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  {sug.name?.[0]}
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', color: 'var(--primary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  ACTIVE NOW
                </div>
              </div>
              <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{sug.name}</h4>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#f59e0b', background: '#fffbeb', padding: '4px 8px', borderRadius: '6px' }}>⭐ {sug.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <BookOpen size={14} /> Expert in <b style={{ color: 'var(--dark)' }}>{sug.skillsOffered?.[0]?.name || 'Everything'}</b>
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Request Demo</button>
                  <button className="btn btn-outline" style={{ padding: '12px', width: '48px', display: 'flex', justifyContent: 'center' }}>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '2rem' }}>
              <Users size={40} style={{ opacity: 0.1, marginBottom: '10px' }} />
              <p style={{ fontWeight: '600', color: 'var(--gray)' }}>Finding the best matches for your skills...</p>
            </div>
          )}
        </div>
      </section>
    </>
  );

  const renderSkillsAndGoals = () => (
    <>
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Plus color="var(--primary)" /> Portfolio Management
        </h2>
        <div className="pw-card" style={{ background: 'white' }}>
          <form onSubmit={handleAddSkill} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) auto', gap: '15px', alignItems: 'end' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700 }}>Skill Name</label>
              <input type="text" placeholder="e.g. Photoshop" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700 }}>Proficiency</label>
              <select value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 700 }}>Action</label>
              <select value={skillForm.type} onChange={e => setSkillForm({ ...skillForm, type: e.target.value })}>
                <option value="teach">I want to TEACH</option>
                <option value="learn">I want to LEARN</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ height: '48px', padding: '0 25px' }}>
              {loading ? '...' : 'Add Skill'}
            </button>
          </form>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
              <Zap size={20} color="var(--primary)" fill="var(--primary)" /> Teaching Portfolio
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(user?.skillsOffered || []).map((sk, i) => (
                <div key={i} className="pw-card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{sk.name}</div>
                    <small style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem' }}>{sk.level.toUpperCase()}</small>
                  </div>
                  <button onClick={() => removeSkill(i, 'teach')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {(!user?.skillsOffered || user?.skillsOffered.length === 0) && (
                <div style={{ padding: '30px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '1rem', color: 'var(--gray)' }}>
                  <AlertCircle size={24} style={{ marginBottom: '10px', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.9rem' }}>No skills listed to teach yet.</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
              <Sparkles size={20} color="var(--secondary)" fill="var(--secondary)" /> Learning Goals
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(user?.skillsWanted || []).map((sk, i) => (
                <div key={i} className="pw-card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{sk.name}</div>
                    <small style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.75rem' }}>{sk.level.toUpperCase()}</small>
                  </div>
                  <button onClick={() => removeSkill(i, 'learn')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {(!user?.skillsWanted || user?.skillsWanted.length === 0) && (
                <div style={{ padding: '30px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '1rem', color: 'var(--gray)' }}>
                  <AlertCircle size={24} style={{ marginBottom: '10px', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.9rem' }}>No learning goals set yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderNetwork = () => (
    <section>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Users color="var(--primary)" /> Your Network
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {matches.map((m) => {
          const partner = m.sender._id === user._id ? m.receiver : m.sender;
          return (
            <div key={m._id} className="pw-card" style={{ padding: '20px', background: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary)', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {partner.name[0]}
              </div>
              <div>
                <h4 style={{ fontWeight: 800 }}>{partner.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Connected as Learning Partner</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => window.location.href='/chat'}>Message</button>
                </div>
              </div>
            </div>
          );
        })}
        {matches.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '2rem' }}>
            <Users size={40} style={{ opacity: 0.1, marginBottom: '10px' }} />
            <p style={{ fontWeight: '600', color: 'var(--gray)' }}>No connections in your network yet.</p>
          </div>
        )}
      </div>
    </section>
  );

  const renderCertificates = () => (
    <section>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Star color="var(--primary)" /> Your Certificates
      </h2>
      <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '2rem' }}>
        <Star size={40} style={{ opacity: 0.1, marginBottom: '10px' }} />
        <p style={{ fontWeight: '600', color: 'var(--gray)' }}>Complete sessions to earn certificates of excellence.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>Your achievements will appear here.</p>
      </div>
    </section>
  );

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      <div className="dashboard-grid">
        {/* Sidebar Navigation - PW Style */}
        <aside>
          <div className="pw-card" style={{ padding: '20px', position: 'sticky', top: '100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 10px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)' }}>
                {user?.name?.[0] || 'U'}
              </div>
              <h4 style={{ fontWeight: 800 }}>{user?.name || 'Stranger'}</h4>
              <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{user?.email}</p>
              <div style={{ marginTop: '15px' }}>
                <span style={{ padding: '4px 12px', background: '#e0e7ff', color: 'var(--primary)', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                  {user?.role?.toUpperCase() || 'USER'}
                </span>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { icon: Layout, label: 'My Dashboard' },
                { icon: BookOpen, label: 'My Skills & Goals' },
                { icon: Users, label: 'Network' },
                { icon: Star, label: 'Certificates' },
                { icon: Settings, label: 'Settings' }
              ].map((item, i) => (
                <div key={i} 
                  onClick={() => setActiveTab(item.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px',
                    background: activeTab === item.label ? '#f0f4ff' : 'transparent',
                    color: activeTab === item.label ? 'var(--primary)' : '#4b5563',
                    fontWeight: 700, cursor: 'pointer', transition: '0.2s'
                  }} className="sidebar-hover">
                  <item.icon size={20} />
                  {item.label}
                </div>
              ))}
            </nav>

            <button
              className="btn btn-outline"
              onClick={() => { }} // Switch role logic if needed
              style={{ width: '100%', marginTop: '30px', borderStyle: 'dashed', borderColor: '#cbd5e1' }}
            >
              Switch to Mentor Mode
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main>
          {activeTab === 'My Dashboard' && renderDashboard()}
          {activeTab === 'My Skills & Goals' && renderSkillsAndGoals()}
          {activeTab === 'Network' && renderNetwork()}
          {activeTab === 'Certificates' && renderCertificates()}
          {activeTab === 'Settings' && <p style={{ padding: '2rem' }}>Settings page coming soon...</p>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
