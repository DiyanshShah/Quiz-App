import { useState, useRef, useEffect } from 'react';
import '../styles/Header.css';

const Header = ({ user, onLogout, activeTab, onTabChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownOptions = [
    { label: 'Dashboard', action: () => onTabChange('dashboard') },
    { label: 'Account', action: () => onTabChange('account') },
    { label: 'Logout', action: onLogout }
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>Interactive Quiz App</h1>
        </div>
        
        <nav className="header-nav">
          <ul>
            <li>
              <button 
                className={`nav-button ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => onTabChange('quiz')}
              >
                Take Quiz
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="user-controls">
          <span className="username">Welcome, {user.username}</span>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
