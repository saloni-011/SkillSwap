import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Zap, Star, ShieldCheck, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Landing = () => {
  const [banner, setBanner] = React.useState({ heroTitle: '', heroSubtitle: '' });

  React.useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data } = await api.get('/admin/banner');
      setBanner(data);
    } catch (err) {}
  };

  return (
    <div className="landing-page">
      {/* Hero Section - PW Style */}
      <section className="hero" style={{ background: '#fff', padding: '60px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ gridTemplateColumns: '1.2fr 1fr', display: 'grid', gap: '40px', alignItems: 'center' }}>
            <div className="hero-content">
              <span className="badge" style={{ marginBottom: '15px' }}>v1.2 - India's Most Loved Learning Platform</span>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#1a1a1b', lineHeight: 1.2, marginBottom: '20px' }}>
                {banner.heroTitle || 'Ab Hoga Skill Exchange Sabke Liye Aasaan!'}
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#4a4a4b', marginBottom: '35px', maxWidth: '550px' }}>
                {banner.heroSubtitle || 'Join SkillSwap and learn anything from mentors for free by teaching what you know.'}
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                  Register for FREE
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 700 }}>
                  <PlayCircle size={30} /> Watch How it works
                </div>
              </div>
            </div>
            <div className="hero-image" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ width: '450px', height: '450px', background: '#eef2ff', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}></div>
                {/* Premium Illustration */}
                <img 
                   src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?t=st=1713110000~exp=1713113600~hmac=6211..." 
                   alt="Modern Learning" 
                   style={{ width: '100%', maxWidth: '550px', position: 'relative', zIndex: 1, borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} 
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '40px 0', background: '#f8f9ff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
            {[
              { val: '50K+', label: 'Registered Students' },
              { val: '10K+', label: 'Expert Mentors' },
              { val: '100+', label: 'Skills to Learn' },
              { val: '4.9/5', label: 'PlayStore Rating' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{s.val}</h2>
                <p style={{ color: '#6b7280', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Courses - PW Style Cards */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Browse Our <span style={{ color: 'var(--primary)' }}>Popular Batches</span></h2>
            <p style={{ color: '#6b7280', marginTop: '10px' }}>Select your category and start learning from the best.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {[
              { title: 'Programming & Tech', color: '#5a4bda', icon: Zap },
              { title: 'Design & Creative', color: '#ff9800', icon: Star },
              { title: 'Business & Growth', color: '#00bcd4', icon: BookOpen },
              { title: 'Lifestyle & Health', color: '#22c55e', icon: Users }
            ].map((cat, i) => (
              <div key={i} className="pw-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => window.open(`https://www.google.com/search?q=online+courses+${cat.title}`, '_blank')}>
                <div style={{ width: '70px', height: '70px', background: `${cat.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: cat.color }}>
                  <cat.icon size={35} />
                </div>
                <h3 style={{ marginBottom: '15px' }}>{cat.title}</h3>
                <button className="btn" style={{ background: '#f0f4ff', color: 'var(--primary)', width: '100%', border: 'none', fontWeight: '800' }}>
                  Explore Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High Quality Trusted Section */}
      <section style={{ padding: '80px 0', background: '#f0f4ff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <img 
                src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
                alt="Trusted" 
                style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
              />
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '25px' }}>Trust of <span style={{ color: 'var(--primary)' }}>Million Learners</span></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  '1-on-1 Personalized Mentorship',
                  'Live Interactive Chat sessions',
                  'Verified Mentors across all categories',
                  'Structured Learning Paths'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', fontWeight: 600 }}>
                    <div style={{ background: '#22c55e', color: 'white', borderRadius: '50%', padding: '4px' }}>
                      <ShieldCheck size={18} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '40px', padding: '15px 40px' }}>
                Explore All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1b', color: 'white', padding: '80px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '20px' }}>Skill<span style={{ color: 'var(--primary)' }}>Swap</span></h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>The world's largest skill-exchange community. Learn together, grow together.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Marketplace</li>
                <li>Success Stories</li>
                <li>How it works</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Popular Skills</h4>
              <ul style={{ listStyle: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>Web Development</li>
                <li>Data Science</li>
                <li>Digital Marketing</li>
                <li>UI/UX Design</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Contact Us</h4>
              <p style={{ color: '#94a3b8' }}>support@skillswap.com</p>
              <p style={{ color: '#94a3b8' }}>1800-Skill-Swap</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: '30px', textAlign: 'center', color: '#64748b' }}>
            <p>&copy; 2026 SkillSwap Learning Platform Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
