import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

function BlogPost({ t }) {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const siteUrl = 'https://decision-help-production.up.railway.app';

  if (!post) {
    return (
      <div className="blog-post">
        <Helmet>
          <title>Post Not Found — Decision Help Blog</title>
        </Helmet>
        <h1>Post not found</h1>
        <p><Link to="/blog">Back to blog</Link></p>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDesc,
    "url": `${siteUrl}/blog/${post.slug}`,
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "Decision Help" }
  };

  return (
    <div className="blog-post">
      <Helmet>
        <title>{post.title} — Decision Help</title>
        <link rel="canonical" href={`${siteUrl}/blog/${post.slug}`} />
        <meta name="description" content={post.metaDesc} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDesc} />
        <meta property="og:url" content={`${siteUrl}/blog/${post.slug}`} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Decision Help" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDesc} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <p className="blog-breadcrumb"><Link to="/blog">← Blog</Link></p>
      <article>
        <h1 className="page-title">{post.title}</h1>
        <p className="blog-date">{post.date}</p>
        <p className="blog-tags">{post.tags.join(' · ')}</p>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <p className="blog-back"><Link to="/blog">← Back to all posts</Link></p>
    </div>
  );
}

export default BlogPost;
