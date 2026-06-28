import React from 'react';
import { Helmet } from 'react-helmet-async';

function Contact({ t }) {
  const siteUrl = 'https://decision-help-production.up.railway.app';
  return (
    <div className="about">
      <Helmet>
        <title>Contact Us — Decision Help</title>
        <link rel="canonical" href={`${siteUrl}/contact`} />
        <meta name="description" content="Contact Decision Help. Get support, send feedback, or reach out to the team behind the free online decision maker tool." />
        <meta property="og:title" content="Contact Us — Decision Help" />
        <meta property="og:description" content="Get in touch with the Decision Help team." />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>Contact Us</h1>

      <div className="about-section">
        <h2>Get in Touch</h2>
        <p>Have feedback, questions, or suggestions? We'd love to hear from you. Whether it's a bug report, a feature idea, or just saying hello — every message helps us make Decision Help better.</p>
      </div>

      <div className="about-section">
        <h2>Email</h2>
        <p>Send us an email at <a href="mailto:gasmimohamed067@gmail.com">gasmimohamed067@gmail.com</a> and we'll get back to you as soon as possible.</p>
      </div>

      <div className="about-section">
        <h2>Feature Requests</h2>
        <p>Have an idea for a new mode, feature, or improvement? We're always looking for ways to make the tool more useful. Drop us an email with "Feature Request" in the subject line.</p>
      </div>

      <div className="about-section">
        <h2>Report a Problem</h2>
        <p>If something isn't working right, please include as much detail as possible: what you were doing, what browser you're using, and any error messages you saw. This helps us fix issues quickly.</p>
      </div>

      <div className="about-section">
        <h2>Business Inquiries</h2>
        <p>For partnership, sponsorship, or advertising inquiries, please reach out via email with "Business" in the subject line.</p>
      </div>
    </div>
  );
}

export default Contact;
