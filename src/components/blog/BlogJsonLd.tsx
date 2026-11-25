import React from 'react';
import type { BlogPost } from '../../lib/blogTypes';
import { SITE_URL, SITE_NAME } from './BlogSEOHead';

export interface BreadcrumbMetaItem {
  name?: string;
  label?: string;
  url?: string;
  href?: string;
}

interface BlogJsonLdProps {
  post: BlogPost;
  breadcrumbItems: BreadcrumbMetaItem[];
}

export const BlogJsonLd: React.FC<BlogJsonLdProps> = ({ post, breadcrumbItems }) => {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.featuredImage.startsWith('http')
    ? post.featuredImage
    : `${SITE_URL}${post.featuredImage}`;

  // 1. Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: [imageUrl],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/src/assets/images/hero_wide_with_1795076675422.jpg`,
      },
    },
    keywords: post.tags?.join(', ') || post.focusKeyword,
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => {
      const name = item.name || item.label || '';
      const rawUrl = item.url || item.href || `${SITE_URL}/blog/${post.slug}`;
      const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: fullUrl,
      };
    }),
  };

  // 3. FAQPage Schema (if post has FAQs)
  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
};
