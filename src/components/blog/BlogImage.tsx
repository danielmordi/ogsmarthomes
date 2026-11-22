import React from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  photographerName?: string;
  photographerProfileUrl?: string;
  caption?: string;
  isFeatured?: boolean;
  className?: string;
}

/**
 * Builds an optimized Unsplash URL with width, quality, and webp format params.
 * If not an Unsplash URL, returns the original src.
 */
export function buildUnsplashUrl(rawUrl: string, width: number, quality = 75): string {
  if (!rawUrl || !rawUrl.includes('images.unsplash.com')) {
    return rawUrl;
  }
  // Strip existing query params and rebuild with optimal params
  const baseUrl = rawUrl.split('?')[0];
  return `${baseUrl}?w=${width}&q=${quality}&fm=webp&auto=format&fit=crop`;
}

/**
 * Builds a responsive srcset string for 480w, 800w, 1200w, 1600w
 */
export function buildUnsplashSrcSet(rawUrl: string, quality = 75): string {
  if (!rawUrl || !rawUrl.includes('images.unsplash.com')) {
    return '';
  }
  const widths = [480, 800, 1200, 1600];
  return widths
    .map((w) => `${buildUnsplashUrl(rawUrl, w, quality)} ${w}w`)
    .join(', ');
}

export const BlogImage: React.FC<BlogImageProps> = ({
  src,
  alt,
  width = 1200,
  height = 800,
  photographerName,
  photographerProfileUrl,
  caption,
  isFeatured = false,
  className = '',
}) => {
  const isUnsplash = src && src.includes('images.unsplash.com');
  const defaultSrc = isUnsplash ? buildUnsplashUrl(src, isFeatured ? 1200 : 800) : src;
  const srcSet = isUnsplash ? buildUnsplashSrcSet(src) : undefined;
  const sizes = isFeatured
    ? '(max-width: 820px) 100vw, 1200px'
    : '(max-width: 820px) 100vw, 840px';

  const utmSuffix = '?utm_source=og_smart_homes&utm_medium=referral';
  const unsplashHomeUrl = `https://unsplash.com/${utmSuffix}`;
  const photographerHref = photographerProfileUrl
    ? `${photographerProfileUrl.split('?')[0]}${utmSuffix}`
    : unsplashHomeUrl;

  return (
    <figure className={`my-8 overflow-hidden rounded-[16px] ${className}`}>
      <div
        className="relative overflow-hidden rounded-[16px] bg-[#101c33]/10"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img
          src={defaultSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={isFeatured ? 'eager' : 'lazy'}
          decoding={isFeatured ? 'sync' : 'async'}
          fetchPriority={isFeatured ? 'high' : 'auto'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
        />
      </div>

      {/* Caption & Unsplash Attribution */}
      {(caption || photographerName) && (
        <figcaption className="mt-2.5 px-1 text-[13px] text-gray-500 flex flex-wrap items-center justify-between gap-2">
          {caption && <span className="italic">{caption}</span>}
          {photographerName && (
            <span className="text-[12px] text-gray-400 ml-auto">
              Photo by{' '}
              <a
                href={photographerHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 transition-colors"
              >
                {photographerName}
              </a>{' '}
              on{' '}
              <a
                href={unsplashHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600 transition-colors"
              >
                Unsplash
              </a>
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
