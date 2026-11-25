import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, BLOG_CATEGORIES } from '../../lib/blog';
import { BlogCard } from '../../components/blog/BlogCard';
import { BlogSEOHead } from '../../components/blog/BlogSEOHead';
import { BlogNav } from '../../components/blog/BlogNav';
import { BlogFooter } from '../../components/blog/BlogFooter';
import { BlogCTA } from '../../components/blog/BlogCTA';
import { buildUnsplashUrl } from '../../components/blog/BlogImage';
import { Calendar, Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export const BlogIndex: React.FC = () => {
  const allPosts = useMemo(() => getAllPosts(), []);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return allPosts;
    return allPosts.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [allPosts, activeCategory]);

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  // If viewing 'all', exclude featured post from the grid so it isn't duplicated
  const gridPosts = useMemo(() => {
    if (activeCategory === 'all' && featuredPost) {
      return filteredPosts.slice(1, visibleCount + 1);
    }
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, activeCategory, featuredPost, visibleCount]);

  const hasMore =
    activeCategory === 'all' && featuredPost
      ? visibleCount + 1 < filteredPosts.length
      : visibleCount < filteredPosts.length;

  return (
    <div className="min-h-screen bg-[#0a1220] text-white flex flex-col">
      <BlogSEOHead
        title="Smart Home Automation Blog & Expert Guides"
        description="Comprehensive guides, cost breakdowns, and expert installation advice for smart locks, CCTV cameras, home automation switches, and solar power integration in Nigeria."
        canonicalUrl="/blog"
        ogType="website"
      />

      <BlogNav />

      <main className="flex-1 pt-[88px] min-[820px]:pt-[108px] pb-20">
        <div className="site-container">
          {/* Header Section */}
          <div className="py-8 min-[820px]:py-12 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ffc46b] text-[12px] font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>Smart Living Knowledge Hub</span>
            </span>
            <h1 className="text-[34px] sm:text-[46px] min-[820px]:text-[56px] font-bold text-white tracking-tight leading-[1.08] m-0 max-w-3xl">
              Insights, Guides & Tips for Modern Automated Homes.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-[#b9c4d6] max-w-2xl leading-relaxed m-0">
              Practical advice from experienced automation technicians on securing your residence, choosing reliable smart hardware, reducing energy bills, and integrating solar power in Nigeria.
            </p>
          </div>

          {/* Featured Post Hero Banner (shown when 'all' is selected) */}
          {featuredPost && activeCategory === 'all' && (
            <section className="my-10 p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-[#101c33] via-[#0f1a2e] to-[#0a1220] border border-white/15 shadow-2xl relative overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#ffc46b] text-[#0a1220]">
                      Featured Guide
                    </span>
                    <span className="text-[13px] text-white/60">
                      {featuredPost.category.replace(/-/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-snug m-0 group-hover:text-[#ffc46b] transition-colors">
                    <Link to={`/blog/${featuredPost.slug}`} className="no-underline text-inherit">
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-[15px] sm:text-[16px] text-[#b9c4d6] line-clamp-3 leading-relaxed m-0">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-white/60 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{featuredPost.readingTime}</span>
                    </span>
                    <span>By {featuredPost.author.name}</span>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="btn-primary h-[46px] px-6 text-[14px] font-semibold rounded-full inline-flex items-center gap-2 text-[#0a1220] bg-[#ffc46b] hover:bg-[#ffd085] no-underline shadow-md"
                    >
                      <span>Read Featured Guide</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="block aspect-[16/11] rounded-[20px] overflow-hidden bg-gray-900 border border-white/10"
                    tabIndex={-1}
                  >
                    <img
                      src={
                        featuredPost.featuredImage.includes('images.unsplash.com')
                          ? buildUnsplashUrl(featuredPost.featuredImage, 800)
                          : featuredPost.featuredImage
                      }
                      alt={featuredPost.featuredImageAlt}
                      width={800}
                      height={550}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Category Filter Pills */}
          <div className="my-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-white/50 mr-2 flex items-center gap-1 shrink-0">
              <Filter size={14} />
              <span>Category:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setVisibleCount(POSTS_PER_PAGE);
              }}
              className={`px-4 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === 'all'
                  ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                  : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              All Topics ({allPosts.length})
            </button>

            {BLOG_CATEGORIES.map((cat) => {
              const count = allPosts.filter((p) => p.category.toLowerCase() === cat.slug.toLowerCase()).length;
              const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat.name} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Post Grid */}
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} dark={true} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-[20px] bg-white/5 border border-white/10">
              <p className="text-[18px] text-white/70">No articles found in this category yet.</p>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="mt-4 px-5 py-2 rounded-full bg-[#ffc46b] text-[#0a1220] font-semibold text-[14px]"
              >
                View all articles
              </button>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                className="btn-secondary h-[48px] px-8 rounded-full text-[14.5px] font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Load More Articles
              </button>
            </div>
          )}

          {/* Homepage CTA Banner */}
          <BlogCTA />
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
