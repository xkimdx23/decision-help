import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Privacy({ t }) {
  const siteUrl = 'https://decision-help-production.up.railway.app';
  return (
    <div className="about">
      <Helmet>
        <title>Privacy Policy — Decision Help</title>
        <link rel="canonical" href={`${siteUrl}/privacy`} />
        <meta name="description" content="Decision Help privacy policy. Learn how we collect, use, and protect your personal data when using our free decision maker tool." />
        <meta property="og:title" content="Privacy Policy — Decision Help" />
        <meta property="og:description" content="Learn how Decision Help collects, uses, and protects your personal data." />
        <meta property="og:url" content={`${siteUrl}/privacy`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>Privacy Policy</h1>
      <p className="page-subtitle">Last updated: June 28, 2026</p>

      <div className="about-section">
        <h2>1. Introduction</h2>
        <p>Decision Help ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at decision-help-production.up.railway.app (the "Site") and use our decision maker tool, blog, community features, and other services.</p>
        <p>By using the Site, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use immediately.</p>
      </div>

      <div className="about-section">
        <h2>2. Information We Collect</h2>
        <p><strong>Information you provide voluntarily:</strong> When you create an account, we collect your username, email address, and preferred language. When you submit a decision, we store the question, options, result, and reason if you choose to make it public.</p>
        <p><strong>Information collected automatically:</strong> When you visit the Site, we automatically collect certain information via Google Analytics, including your IP address, browser type, operating system, referring URLs, pages viewed, and the date/time of your visit.</p>
        <p><strong>Cookies and similar technologies:</strong> We use cookies and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
      </div>

      <div className="about-section">
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <p>- To provide, operate, and maintain our decision maker tool and services<br/>
        - To improve, personalize, and expand our services<br/>
        - To communicate with you, including for customer support<br/>
        - To send you newsletters or marketing communications (only with your consent)<br/>
        - To detect, prevent, and address technical issues and abuse<br/>
        - To analyze usage trends and improve user experience via Google Analytics<br/>
        - To display personalized advertisements via Google AdSense</p>
      </div>

      <div className="about-section">
        <h2>4. Google AdSense & Third-Party Advertising</h2>
        <p>We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our Site and other sites on the Internet.</p>
        <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>. You can also learn more about how Google uses data when you use our Site at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/partner-sites</a>.</p>
        <p>We use a Google CMP (Consent Management Platform) to obtain your consent before setting non-essential cookies for advertising purposes, in compliance with GDPR and other privacy regulations.</p>
      </div>

      <div className="about-section">
        <h2>5. Google Analytics</h2>
        <p>We use Google Analytics to collect and analyze usage data. Google Analytics collects information such as how often users visit the Site, what pages they visit, and what other sites they used prior to coming to the Site. We use the information from Google Analytics to improve the Site and user experience.</p>
        <p>Google Analytics collects your IP address on our behalf but does not associate it with any other data held by Google. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser add-on</a>.</p>
      </div>

      <div className="about-section">
        <h2>6. Data Storage and Security</h2>
        <p>Your account information and decision history are stored securely on our servers. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
        <p>If you submit a decision as a guest (without logging in), a guest ID is stored in your browser's local storage to associate decisions with your session. No personal information is required to use the basic decision maker tool.</p>
      </div>

      <div className="about-section">
        <h2>7. Data Retention</h2>
        <p>We retain your personal data only for as long as necessary to provide you with our services and for legitimate business purposes. You may request deletion of your account and associated data at any time by contacting us or using the delete account option in your profile settings.</p>
      </div>

      <div className="about-section">
        <h2>8. Your Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <p>- The right to access, update, or delete your information<br/>
        - The right to rectification (correcting inaccurate data)<br/>
        - The right to object to processing of your data<br/>
        - The right to data portability<br/>
        - The right to withdraw consent at any time<br/>
        - The right to lodge a complaint with a data protection authority</p>
        <p>To exercise any of these rights, please contact us at gasmimohamed067@gmail.com.</p>
      </div>

      <div className="about-section">
        <h2>9. Third-Party Links</h2>
        <p>Our Site may contain links to third-party websites, including social media platforms, PayPal (for donations), and GIPHY. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before providing any personal information.</p>
      </div>

      <div className="about-section">
        <h2>10. Children's Privacy</h2>
        <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete that information.</p>
      </div>

      <div className="about-section">
        <h2>11. Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.</p>
      </div>

      <div className="about-section">
        <h2>12. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
        <p>Email: gasmimohamed067@gmail.com<br/>
        Website: <Link to="/">Decision Help</Link></p>
      </div>
    </div>
  );
}

export default Privacy;
