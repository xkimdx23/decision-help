import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser, t, toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Decision Help</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/">{t('home')}</Link>
        {user && <Link to="/history">{t('history')}</Link>}
        <Link to="/community">{t('community')}</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">{t('about')}</Link>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <Link to="/profile">{t('profile')}</Link>
            <button onClick={handleLogout} className="logout-nav">{t('logout')}</button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-btn">{t('login')}</Link>
            <Link to="/register" className="nav-btn">{t('register')}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
