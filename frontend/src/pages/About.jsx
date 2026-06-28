import React from 'react';
import { Helmet } from 'react-helmet-async';

function About({ t }) {
  const siteUrl = 'https://decision-help-production.up.railway.app';
  return (
    <div className="about">
      <Helmet>
        <title>About — Decision Help | Free Decision Maker Tool</title>
        <link rel="canonical" href={`${siteUrl}/about`} />
        <meta name="description" content="Learn about Decision Help — the free positive-bias decision maker tool. Our mission to help people break analysis paralysis with this or that, yes/no, and pick from list modes." />
        <meta name="keywords" content="about decision help, decision maker tool, free decision helper" />
        <meta property="og:title" content="About — Decision Help" />
        <meta property="og:description" content="Free positive-bias decision maker tool. Break analysis paralysis instantly." />
        <meta property="og:url" content={`${siteUrl}/about`} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <h1>{t('about_title')}</h1>
      
      <div className="about-section">
        <h2>{t('our_mission')}</h2>
        <p>{t('mission_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>{t('how_it_works')}</h2>
        <p>{t('how_it_works_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>{t('safety_first')}</h2>
        <p>{t('safety_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>{t('languages')}</h2>
        <p>{t('languages_text')}</p>
      </div>
      
      <div className="about-section">
        <h2>{t('positive_impact')}</h2>
        <p>{t('impact_text')}</p>
      </div>
      <div className="about-section disclaimer-section">
        <h2>{t('disclaimer_title')}</h2>
        <p>{t('disclaimer')}</p>
      </div>
      <div className="about-section donation-about-section">
        <h2>{t('donation_title')}</h2>
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
