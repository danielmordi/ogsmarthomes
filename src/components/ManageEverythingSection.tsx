import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ManageEverythingSectionProps {
  onProceedToSurvey: (chips: string[], note: string) => void;
}

interface AutomationCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  surveyChip: string;
}

const AUTOMATION_CATEGORIES: AutomationCategory[] = [
  {
    id: 'smart-cinema',
    title: 'Smart Cinema',
    description:
      'Automate your media room for effortless movie nights — dimmed cove lighting, closed curtains, and sound in one tap.',
    image: '/src/assets/images/smart/smart-cinema.jpg',
    alt: 'Private home cinema room with automated starlight ceiling, wall lighting, and plush theater seating.',
    surveyChip: 'Whole home',
  },
  {
    id: 'smart-lighting',
    title: 'Smart Lighting',
    description:
      'Control indoor and outdoor switches from anywhere. Turn lights on selectively, dim zones, or trigger whole-house scenes.',
    image: '/src/assets/images/smart/smart-lighting.jpg',
    alt: 'Smart glass wall touch panels and central lighting control switches.',
    surveyChip: 'Smart switches and lighting',
  },
  {
    id: 'smart-appliances',
    title: 'Smart Appliances',
    description:
      'Monitor and schedule sockets and heavy appliances remotely so nothing stays powered on unnecessarily.',
    image: '/src/assets/images/smart/smart-appliances.jpg',
    alt: 'Smart home appliance and socket automation controller.',
    surveyChip: 'Smart switches and lighting',
  },
  {
    id: 'smart-locks',
    title: 'Smart Locks',
    description:
      'Keep every entrance secure with biometric, Face ID, PIN, and remote mobile unlock — know who arrives from anywhere.',
    image: '/src/assets/images/smart/smart-lock-catalogue.jpeg',
    alt: 'Sleek biometric and Face ID smart door locks with backlit keypads.',
    surveyChip: 'Smart door locks',
  },
  {
    id: 'smart-security',
    title: 'Smart Security',
    description:
      'High-definition 24/7 CCTV cameras with wide perimeter coverage, night vision, and instant motion alerts on your phone.',
    image: '/src/assets/images/smart/smart-security.jpg',
    alt: 'Compact high-definition smart security camera for indoor and perimeter monitoring.',
    surveyChip: 'CCTV',
  },
  {
    id: 'premium-audio',
    title: 'Premium Audio',
    description:
      'Fill one room or your entire home with synchronized ceiling speakers controlled effortlessly from a single app.',
    image: '/src/assets/images/smart/premuim-audio.jpg',
    alt: 'High-fidelity multi-room smart audio speaker system.',
    surveyChip: 'Whole home',
  },
  {
    id: 'smart-inverters',
    title: 'Smart Inverters',
    description:
      'Monitor solar and inverter power consumption in real time for smarter load management and uninterrupted supply.',
    image: '/src/assets/images/smart/smart-inverter.jpg',
    alt: 'Solar panels at sunset powering a smart inverter energy management system.',
    surveyChip: 'Solar and inverter',
  },
  {
    id: 'smart-blinds',
    title: 'Smart Blinds & Curtains',
    description:
      'Motorized curtains and blinds designed to blend into your interior while opening and closing on your daily schedule.',
    image: '/src/assets/images/smart/smart-blinds.jpg',
    alt: 'Modern living room with automated sheer and blackout smart curtains.',
    surveyChip: 'Whole home',
  },
  {
    id: 'smart-mirrors',
    title: 'Smart Mirrors',
    description:
      'Elevate dressing rooms and bathrooms with sleek backlit smart displays for daily schedules, weather, and ambiance.',
    image: '/src/assets/images/smart/smart-mirror.jpg',
    alt: 'Backlit smart mirror displaying time, weather, and daily schedule.',
    surveyChip: 'Whole home',
  },
];

const CARDS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(AUTOMATION_CATEGORIES.length / CARDS_PER_PAGE);
const TOTAL_CARDS = AUTOMATION_CATEGORIES.length;
const SLIDE_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.4 };

