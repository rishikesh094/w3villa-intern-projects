import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import api from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
          />
          
          {/* Redirect root */}
          <Route 
            path="/" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
