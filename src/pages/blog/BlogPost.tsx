import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getRelatedPosts, getCategoryBySlug } from '../../lib/blog';
import { BlogSEOHead } from '../../components/blog/BlogSEOHead';
import { BlogJsonLd } from '../../components/blog/BlogJsonLd';
import { BlogNav } from '../../components/blog/BlogNav';
import { BlogFooter } from '../../components/blog/BlogFooter';
import { BlogBreadcrumb } from '../../components/blog/BlogBreadcrumb';
import { BlogImage } from '../../components/blog/BlogImage';
import { BlogTableOfContents, extractHeadingsFromMarkdown, slugifyHeading } from '../../components/blog/BlogTableOfContents';
import { BlogAuthorBox } from '../../components/blog/BlogAuthorBox';
import { BlogRelatedPosts } from '../../components/blog/BlogRelatedPosts';
import { BlogCTA } from '../../components/blog/BlogCTA';
import { BlogNotFound } from './BlogNotFound';
import { Calendar, Clock, Tag, HelpCircle, ChevronDown } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug]);

  if (!post) {
    return <BlogNotFound requestedSlug={slug} />;
  }

  const categoryMeta = getCategoryBySlug(post.category);
  const relatedPosts = useMemo(() => getRelatedPosts(post.slug, 3), [post.slug]);
  const tocItems = useMemo(() => extractHeadingsFromMarkdown(post.content), [post.content]);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    {
      label: categoryMeta?.name || post.category,
      href: `/blog/category/${post.category}`,
    },
    { label: post.title },
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#0f1a2b] flex flex-col">
      {/* Dynamic Head SEO */}
      <BlogSEOHead
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.featuredImage}
        ogImageAlt={post.featuredImageAlt}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        authorName={post.author.name}
        keywords={post.tags}
      />

      {/* Structured Data */}
      <BlogJsonLd post={post} breadcrumbItems={breadcrumbItems} />

      <BlogNav />

      <main className="flex-1 pt-[76px] min-[820px]:pt-[90px] pb-20">
        {/* Post Hero Header (Navy surface matching top hero aesthetic) */}
        <div className="bg-[#0a1220] text-white py-12 min-[820px]:py-16 border-b border-white/10">
          <div className="site-container max-w-[960px]">
            <BlogBreadcrumb items={breadcrumbItems} dark={true} className="mb-6" />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                to={`/blog/category/${post.category}`}
                className="px-3.5 py-1 rounded-full text-[12.5px] font-semibold bg-[#ffc46b] text-[#0a1220] no-underline hover:bg-[#ffd085] transition-colors"
              >
                {categoryMeta?.name || post.category}
              </Link>
              {post.focusKeyword && (
                <span className="text-[12px] text-white/50 border border-white/15 px-2.5 py-0.5 rounded-full">
                  Topic: {post.focusKeyword}
                </span>
              )}
            </div>

            <h1 className="text-[32px] sm:text-[44px] min-[820px]:text-[52px] font-bold text-white tracking-tight leading-[1.12] m-0">
              {post.title}
            </h1>

            <p className="mt-5 text-[17px] sm:text-[20px] text-[#b9c4d6] leading-relaxed m-0 font-normal">
              {post.excerpt}
            </p>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[13.5px] text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#ffc46b] font-bold text-[14px]">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-[12px] text-white/60">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{post.readingTime}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body Section */}
        <div className="site-container max-w-[960px] pt-8">
          {/* Featured Image */}
          <BlogImage
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            width={1200}
            height={700}
            isFeatured={true}
            caption={post.featuredImageAlt}
          />

          {/* Table of Contents */}
          <BlogTableOfContents items={tocItems} />

          {/* Render Markdown Content */}
          <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0f1a2b] prose-h2:text-[26px] sm:prose-h2:text-[32px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:pt-4 prose-h2:border-t prose-h2:border-[#0f1a2b]/10 prose-h3:text-[20px] sm:prose-h3:text-[23px] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[#2d3748] prose-p:text-[16.5px] prose-p:leading-[1.75] prose-li:text-[16px] prose-li:text-[#2d3748] prose-a:text-[#a8650a] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#ffc46b] prose-strong:text-[#0f1a2b] prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-th:bg-[#0a1220] prose-th:text-white prose-th:p-3.5 prose-th:text-left prose-td:p-3.5 prose-td:border-b prose-td:border-[#0f1a2b]/10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = slugifyHeading(text);
                  return (
                    <h2 id={id} className="scroll-mt-24">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = slugifyHeading(text);
                  return (
                    <h3 id={id} className="scroll-mt-24">
                      {children}
                    </h3>
                  );
                },
                a: ({ href, children }) => {
                  // If it's an internal link, use normal anchor or router link
                  const isExternal = href?.startsWith('http') && !href?.includes('ogsmarthomes.com');
                  return (
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 rounded-[16px] border border-[#0f1a2b]/10 shadow-sm bg-white">
                    <table className="w-full text-[14.5px] m-0">{children}</table>
                  </div>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="my-10 pt-6 border-t border-[#0f1a2b]/10 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-gray-500 mr-2 flex items-center gap-1.5">
                <Tag size={14} />
                <span>Tagged under:</span>
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[12.5px] font-medium bg-white border border-[#0f1a2b]/10 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* FAQ Accordion Section (if available) */}
          {post.faq && post.faq.length > 0 && (
            <section className="my-14 p-8 sm:p-10 rounded-[24px] bg-white border border-[#0f1a2b]/10 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <HelpCircle size={22} className="text-[#a8650a]" />
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0f1a2b] tracking-tight m-0">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {post.faq.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-[#0f1a2b]/10 rounded-[16px] p-5 bg-[#f6f4ef]/50 open:bg-white transition-colors"
                  >
                    <summary className="font-semibold text-[16px] sm:text-[17px] text-[#0f1a2b] cursor-pointer flex items-center justify-between gap-4 list-none">
                      <span>{item.question}</span>
                      <ChevronDown
                        size={18}
                        className="text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-3 text-[15px] text-[#5a6678] leading-relaxed pt-2 border-t border-[#0f1a2b]/5 m-0">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Author Box */}
          <BlogAuthorBox author={post.author} />

          {/* Homepage CTA Block */}
          <BlogCTA />

          {/* Related Posts */}
          <BlogRelatedPosts posts={relatedPosts} />
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
