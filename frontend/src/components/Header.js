import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo/Brand */}
          <Link to="/" className="brand">
            <h1>MindScribble</h1>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className={isActiveRoute('/')}>
              Home
            </Link>

            {!isAuthenticated ? (
              // Not logged in - show Login/Register
              <>
                <Link to="/login" className={isActiveRoute('/login')}>
                  Login
                </Link>
                <Link to="/register" className={isActiveRoute('/register')}>
                  Register
                </Link>
              </>
            ) : (
              // Logged in - show Create Post/Logout
              <>
                <Link to="/create" className={isActiveRoute('/create')}>
                  Create Post
                </Link>
                <div className="user-menu">
                  <span className="welcome-text">
                    Welcome, {user?.name}!
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;