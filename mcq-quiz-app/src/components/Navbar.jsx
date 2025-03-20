import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { QuizIcon, LibraryBooksIcon, DashboardIcon, LogoutIcon } from '../icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { user: authUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={authUser ? "/" : "/login"} className="navbar-logo">
          <QuizIcon className="logo-icon" />
          <span className="logo-text">MCQ Quiz App</span>
        </Link>
        
        <div className="navbar-links">
          {authUser && (
            <>
              <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
                Quizzes
              </Link>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active dashboard-link' : 'nav-link dashboard-link'}>
                Dashboard
              </Link>
            </>
          )}
        </div>
        
        {/* Auth buttons for desktop */}
        <div className="auth-buttons">
          {!authUser ? (
            <>
              <Link to="/login" className="auth-button login-button">Login</Link>
              <Link to="/register" className="auth-button signup-button">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-button">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : authUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name || authUser.username || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <LogoutIcon /> Logout
              </button>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span>☰</span>
        </button>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-links">
              {authUser && (
                <>
                  <Link 
                    to="/" 
                    className={location.pathname === '/' ? 'mobile-link active' : 'mobile-link'}
                    onClick={toggleMobileMenu}
                  >
                    <LibraryBooksIcon /> Quizzes
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className={location.pathname === '/dashboard' ? 'mobile-link active dashboard-link' : 'mobile-link dashboard-link'}
                    onClick={toggleMobileMenu}
                  >
                    <DashboardIcon /> Dashboard
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile auth buttons */}
            <div className="mobile-auth-buttons">
              {!authUser ? (
                <>
                  <Link to="/login" className="mobile-auth-button mobile-login-button" onClick={toggleMobileMenu}>Login</Link>
                  <Link to="/register" className="mobile-auth-button mobile-signup-button" onClick={toggleMobileMenu}>Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="mobile-auth-button" onClick={toggleMobileMenu}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="mobile-auth-button mobile-logout-button">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 