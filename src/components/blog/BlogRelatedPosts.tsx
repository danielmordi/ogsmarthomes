import React from 'react';
import type { BlogPost } from '../../lib/blogTypes';
import { BlogCard } from './BlogCard';

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

export const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section className="my-16 pt-12 border-t border-[#0f1a2b]/10">
      <div className="mb-8">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#a8650a]">
          Continue Reading
        </span>
        <h2 className="text-[26px] sm:text-[32px] font-bold text-[#0f1a2b] tracking-tight mt-1 mb-0">
          Related Articles & Guides
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} dark={false} />
        ))}
      </div>
    </section>
  );
};