const AutomationCard: React.FC<{
  item: AutomationCategory;
  onBook: (item: AutomationCategory) => void;
}> = ({ item, onBook }) => (
  <article className="group rounded-[22px] bg-[#101c33]/85 border border-white/12 overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-white/25">
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070d18]">
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1220]/45 via-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        />
      </div>

      <div className="p-5 min-[820px]:p-6 pb-4">
        <h3 className="text-[20px] font-semibold text-white tracking-[-0.015em] leading-snug m-0">
          {item.title}
        </h3>
        <p className="text-[14.5px] text-[#b9c4d6] mt-2 mb-0 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>

    <div className="px-5 min-[820px]:px-6 pb-5 min-[820px]:pb-6 pt-3 border-t border-white/[0.08] flex items-center justify-between">
      <button
        type="button"
        onClick={() => onBook(item)}
        className="inline-flex items-center gap-1.5 min-h-[44px] -my-2 text-[14px] font-semibold text-[#ffc46b] hover:text-white bg-transparent border-0 p-0 cursor-pointer transition-colors active:scale-[0.97]"
      >
        <span>Book survey</span>
        <ArrowRightIcon size={15} />
      </button>
    </div>
  </article>
);

export const ManageEverythingSection: React.FC<ManageEverythingSectionProps> = ({
  onProceedToSurvey,
}) => {
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Desktop 3-up carousel state
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Mobile 1-card-at-a-time scroll-driven state
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState<1 | -1>(1);
  const mobileIndexRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: mobileTrackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion) return;
    const clamped = Math.max(0, Math.min(0.9999, latest));
    const nextIdx = Math.floor(clamped * TOTAL_CARDS);
    if (nextIdx !== mobileIndexRef.current) {
      setMobileDirection(nextIdx > mobileIndexRef.current ? 1 : -1);
      mobileIndexRef.current = nextIdx;
      setMobileIndex(nextIdx);
    }
  });

  const handleBookItem = (item: AutomationCategory) => {
    onProceedToSurvey([item.surveyChip], `Interested in ${item.title}.`);
    document.getElementById('survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Desktop handlers
  const goToPage = (nextPage: number) => {
    const normalized = ((nextPage % TOTAL_PAGES) + TOTAL_PAGES) % TOTAL_PAGES;
    if (normalized === pageIndex) return;
    setDirection(normalized > pageIndex ? 1 : -1);
    setPageIndex(normalized);
  };

  const handleDesktopPrev = () => {
    setDirection(-1);
    setPageIndex((p) => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const handleDesktopNext = () => {
    setDirection(1);
    setPageIndex((p) => (p + 1) % TOTAL_PAGES);
  };

  // Mobile manual handlers
  const stepMobile = (delta: 1 | -1) => {
    const nextIdx = (mobileIndex + delta + TOTAL_CARDS) % TOTAL_CARDS;
    setMobileDirection(delta);
    mobileIndexRef.current = nextIdx;
    setMobileIndex(nextIdx);
  };

  const goToMobileCard = (nextIdx: number) => {
    if (nextIdx === mobileIndex) return;
    setMobileDirection(nextIdx > mobileIndex ? 1 : -1);
    mobileIndexRef.current = nextIdx;
    setMobileIndex(nextIdx);
  };

  const visibleDesktopItems = AUTOMATION_CATEGORIES.slice(
    pageIndex * CARDS_PER_PAGE,
    pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const activeMobileItem = AUTOMATION_CATEGORIES[mobileIndex];

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="rooms"
        aria-labelledby="manage-everything-heading"
        className="surface-navy relative overflow-x-clip border-y border-white/[0.08]"
      >
        {/* =======================================================
            MOBILE: Single-card sticky scroll-driven stage (< 820px)
            ======================================================= */}
        <div
          ref={mobileTrackRef}
          className={`min-[820px]:hidden relative ${
            prefersReducedMotion ? 'py-[72px]' : 'h-[360svh]'
          }`}
        >
          <div
            className={`${
              prefersReducedMotion
                ? ''
                : 'sticky top-[68px] pt-8 pb-8 min-h-[calc(100svh-68px)] flex flex-col justify-center'
            }`}
          >
            <div className="site-container">
              {/* Mobile Header */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="section-label">Control &amp; automation</span>
                  <h2 id="manage-everything-heading" className="section-headline">
                    Manage everything.
                  </h2>
                </div>
                <span className="text-[13px] font-semibold text-[#ffc46b] tabular-nums shrink-0 pb-1">
                  {mobileIndex + 1} / {TOTAL_CARDS}
                </span>
              </div>

              <p className="text-[15px] text-[#b9c4d6] mt-2.5 mb-0 leading-relaxed">
                Scroll to explore every smart system you can control from one app.
              </p>

              {/* Continuous scroll progress hairline */}
              {!prefersReducedMotion && (
                <div
                  aria-hidden="true"
                  className="mt-4 h-[2px] w-full rounded-full bg-white/10 overflow-hidden"
                >
                  <motion.div
                    className="h-full w-full origin-left bg-[#ffc46b]"
                    style={{ scaleX: scrollYProgress }}
                  />
                </div>
              )}

              {/* Single-card spring stage */}
              <div className="mt-5 relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeMobileItem.id}
                    initial={{
                      opacity: 0,
                      y: mobileDirection * 22,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: mobileDirection * -22,
                      scale: 0.97,
                    }}
                    transition={SLIDE_SPRING}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -45 || info.velocity.x < -280) {
                        stepMobile(1);
                      } else if (info.offset.x > 45 || info.velocity.x > 280) {
                        stepMobile(-1);
                      }
                    }}
                  >
                    <AutomationCard item={activeMobileItem} onBook={handleBookItem} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile controls & pagination dots */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Smart home categories">
                  {AUTOMATION_CATEGORIES.map((cat, idx) => {
                    const isActive = idx === mobileIndex;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={cat.title}
                        onClick={() => goToMobileCard(idx)}
                        className="min-w-[20px] min-h-[32px] flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer active:scale-90 transition-transform"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-300 ${
                            isActive ? 'w-5 bg-[#ffc46b]' : 'w-1.5 bg-white/30'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => stepMobile(-1)}
                    aria-label="Previous category"
                    className="w-[40px] h-[40px] rounded-full bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  >
                    <ChevronLeftIcon size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepMobile(1)}
                    aria-label="Next category"
                    className="w-[40px] h-[40px] rounded-full bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  >
                    <ChevronRightIcon size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            DESKTOP: 3-card spring carousel (>= 820px)
            ======================================================= */}
        <div className="hidden min-[820px]:block site-section">
          <div className="site-container">
            <div className="flex items-end justify-between gap-6">
              <div className="reveal max-w-[640px]">
                <span className="section-label">Control &amp; automation</span>
                <h2 className="section-headline">Manage everything.</h2>
                <p className="section-intro">
                  Our smart home architecture lets you monitor and control your lighting, locks,
                  audio, climate, and appliances from anywhere in the world.
                </p>
              </div>

              <div className="reveal flex items-center gap-3 self-end">
                <span className="text-[13px] font-semibold text-[#b9c4d6] tabular-nums mr-1">
                  {pageIndex + 1} / {TOTAL_PAGES}
                </span>
                <button
                  type="button"
                  onClick={handleDesktopPrev}
                  aria-label="Previous smart home categories"
                  className="w-[44px] h-[44px] rounded-full bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleDesktopNext}
                  aria-label="Next smart home categories"
                  className="w-[44px] h-[44px] rounded-full bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            </div>

            <div
              className="mt-14 relative"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  handleDesktopPrev();
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  handleDesktopNext();
                }
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pageIndex}
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -28 }}
                  transition={SLIDE_SPRING}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50 || info.velocity.x < -300) {
                      handleDesktopNext();
                    } else if (info.offset.x > 50 || info.velocity.x > 300) {
                      handleDesktopPrev();
                    }
                  }}
                  className="grid grid-cols-3 gap-7 cursor-grab active:cursor-grabbing"
                >
                  {visibleDesktopItems.map((item) => (
                    <AutomationCard key={item.id} item={item} onBook={handleBookItem} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="mt-8 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Automation category pages"
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, idx) => {
                const isActive = idx === pageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show categories ${idx * CARDS_PER_PAGE + 1} to ${Math.min(
                      (idx + 1) * CARDS_PER_PAGE,
                      TOTAL_CARDS
                    )}`}
                    onClick={() => goToPage(idx)}
                    className="min-w-[28px] min-h-[28px] flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer active:scale-90 transition-transform"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-300 ${
                        isActive ? 'w-7 bg-[#ffc46b]' : 'w-2 bg-white/30 hover:bg-white/55'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};
