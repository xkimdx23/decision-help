import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function VoteFeed({ API_URL }) {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState(null);
  const [voterId] = useState(() => localStorage.getItem('guestId') || `voter_${Date.now()}_${Math.random()}`);
  const [excludeIds, setExcludeIds] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('guestId')) {
      localStorage.setItem('guestId', voterId);
    }
  }, [voterId]);

  const fetchDecision = useCallback(async () => {
    setLoading(true);
    setVoted(false);
    setResults(null);
    try {
      const params = { exclude: excludeIds.join(',') };
      const res = await axios.get(`${API_URL}/decisions/vote-feed`, { params });
      if (res.data.decision) {
        setDecision(res.data.decision);
      } else {
        setDecision(null);
      }
    } catch {
      setDecision(null);
    }
    setLoading(false);
  }, [excludeIds, API_URL]);

  useEffect(() => {
    fetchDecision();
  }, []);

  const handleVote = async (option) => {
    if (voted || !decision) return;
    setVoted(true);
    try {
      const res = await axios.post(`${API_URL}/decisions/${decision._id}/vote`, {
        chosen_option: option,
        voter_id: voterId
      });
      setResults(res.data);
      setTotalVotes(res.data.total);
    } catch {
      setVoted(false);
    }
  };

  const next = () => {
    if (decision) {
      setExcludeIds(prev => [...prev, decision._id]);
    }
  };

  useEffect(() => {
    if (excludeIds.length > 0) {
      fetchDecision();
    }
  }, [excludeIds]);

  const skip = () => {
    if (decision) {
      setExcludeIds(prev => [...prev, decision._id]);
    }
  };

  const getPercent = (option) => {
    if (!results || !results.votes) return 0;
    const count = results.votes[option] || 0;
    return totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
  };

  if (loading) {
    return <div className="vote-feed"><p className="vote-loading">Loading decisions...</p></div>;
  }

  if (!decision) {
    return (
      <div className="vote-feed">
        <div className="vote-empty">
          <h3>No more decisions to vote on</h3>
          <p>Check back later or make your own!</p>
          <button onClick={() => { setExcludeIds([]); fetchDecision(); }} className="vote-refresh-btn">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const isThisThat = decision.mode === 'this_or_that';
  const options = decision.options || [];

  return (
    <div className="vote-feed">
      <div className="vote-card">
        <div className="vote-header">
          <span className="vote-badge">Vote</span>
          <span className="vote-question">{decision.question}</span>
        </div>

        {!voted ? (
          <div className="vote-options">
            {isThisThat ? (
              <>
                <button onClick={() => handleVote(options[0])} className="vote-btn vote-a">
                  <span className="vote-btn-label">A</span>
                  <span className="vote-btn-text">{options[0]}</span>
                </button>
                <div className="vote-divider">VS</div>
                <button onClick={() => handleVote(options[1])} className="vote-btn vote-b">
                  <span className="vote-btn-label">B</span>
                  <span className="vote-btn-text">{options[1]}</span>
                </button>
              </>
            ) : (
              <div className="vote-multi">
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handleVote(opt)} className="vote-btn vote-multi-btn">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="vote-results">
            {options.map((opt, i) => (
              <div key={i} className="vote-result-bar">
                <div className="vote-result-label">{opt}</div>
                <div className="vote-result-track">
                  <div
                    className={`vote-result-fill ${results?.your_vote === opt ? 'vote-yours' : ''}`}
                    style={{ width: `${getPercent(opt)}%` }}
                  />
                </div>
                <div className="vote-result-pct">{getPercent(opt)}%</div>
              </div>
            ))}
            <p className="vote-total">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
          </div>
        )}

        {voted && (
          <button onClick={skip} className="vote-next-btn">
            Next Decision →
          </button>
        )}
      </div>

      <p className="vote-hint">Tap an option to vote • See what others chose</p>
    </div>
  );
}

export default VoteFeed;
