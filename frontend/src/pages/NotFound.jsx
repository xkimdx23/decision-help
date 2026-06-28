import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  return (
    <div className="about" style={{ textAlign: 'center', paddingTop: 60 }}>
      <Helmet>
        <title>Page Not Found — Decision Help</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>404</div>
      <h1 style={{ marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.05rem' }}>
        This page doesn't exist. Maybe it moved, or maybe you typed the wrong URL.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/" className="submit-btn" style={{ width: 'auto', padding: '12px 32px', textDecoration: 'none' }}>
          Go Home
        </Link>
        <Link to="/blog" className="submit-btn" style={{ width: 'auto', padding: '12px 32px', textDecoration: 'none', background: 'var(--accent)' }}>
          Read Our Blog
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
