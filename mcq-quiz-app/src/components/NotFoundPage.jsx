import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
      <style jsx>{`
        .not-found-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
          text-align: center;
        }
        
        .not-found-content {
          max-width: 600px;
          padding: 3rem;
          background: var(--surface);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          font-size: 6rem;
          margin: 0;
          color: var(--primary);
          line-height: 1;
        }
        
        h2 {
          font-size: 2rem;
          margin: 0 0 1rem;
          color: var(--text);
        }
        
        p {
          margin-bottom: 2rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          transition: background 0.3s;
        }
        
        .btn:hover {
          background: var(--primary-dark);
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage; 