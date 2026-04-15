import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, BookOpen, Award, CheckCircle2, Trophy, Briefcase } from 'lucide-react';

const UserGoals = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '3rem 0', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>My <span className="gradient-text">Aspirations</span></h1>
        <p style={{ color: 'var(--gray)', fontSize: '1.2rem' }}>Tracking milestones, skills, and professional impact.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        {/* Left: Goals Card */}
        <aside>
          <div className="glass-card" style={{ padding: '2rem', background: 'white', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--secondary)', padding: '12px', borderRadius: '15px', color: 'white' }}>
                 <Target size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Primary Goal</h2>
            </div>
            
            <div style={{ background: '#fefce8', padding: '1.5rem', borderRadius: '20px', border: '1px solid #fef3c7', marginBottom: '2rem' }}>
               <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#92400e', lineHeight: 1.3 }}>
                 "Become a Good Educator"
               </p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', color: '#b45309', fontSize: '14px', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> 80% Toward Milestones
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <GoalProgress label="Student Feedback" val="92%" color="#10b981" />
               <GoalProgress label="Course Materials" val="75%" color="var(--primary)" />
               <GoalProgress label="Community Support" val="60%" color="var(--secondary)" />
            </div>
          </div>
        </aside>

        {/* Right: Skills & Certs */}
        <main>
          <div className="glass-card" style={{ padding: '2.5rem', background: 'white', marginBottom: '2.5rem' }}>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={24} color="var(--primary)" /> Mastery Core
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '2px solid var(--primary)' }}>
                   <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '10px' }}>MAIN DOMAIN</p>
                   <h4 style={{ fontSize: '2.2rem', fontWeight: 900 }}>MERN Stack</h4>
                   <p style={{ color: 'var(--gray)', marginTop: '10px' }}>Full-Stack JavaScript Specialist</p>
                </div>
                <div style={{ padding: '1rem' }}>
                   <p style={{ fontWeight: 800, marginBottom: '1rem' }}>Technical Sub-Specialties:</p>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['React & Next.js', 'Node.js/Express', 'MongoDB Atlas', 'Socket.io', 'JWT Security'].map(s => (
                        <span key={s} style={{ background: '#eef2ff', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}>{s}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
             <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={24} color="#10b981" /> Professional Certifications
             </h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <CertificateCard 
                  title="Java Developer Certificate" 
                  issuer="Oracle Academy" 
                  date="April 2025" 
                  color="#ef4444"
                  image="https://cdn-icons-png.flaticon.com/512/226/226777.png"
                />
                <CertificateCard 
                  title="MERN Stack Professional" 
                  issuer="SkillSwap Institute" 
                  date="October 2026" 
                  color="var(--primary)"
                  image="https://cdn.iconscout.com/icon/free/png-256/free-mongodb-3629020-3030245.png"
                />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const GoalProgress = ({ label, val, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 800 }}>
       <span>{label}</span>
       <span style={{ color }}>{val}</span>
    </div>
    <div style={{ background: '#f1f5f9', height: '10px', borderRadius: '5px' }}>
       <div style={{ background: color, width: val, height: '100%', borderRadius: '5px' }}></div>
    </div>
  </div>
);

const CertificateCard = ({ title, issuer, date, color, image }) => (
  <div style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#fdfdfd', transition: '0.3s' }} className="cert-card">
     <div style={{ width: '60px', height: '60px', background: `${color}10`, borderRadius: '15px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={image} alt={title} style={{ width: '35px', opacity: 0.8 }} />
     </div>
     <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h4>
     <p style={{ fontSize: '14px', color: 'var(--gray)', fontWeight: 600 }}>{issuer}</p>
     <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '1rem' }}>{date}</p>
     <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontWeight: 800, fontSize: '12px' }}>
        <Trophy size={14} /> VERIFIED CREDENTIAL
     </div>
  </div>
);

export default UserGoals;
