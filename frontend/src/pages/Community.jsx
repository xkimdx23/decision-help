import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Community({ t, API_URL }) {
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
