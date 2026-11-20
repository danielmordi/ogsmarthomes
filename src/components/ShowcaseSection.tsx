import React, { useEffect, useRef, useState } from 'react';
import {
  SHOWCASE_CATEGORIES,
  SHOWCASE_ITEMS,
  type ShowcaseCategory,
  type ShowcaseItem,
} from '../data/siteData';
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ProductIcon,
} from './Icons';

interface ShowcaseSectionProps {
  onRequestSetup: (chips: string[], note: string) => void;
}

const ShowcaseImage: React.FC<{
  item: ShowcaseItem;
  className?: string;
}> = ({ item, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const iconId =
      item.category === 'locks' ? 'locks' : item.category === 'cctv' ? 'cctv' : 'switches';
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#101c33] to-[#0a1220] text-white ${className}`}
      >
        <span className="w-11 h-11 rounded-[12px] bg-[#ffc46b]/[0.14] text-[#ffc46b] flex items-center justify-center mb-3">
          <ProductIcon id={iconId} />
        </span>
        <span className="text-[15px] font-semibold text-white">{item.title}</span>
        <span className="text-[13px] text-[#b9c4d6] mt-1">{item.setting}</span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={item.alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ onRequestSetup }) => {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory>('all');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const filteredItems =
    activeCategory === 'all'
      ? SHOWCASE_ITEMS
      : SHOWCASE_ITEMS.filter((item) => item.category === activeCategory);

  const activeModalIndex = activeModalId
    ? filteredItems.findIndex((item) => item.id === activeModalId)
    : -1;
  const activeModalItem = activeModalIndex >= 0 ? filteredItems[activeModalIndex] : null;

  // Manage modal keyboard navigation, scroll lock, and focus restoration
  useEffect(() => {
    if (!activeModalItem) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveModalId(null);
      } else if (e.key === 'ArrowRight' && filteredItems.length > 1) {
        e.preventDefault();
        const nextIdx = (activeModalIndex + 1) % filteredItems.length;
        setActiveModalId(filteredItems[nextIdx].id);
      } else if (e.key === 'ArrowLeft' && filteredItems.length > 1) {
        e.preventDefault();
        const prevIdx = (activeModalIndex - 1 + filteredItems.length) % filteredItems.length;
        setActiveModalId(filteredItems[prevIdx].id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [activeModalItem, activeModalIndex, filteredItems]);

  const openModal = (itemId: string, triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setActiveModalId(itemId);
  };

  const handleRequestItem = (item: ShowcaseItem) => {
    setActiveModalId(null);
    onRequestSetup(
      item.surveyChips,
      `Interested in a setup similar to: ${item.title} (${item.categoryLabel}).`
    );
  };

  const getCategoryCount = (category: ShowcaseCategory) =>
    category === 'all'
      ? SHOWCASE_ITEMS.length
      : SHOWCASE_ITEMS.filter((item) => item.category === category).length;

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="surface-paper site-section border-t border-[var(--line-paper)]"
    >
      <div className="site-container">
        {/* Header row with category filter controls */}
        <div className="flex flex-col min-[820px]:flex-row min-[820px]:items-end justify-between gap-6 min-[820px]:gap-10">
          <div className="reveal">
            <span className="section-label">Showcase</span>
            <h2 id="showcase-heading" className="section-headline max-w-[600px]">
              Installed to look like it belongs.
            </h2>
            <p className="section-intro max-w-[540px]">
              Browse finished smart locks, CCTV setups and lighting scenes across real entrances,
              living rooms and compounds.
            </p>
          </div>

          {/* Interactive segmented category filters */}
          <div
            role="group"
            aria-label="Filter installations by category"
            className="reveal self-start min-[820px]:self-end max-w-full overflow-x-auto pb-0.5"
          >
            <div className="inline-flex items-center gap-1 p-1 rounded-[14px] bg-[#0f1a2b]/[0.06] border border-[var(--line-paper)]">
              {SHOWCASE_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = getCategoryCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 min-[820px]:px-4 rounded-[10px] text-[14px] font-semibold whitespace-nowrap shrink-0 border-0 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#0a1220] text-white shadow-xs'
                        : 'bg-transparent text-[#0f1a2b]/75 hover:text-[#0f1a2b] hover:bg-white/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[12px] font-semibold tabular-nums ${
                        isActive ? 'text-[#ffc46b]' : 'text-[#5a6678]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtered installation gallery */}
        <div
          key={activeCategory}
          aria-live="polite"
          className={`tab-panel-fade mt-10 min-[820px]:mt-12 grid grid-cols-1 sm:grid-cols-2 ${
            filteredItems.length >= 3 ? 'min-[820px]:grid-cols-3' : 'min-[820px]:grid-cols-2'
          } gap-5 min-[820px]:gap-7`}
        >
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="card-paper card-lift overflow-hidden flex flex-col group"
            >
              {/* Photo preview trigger */}
              <button
                type="button"
                onClick={(e) => openModal(item.id, e.currentTarget)}
                aria-label={`View full photo and details for ${item.title}`}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a1220] p-0 border-0 cursor-pointer block text-left"
              >
                <ShowcaseImage
                  item={item}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1220]/70 via-[#0a1220]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-4"
                >
                  <span className="text-[13px] font-semibold text-white tracking-tight">
                    Inspect installation
                  </span>
                </div>
              </button>

              {/* Installation details */}
              <div className="p-5 min-[820px]:p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-[13px] font-semibold mb-2">
                    <span className="text-[#a8650a]">{item.categoryLabel}</span>
                    <span aria-hidden="true" className="text-[#5a6678]/60">
                      ·
                    </span>
                    <span className="text-[#5a6678] font-medium">{item.setting}</span>
                  </div>

                  <h3 className="text-[19px] font-semibold text-[#0f1a2b] leading-snug m-0">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#5a6678] mt-2 mb-0 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Card actions */}
                <div className="pt-3.5 border-t border-[var(--line-paper)] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleRequestItem(item)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] -my-2 text-[14px] font-semibold text-[#a8650a] hover:text-[#0f1a2b] bg-transparent border-0 p-0 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <span>Request this setup</span>
                    <ArrowRightIcon size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => openModal(item.id, e.currentTarget)}
                    className="inline-flex items-center min-h-[44px] -my-2 text-[14px] font-medium text-[#5a6678] hover:text-[#0f1a2b] bg-transparent border-0 p-0 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Accessible installation detail & lightbox modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="showcase-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalId(null);
          }}
          className="fixed inset-0 z-[110] bg-[#0a1220]/82 backdrop-blur-md flex items-center justify-center p-4 min-[820px]:p-6"
        >
          <div className="relative w-full max-w-[920px] max-h-[90svh] overflow-y-auto rounded-[20px] bg-[#101c33] border border-white/14 text-white shadow-2xl grid grid-cols-1 min-[820px]:grid-cols-[1.25fr_1fr]">
            {/* Close button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setActiveModalId(null)}
              aria-label="Close installation preview"
              className="absolute top-3.5 right-3.5 z-20 w-[44px] h-[44px] rounded-full bg-[#0a1220]/80 text-white border border-white/18 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] transition-colors"
            >
              <CloseIcon size={20} />
            </button>

            {/* Full installation photo */}
            <div className="relative aspect-[4/3] min-[820px]:aspect-auto min-[820px]:min-h-[420px] bg-[#0a1220] overflow-hidden">
              <ShowcaseImage
                item={activeModalItem}
                className="w-full h-full object-cover"
              />

              {filteredItems.length > 1 && (
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous installation"
                    onClick={() => {
                      const prevIdx =
                        (activeModalIndex - 1 + filteredItems.length) % filteredItems.length;
                      setActiveModalId(filteredItems[prevIdx].id);
                    }}
                    className="w-[44px] h-[44px] rounded-full bg-[#0a1220]/80 text-white border border-white/18 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] transition-colors"
                  >
                    <ChevronLeftIcon size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next installation"
                    onClick={() => {
                      const nextIdx = (activeModalIndex + 1) % filteredItems.length;
                      setActiveModalId(filteredItems[nextIdx].id);
                    }}
                    className="w-[44px] h-[44px] rounded-full bg-[#0a1220]/80 text-white border border-white/18 flex items-center justify-center cursor-pointer hover:bg-[#0a1220] transition-colors"
                  >
                    <ChevronRightIcon size={18} />
                  </button>
                  <span className="px-2.5 py-1 rounded-md bg-[#0a1220]/75 text-[12px] font-semibold text-white/90 tabular-nums">
                    {activeModalIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              )}
            </div>

            {/* Specification panel */}
            <div className="p-5 min-[820px]:p-7 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[13px] font-semibold mb-2.5 pr-12">
                  <span className="text-[#ffc46b]">{activeModalItem.categoryLabel}</span>
                  <span aria-hidden="true" className="text-white/35">
                    ·
                  </span>
                  <span className="text-[#b9c4d6] font-medium">{activeModalItem.setting}</span>
                </div>

                <h3
                  id="showcase-modal-title"
                  className="text-[22px] min-[820px]:text-[24px] font-semibold text-white leading-snug m-0"
                >
                  {activeModalItem.title}
                </h3>

                <p className="text-[15px] text-[#b9c4d6] mt-3 mb-0 leading-relaxed">
                  {activeModalItem.summary}
                </p>

                <div className="mt-6 pt-5 border-t border-white/14">
                  <div className="text-[13px] font-semibold text-[#b9c4d6] mb-3">
                    What is included in this setup
                  </div>
                  <ul className="list-none m-0 p-0 space-y-2.5">
                    {activeModalItem.installedSpecs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-start gap-2.5 text-[14px] text-white leading-snug"
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 w-5 h-5 rounded-full bg-[#ffc46b]/[0.16] text-[#ffc46b] flex items-center justify-center mt-0.5"
                        >
                          <CheckIcon size={12} />
                        </span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleRequestItem(activeModalItem)}
                  className="btn-primary w-full !h-[52px]"
                >
                  Book survey for this setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
