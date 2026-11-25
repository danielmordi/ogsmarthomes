import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '../../lib/blogTypes';
import { getCategoryBySlug } from '../../lib/blog';
import { buildUnsplashUrl } from './BlogImage';

interface BlogCardProps {
  post: BlogPost;
  dark?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, dark = false }) => {
  const categoryMeta = getCategoryBySlug(post.category);
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const optimizedThumb = post.featuredImage.includes('images.unsplash.com')
    ? buildUnsplashUrl(post.featuredImage, 640)
    : post.featuredImage;

  return (
    <article
      className={`group flex flex-col rounded-[22px] overflow-hidden border transition-all duration-300 ${
        dark
          ? 'bg-[#101c33] border-white/10 hover:border-white/25 shadow-lg'
          : 'bg-white border-[#0f1a2b]/10 hover:border-[#a8650a]/40 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Featured Thumbnail */}
      <Link
        to={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-gray-900"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={optimizedThumb}
          alt={post.featuredImageAlt || post.title}
          loading="lazy"
          width={640}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0a1220]/80 backdrop-blur-md text-[#ffc46b] border border-white/10">
            {categoryMeta?.name || post.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Meta Info */}
        <div
          className={`flex items-center gap-4 text-[12.5px] mb-3 ${
            dark ? 'text-white/60' : 'text-gray-500'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{post.readingTime}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-[20px] font-bold tracking-tight line-clamp-2 mb-3 leading-snug group-hover:text-[#ffc46b] transition-colors ${
            dark ? 'text-white' : 'text-[#0f1a2b]'
          }`}
        >
          <Link to={`/blog/${post.slug}`} className="no-underline text-inherit">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p
          className={`text-[14.5px] leading-relaxed line-clamp-3 mb-5 flex-1 ${
            dark ? 'text-[#b9c4d6]' : 'text-[#5a6678]'
          }`}
        >
          {post.excerpt}
        </p>

        {/* Read More Link */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#ffc46b] group-hover:underline no-underline"
          >
            <span>Read Article</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <span className={`text-[12px] truncate max-w-[140px] ${dark ? 'text-white/40' : 'text-gray-400'}`}>
            By {post.author.name}
          </span>
        </div>
      </div>
    </article>
  );
};
