import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

function BlogList({ t }) {
  return (
    <div className="blog-page">
      <Helmet>
        <title>Decision Help Blog — Decision Making Tips & Free Tools</title>
        <meta name="description" content="Learn how to make better decisions with our blog. Tips on decision fatigue, this or that choices, yes or no questions, and more. Free decision maker tool." />
        <meta name="keywords" content="decision making, decision fatigue, this or that, yes or no, decision helper, how to make decisions" />
      </Helmet>
      <h1 className="page-title">📝 Decision Help Blog</h1>
      <p className="page-subtitle">Tips, strategies, and tools for better decision making</p>
      <div className="blog-list">
        {blogPosts.map(post => (
          <article key={post.slug} className="blog-card">
            <Link to={`/blog/${post.slug}`} className="blog-card-link">
              <h2>{post.title}</h2>
              <p className="blog-date">{post.date}</p>
              <p className="blog-excerpt">{post.metaDesc}</p>
              <span className="blog-tags">{post.tags.join(' · ')}</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
