import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Filter, MessageSquare, UserPlus, Star, ChevronRight, SlidersHorizontal, MapPin, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Marketplace = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('exchange'); // exchange or courses
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('teach'); 
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(null);

  useEffect(() => {
    if (view === 'exchange') {
      fetchUsers();
    } else {
      fetchCourses();
    }
  }, [level, type, category, view]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users?skill=${search}&level=${level}&type=${type}`);
      setUsers(data);
    } catch (err) {
      toast.error('Failed to fetch specialists');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const mockData = [
      {
        _id: 'mock1',
        title: 'Full Stack Web Development (MERN)',
        description: 'Master React, Node.js, Express and MongoDB with real-world projects. Learn how to build scalable applications from scratch.',
        price: 49,
        category: 'Programming',
        enrollmentCount: 1250,
        instructor: { name: 'Dr. Angela' }
      },
      {
        _id: 'mock2',
        title: 'UI/UX Design Masterclass',
        description: 'Deep dive into Figma, user research, and modern design principles. Create stunning interfaces that users love.',
        price: 29,
        category: 'Design',
        enrollmentCount: 850,
        instructor: { name: 'Gary Simon' }
      },
      {
        _id: 'mock3',
        title: 'Digital Marketing Excellence',
        description: 'Learn SEO, SEM, and social media growth strategies. Scale your business or brand with latest marketing techniques.',
        price: 39,
        category: 'Business',
        enrollmentCount: 2100,
        instructor: { name: 'Neil Patel' }
      }
    ];

    try {
      setLoading(true);
      const { data } = await api.get(`/courses?search=${search}&category=${category}&level=${level}`);
      if (data && data.length > 0) {
        setCourses(data);
      } else {
        setCourses(mockData);
      }
    } catch (err) {
      console.error('Failed to fetch courses, using mock data');
      setCourses(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    view === 'exchange' ? fetchUsers() : fetchCourses();
  };

  const handleConnect = async (receiverId) => {
    try {
      setRequestLoading(receiverId);
      await api.post('/matches', { receiverId });
      toast.success((t) => (
        <span>
          Request Sent! 
          <button 
            onClick={() => { toast.dismiss(t.id); window.location.href='/chat'; }}
            style={{ marginLeft: '10px', background: 'var(--primary)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: '800' }}
          >
            GO TO CHAT
          </button>
        </span>
      ), { duration: 5000 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequestLoading(null);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center', animation: 'fadeIn 0.6s ease-out' }}>
        <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '5px', borderRadius: '1.25rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setView('exchange')}
            style={{ 
              padding: '10px 25px', borderRadius: '1rem', border: 'none', fontWeight: '800', cursor: 'pointer',
              background: view === 'exchange' ? 'white' : 'transparent',
              color: view === 'exchange' ? 'var(--primary)' : 'var(--gray)',
              boxShadow: view === 'exchange' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Skill Exchange
          </button>
          <button 
            onClick={() => setView('courses')}
            style={{ 
              padding: '10px 25px', borderRadius: '1rem', border: 'none', fontWeight: '800', cursor: 'pointer',
              background: view === 'courses' ? 'white' : 'transparent',
              color: view === 'courses' ? 'var(--primary)' : 'var(--gray)',
              boxShadow: view === 'courses' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Course Marketplace
          </button>
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
          {view === 'exchange' ? <>Discover Your Next <span className="gradient-text">Mentor.</span></> : <>Modern Courses for <span className="gradient-text">Modern Skills.</span></>}
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          {view === 'exchange' ? 'Connect with people willing to share knowledge in exchange for yours.' : 'Expert-led video courses designed to help you reach your goals faster.'}
        </p>
      </header>

      {/* Discovery Console */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem', background: 'white', borderRadius: '2.5rem', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.08)' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr auto', gap: '1.5rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em' }}>SEARCH KEYWORD</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder={view === 'exchange' ? "What do you want to learn?" : "Search courses..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '3rem', height: '56px', borderRadius: '1.25rem', border: '2px solid #f1f5f9', fontWeight: '600' }}
              />
              <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em' }}>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ height: '56px', borderRadius: '1.25rem', border: '2px solid #f1f5f9', padding: '0 1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
              <option value="">All Disciplines</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em' }}>MODE</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ height: '56px', borderRadius: '1.25rem', border: '2px solid #f1f5f9', padding: '0 1.5rem', fontWeight: '600' }}>
              <option value="teach">Learning Mode</option>
              <option value="learn">Teaching Mode</option>
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.05em' }}>LEVEL</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ height: '56px', borderRadius: '1.25rem', border: '2px solid #f1f5f9', padding: '0 1.5rem', fontWeight: '600' }}>
              <option value="">Any Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '56px', padding: '0 30px', fontWeight: '800' }}>
            Fetch
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1.5rem', color: 'var(--gray)', fontWeight: '700' }}>Optimizing matches...</p>
        </div>
      ) : view === 'exchange' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {users.map((user) => (
            <div key={user._id} className="glass-card mentor-card" style={{ padding: '2.5rem', background: 'white', borderRadius: '2.5rem', overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '25px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: '900', boxShadow: '0 12px 20px -5px rgba(99, 102, 241, 0.4)' }}>
                    {user.name[0]}
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#10b981', width: '20px', height: '20px', border: '4px solid white', borderRadius: '50%' }}></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: '900', fontSize: '1.2rem' }}>
                    <Star size={18} fill="#f59e0b" /> {user.rating?.toFixed(1) || '0.0'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: '700' }}>{user.numReviews || 0} Reviews</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--dark)', marginBottom: '0.5rem' }}>{user.name}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.5' }}>{user.bio?.substring(0, 80)}...</p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>EXPERTISE</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {user.skillsOffered?.map((sk, i) => (
                      <span key={i} style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--dark)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700' }}>{sk.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleConnect(user._id)}
                  disabled={requestLoading === user._id}
                  className="btn btn-primary" 
                  style={{ flex: 1, height: '56px', borderRadius: '1.25rem' }}
                >
                  {requestLoading === user._id ? 'Connecting...' : 'Connect Now'}
                </button>
                <button className="btn btn-outline" style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem' }}>
                  <MessageSquare size={22} />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px', background: '#f8fafc', borderRadius: '3rem', border: '2px dashed #e2e8f0' }}>
              <div style={{ background: 'white', display: 'inline-flex', padding: '2rem', borderRadius: '50%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <Search size={48} style={{ color: 'var(--primary)', opacity: 0.2 }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--dark)' }}>No specialists found yet</h3>
              <p style={{ color: 'var(--gray)', fontSize: '1.1rem', maxWidth: '400px', margin: '1rem auto' }}>Try broadening your search or choosing "Any Level" to discover more learning partners.</p>
              <button onClick={() => { setSearch(''); setLevel(''); }} className="btn btn-outline" style={{ marginTop: '1rem' }}>Clear All Filters</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
          {courses.map((course) => (
            <div key={course._id} className="glass-card mentor-card" style={{ padding: 0, background: 'white', borderRadius: '2.5rem', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <div style={{ height: '220px', background: '#e0e7ff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }}></div>
                {course.thumbnail ? (
                  <img src={course.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
                    <BookOpen size={64} style={{ color: 'var(--primary)', opacity: 0.1 }} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '12px', fontWeight: '900', fontSize: '0.8rem', color: 'var(--primary)', zIndex: 2, backdropFilter: 'blur(5px)' }}>
                  {course.category?.toUpperCase() || 'GENERAL'}
                </div>
              </div>
              <div style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', lineHeight: '1.3', flex: 1, marginRight: '1rem' }}>{course.title}</h3>
                  <div style={{ fontWeight: '900', fontSize: '1.6rem', color: 'var(--primary)' }}>${course.price}</div>
                </div>
                <p style={{ color: 'var(--gray)', fontSize: '0.95rem', marginBottom: '2rem', height: '48px', overflow: 'hidden', lineHeight: '1.6' }}>{course.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '900' }}>
                      {course.instructor?.name?.[0] || 'I'}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block' }}>{course.instructor?.name || 'Instructor'}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--gray)', fontWeight: '600' }}>Verified Mentor</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--dark)' }}>{course.enrollmentCount}+</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray)', fontWeight: '600' }}>Students</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, height: '56px', borderRadius: '1.25rem', fontWeight: '800' }}>Enroll Now</button>
                  <button className="btn btn-outline" style={{ height: '56px', borderRadius: '1.25rem', width: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px', background: '#f8fafc', borderRadius: '3rem', border: '2px dashed #e2e8f0' }}>
               <div style={{ background: 'white', display: 'inline-flex', padding: '2rem', borderRadius: '50%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <BookOpen size={48} style={{ color: 'var(--primary)', opacity: 0.2 }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--dark)' }}>No courses available yet</h3>
              <p style={{ color: 'var(--gray)', fontSize: '1.1rem', maxWidth: '400px', margin: '1rem auto' }}>We are currently vetting new expert-led courses. Check back soon for the latest releases!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
