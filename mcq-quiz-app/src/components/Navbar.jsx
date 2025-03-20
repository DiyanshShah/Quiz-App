import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { QuizIcon, LibraryBooksIcon, DashboardIcon } from '../icons';

const Navbar = () => {
  const location = useLocation();
  const user = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <QuizIcon className="logo-icon" />
          <span className="logo-text">MCQ Quiz App</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' || location.pathname === '/topics' ? 'nav-link active' : 'nav-link'}>
            Topics
          </Link>
          {user && (
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-link active dashboard-link' : 'nav-link dashboard-link'}>
              Dashboard
            </Link>
          )}
        </div>
        
        {/* Rest of the desktop navbar */}
        
        {/* Mobile menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-links">
            <Link 
              to="/" 
              className={location.pathname === '/' || location.pathname === '/topics' ? 'mobile-link active' : 'mobile-link'}
              onClick={toggleMobileMenu}
            >
              <LibraryBooksIcon /> Topics
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'mobile-link active dashboard-link' : 'mobile-link dashboard-link'}
                onClick={toggleMobileMenu}
              >
                <DashboardIcon /> Dashboard
              </Link>
            )}
          </div>
          
          {/* Rest of mobile menu */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 