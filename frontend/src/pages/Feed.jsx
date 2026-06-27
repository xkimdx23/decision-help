import React from 'react';
import { Helmet } from 'react-helmet-async';
import VoteFeed from '../components/VoteFeed';

function Feed({ API_URL }) {
  const siteUrl = 'https://decision-help-production.up.railway.app';
  return (
    <div className="feed-page">
      <Helmet>
        <title>Vote on Decisions — Decision Help Community Feed</title>
        <link rel="canonical" href={`${siteUrl}/feed`} />
        <meta name="description" content="Vote on real decisions from the community. See what others chose and share your opinion." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <h1 className="feed-title">Community Vote Feed</h1>
      <p className="feed-subtitle">See how others decide — cast your vote</p>
      <VoteFeed API_URL={API_URL} />
    </div>
  );
}

export default Feed;
