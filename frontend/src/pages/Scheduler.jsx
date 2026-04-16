import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle, Star, Plus, User, Info, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Scheduler = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({ title: '', mentor: '', date: '', duration: 60 });
  const [ratingData, setRatingData] = useState({ rating: 5, review: '' });
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const sRes = await api.get('/sessions');
      setSessions(sRes.data);
      const mRes = await api.get('/matches');
      setMatches(mRes.data.filter(m => m.status === 'accepted' || m.status === 'pending'));
    } catch (err) {
      console.error('Error fetching scheduler data');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', formData);
      fetchData();
      setFormData({ title: '', mentor: '', date: '', duration: 60 });
      alert('Session scheduled successfully!');
    } catch (err) {
      alert('Error booking session');
    }
  };

  const completeSession = async (id) => {
    try {
      await api.put(`/sessions/${id}`, { status: 'completed' });
      fetchData();
    } catch (err) {
      alert('Error updating session');
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/sessions/${selectedSession}`, { ...ratingData });
      fetchData();
      setSelectedSession(null);
      setRatingData({ rating: 5, review: '' });
      alert('Thank you for your feedback!');
    } catch (err) {
      alert('Error submitting rating');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <header style={{ marginBottom: '4rem', animation: 'fadeIn 0.5s ease-out' }}>
        <div className="badge">Time Management</div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
          Your <span className="gradient-text">Learning Flow.</span>
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Coordinate sessions and track your progress with mentors.</p>
      </header>

      <div className="dashboard-grid">
        {/* Booking Console */}
        <aside>
          <div className="glass-card" style={{ padding: '2.5rem', background: 'white', borderRadius: '2rem', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '1.5rem', fontWeight: '800' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.6rem', borderRadius: '1rem', color: 'var(--primary)' }}>
                <Calendar size={20} />
              </div> 
              Plan Entry
            </h3>
            <form onSubmit={handleBook}>
              <div className="input-group">
                <label>Knowledge Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advanced TypeScript" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem' }}
                />
              </div>
              <div className="input-group">
                <label>Learning Partner</label>
                <select 
                  value={formData.mentor} 
                  onChange={e => setFormData({...formData, mentor: e.target.value})} 
                  required
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', height: '54px' }}
                >
                  <option value="">Select current mentor</option>
                  {matches.map(m => {
                    const partner = m.sender._id === user._id ? m.receiver : m.sender;
                    return <option key={partner._id} value={partner._id}>{partner.name}</option>
                  })}
                </select>
              </div>
              <div className="input-group">
                <label>Event Timestamp</label>
                <input 
                  type="datetime-local" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  required 
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem' }}
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', height: '54px', borderRadius: '1rem', fontWeight: '800' }}>
                Confirm Booking
              </button>
            </form>
          </div>
        </aside>

        {/* Sessions Pipeline */}
        <main>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Session Registry</h2>
            <div style={{ padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--gray)' }}>
              {sessions.length} TOTAL SESSIONS
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {sessions.length === 0 ? (
              <div className="glass-card" style={{ padding: '5rem 2rem', textAlign: 'center', background: 'white', borderRadius: '2.5rem' }}>
                <Clock size={64} style={{ color: 'var(--primary)', opacity: 0.1, marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Empty Pipeline</h3>
                <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>Start your journey by booking your first skill exchange session.</p>
              </div>
            ) : (
              sessions.map(sess => {
                const isMentor = sess.mentor._id === user._id;
                const partner = isMentor ? sess.student : sess.mentor;
                
                return (
                  <div key={sess._id} className="glass-card" style={{ padding: '1.75rem 2rem', background: 'white', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)', fontSize: '1.25rem' }}>
                          {partner.name[0]}
                        </div>
                        <div style={{ position: 'absolute', top: '-5px', left: '-5px', background: isMentor ? 'var(--primary)' : 'var(--secondary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: '900' }}>
                          {isMentor ? 'HOST' : 'GUEST'}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--dark)' }}>{sess.title}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--gray)', fontWeight: '600' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} /> {format(new Date(sess.date), 'MMMM dd, p')}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={14} /> partner: {partner.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.4rem 0.85rem', 
                        borderRadius: '2rem', 
                        background: sess.status === 'completed' ? '#ecfdf5' : '#fff7ed',
                        color: sess.status === 'completed' ? '#10b981' : '#f97316',
                        fontWeight: '800',
                        display: 'inline-block',
                        marginBottom: '1rem',
                        border: sess.status === 'completed' ? '1px solid #a7f3d0' : '1px solid #fed7aa'
                      }}>
                        {sess.status.toUpperCase()}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {sess.status === 'scheduled' && isMentor && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.85rem' }} 
                            onClick={() => completeSession(sess._id)}
                          >
                            End Session
                          </button>
                        )}

                        {sess.status === 'completed' && sess.student._id === user._id && !sess.rating && (
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '0.85rem' }} 
                            onClick={() => setSelectedSession(sess._id)}
                          >
                            Feedback Portal
                          </button>
                        )}

                        {sess.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: '800', background: '#fffbeb', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #fef3c7' }}>
                            <Star size={16} fill="#f59e0b" /> {sess.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Modern Rating Portal */}
      {selectedSession && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '2rem' }}>
          <div className="glass-card" style={{ background: 'white', padding: '3rem', maxWidth: '450px', width: '100%', borderRadius: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Star size={32} fill="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Rate Experience</h3>
              <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>Help our community maintain quality standards by rating your latest session.</p>
            </div>

            <form onSubmit={submitRating}>
              <div className="input-group">
                <label>Vibe Rating</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(n => (
                    <button 
                      key={n} 
                      type="button" 
                      onClick={() => setRatingData({...ratingData, rating: n})}
                      style={{ 
                        height: '50px', 
                        borderRadius: '12px', 
                        border: ratingData.rating === n ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                        background: ratingData.rating === n ? '#fffbeb' : 'white',
                        color: ratingData.rating === n ? '#f59e0b' : 'var(--gray)',
                        fontWeight: '800',
                        fontSize: '1.1rem'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '1.5rem' }}>
                <label>Qualitative Review</label>
                <textarea 
                  rows="4" 
                  placeholder="What did you learn? How was the mentor?"
                  value={ratingData.review} 
                  onChange={e => setRatingData({...ratingData, review: e.target.value})} 
                  style={{ borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, height: '54px', borderRadius: '1rem' }} onClick={() => setSelectedSession(null)}>Skip</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '54px', borderRadius: '1rem' }}>Submit Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
