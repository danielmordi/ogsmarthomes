import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostsByCategory, getCategoryBySlug, BLOG_CATEGORIES } from '../../lib/blog';
import { BlogCard } from '../../components/blog/BlogCard';
import { BlogSEOHead } from '../../components/blog/BlogSEOHead';
import { BlogNav } from '../../components/blog/BlogNav';
import { BlogFooter } from '../../components/blog/BlogFooter';
import { BlogBreadcrumb } from '../../components/blog/BlogBreadcrumb';
import { BlogCTA } from '../../components/blog/BlogCTA';
import { BlogNotFound } from './BlogNotFound';
import { Layers } from 'lucide-react';

export const BlogCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = useMemo(() => (slug ? getCategoryBySlug(slug) : undefined), [slug]);
  const posts = useMemo(() => (slug ? getPostsByCategory(slug) : []), [slug]);

  if (!category && (!posts || posts.length === 0)) {
    return <BlogNotFound requestedSlug={slug} />;
  }

  const categoryName = category?.name || (slug ? slug.replace(/-/g, ' ') : 'Category');
  const categoryDescription =
    category?.description ||
    `Browse all smart home articles and automation installation tutorials in ${categoryName}.`;

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: categoryName },
  ];

  return (
    <div className="min-h-screen bg-[#0a1220] text-white flex flex-col">
      <BlogSEOHead
        title={`${categoryName} | Smart Home Guides & Articles`}
        description={categoryDescription}
        canonicalUrl={`/blog/category/${slug}`}
        ogType="website"
      />

      <BlogNav />

      <main className="flex-1 pt-[88px] min-[820px]:pt-[108px] pb-20">
        <div className="site-container">
          <div className="py-8 min-[820px]:py-12 border-b border-white/10">
            <BlogBreadcrumb items={breadcrumbItems} dark={true} className="mb-5" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ffc46b] text-[12px] font-semibold uppercase tracking-wider mb-4">
              <Layers size={14} />
              <span>Topic Category</span>
            </div>

            <h1 className="text-[34px] sm:text-[46px] min-[820px]:text-[54px] font-bold text-white tracking-tight leading-[1.08] m-0">
              {categoryName}
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#b9c4d6] max-w-2xl leading-relaxed m-0">
              {categoryDescription}
            </p>
          </div>

          {/* Related Category Pills */}
          <div className="my-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              to="/blog"
              className="px-4 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap bg-white/5 text-white/80 border border-white/10 hover:border-white/30 hover:text-white transition-colors no-underline"
            >
              All Topics
            </Link>

            {BLOG_CATEGORIES.map((cat) => {
              const isCurrent = cat.slug.toLowerCase() === slug?.toLowerCase();
              return (
                <Link
                  key={cat.slug}
                  to={`/blog/category/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-colors no-underline border ${
                    isCurrent
                      ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Post Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} dark={true} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-[20px] bg-white/5 border border-white/10">
              <p className="text-[18px] text-white/70">
                No articles published in this category yet. Check back soon!
              </p>
              <Link
                to="/blog"
                className="mt-4 inline-block px-5 py-2.5 rounded-full bg-[#ffc46b] text-[#0a1220] font-semibold text-[14px] no-underline"
              >
                Back to All Articles
              </Link>
            </div>
          )}

          {/* Homepage CTA */}
          <BlogCTA />
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
