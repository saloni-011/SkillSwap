import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import api from '../utils/api';
import { Send, User, Search, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    // In production, this would be an environment variable
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/matches');
        // Status accepted only
        const accepted = data.filter(m => m.status === 'accepted');
        setMatches(accepted);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Join room
      socketRef.current.emit('joinRoom', { 
        senderId: user._id, 
        receiverId: selectedUser._id 
      });

      // Fetch history
      const fetchHistory = async () => {
        try {
          const { data } = await api.get(`/messages/${selectedUser._id}`);
          setMessages(data);
        } catch (err) {
          console.error('Error fetching chat history:', err);
        }
      };
      fetchHistory();
    }
  }, [selectedUser, user._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const data = {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: newMessage
    };

    socketRef.current.emit('chatMessage', data);
    setNewMessage('');
  };

  return (
    <div className="container" style={{ padding: '2rem 0', height: 'calc(100vh - 120px)' }}>
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 350px) 1fr', height: '100%', background: 'white', overflow: 'hidden', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
        {/* Contacts Sidebar */}
        <div style={{ borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', background: '#fcfcfd' }}>
          <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--dark)' }}>Conversations</h2>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search people..." style={{ paddingLeft: '2.75rem', fontSize: '0.95rem', background: '#f1f5f9', border: 'none', borderRadius: '1rem', width: '100%', height: '45px' }} />
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--gray)' }}>
                <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <User size={30} style={{ opacity: 0.3 }} />
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>No connections yet</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Visit the marketplace to find learning partners!</p>
              </div>
            ) : (
              matches.map((match) => {
                const partner = match.sender._id === user._id ? match.receiver : match.sender;
                const isSelected = selectedUser?._id === partner._id;
                return (
                  <div 
                    key={match._id}
                    onClick={() => setSelectedUser(partner)}
                    style={{ 
                      padding: '1.25rem 1.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      cursor: 'pointer',
                      background: isSelected ? 'white' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                      boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}>
                        {partner.name[0]}
                      </div>
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#10b981', border: '3px solid white', borderRadius: '50%' }}></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{partner.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Click to continue learning</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fcfcfd' }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1.25rem 2rem', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {selectedUser.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{selectedUser.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span> Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'radial-gradient(circle at center, #f8fafc 0%, #f1f5f9 100%)' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--gray)', opacity: 0.6 }}>
                    <MessageSquare size={48} style={{ marginBottom: '1rem' }} />
                    <p>No messages yet. Send a greeting!</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      alignSelf: msg.sender === user._id ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '1.25rem',
                      background: msg.sender === user._id ? 'var(--primary)' : 'white',
                      color: msg.sender === user._id ? 'white' : 'var(--dark)',
                      boxShadow: msg.sender === user._id ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                      borderTopRightRadius: msg.sender === user._id ? '0.25rem' : '1.25rem',
                      borderTopLeftRadius: msg.sender !== user._id ? '0.25rem' : '1.25rem',
                      fontSize: '0.95rem',
                      lineHeight: '1.4'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '0.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.75rem 1.25rem', fontSize: '0.95rem', outline: 'none' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', padding: '3rem' }}>
              <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
                <MessageSquare size={80} style={{ marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.1 }} />
                <h3 style={{ color: 'var(--dark)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your Inbox</h3>
                <p style={{ maxWidth: '300px', margin: '0 auto' }}>Select a connection from the left to start collaborating on new skills.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
