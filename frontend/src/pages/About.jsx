import React from 'react';

function About({ t }) {
  return (
    <div className="about">
      <h1>{t('about_title')}</h1>
      
      <div className="about-section">
        <h2>🌟 {t('our_mission')}</h2>
        <p>{t('mission_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>✨ {t('how_it_works')}</h2>
        <p>{t('how_it_works_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>🔒 {t('safety_first')}</h2>
        <p>{t('safety_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>🌍 {t('languages')}</h2>
        <p>{t('languages_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>💚 {t('positive_impact')}</h2>
        <p>{t('impact_text')}</p>
      </div>
      <div className="about-section disclaimer-section">
        <h2>⚖️ {t('disclaimer_title')}</h2>
        <p>{t('disclaimer')}</p>
      </div>
      <div className="about-section donation-about-section">
        <h2>☕ {t('donation_title')}</h2>
        <p>{t('donation_about')}</p>
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
      </div>
    </div>
  );
}

export default About;
