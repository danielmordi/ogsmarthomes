import React from 'react';
import { Link } from 'react-router-dom';
import { BlogSEOHead } from '../../components/blog/BlogSEOHead';
import { BlogNav } from '../../components/blog/BlogNav';
import { BlogFooter } from '../../components/blog/BlogFooter';
import { FileQuestion, ArrowRight, Home } from 'lucide-react';

interface BlogNotFoundProps {
  requestedSlug?: string;
}

export const BlogNotFound: React.FC<BlogNotFoundProps> = ({ requestedSlug }) => {
  return (
    <div className="min-h-screen bg-[#0a1220] text-white flex flex-col">
      <BlogSEOHead
        title="Article Not Found (404) | Og Smart Homes"
        description="The smart home article or guide you requested could not be found. Explore our knowledge hub or return to the homepage."
        canonicalUrl="/blog/404"
        ogType="website"
      />

      <BlogNav />

      <main className="flex-1 pt-[120px] pb-24 flex items-center justify-center">
        <div className="site-container max-w-xl text-center py-12">
          <div className="w-20 h-20 rounded-full bg-white/10 text-[#ffc46b] flex items-center justify-center mx-auto mb-6">
            <FileQuestion size={40} />
          </div>

          <span className="text-[14px] font-semibold uppercase tracking-wider text-[#ffc46b] mb-2 block">
            404 — Article Not Found
          </span>

          <h1 className="text-[32px] sm:text-[42px] font-bold text-white tracking-tight leading-tight m-0">
            We couldn't find that article.
          </h1>

          <p className="mt-4 text-[16px] text-[#b9c4d6] leading-relaxed">
            {requestedSlug ? (
              <>
                The page for <code className="bg-white/10 px-2 py-0.5 rounded text-white text-[14px]">"{requestedSlug}"</code> may have been moved, renamed, or is currently being updated.
              </>
            ) : (
              'The requested blog page could not be located on our server.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/blog"
              className="btn-primary h-[48px] px-6 rounded-full inline-flex items-center gap-2 text-[#0a1220] bg-[#ffc46b] hover:bg-[#ffd085] no-underline font-semibold text-[14.5px]"
            >
              <span>Browse All Articles</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="btn-secondary h-[48px] px-6 rounded-full inline-flex items-center gap-2 text-white border border-white/20 hover:bg-white/10 no-underline font-semibold text-[14.5px]"
            >
              <Home size={16} />
              <span>Go to Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
