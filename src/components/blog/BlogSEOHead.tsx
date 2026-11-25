import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BlogSEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  keywords?: string[];
}

export const SITE_URL = 'https://ogsmarthomes.com';
export const SITE_NAME = 'OG Smarthomes';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/src/assets/images/hero_wide_with_1795076675422.jpg`;

export const BlogSEOHead: React.FC<BlogSEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'article',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  publishedAt,
  updatedAt,
  authorName = 'OG Smarthomes Engineering Team',
  keywords,
}) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const absoluteCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${SITE_URL}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteCanonical} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={absoluteCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}

      {/* Article Specific Open Graph */}
      {ogType === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {ogType === 'article' && updatedAt && (
        <meta property="article:modified_time" content={updatedAt} />
      )}
      {ogType === 'article' && authorName && (
        <meta property="article:author" content={authorName} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
    </Helmet>
  );
};
