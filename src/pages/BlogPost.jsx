import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { id } = useParams();
  const { getPost } = useBlog();
  const post = getPost(id);
  const canonical = window.location.origin + `/blog/${id}`;

  const ogImageUrl = (img) => {
    if (!img || img.startsWith('data:')) return null;
    if (img.startsWith('http')) return img;
    return window.location.origin + img;
  };

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Helmet>
          <title>블로그 | 메타코스모스</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <p className="text-slate-400 mb-4">글이 없습니다.</p>
        <Link to="/blog" className="text-cyan-400 hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={18} /> 목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <Helmet>
        <title>{post.title} | 메타코스모스 블로그</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={canonical} />
        {ogImageUrl(post.image) ? <meta property="og:image" content={ogImageUrl(post.image)} /> : null}
        <script type="application/ld+json">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt || post.title,
              datePublished: post.createdAt,
              dateModified: post.createdAt,
              mainEntityOfPage: canonical,
              author: { '@type': 'Organization', name: '(주)메타코스모스' },
              publisher: {
                '@type': 'Organization',
                name: '(주)메타코스모스',
              },
              image: ogImageUrl(post.image) ? [ogImageUrl(post.image)] : undefined,
            },
            null,
            0
          )}
        </script>
      </Helmet>
      <Link to="/blog" className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-8">
        <ArrowLeft size={18} /> 목록으로
      </Link>
      {post.image && (
        <div className="aspect-video rounded-xl overflow-hidden bg-slate-800/80 mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <header className="mb-6">
        <time className="text-sm text-slate-400">{post.createdAt}</time>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">{post.title}</h1>
      </header>
      <div className="prose prose-invert prose-slate max-w-none text-slate-300 whitespace-pre-wrap">
        {post.body}
      </div>
    </article>
  );
}
