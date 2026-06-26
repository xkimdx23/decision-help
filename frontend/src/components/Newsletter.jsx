import React, { useState } from 'react';
import axios from 'axios';

function Newsletter({ API_URL }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await axios.post(`${API_URL}/subscribe`, { email });
      setStatus('success');
      setMessage(res.data.message);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div className="newsletter">
      <h3 className="newsletter-title">📬 Stay Updated</h3>
      <p className="newsletter-text">New features, blog posts, and tips — once a week. No spam.</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="newsletter-input"
        />
        <button type="submit" disabled={status === 'loading'} className="newsletter-btn">
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className="newsletter-msg success">✅ {message}</p>}
      {status === 'error' && <p className="newsletter-msg error">⚠️ {message}</p>}
    </div>
  );
}

export default Newsletter;
