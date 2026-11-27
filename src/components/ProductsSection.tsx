import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PRODUCTS, type ProductItem } from '../data/siteData';
import { getWhatsAppLinkProps } from '../utils/whatsapp';
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from './Icons';

interface ProductsSectionProps {
  onRequestProduct?: (chips: string[], note?: string) => void;
}

const SHEET_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.35 };

export const ProductsSection: React.FC<ProductsSectionProps> = () => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const activeIndex = activeProductId
    ? PRODUCTS.findIndex((p) => p.id === activeProductId)
    : -1;
  const activeProduct: ProductItem | null = activeIndex >= 0 ? PRODUCTS[activeIndex] : null;

  useEffect(() => {
    if (!activeProduct) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveProductId(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (activeIndex + 1) % PRODUCTS.length;
        setActiveProductId(PRODUCTS[next].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
        setActiveProductId(PRODUCTS[prev].id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [activeProduct, activeIndex]);

  const openSpecs = (productId: string, triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setActiveProductId(productId);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="products" className="surface-paper site-section">
        <div className="site-container">
          <div className="reveal flex flex-col min-[820px]:flex-row min-[820px]:items-end justify-between gap-6">
            <div>
              <span className="section-label">Featured hardware</span>
              <h2 className="section-headline">Products that work together.</h2>
              <p className="section-intro">
                Start with our flagship smart locks below — every product we supply, from locks to
                lighting, CCTV, and audio, is tested by our installers and works from one app.
              </p>
            </div>
            <div className="text-[14px] font-medium text-[#5a6678] shrink-0">
              Featured Smart Locks · {PRODUCTS.length} models
            </div>
          </div>

          <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-5 min-[820px]:gap-7 mt-10 min-[820px]:mt-14">
            {PRODUCTS.map((product, idx) => (
              <article
                key={product.id}
                className="reveal card-paper card-lift overflow-hidden flex flex-col justify-between group"
                style={{ '--reveal-delay': `${(idx % 2) * 80}ms` } as React.CSSProperties}
              >
                <div>
                  {/* Hardware stage */}
                  <button
                    type="button"
                    onClick={(e) => openSpecs(product.id, e.currentTarget)}
                    aria-label={`Inspect ${product.name} photos and full specifications`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#ece8df] p-0 border-0 cursor-pointer block text-left active:scale-[0.985] transition-transform duration-100 ease-out"
                  >
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#0f1a2b]/10"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1220]/70 via-[#0a1220]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-4"
                    >
                      <span className="text-[13px] font-semibold text-white tracking-tight">
                        View specs
                      </span>
                    </div>
                  </button>

                  {/* Model info & full capabilities */}
                  <div className="p-3.5 min-[820px]:p-5 flex flex-col gap-2.5 min-[820px]:gap-3">
                    <div>
                      <span className="block text-[11px] min-[820px]:text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a8650a]">
                        {product.category}
                      </span>
                      <h3 className="text-[15px] min-[820px]:text-[19px] font-semibold text-[#0f1a2b] leading-snug tracking-[-0.02em] mt-1 mb-0">
                        {product.name}
                      </h3>
                      <p className="text-[12.5px] min-[820px]:text-[14px] text-[#5a6678] mt-1.5 mb-0 leading-relaxed line-clamp-3 min-[820px]:line-clamp-none">
                        {product.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 min-[820px]:gap-1.5 pt-0.5 min-[820px]:pt-1">
                      {product.features.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-2 py-0.5 min-[820px]:px-2.5 min-[820px]:py-1 rounded-[7px] min-[820px]:rounded-[8px] bg-[#f6f4ef] text-[#0f1a2b] text-[11px] min-[820px]:text-[12px] font-medium border border-[#0f1a2b]/8"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="px-3.5 pb-3.5 pt-3 min-[820px]:px-5 min-[820px]:pb-5 min-[820px]:pt-3.5 border-t border-[var(--line-paper)] flex flex-wrap items-center justify-between gap-2 min-[820px]:gap-3">
                  <a
                    {...getWhatsAppLinkProps(
                      `Hello OG Smarthomes, I would like to buy the ${product.name}.`
                    )}
                    className="inline-flex items-center gap-1 min-[820px]:gap-1.5 min-h-[40px] min-[820px]:min-h-[44px] -my-2 text-[13px] min-[820px]:text-[14px] font-semibold text-[#a8650a] hover:text-[#0f1a2b] no-underline transition-colors active:scale-[0.97] whitespace-nowrap"
                  >
                    <span>Buy now</span>
                    <ArrowRightIcon size={14} />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => openSpecs(product.id, e.currentTarget)}
                    className="inline-flex items-center min-h-[40px] min-[820px]:min-h-[44px] -my-2 text-[13px] min-[820px]:text-[14px] font-medium text-[#5a6678] hover:text-[#0f1a2b] bg-transparent border-0 p-0 cursor-pointer transition-colors active:scale-[0.97] whitespace-nowrap"
                  >
                    Full specs
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Apple-design translucent specification sheet */}
        <AnimatePresence>
          {activeProduct && (
            <motion.div
              key="product-spec-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-spec-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setActiveProductId(null);
              }}
              className="fixed inset-0 z-[110] bg-[#0a1220]/75 backdrop-blur-md flex items-center justify-center p-4 min-[820px]:p-6"
            >
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 12 }}
                transition={SHEET_SPRING}
                className="product-sheet-chrome relative w-full max-w-[920px] max-h-[90svh] overflow-y-auto rounded-[24px] text-white shadow-2xl grid grid-cols-1 min-[820px]:grid-cols-[1fr_1.15fr]"
              >
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setActiveProductId(null)}
                  aria-label="Close product specifications"
                  className="absolute top-3.5 right-3.5 z-20 w-[44px] h-[44px] rounded-full bg-[#0a1220]/75 text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] active:scale-95 transition-all"
                >
                  <CloseIcon size={20} />
                </button>

                {/* Hardware photo stage */}
                <div className="relative aspect-[4/5] min-[820px]:aspect-auto min-[820px]:min-h-[480px] bg-[#070d18] overflow-hidden">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.alt}
                    className="w-full h-full object-cover object-center"
                  />

                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous smart lock"
                      onClick={() => {
                        const prev = (activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
                        setActiveProductId(PRODUCTS[prev].id);
                      }}
                      className="w-[44px] h-[44px] rounded-full bg-[#0a1220]/80 text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] active:scale-95 transition-all"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next smart lock"
                      onClick={() => {
                        const next = (activeIndex + 1) % PRODUCTS.length;
                        setActiveProductId(PRODUCTS[next].id);
                      }}
                      className="w-[44px] h-[44px] rounded-full bg-[#0a1220]/80 text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] active:scale-95 transition-all"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                    <span className="px-2.5 py-1 rounded-md bg-[#0a1220]/75 text-[12px] font-semibold text-white/90 tabular-nums">
                      {activeIndex + 1} / {PRODUCTS.length}
                    </span>
                  </div>
                </div>

                {/* Full specification list */}
                <div className="p-6 min-[820px]:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold mb-2 pr-12">
                      <span className="text-[#ffc46b]">{activeProduct.category}</span>
                      <span aria-hidden="true" className="text-white/35">
                        ·
                      </span>
                      <span className="text-[#d3dcea] font-medium tabular-nums">
                        {activeProduct.features.length} features
                      </span>
                    </div>

                    <h3
                      id="product-spec-title"
                      className="text-[22px] min-[820px]:text-[26px] font-semibold text-white leading-tight tracking-[-0.02em] m-0"
                    >
                      {activeProduct.name}
                    </h3>

                    <p className="text-[15px] text-[#d3dcea] mt-2.5 mb-0 leading-relaxed">
                      {activeProduct.summary}
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/14">
                      <div className="text-[13px] font-semibold text-[#d3dcea] mb-3">
                        Included features
                      </div>
                      <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                        {activeProduct.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-[14px] text-white leading-snug"
                          >
                            <span
                              aria-hidden="true"
                              className="shrink-0 w-5 h-5 rounded-full bg-[#ffc46b]/[0.16] text-[#ffc46b] flex items-center justify-center mt-0.5"
                            >
                              <CheckIcon size={12} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      {...getWhatsAppLinkProps(
                        `Hello OG Smarthomes, I would like to buy the ${activeProduct.name}.`
                      )}
                      className="btn-primary w-full !h-[52px] active:scale-[0.985]"
                    >
                      Buy {activeProduct.shortName} now
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
};
