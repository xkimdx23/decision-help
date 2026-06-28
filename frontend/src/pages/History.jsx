import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function History({ user, t, API_URL }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/decisions/history?page=${page}&limit=10`);
      setDecisions(response.data.decisions);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDecision = async (id) => {
    if (confirm(t('confirm_delete'))) {
      await axios.delete(`${API_URL}/decisions/${id}`);
      fetchHistory();
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="history">
      <Helmet>
        <title>Decision History — Decision Help</title>
        <meta name="description" content="View your saved decision history on Decision Help. Review past choices and track your decision-making patterns." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1>{t('decision_history')}</h1>
      
      {decisions.length === 0 ? (
        <p className="no-history">{t('no_history')}</p>
      ) : (
        <>
          <div className="history-list">
            {decisions.map((decision) => (
              <div key={decision._id} className="history-card">
                <div className="history-question">{decision.question}</div>
                <div className="history-result">{t('chose')}: {decision.result}</div>
                <div className="history-reason">{decision.reason}</div>
                <div className="history-date">{new Date(decision.created_at).toLocaleDateString()}</div>
                <button onClick={() => deleteDecision(decision._id)} className="delete-btn">
                  {t('delete')}
                </button>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t('prev')}</button>
              <span>{t('page')} {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>{t('next')}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default History;
