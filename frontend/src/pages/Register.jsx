import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser, t, API_URL }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        preferred_language: localStorage.getItem('language') || 'en'
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">📝 {t('register')}</div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cooluser123"
              required
              minLength={3}
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••• (min 6 chars)"
              required
              minLength={6}
            />
          </div>
          {error && <div className="auth-error">⚠️ {error}</div>}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '...' : `🎉 ${t('register')}`}
          </button>
        </form>
        <p className="auth-footer">
          {t('have_account')}{' '}
          <Link to="/login">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
