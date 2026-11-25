import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BlogNav } from '../blog/BlogNav';
import { BlogFooter } from '../blog/BlogFooter';
import { BlogBreadcrumb } from '../blog/BlogBreadcrumb';
import { FileText, Shield, Scale, Clock, ArrowRight, Printer, Mail } from 'lucide-react';

export interface SectionItem {
  id: string;
  title: string;
}

export interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  effectiveDate?: string;
  description: string;
  canonicalUrl: string;
  badge?: string;
  sections: SectionItem[];
  children: React.ReactNode;
}

const LEGAL_DOCS = [
  { title: 'Privacy Policy', href: '/privacy-policy' },
  { title: 'Terms and Conditions', href: '/terms-and-conditions' },
  { title: 'Cookie Policy', href: '/cookie-policy' },
  { title: 'Refund & Warranty Policy', href: '/refund-and-warranty-policy' },
];

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  lastUpdated,
  effectiveDate = lastUpdated,
  description,
  canonicalUrl,
  badge = 'Official Policy',
  sections,
  children,
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const location = useLocation();

  const fullTitle = `${title} | OG Smarthomes`;
  const fullUrl = `https://ogsmarthomes.com${canonicalUrl}`;

  useEffect(() => {
    // Scrollspy using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by position or pick the top one
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const breadcrumbItems = [
    { label: 'Legal' },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#0f1a2b] flex flex-col font-sans">
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OG Smarthomes" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <BlogNav />

      <main className="flex-1 pt-[64px] min-[820px]:pt-[76px]">
        {/* Hero Header */}
        <section className="bg-[#0a1220] text-white py-12 min-[820px]:py-16 border-b border-white/10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 right-0 w-[420px] h-[420px] bg-[#ffc46b]/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="site-container relative z-10">
            <BlogBreadcrumb items={breadcrumbItems} dark={true} className="mb-6" />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#ffc46b] text-[#0a1220] tracking-wide uppercase">
                <Shield size={13} className="shrink-0" />
                <span>{badge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-white/70 bg-white/10 border border-white/15 px-3 py-1 rounded-full">
                <Clock size={13} className="shrink-0 text-[#ffc46b]" />
                <span>Last updated: {lastUpdated}</span>
              </span>
              {effectiveDate !== lastUpdated && (
                <span className="text-[12.5px] text-white/50">
                  (Effective: {effectiveDate})
                </span>
              )}
            </div>

            <h1 className="text-[32px] sm:text-[44px] min-[820px]:text-[50px] font-bold text-white tracking-tight leading-[1.12] m-0 max-w-3xl">
              {title}
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#b9c4d6] leading-relaxed max-w-2xl m-0">
              {description}
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
              <div className="flex items-center gap-2">
                <Scale size={15} className="text-[#ffc46b]" />
                <span>Governing Entity: <strong>OG Smarhome &amp; Technology</strong> (Federal Republic of Nigeria)</span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer"
                title="Print this document"
              >
                <Printer size={13} />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Body with Sticky TOC */}
        <div className="site-container py-12 min-[820px]:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-[1100px]:gap-14 items-start">
            {/* Sticky Table of Contents sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <nav
                aria-label="Table of contents"
                className="bg-white rounded-2xl p-6 border border-[#0f1a2b]/10 shadow-sm"
              >
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#0f1a2b]/8">
                  <FileText size={17} className="text-[#ffc46b]" />
                  <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#0f1a2b] m-0">
                    Table of Contents
                  </h2>
                </div>

                <ol className="list-none p-0 m-0 space-y-1 text-[13.5px]">
                  {sections.map((section, idx) => {
                    const isActive = activeSection === section.id;
                    return (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg text-left no-underline transition-colors ${
                            isActive
                              ? 'bg-[#0a1220] text-white font-semibold shadow-xs'
                              : 'text-[#4a5568] hover:text-[#0f1a2b] hover:bg-[#0f1a2b]/5'
                          }`}
                        >
                          <span
                            className={`text-[11px] font-bold mt-0.5 shrink-0 ${
                              isActive ? 'text-[#ffc46b]' : 'text-[#a0aec0]'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span className="leading-snug">{section.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Other Legal Documents Quick Switcher */}
              <div className="bg-white rounded-2xl p-6 border border-[#0f1a2b]/10 shadow-sm">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#64748b] m-0 mb-3">
                  All Legal Policies
                </h3>
                <ul className="list-none p-0 m-0 space-y-2 text-[13.5px]">
                  {LEGAL_DOCS.map((doc) => {
                    const isCurrent = location.pathname === doc.href;
                    return (
                      <li key={doc.href}>
                        <Link
                          to={doc.href}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg no-underline transition-colors ${
                            isCurrent
                              ? 'bg-[#ffc46b]/20 text-[#0a1220] font-semibold'
                              : 'text-[#4a5568] hover:text-[#0f1a2b] hover:bg-[#0f1a2b]/5'
                          }`}
                        >
                          <span>{doc.title}</span>
                          <ArrowRight
                            size={13}
                            className={isCurrent ? 'text-[#0a1220]' : 'text-gray-400'}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Legal Contact Card */}
              <div className="bg-[#0a1220] text-white rounded-2xl p-6 border border-white/10 shadow-sm">
                <h3 className="text-[15px] font-bold text-white m-0 mb-2">
                  Legal &amp; Privacy Queries
                </h3>
                <p className="text-[13px] text-[#b9c4d6] leading-relaxed mb-4">
                  For data access requests, warranty inquiries, or compliance questions, reach out to our legal officer.
                </p>
                <a
                  href="mailto:privacy@ogsmarthomes.com"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#ffc46b] hover:underline"
                >
                  <Mail size={14} />
                  <span>privacy@ogsmarthomes.com</span>
                </a>
              </div>
            </aside>

            {/* Document Content Column (max-w around 760px) */}
            <article className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 border border-[#0f1a2b]/10 shadow-sm max-w-[760px] leading-relaxed">
              <div className="legal-prose space-y-8 text-[#2d3748] text-[15px] sm:text-[16px] leading-[1.8]">
                {children}
              </div>
            </article>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};
