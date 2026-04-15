import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Plus, Users, BookOpen, Trash2, Shield, BarChart2, CheckCircle,
  Search, Mail, Star, LayoutDashboard, CreditCard, Clock,
  AlertCircle, ChevronRight, Ban, UserPlus, FileCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [banner, setBanner] = useState({ heroTitle: '', heroSubtitle: '' });
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Tech' });
  const [globalSkills, setGlobalSkills] = useState([]);

  const filteredUsers = (users || []).filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData();
    fetchBanner();
    fetchSkills();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, sRes, pRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/analytics'),
        api.get('/admin/courses/pending')
      ]);
      setUsers(uRes.data);
      setStats(sRes.data);
      setPendingCourses(pRes.data);
    } catch (err) {
      toast.error('Admin access denied or server error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanner = async () => {
    try {
      const { data } = await api.get('/admin/banner');
      setBanner(data);
    } catch (err) { }
  };

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/admin/skills');
      setGlobalSkills(data || []);
    } catch (err) { }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/skills', newSkill);
      toast.success('Skill added to database');
      setShowSkillModal(false);
      fetchSkills();
    } catch (err) {
      toast.error('Skill already exists or error');
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/banner', banner);
      toast.success('Landing page updated!');
    } catch (err) {
      toast.error('Failed to update banner');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User deleted');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success(`User promoted to ${role === 'mentor' ? 'Instructor' : role}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleApproveCourse = async (id) => {
    try {
      await api.put(`/admin/courses/${id}/approve`);
      toast.success('Course approved and listed');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve course');
    }
  };


  if (loading) return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
      <div className="loader"></div>
      <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Accessing secure mainframe...</p>
    </div>
  );

  const renderDashboard = () => (
    <div className="admin-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="TOTAL REVENUE" value={`$${stats?.totalSales || 0}`} icon={<CreditCard size={24} />} color="#10b981" />
        <StatCard title="ACTIVE LEARNERS" value={stats?.totalEnrollments || 0} icon={<Users size={24} />} color="var(--primary)" />
        <StatCard title="PENDING COURSES" value={stats?.pendingCourses || 0} icon={<Clock size={24} />} color="#f59e0b" />
        <StatCard title="TOTAL USERS" value={stats?.totalUsers || 0} icon={<FileCheck size={24} />} color="var(--secondary)" />
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart2 size={24} color="var(--primary)" /> Financial Growth & User Engagement
        </h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.growthData || []}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-fade-in">
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>User Management</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 3rem', width: '100%', borderRadius: '2rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}
            />
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--gray)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0 1rem' }}>User Identification</th>
              <th style={{ padding: '0 1rem' }}>Role</th>
              <th style={{ padding: '0 1rem' }}>Status</th>
              <th style={{ padding: '0 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} style={{ background: '#f8fafc' }}>
                <td style={{ padding: '1rem', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>{u.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: '700' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    background: u.role === 'admin' ? '#fef3c7' : (u.role === 'mentor' ? '#dcfce7' : '#f1f5f9'),
                    color: u.role === 'admin' ? '#92400e' : (u.role === 'mentor' ? '#166534' : '#64748b')
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>ACTIVE</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                    {u.role === 'user' && (
                      <button onClick={() => handleUpdateRole(u._id, 'mentor')} className="btn-icon" title="Promote to Mentor">
                        <UserPlus size={16} color="#10b981" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u.role === 'admin'}
                      className="btn-icon"
                      style={{ opacity: u.role === 'admin' ? 0.3 : 1 }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBanner = () => (
    <div className="admin-fade-in">
      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileCheck size={24} color="var(--primary)" /> Landing Banner Logic
        </h3>
        <form onSubmit={handleUpdateBanner}>
          <div className="input-group">
            <label>Hero Title (H1)</label>
            <input
              type="text"
              value={banner.heroTitle}
              onChange={e => setBanner({ ...banner, heroTitle: e.target.value })}
              placeholder="Ab Hoga Skill Exchange..."
              required
            />
          </div>
          <div className="input-group">
            <label>Hero Subtitle (P)</label>
            <textarea
              rows="4"
              value={banner.heroSubtitle}
              onChange={e => setBanner({ ...banner, heroSubtitle: e.target.value })}
              placeholder="Provide a catchphrase for your platform..."
              required
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Main Landing</button>
        </form>
      </div>
    </div>
  );


  const renderSkills = () => (
    <div className="admin-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Expertise Registry</h3>
            <button onClick={() => setShowSkillModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Add New Skill
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {globalSkills.length === 0 ? (
              <p style={{ color: 'var(--gray)' }}>No global skills found. Start adding!</p>
            ) : globalSkills.map((sk, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '15px' }}>{sk.name}</span>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{sk.category.toUpperCase()}</div>
                </div>
                <div style={{ background: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, border: '1px solid #eef2ff' }}>
                  ACTIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSkillModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', background: 'white', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>Add Global Discipline</h3>
            <form onSubmit={handleAddSkill}>
              <div className="input-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Solidity Development"
                  value={newSkill.name}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Niche Category</label>
                <select
                  value={newSkill.category}
                  onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }}
                >
                  <option value="Tech">Tech</option>
                  <option value="Business">Business</option>
                  <option value="Design">Design</option>
                  <option value="Art">Art</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowSkillModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="admin-fade-in">
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '2rem' }}>Verification Queue</h3>
        {pendingCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gray)' }}>
            <FileCheck size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <p style={{ fontWeight: 800 }}>Queue is clear. Every mentor verified.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {pendingCourses.map(course => (
              <div key={course._id} className="course-approval-card" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>{course.category.toUpperCase()}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{course.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>Instructor: <b>{course.instructor?.name}</b></p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleApproveCourse(course._id)} className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>Approve</button>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: '13px', color: '#ef4444', borderColor: '#ef4444' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', marginTop: '1rem', gap: '2rem' }}>
      {/* Sidebar */}
      <aside style={{ width: '320px', flexShrink: 0 }}>
        <div className="glass-card" style={{ padding: '2rem', height: '100%', position: 'sticky', top: '2rem' }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '1rem' }}>
              <Shield size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', letterSpacing: '-0.02em' }}>MASTER CONTROL</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="System Overview" />
            <SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20} />} label="User Registry" />
            <SidebarItem active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon={<BookOpen size={20} />} label="Course Vetting" />
            <SidebarItem active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={<FileCheck size={20} />} label="Skills Registry" />
            <SidebarItem active={activeTab === 'banner'} onClick={() => setActiveTab('banner')} icon={<Star size={20} />} label="Banner Control" />
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '800' }}>IDENTITY</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', background: 'var(--dark)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>AD</div>
                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Project Admin</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <span className="badge">Secured Connection</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--dark)', marginTop: '0.5rem' }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>Managing the SkillSwap infrastructure and marketplace intelligence.</p>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'banner' && renderBanner()}
        {activeTab === 'skills' && renderSkills()}
      </main>

      <style>{`
        .btn-icon {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-icon:hover {
          background: #f8fafc;
          transform: scale(1.1);
        }
        .admin-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '1rem', border: 'none', width: '100%', textAlign: 'left',
      background: active ? 'linear-gradient(135deg, var(--primary), #818cf8)' : 'transparent',
      color: active ? 'white' : 'var(--gray)',
      fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer'
    }}
  >
    {icon} {label}
    {active && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gray)', marginBottom: '0.5rem' }}>{title}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{value}</h3>
      <div style={{ color: color, background: `${color}15`, padding: '0.6rem', borderRadius: '0.75rem' }}>
        {icon}
      </div>
    </div>
  </div>
);

export default Admin;
