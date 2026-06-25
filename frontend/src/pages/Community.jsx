import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function Community({ t, API_URL }) {
  const siteUrl = 'https://decision-help-production.up.railway.app';
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPublicDecisions();
  }, [page]);

  const fetchPublicDecisions = async () => {
    try {
      const response = await axios.get(`${API_URL}/decisions/public?page=${page}&limit=20`);
      setDecisions(response.data.decisions);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch public decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeDecision = async (id) => {
    try {
      await axios.post(`${API_URL}/decisions/${id}/like`);
      fetchPublicDecisions();
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  if (loading) return <div className="loading">⏳ {t('loading')}</div>;

  return (
    <div className="community">
      <Helmet>
        <title>Community Decisions — Decision Help</title>
        <link rel="canonical" href={`${siteUrl}/community`} />
        <meta name="description" content="Browse public decisions made with Decision Help. See how others use our free decision maker for this or that, yes/no, and pick from list choices." />
        <meta name="keywords" content="community decisions, public decisions, decision maker examples" />
        <meta property="og:title" content="Community Decisions — Decision Help" />
        <meta property="og:description" content="Browse public decisions made with our free decision maker tool." />
        <meta property="og:url" content={`${siteUrl}/community`} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>{t('community_decisions')}</h1>
      <p>{t('community_description')}</p>
      
      <div className="community-grid">
        {decisions.map((decision) => (
          <div key={decision._id} className="community-card">
            <div className="community-user">
              👤 {decision.user_id?.username || t('anonymous')}
            </div>
            <div className="community-question">❓ {decision.question}</div>
            <div className="community-result">✨ {decision.result} ✨</div>
            <div className="community-reason">💡 {decision.reason}</div>
            <div className="community-footer">
              <button onClick={() => likeDecision(decision._id)} className="like-btn">
                ❤️ {decision.likes_count}
              </button>
              <span className="community-date">
                📅 {new Date(decision.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>◀ {t('prev')}</button>
          <span>{t('page')} {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>{t('next')} ▶</button>
        </div>
      )}
    </div>
  );
}

export default Community;
