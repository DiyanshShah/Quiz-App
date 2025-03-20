import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const AuthPage = ({ isLogin = true }) => {
  const [activeTab, setActiveTab] = useState(isLogin ? 'login' : 'signup');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'login' ? '/login' : '/register');
  };

  const handleLoginSuccess = (userData) => {
    login(userData);
    navigate('/');
  };

  const handleSignupSuccess = (userData) => {
    // Automatically log in the user after successful signup
    login(userData);
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    handleTabChange('login');
  };

  const handleSwitchToSignup = () => {
    handleTabChange('signup');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </button>
        </div>
        <div className="auth-content">
          {activeTab === 'login' ? 
            <LoginForm 
              onSwitch={handleSwitchToSignup} 
              onLoginSuccess={handleLoginSuccess} 
            /> : 
            <SignupForm 
              onSwitch={handleSwitchToLogin} 
              onSignupSuccess={handleSignupSuccess} 
            />
          }
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 