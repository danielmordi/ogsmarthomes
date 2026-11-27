import React, { useEffect, useRef, useState } from 'react';
import {
  FAQS,
  HERO_IMAGES,
  HOW_IT_WORKS_STEPS,
  PROJECTS,
  SERVICES,
  TRUST_ITEMS,
  WHY_US_BENEFITS,
  type ProjectItem,
} from '../data/siteData';
import {
  ArrowRightIcon,
  ServiceIcon,
  TrustIcon,
  WhyUsIcon,
} from './Icons';
import { CtaSection } from './CtaSection';
import { ManageEverythingSection } from './ManageEverythingSection';
import { PackagesSection } from './PackagesSection';
import { ProductsSection } from './ProductsSection';
// Muted: RoomDemoSection preserved on disk per request
// import { RoomDemoSection } from './RoomDemoSection';
import { ShowcaseSection } from './ShowcaseSection';
import { TrustTestimonialCarousel } from './TrustTestimonialCarousel';

interface SectionsProps {
  addedDeviceIds: string[];
  onToggleSurveyDevice: (deviceId: string) => void;
  onSelectSurveyInterest: (chips: string[], note?: string) => void;
  onSelectPackage: (packageName: string, surveyChips: string[]) => void;
}

/** Accessible draggable Before / After comparison slider for Projects (Section 6.8) */
const BeforeAfterCard: React.FC<{ project: ProjectItem; delayMs: number }> = ({
  project,
  delayMs,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<number>(50);
  const draggingRef = useRef<boolean>(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <article
      className="reveal card-paper card-lift overflow-hidden flex flex-col shrink-0 w-[86vw] max-w-[360px] min-[820px]:w-auto min-[820px]:max-w-none snap-start"
      style={{ '--reveal-delay': `${delayMs}ms` } as React.CSSProperties}
    >
      {/* Before / After visual stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative aspect-[4/3] w-full select-none touch-pan-y cursor-ew-resize overflow-hidden bg-[#0a1220]"
      >
        {/* Base layer: After */}
        {project.useHeroPair ? (
          <img
            src={HERO_IMAGES.wideWith}
            alt="After smart home installation"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#101c33] text-white">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#ffc46b] mb-2">
              After
            </span>
            <span className="text-[15px] text-[#b9c4d6]">{project.afterPlaceholder}</span>
          </div>
        )}

        {/* Clipped overlay layer: Before */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {project.useHeroPair ? (
            <img
              src={HERO_IMAGES.wideWithout}
              alt="Before smart home installation"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#e7e2d7] text-[#0f1a2b]">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a8650a] mb-2">
                Before
              </span>
              <span className="text-[15px] text-[#5a6678]">{project.beforePlaceholder}</span>
            </div>
          )}
        </div>

        {/* Corner Before / After labels */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#0a1220]/75 text-white pointer-events-none">
          Before
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#0a1220]/75 text-[#ffc46b] pointer-events-none">
          After
        </span>

        {/* Divider line & draggable handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow pointer-events-none"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Compare before and after for ${project.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white text-[#0a1220] shadow-lg flex items-center justify-center border-2 border-[#0a1220]/15 cursor-ew-resize"
          style={{ left: `${position}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 7L4 12L9 17M15 7L20 12L15 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Project info */}
      <div className="p-5 min-[820px]:p-6 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-[19px] font-semibold text-[#0f1a2b] leading-snug m-0">
            {project.title}
          </h3>
          <p className="text-[14px] font-medium text-[#a8650a] mt-1 mb-0">{project.area}</p>
        </div>
        <p className="text-[14px] text-[#5a6678] m-0 leading-relaxed">{project.devices}</p>
      </div>
    </article>
  );
};

export const Sections: React.FC<SectionsProps> = ({
  onSelectSurveyInterest,
  onSelectPackage,
}) => {
  // 6.6 How it works scroll-drawn line progress (0..1)
  const howSectionRef = useRef<HTMLElement | null>(null);
  const [howProgress, setHowProgress] = useState<number>(0);

  // 6.11 FAQ single-open accordion
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Scroll-drawn line progress for How It Works (Section 6.6)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setHowProgress(1);
      return;
    }

    let rafId = 0;
    const updateLine = () => {
      const el = howSectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.78;
      const end = vh * 0.25;
      const total = rect.height * 0.65 + (start - end);
      const passed = start - rect.top;
      const p = Math.max(0, Math.min(1, passed / Math.max(total, 1)));
      setHowProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateLine);
    };

    updateLine();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToSurveyWith = (chips: string[], note?: string) => {
    onSelectSurveyInterest(chips, note);
    const el = document.getElementById('survey');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* =======================================================
          6.1 TRUST STRIP (on paper, directly under the hero)
          ======================================================= */}
      <section
        id="trust"
        aria-label="Key guarantees and track record"
        className="surface-paper border-b border-[var(--line-paper)] py-12 min-[820px]:py-16"
      >
        <div className="site-container">
          <div className="grid grid-cols-2 min-[820px]:grid-cols-4 gap-x-5 gap-y-6 pb-10 border-b border-[var(--line-paper)]">
            {TRUST_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                className="reveal flex items-start gap-3"
                style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
              >
                <span className="shrink-0 w-10 h-10 rounded-[12px] bg-[#0f1a2b]/[0.06] text-[#a8650a] flex items-center justify-center">
                  <TrustIcon id={item.id} />
                </span>
                <span className="text-[14px] min-[820px]:text-[15px] font-medium text-[#0f1a2b] leading-snug pt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <TrustTestimonialCarousel />
        </div>
      </section>

      {/* =======================================================
          6.2 SERVICES (on paper)
          ======================================================= */}
      <section id="services" className="surface-paper site-section">
        <div className="site-container">
          <div className="reveal">
            <span className="section-label">What we do</span>
            <h2 className="section-headline max-w-[760px]">
              Everything for a smarter home, under one roof.
            </h2>
            <p className="section-intro">
              We sell the products, install them properly and look after them afterwards, so you
              deal with one team from first call to daily use.
            </p>
          </div>

          <div className="grid grid-cols-1 min-[820px]:grid-cols-3 gap-5 min-[820px]:gap-7 mt-10 min-[820px]:mt-14">
            {SERVICES.map((service, idx) => (
              <article
                key={service.id}
                className="reveal card-paper card-lift p-6 min-[820px]:p-8 flex flex-col justify-between gap-6"
                style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
              >
                <div>
                  <span className="inline-flex w-12 h-12 rounded-[14px] bg-[#f6f4ef] text-[#a8650a] items-center justify-center mb-5">
                    <ServiceIcon id={service.id} />
                  </span>
                  <h3 className="text-[22px] font-semibold text-[#0f1a2b] m-0">
                    {service.title}
                  </h3>
                  <p className="text-[16px] text-[#5a6678] mt-3 mb-0 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <a
                  href={service.href}
                  className="inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-[#a8650a] hover:text-[#0f1a2b] no-underline transition-colors self-start"
                >
                  <span>{service.linkLabel}</span>
                  <ArrowRightIcon size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          6.3 MANAGE EVERYTHING — AUTOMATION SHOWCASE (on navy)
          (RoomDemoSection muted and preserved on disk)
          ======================================================= */}
      <ManageEverythingSection onProceedToSurvey={scrollToSurveyWith} />

      {/* =======================================================
          6.4 PRODUCTS (on paper)
          ======================================================= */}
      <ProductsSection onRequestProduct={scrollToSurveyWith} />

      {/* =======================================================
          6.5 PACKAGES (on navy — redesigned pricing section)
          ======================================================= */}
      <PackagesSection
        onSelectPackage={(packageName, surveyChips) => {
          onSelectPackage(packageName, surveyChips);
          const el = document.getElementById('survey');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* =======================================================
          6.6 HOW IT WORKS (on paper)
          ======================================================= */}
      <section ref={howSectionRef} id="how-it-works" className="surface-paper site-section">
        <div className="site-container">
          <div className="reveal">
            <span className="section-label">How it works</span>
            <h2 className="section-headline max-w-[700px]">
              From first call to a smarter home in four steps.
            </h2>
          </div>

          <div className="relative mt-12 min-[820px]:mt-16">
            {/* Mobile vertical track + animated fill */}
            <div
              aria-hidden="true"
              className="only-mobile-block absolute left-[21px] top-6 bottom-6 w-[2px] bg-[#0f1a2b]/12 rounded-full overflow-hidden"
            >
              <div
                className="w-full h-full origin-top"
                style={{
                  backgroundColor: '#a8650a',
                  transform: `scaleY(${howProgress})`,
                }}
              />
            </div>

            {/* Desktop horizontal track + animated fill */}
            <div
              aria-hidden="true"
              className="only-desktop-block hidden min-[820px]:block absolute top-[22px] left-6 right-6 h-[2px] bg-[#0f1a2b]/12 rounded-full overflow-hidden"
            >
              <div
                className="w-full h-full origin-left"
                style={{
                  backgroundColor: '#a8650a',
                  transform: `scaleX(${howProgress})`,
                }}
              />
            </div>

            <ol className="list-none m-0 p-0 grid grid-cols-1 min-[820px]:grid-cols-4 gap-8 min-[820px]:gap-7 relative z-10">
              {HOW_IT_WORKS_STEPS.map((step, idx) => {
                const threshold = idx / (HOW_IT_WORKS_STEPS.length - 1) * 0.85;
                const lit = howProgress >= threshold;
                return (
                  <li
                    key={step.number}
                    className="reveal flex min-[820px]:flex-col items-start gap-4 min-[820px]:gap-5"
                    style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
                  >
                    <span
                      className="shrink-0 w-[44px] h-[44px] rounded-full flex items-center justify-center text-[16px] font-bold tabular-nums transition-colors duration-200"
                      style={{
                        backgroundColor: lit ? '#ffc46b' : '#ffffff',
                        color: lit ? '#0a1220' : '#0f1a2b',
                        border: lit
                          ? '2px solid #ffc46b'
                          : '2px solid rgba(15, 26, 43, 0.18)',
                        boxShadow: lit ? '0 4px 16px rgba(255, 196, 107, 0.4)' : 'none',
                      }}
                    >
                      {step.number}
                    </span>
                    <div className="pt-1 min-[820px]:pt-0">
                      <h3 className="text-[20px] font-semibold text-[#0f1a2b] m-0">
                        {step.title}
                      </h3>
                      <p className="text-[15px] text-[#5a6678] mt-2 mb-0 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* =======================================================
          6.7 WHY OG Smarthomes (on navy)
          ======================================================= */}
      <section id="why-us" className="surface-navy site-section">
        <div className="site-container">
          <div className="grid grid-cols-1 min-[820px]:grid-cols-2 gap-10 min-[820px]:gap-14 items-center">
            {/* Installed smart home showcase image */}
            <div className="reveal relative rounded-[20px] aspect-[4/3] min-[820px]:aspect-[5/4] w-full overflow-hidden border border-white/14 bg-[#101c33]">
              <img
                src="/src/assets/images/showcase_lighting_living_1795116976048.jpg"
                alt="Installed smart home living room with recessed warm lighting and black glass wall touch panel"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[20px]"
              />
            </div>

            {/* 6 benefits */}
            <div className="reveal">
              <span className="section-label">Why us</span>
              <h2 className="section-headline">Smart homes built for how we live here.</h2>

              <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {WHY_US_BENEFITS.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 p-4 rounded-[16px] bg-[#101c33] border border-white/12"
                  >
                    <span className="shrink-0 w-9 h-9 rounded-[10px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center">
                      <WhyUsIcon id={item.id} />
                    </span>
                    <span className="text-[15px] font-medium text-white leading-snug pt-0.5">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          6.8 PROJECTS (on paper)
          ======================================================= */}
      <section id="projects" className="surface-paper site-section sr-only">
        <div className="site-container">
          <div className="reveal">
            <span className="section-label">Recent work</span>
            <h2 className="section-headline">See the difference we make.</h2>
            <p className="section-intro">
              Drag the slider to compare a home before and after.
            </p>
          </div>

          <div className="mt-10 min-[820px]:mt-14 -mx-5 px-5 min-[820px]:mx-0 min-[820px]:px-0 snap-row min-[820px]:grid min-[820px]:grid-cols-3 gap-5 min-[820px]:gap-7 pb-2">
            {PROJECTS.map((project, idx) => (
              <BeforeAfterCard key={project.id} project={project} delayMs={idx * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          6.8b SHOWCASE — INSTALLATION GALLERY WITH CATEGORY FILTERS (on paper)
          ======================================================= */}
      <ShowcaseSection onRequestSetup={scrollToSurveyWith} />

      {/* =======================================================
          6.9 CENTERED CTA (on navy)
          ======================================================= */}
      <CtaSection id="testimonials" />

      {/* =======================================================
          6.11 FAQ (on paper)
          ======================================================= */}
      <section id="faq" className="surface-paper site-section">
        <div className="site-container max-w-[860px]">
          <div className="reveal">
            <span className="section-label">Questions</span>
            <h2 className="section-headline">Good to know.</h2>
          </div>

          <div className="mt-10 min-[820px]:mt-12 border-t border-[var(--line-paper)]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              const panelId = `faq-panel-${idx}`;
              const btnId = `faq-btn-${idx}`;

              return (
                <div key={faq.question} className="border-b border-[var(--line-paper)]">
                  <h3 className="m-0">
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full min-h-[60px] py-5 text-left flex items-center justify-between gap-4 bg-transparent border-0 cursor-pointer text-[#0f1a2b] font-semibold text-[17px] min-[820px]:text-[19px] leading-snug"
                    >
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 w-9 h-9 rounded-full bg-[#0f1a2b]/[0.05] text-[#0f1a2b] flex items-center justify-center relative"
                      >
                        <span className="block w-3.5 h-[2px] bg-current rounded-full" />
                        <span
                          className="block w-[2px] h-3.5 bg-current rounded-full absolute transition-transform duration-300"
                          style={{
                            transform: isOpen ? 'scaleY(0)' : 'scaleY(1)',
                          }}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`accordion-body ${isOpen ? 'is-open' : ''}`}
                  >
                    <div className="accordion-body-inner">
                      <p className="text-[16px] text-[#5a6678] leading-relaxed m-0 pb-6 pr-10">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
