import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TopicsPage from './components/TopicsPage';
import QuizSection from './components/QuizSection';
import AuthPage from './components/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NotFoundPage from './components/NotFoundPage';

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  // Set background color for dark theme
  useEffect(() => {
    document.body.style.backgroundColor = '#263238'; // Match --background from our CSS variables
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<TopicsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/quiz/:topicId" element={<QuizSection />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<AuthPage isLogin={true} />} />
            <Route path="/register" element={<AuthPage isLogin={false} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 