import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdUnit from '../components/AdUnit';

function Home({ user, language, t, API_URL }) {
  const [mode, setMode] = useState('this_or_that');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [listOptions, setListOptions] = useState(['', '']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [gifUrl, setGifUrl] = useState('');
  const [showDonation, setShowDonation] = useState(localStorage.getItem('hideDonation') !== 'true');

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  const dismissDonation = () => {
    setShowDonation(false);
    localStorage.setItem('hideDonation', 'true');
  };

  const addListOption = () => {
    if (listOptions.length < 10) {
      setListOptions([...listOptions, '']);
    }
  };

  const removeListOption = (index) => {
    if (listOptions.length > 2) {
      const newOptions = listOptions.filter((_, i) => i !== index);
      setListOptions(newOptions);
    }
  };

  const updateListOption = (index, value) => {
    const newOptions = [...listOptions];
    newOptions[index] = value;
    setListOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let finalOptions = [];
    if (mode === 'this_or_that') {
      finalOptions = options.filter(opt => opt.trim());
    } else if (mode === 'pick_from_list') {
      finalOptions = listOptions.filter(opt => opt.trim());
    }

    if (mode !== 'yes_no' && finalOptions.length < 2) {
      setError(t('need_two_options'));
      setLoading(false);
      return;
    }

    try {
      const guestId = localStorage.getItem('guestId') || `guest_${Date.now()}_${Math.random()}`;
      if (!localStorage.getItem('guestId')) {
        localStorage.setItem('guestId', guestId);
      }

      const response = await axios.post(`${API_URL}/decide`, {
        mode,
        question,
        options: finalOptions,
        is_public: false,
        language,
        guest_id: user ? undefined : guestId
      });

      setResult(response.data.decision);
      setShowConfetti(true);
      
      try {
        const gifResponse = await axios.get('https://api.giphy.com/v1/gifs/random', {
          params: {
            api_key: 'YOUR_GIPHY_API_KEY',
            tag: 'happy celebration',
            rating: 'g'
          }
        });
        if (gifResponse.data.data) {
          setGifUrl(gifResponse.data.data.images.fixed_height.url);
        }
      } catch (gifError) {
        setGifUrl('');
      }
      
    } catch (err) {
      setError(err.response?.data?.error || t('error_making_decision'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      const text = `${t('decision_friend_says')}: ${result.result}! ${result.reason}`;
      navigator.clipboard.writeText(text);
      alert(t('copied'));
    }
  };

  return (
    <div className="home">
      {showConfetti && <div className="confetti">🎉✨🌟🎊</div>}
      
      <h1 className="title">{t('make_decision')}</h1>
      <p className="subtitle">{t('positive_choices')}</p>

      <div className="mode-selector">
        <button className={mode === 'this_or_that' ? 'active' : ''} onClick={() => setMode('this_or_that')}>
          🤔 {t('this_or_that')}
        </button>
        <button className={mode === 'yes_no' ? 'active' : ''} onClick={() => setMode('yes_no')}>
          ✅ {t('yes_or_no')}
        </button>
        <button className={mode === 'pick_from_list' ? 'active' : ''} onClick={() => setMode('pick_from_list')}>
          📋 {t('pick_from_list')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="decision-form">
        <div className="input-group">
          <label>{t('your_question')}</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('question_placeholder')}
            required
            maxLength={500}
          />
        </div>

        {mode === 'this_or_that' && (
          <div className="options-group">
            <label>{t('option_a')}</label>
            <input
              type="text"
              value={options[0]}
              onChange={(e) => setOptions([e.target.value, options[1]])}
              placeholder={t('first_option')}
              required
            />
            <label>{t('option_b')}</label>
            <input
              type="text"
              value={options[1]}
              onChange={(e) => setOptions([options[0], e.target.value])}
              placeholder={t('second_option')}
              required
            />
          </div>
        )}

        {mode === 'pick_from_list' && (
          <div className="list-options">
            <label>{t('your_options')}</label>
            {listOptions.map((opt, index) => (
              <div key={index} className="list-option-item">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateListOption(index, e.target.value)}
                  placeholder={`${t('option')} ${index + 1}`}
                  required={index < 2}
                />
                {listOptions.length > 2 && (
                  <button type="button" onClick={() => removeListOption(index)}>🗑️</button>
                )}
              </div>
            ))}
            {listOptions.length < 10 && (
              <button type="button" onClick={addListOption} className="add-option">
                + {t('add_option')}
              </button>
            )}
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '🤔 ...' : `🎲 ${t('help_me_decide')}`}
        </button>
      </form>

      {error && <div className="error-message">⚠️ {error}</div>}

      {result && (
        <div className="result-card">
          {gifUrl && <img src={gifUrl} alt="Celebration" className="result-gif" />}
          <div className="result-content">
            <h2>{t('final_decision')}</h2>
            <div className="result-option">✨ {result.result} ✨</div>
            <p className="result-reason">💡 {result.reason}</p>
            <div className="result-actions">
              <button onClick={() => window.location.reload()} className="spin-again">
                🎰 {t('spin_again')}
              </button>
              <button onClick={copyToClipboard} className="share-btn">
                📋 {t('share')}
              </button>
            </div>
          </div>
        </div>
      )}

      {result && <AdUnit slot="7401516863" />}

      {showDonation && (
        <div className="donation-card">
          <button className="donation-close" onClick={dismissDonation}>&times;</button>
          <h3>{t('donation_title')}</h3>
          <p>{t('donation_text')}</p>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" rel="noopener noreferrer" className="donation-form">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="gasmimohamed067@gmail.com" />
            <input type="hidden" name="item_name" value="Support Decision Help" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="no_note" value="0" />
            <div className="donation-amount-row">
              <span className="donation-currency">$</span>
              <input type="number" name="amount" min="1" step="any" placeholder="5" className="donation-amount-input" required />
              <button type="submit" className="donation-button">{t('donation_button')}</button>
            </div>
          </form>
          <button className="donation-skip" onClick={dismissDonation}>{t('donation_dismiss')}</button>
        </div>
      )}

      <AdUnit slot="4690463740" />
    </div>
  );
}

export default Home;
