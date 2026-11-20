import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TRUST_TESTIMONIALS } from '../data/siteData';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from './Icons';

const AUTOPLAY_INTERVAL_MS = 4500;

/** Picks a random index different from the current one, avoiding recent repeats until the bag empties */
function pickNextRandomIndex(current: number, total: number, bag: number[]): number {
  if (total <= 1) return 0;
  if (bag.length === 0) {
    for (let i = 0; i < total; i += 1) {
      if (i !== current) bag.push(i);
    }
    // Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  const next = bag.pop();
  return next !== undefined ? next : (current + 1) % total;
}

export const TrustTestimonialCarousel: React.FC = () => {
  const total = TRUST_TESTIMONIALS.length;
  const shuffleBagRef = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.floor(Math.random() * total)
  );
  const [history, setHistory] = useState<number[]>([]);
  const [isPlaying] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : true
  );
  const [isPausedByInteraction, setIsPausedByInteraction] = useState<boolean>(false);
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

  const goRandomNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = pickNextRandomIndex(prev, total, shuffleBagRef.current);
      setHistory((h) => [...h.slice(-19), prev]);
      return next;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const last = prevHistory[prevHistory.length - 1];
        setActiveIndex(last);
        return prevHistory.slice(0, -1);
      }
      setActiveIndex((curr) => (curr - 1 + total) % total);
      return prevHistory;
    });
  }, [total]);

  // Auto-play randomly when playing and not hovered/focused
  useEffect(() => {
    if (!isPlaying || isPausedByInteraction) return;
    const timer = window.setInterval(goRandomNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, isPausedByInteraction, goRandomNext]);

  // Show 3 cards on desktop (filling the 3-column strip cleanly) and 1 card on mobile
  const visibleCount = isDesktop ? 3 : 1;
  const visibleItems = Array.from({ length: visibleCount }, (_, offset) => {
    const idx = (activeIndex + offset) % total;
    return { item: TRUST_TESTIMONIALS[idx], index: idx };
  });

  const displayNumber = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  return (
    <div
      className="pt-8 min-[820px]:pt-10"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => setIsPausedByInteraction(true)}
      onMouseLeave={() => setIsPausedByInteraction(false)}
      onFocus={() => setIsPausedByInteraction(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPausedByInteraction(false);
        }
      }}
    >
      {/* Carousel header & controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 text-[#a8650a]" aria-label="5 out of 5 stars">
            {[0, 1, 2, 3, 4].map((s) => (
              <StarIcon key={s} size={15} />
            ))}
          </div>
          <span className="text-[14px] font-semibold text-[#0f1a2b]">
            Verified homeowner reviews
          </span>
          <span aria-hidden="true" className="text-[#5a6678]/50">
            ·
          </span>
          <span className="text-[13px] font-semibold text-[#5a6678] tabular-nums">
            {displayNumber} / {totalLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="w-[40px] h-[40px] rounded-full bg-white border border-[var(--line-paper)] text-[#0f1a2b] hover:border-[#0f1a2b]/30 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeftIcon size={17} />
          </button>

          <button
            type="button"
            onClick={goRandomNext}
            aria-label="Next random testimonial"
            className="w-[40px] h-[40px] rounded-full bg-white border border-[var(--line-paper)] text-[#0f1a2b] hover:border-[#0f1a2b]/30 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRightIcon size={17} />
          </button>
        </div>
      </div>

      {/* Cards stage (1 card on mobile, 3 cards on desktop) */}
      <div
        key={activeIndex}
        aria-live={isPlaying ? 'off' : 'polite'}
        className="tab-panel-fade grid grid-cols-1 min-[820px]:grid-cols-3 gap-4 min-[820px]:gap-5"
      >
        {visibleItems.map(({ item }) => (
          <blockquote
            key={item.id}
            className="card-paper m-0 p-5 min-[820px]:p-6 flex flex-col justify-between gap-4"
          >
            <div>
              <div
                className="flex items-center gap-0.5 text-[#a8650a] mb-3"
                aria-label="5 out of 5 stars"
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <StarIcon key={s} size={14} />
                ))}
              </div>
              <p className="text-[15px] text-[#0f1a2b] leading-relaxed m-0">“{item.quote}”</p>
            </div>

            <footer className="pt-3.5 border-t border-[var(--line-paper)]">
              <div className="text-[14px] font-semibold text-[#0f1a2b] leading-snug">
                {item.name}
              </div>
              <div className="text-[13px] text-[#5a6678] mt-0.5 leading-snug">
                <span>{item.area}</span>
                <span aria-hidden="true"> · </span>
                <span className="text-[#a8650a] font-medium">{item.setup}</span>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>

      {/* Interactive 20-dot selector bar */}
      <div
        className="flex items-center justify-center flex-wrap gap-1.5 mt-5"
        role="tablist"
        aria-label="Select testimonial"
      >
        {TRUST_TESTIMONIALS.map((t, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`View review ${idx + 1} by ${t.name}`}
              onClick={() => {
                setHistory((h) => [...h.slice(-19), activeIndex]);
                setActiveIndex(idx);
              }}
              className="p-1.5 -m-0.5 bg-transparent border-0 cursor-pointer flex items-center justify-center"
            >
              <span
                className="block rounded-full transition-all duration-200"
                style={{
                  width: isCurrent ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: isCurrent ? '#a8650a' : 'rgba(15, 26, 43, 0.22)',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
