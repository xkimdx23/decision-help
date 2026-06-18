import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Profile from './pages/Profile';
import Community from './pages/Community';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import LanguageSwitcher from './components/LanguageSwitcher';
import Navbar from './components/Navbar';

import translations from './translations';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    if (GA_ID) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);
  return null;
}

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const applyDirection = useCallback((lang) => {
    if (lang === 'ar') {
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    }
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    applyDirection(language);
  }, [language, applyDirection]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('token');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <HelmetProvider>
      <Router>
        <Helmet>
          <title>Decision Help — Free Online Decision Maker Tool</title>
          <meta name="description" content="Make better decisions with our free online decision maker. Choose between options, get yes/no answers, or pick from a list. No signup required. 12 languages." />
          <meta name="keywords" content="decision maker, help me decide, this or that, yes or no, decision tool, online decision helper" />
        </Helmet>
        <PageViewTracker />
        <div className="app">
          <Navbar 
            user={user} 
            setUser={setUser} 
            language={language} 
            t={t}
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
          />
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home user={user} language={language} t={t} API_URL={API_URL} />} />
              <Route path="/login" element={!user ? <Login setUser={setUser} t={t} API_URL={API_URL} /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register setUser={setUser} t={t} API_URL={API_URL} /> : <Navigate to="/" />} />
              <Route path="/history" element={user ? <History user={user} language={language} t={t} API_URL={API_URL} /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} language={language} t={t} API_URL={API_URL} /> : <Navigate to="/login" />} />
              <Route path="/community" element={<Community language={language} t={t} API_URL={API_URL} />} />
              <Route path="/about" element={<About language={language} t={t} />} />
              <Route path="/blog" element={<BlogList t={t} />} />
              <Route path="/blog/:slug" element={<BlogPost t={t} />} />
              <Route path="/forgot-password" element={<ForgotPassword t={t} API_URL={API_URL} />} />
              <Route path="/verify-email/:token" element={<VerifyEmail API_URL={API_URL} t={t} />} />
              <Route path="/reset-password/:token" element={<ResetPassword API_URL={API_URL} t={t} />} />
            </Routes>
          </main>
          <footer className="disclaimer-bar">
            <p>{t('disclaimer')}</p>
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
}

function VerifyEmail({ API_URL, t }) {
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const token = window.location.pathname.split('/').pop();
    axios.get(`${API_URL}/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="verify-email">
      {status === 'verifying' && <p>{t('verifying_email')}</p>}
      {status === 'success' && <p>✅ {t('email_verified')}</p>}
      {status === 'error' && <p>❌ {t('email_verify_error')}</p>}
    </div>
  );
}

function ResetPassword({ API_URL, t }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.location.pathname.split('/').pop();
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { newPassword: password });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="reset-password">
      <h2>{t('reset_password')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder={t('new_password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{t('reset')}</button>
      </form>
      {status === 'success' && <p className="success">✅ {t('password_reset_success')}</p>}
      {status === 'error' && <p className="error">❌ {t('password_reset_error')}</p>}
    </div>
  );
}

export default App;
