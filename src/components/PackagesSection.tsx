import React, { useEffect, useRef, useState } from 'react';
import {
  CONTACT_PLACEHOLDERS,
  PACKAGES,
  PRICING_BADGE,
  PRICING_FAQS,
  PRICING_INCLUDED_ITEMS,
  type PackagePlan,
} from '../data/siteData';
import { getWhatsAppLinkProps } from '../utils/whatsapp';

interface PackagesSectionProps {
  onSelectPackage?: (packageName: string, surveyChips: string[]) => void;
}

const IncludedLineIcon: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'survey':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 5H7C5.895 5 5 5.895 5 7V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V7C19 5.895 18.105 5 17 5H15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect x="9" y="3" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M9 12.5L11 14.5L15 10.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'install':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-3-3 2.3-2.3z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'training':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M11 17.5H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 13V12a8 8 0 0 1 16 0v1"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect x="3" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <rect x="17" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M19 19v1a2 2 0 0 1-2 2h-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

const PricingFaqAccordion: React.FC<{
  openIdx: number | null;
  onToggle: (idx: number) => void;
  className?: string;
}> = ({ openIdx, onToggle, className = '' }) => (
  <div
    className={`border-t border-white/14 ${className}`}
    aria-label="Pricing frequently asked questions"
  >
    {PRICING_FAQS.map((item, idx) => {
      const isOpen = openIdx === idx;
      const btnId = `pricing-faq-btn-${item.id}`;
      const panelId = `pricing-faq-panel-${item.id}`;

      return (
        <div key={item.id} className="border-b border-white/14">
          <h3 className="m-0">
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(idx)}
              className="w-full min-h-[56px] py-4 text-left flex items-center justify-between gap-4 bg-transparent border-0 cursor-pointer text-white font-semibold text-[17px] leading-snug transition-colors hover:text-[#ffc46b]"
            >
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="shrink-0 w-7 h-7 rounded-full bg-white/[0.06] text-white flex items-center justify-center relative"
              >
                <span className="block w-3 h-[1.75px] bg-current rounded-full" />
                <span
                  className="block w-[1.75px] h-3 bg-current rounded-full absolute transition-transform duration-300"
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
              <p className="text-[15px] text-[#b9c4d6] leading-relaxed max-w-[420px] m-0 pb-5 pr-8">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const PackageCard: React.FC<{
  pkg: PackagePlan;
  cardDelayMs: number;
  revealed: boolean;
}> = ({ pkg, cardDelayMs, revealed }) => {
  const titleId = `package-title-${pkg.id}`;
  const priceLabelId = `package-price-${pkg.id}`;
  let checkCounter = 0;

  return (
    <div
      className={`pricing-reveal-card ${revealed ? 'is-revealed' : ''} ${pkg.popular ? 'order-first min-[820px]:order-none' : ''
        }`}
      style={{ '--card-delay': `${cardDelayMs}ms` } as React.CSSProperties}
    >
      <article
        role="group"
        aria-labelledby={titleId}
        aria-describedby={priceLabelId}
        className={`pricing-card ${pkg.popular
            ? 'pricing-card-popular p-5 min-[820px]:p-7'
            : 'p-5 min-[820px]:p-7'
          }`}
      >
        {/* Top hardware kit visual */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-white/12 bg-[#070d18]">
          <img
            src={pkg.image}
            alt={pkg.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {pkg.tag.trim() !== '' && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#070d18]/70 to-transparent"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-bold leading-snug whitespace-nowrap shadow-sm ${pkg.popular
                    ? 'bg-[#ffc46b] text-[#0a1220]'
                    : 'bg-[#0a1220]/85 text-[#ffc46b] border border-[#ffc46b]/35 backdrop-blur-sm'
                  }`}
              >
                {pkg.tag}
              </span>
            </>
          )}
        </div>

        {/* Title & Price */}
        <div className="mt-5">
          <h3
            id={titleId}
            className="text-[15px] font-semibold uppercase tracking-[0.08em] text-[#b9c4d6] m-0"
          >
            {pkg.name}
          </h3>

          {/* Accessible labelled price */}
          <div id={priceLabelId} className="mt-2.5">
            <span className="sr-only">
              {pkg.name}, {pkg.pricePrefix} {pkg.priceValue}
            </span>
            <div aria-hidden="true" className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[15px] font-medium text-[#b9c4d6]">{pkg.pricePrefix}</span>
              <span className="text-[34px] min-[420px]:text-[38px] font-bold leading-[1.08] tracking-[-0.02em] text-[#ffc46b] tabular-nums whitespace-nowrap">
                {pkg.priceValue}
              </span>
            </div>
            <p className="text-[14px] text-[#b9c4d6] mt-1.5 mb-0 leading-snug">
              Includes hardware only &amp; professional installation is billed separately.
            </p>
          </div>
        </div>

        {/* Single-column hardware checklist */}
        <ul
          className="list-none m-0 mt-5 pt-5 border-t border-white/14 p-0 space-y-2.5"
          aria-label={`Included in ${pkg.name}`}
        >
          {pkg.features.map((feat) => {
            const currentCheckIdx = feat.inherited ? 0 : checkCounter++;
            return (
              <li
                key={feat.text}
                className={`flex items-start gap-2.5 text-[14.5px] leading-snug ${feat.inherited ? 'text-[#b9c4d6]' : 'text-white'
                  }`}
              >
                {feat.inherited ? (
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-5 h-5 rounded-full bg-white/[0.1] text-[#b9c4d6] flex items-center justify-center mt-0.5"
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 2.25V9.75M2.25 6H9.75"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-5 h-5 rounded-full bg-[#ffc46b]/[0.16] text-[#ffc46b] flex items-center justify-center mt-0.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 4.8"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pricing-check-path"
                        style={{ '--check-idx': currentCheckIdx } as React.CSSProperties}
                      />
                    </svg>
                  </span>
                )}
                <span>{feat.text}</span>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="mt-6">
          <a
            aria-describedby={titleId}
            {...getWhatsAppLinkProps(
              `Hello OG Smarthomes, I would like to get the ${pkg.name} package (${pkg.priceValue}).`
            )}
            className={
              pkg.popular
                ? 'btn-primary !h-[52px] w-full min-[820px]:w-auto min-[820px]:px-8 active:scale-[0.985]'
                : 'btn-secondary !h-[52px] w-full min-[820px]:w-auto min-[820px]:px-8 !border-white !text-white active:scale-[0.985]'
            }
          >
            Get this package
          </a>
        </div>
      </article>
    </div>
  );
};

export const PackagesSection: React.FC<PackagesSectionProps> = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [sectionRevealed, setSectionRevealed] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 820px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 820px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSectionRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSectionRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const badgeText = PRICING_BADGE.useCountPlaceholder
    ? PRICING_BADGE.textWithCount
    : PRICING_BADGE.fallbackText;

  const whatsappHref = `https://wa.me/${CONTACT_PLACEHOLDERS.whatsappDigits}?text=${encodeURIComponent(
    'Hello OG Smarthomes, I would like help choosing a smart home package and getting a custom quote.'
  )}`;

  const handleToggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      ref={sectionRef}
      id="packages"
      aria-labelledby="packages-heading"
      className="surface-navy relative overflow-x-clip pt-[72px] pb-[168px] min-[820px]:pt-[120px] min-[820px]:pb-[120px]"
    >
      {/* Top-left ambient glow contained inside overflow-hidden wrapper so sticky works and nothing scrolls sideways */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pricing-ambient-glow" />
      </div>

      <div className="site-container relative z-10">
        {/* Two-column layout on desktop (5/12 sticky left pitch + FAQ, 7/12 right stacked cards) */}
        <div className="grid grid-cols-1 min-[820px]:grid-cols-12 gap-8 min-[820px]:gap-10 min-[1040px]:gap-12 items-start">
          {/* Left column: Badge, headline, intro, and (on desktop) sticky FAQ */}
          <div
            className={`pricing-reveal-left min-[820px]:col-span-5 min-[820px]:sticky min-[820px]:top-[120px] ${sectionRevealed ? 'is-revealed' : ''
              }`}
          >
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-[#ffc46b] bg-[#ffc46b]/[0.14] border border-[#ffc46b]/30 mb-5">
              {badgeText}
            </div>

            <h2
              id="packages-heading"
              className="text-white font-semibold tracking-[-0.02em] leading-[1.1] m-0"
              style={{ fontSize: 'clamp(30px, 4.2vw, 52px)' }}
            >
              <span className="block">Clear pricing.</span>
              <span className="block text-[#ffc46b]">Easy scaling.</span>
            </h2>

            <p
              className="text-[#b9c4d6] leading-[1.55] max-w-[440px] mt-4 mb-0"
              style={{ fontSize: 'clamp(16px, 1.8vw, 19px)' }}
            >
              Start with your entrance and add more rooms when you are ready. Every package is
              tailored to your rooms and wiring so you only pay for what your home needs.
            </p>

            {/* Desktop Pricing FAQ sits 48px under intro inside sticky column */}
            {isDesktop && (
              <PricingFaqAccordion
                openIdx={openFaqIdx}
                onToggle={handleToggleFaq}
                className="mt-12"
              />
            )}
          </div>

          {/* Right column: Three wide horizontal package cards stacked with 16px gap */}
          <div className="min-[820px]:col-span-7 flex flex-col gap-4">
            {PACKAGES.map((pkg, idx) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                cardDelayMs={idx * 100}
                revealed={sectionRevealed}
              />
            ))}
          </div>
        </div>

        {/* Under the cards: "Included in every package" strip */}
        <div className="mt-8 pt-6 border-t border-white/14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#b9c4d6] m-0 mb-5">
            Included in every package
          </p>

          <ul className="list-none m-0 p-0 grid grid-cols-2 min-[820px]:grid-cols-4 gap-x-5 gap-y-6 min-[820px]:gap-6">
            {PRICING_INCLUDED_ITEMS.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 rounded-[10px] bg-[#ffc46b]/[0.12] text-[#ffc46b] flex items-center justify-center mt-0.5">
                  <IncludedLineIcon id={item.id} />
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-medium text-white leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[13px] text-[#b9c4d6] mt-1 leading-snug">
                    {item.subtitle}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* One muted 14px note + Chat on WhatsApp link */}
        <p className="text-[14px] text-[#b9c4d6] leading-relaxed mt-7 mb-0">
          Prices depend on your home and the products you choose. Not sure where to start? Request a
          custom plan and we will recommend the right package.{' '}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffc46b] font-semibold underline decoration-[#ffc46b]/50 underline-offset-4 hover:decoration-[#ffc46b] hover:text-[#ffd694] transition-colors whitespace-nowrap"
          >
            Chat on WhatsApp
          </a>
        </p>

        {/* Mobile Pricing FAQ accordion sits full width at the bottom */}
        {!isDesktop && (
          <PricingFaqAccordion
            openIdx={openFaqIdx}
            onToggle={handleToggleFaq}
            className="mt-10"
          />
        )}
      </div>
    </section>
  );
};
