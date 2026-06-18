import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

function BlogPost({ t }) {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

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

  return (
    <div className="blog-post">
      <Helmet>
        <title>{post.title} — Decision Help</title>
        <meta name="description" content={post.metaDesc} />
        <meta name="keywords" content={post.tags.join(', ')} />
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
