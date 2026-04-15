import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Chat from './pages/Chat';
import Scheduler from './pages/Scheduler';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import UserGoals from './pages/UserGoals';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
     return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
           <div className="loader"></div>
           <p style={{ marginTop: '1.5rem', fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '2px' }}>INITIALIZING ENGINE...</p>
        </div>
     );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/scheduler" 
            element={
              <PrivateRoute>
                <Scheduler />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile/goals" 
            element={
              <PrivateRoute>
                <UserGoals />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute adminOnly>
                <Admin />
              </PrivateRoute>
            } 
          />
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

export default RootApp;
