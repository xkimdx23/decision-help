import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword({ t, API_URL }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message || 'Password reset email sent');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">🔑 {t('reset_password')}</div>
        <form onSubmit={handleSubmit} className="auth-form">
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
          {error && <div className="auth-error">⚠️ {error}</div>}
          {message && <div className="auth-success">✅ {message}</div>}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '...' : `📧 ${t('reset')}`}
          </button>
        </form>
        <p className="auth-footer">
          <Link to="/login">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
