import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../data/blogPosts';

const AFFILIATE_TAG = 'kimo007-20';

const bookRecs = {
  default: { asin: '0385349394', title: 'Decisive: How to Make Better Choices in Life and Work', author: 'Chip Heath & Dan Heath' },
  'how-to-stop-overthinking-every-decision': { asin: '0735211299', title: 'Atomic Habits', author: 'James Clear' },
  'should-i-move-to-a-new-city': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
  'how-to-make-tough-decisions-easier': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
  'what-is-decision-paralysis': { asin: '0062449923', title: 'The Paradox of Choice', author: 'Barry Schwartz' },
  'how-to-trust-your-gut-feeling': { asin: '0374533555', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  'this-or-that-decision-maker': { asin: '0735211299', title: 'Atomic Habits', author: 'James Clear' },
  'help-me-decide-tool': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
  'yes-or-no-decision-maker': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
  'how-to-make-better-decisions': { asin: '0735211299', title: 'Atomic Habits', author: 'James Clear' },
  'decision-fatigue-help': { asin: '081298160X', title: 'The Power of Habit', author: 'Charles Duhigg' },
  'is-it-worth-it-decision-guide': { asin: '1982137274', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey' },
  'should-i-quit-my-job': { asin: '1101875321', title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans' },
  'how-to-make-fast-decisions': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
  'how-to-stop-second-guessing-yourself': { asin: '0374533555', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  'should-i-break-up-with-my-girlfriend-or-boyfriend': { asin: '1585429139', title: 'Attached', author: 'Amir Levine' },
  'should-i-buy-a-house': { asin: '1982137274', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey' },
  'how-to-decide-between-two-jobs': { asin: '1101875321', title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans' },
  'should-i-start-a-business': { asin: '0307887898', title: 'The Lean Startup', author: 'Eric Ries' },
  'should-i-go-to-college': { asin: '1101875321', title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans' },
  'should-i-text-him-or-her': { asin: '1585429139', title: 'Attached', author: 'Amir Levine' },
  'how-to-decide-what-to-do-with-your-life': { asin: '1101875321', title: 'Designing Your Life', author: 'Bill Burnett & Dave Evans' },
  'should-i-move-out-of-my-parents-house': { asin: '1595555277', title: 'The Total Money Makeover', author: 'Dave Ramsey' },
  'should-i-apologize': { asin: '0071771328', title: 'Crucial Conversations', author: 'Kerry Patterson' },
  'how-to-make-a-big-life-decision': { asin: '0385349394', title: 'Decisive', author: 'Chip Heath & Dan Heath' },
};

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

  const book = bookRecs[slug] || bookRecs.default;

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
      <div className="blog-book">
        <h3>Recommended Reading</h3>
        <p>
          <a href={`https://www.amazon.com/dp/${book.asin}?tag=${AFFILIATE_TAG}`} target="_blank" rel="noopener noreferrer sponsored">
            <strong>{book.title}</strong>
          </a>
          {' '}by {book.author} &mdash; if this topic resonated with you, this book goes deeper.
        </p>
        <p className="affiliate-disclosure">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      </div>
      <p className="blog-back"><Link to="/blog">← Back to all posts</Link></p>
    </div>
  );
}

export default BlogPost;
