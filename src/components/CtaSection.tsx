import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CtaSectionProps {
  id?: string;
  badgeText?: string;
  headline?: string;
  subtext?: string;
  buttonLabel?: string;
  href?: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RING_SPRING = { stiffness: 90, damping: 24, mass: 0.6 };

const BUTTON_GLOW_LOW =
  '0 12px 30px -4px rgba(255, 196, 107, 0.25), 0 0 22px rgba(255, 196, 107, 0.14), inset 0 1px 0 rgba(255, 248, 232, 0.72), inset 0 0 0 1px rgba(255, 234, 194, 0.52)';
const BUTTON_GLOW_HIGH =
  '0 16px 40px -2px rgba(255, 196, 107, 0.45), 0 0 34px rgba(255, 196, 107, 0.28), inset 0 1px 0 rgba(255, 248, 232, 0.72), inset 0 0 0 1px rgba(255, 234, 194, 0.52)';
const BUTTON_GLOW_HOVER =
  '0 18px 46px -2px rgba(255, 196, 107, 0.56), 0 0 42px rgba(255, 196, 107, 0.36), inset 0 1px 0 rgba(255, 250, 240, 0.85), inset 0 0 0 1px rgba(255, 240, 208, 0.68)';

function splitHeadlineIntoLines(headline: string): string[] {
  if (headline.includes('\n')) {
    return headline
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
  const words = headline.trim().split(/\s+/);
  if (words.length <= 2) return [headline.trim()];
  return [words.slice(0, 2).join(' '), words.slice(2).join(' ')];
}

const AmberDonutRing: React.FC<{ variant: 'left' | 'right' }> = ({ variant }) => {
  const gradId = `cta-amber-ring-grad-${variant}`;
  const innerFadeId = `cta-amber-ring-fade-${variant}`;

  return (
    <div className="relative w-full h-full">
      {/* Static blurred glow aura behind the ring */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="absolute inset-0 w-full h-full blur-3xl opacity-50 scale-105"
        aria-hidden="true"
      >
        <circle
          cx="200"
          cy="200"
          r="142"
          stroke="#ffc46b"
          strokeWidth="56"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Secondary soft mid-glow */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="absolute inset-0 w-full h-full blur-xl opacity-55"
        aria-hidden="true"
      >
        <circle
          cx="200"
          cy="200"
          r="142"
          stroke={`url(#${gradId})`}
          strokeWidth="46"
        />
      </svg>

      {/* Main luminous amber donut ring with soft inner edge */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="relative w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1={variant === 'left' ? '340' : '40'}
            y1={variant === 'left' ? '340' : '60'}
            x2={variant === 'left' ? '60' : '360'}
            y2={variant === 'left' ? '60' : '340'}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffe6ba" stopOpacity="0.96" />
            <stop offset="38%" stopColor="#ffc46b" stopOpacity="0.88" />
            <stop offset="72%" stopColor="#e89a2c" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#ffc46b" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient
            id={innerFadeId}
            cx="200"
            cy="200"
            r="172"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="58%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="72%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="86%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="96%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <mask id={`cta-ring-mask-${variant}`}>
            <rect width="400" height="400" fill={`url(#${innerFadeId})`} />
          </mask>
        </defs>

        <g mask={`url(#cta-ring-mask-${variant})`}>
          <circle
            cx="200"
            cy="200"
            r="142"
            stroke={`url(#${gradId})`}
            strokeWidth="48"
          />
          <circle
            cx="200"
            cy="200"
            r="160"
            stroke="#fff1d6"
            strokeOpacity="0.32"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

export const CtaSection: React.FC<CtaSectionProps> = ({
  id = 'testimonials',
  badgeText = 'Free site survey',
  headline = 'Book your\nfree home survey',
  subtext = 'We visit your home, plan every room with you, and send a clear itemised quote with zero obligation.',
  buttonLabel = 'Book a free survey',
  href = '#survey',
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Scroll-linked parallax for the two decorative rings
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const leftParallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rightParallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // Subtle desktop pointer parallax (max ~10px)
  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const smoothPointerX = useSpring(rawPointerX, RING_SPRING);
  const smoothPointerY = useSpring(rawPointerY, RING_SPRING);
  const leftPointerX = useTransform(smoothPointerX, (v) => v * 10);
  const leftPointerY = useTransform(smoothPointerY, (v) => v * 8);
  const rightPointerX = useTransform(smoothPointerX, (v) => v * -10);
  const rightPointerY = useTransform(smoothPointerY, (v) => v * -8);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    rawPointerX.set(nx);
    rawPointerY.set(ny);
  };

  const handlePointerLeave = () => {
    rawPointerX.set(0);
    rawPointerY.set(0);
  };

  const lines = splitHeadlineIntoLines(headline);

  // Parent container stagger
  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: prefersReducedMotion
        ? { staggerChildren: 0.04 }
        : { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  // Badge entrance
  const badgeVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 16, scale: 0.95 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: EASE_OUT_EXPO },
        },
      };

  // Subtext entrance
  const subtextVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      };

  // Button entrance wrapper
  const buttonWrapperVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.35 } },
      }
    : {
        hidden: { opacity: 0, y: 20, scale: 0.96 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      };

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby="cta-heading"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="surface-navy relative overflow-hidden py-24 md:py-32"
    >
      {/* Subtle radial amber haze behind headline (<10% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <div
          className="h-[340px] w-[520px] md:h-[440px] md:w-[760px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 196, 107, 0.085) 0%, rgba(255, 196, 107, 0.03) 45%, rgba(10, 18, 32, 0) 72%)',
          }}
        />
      </div>

      {/* Decorative top-left glowing amber ring */}
      <motion.div
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? undefined
            : { y: leftParallaxY, x: leftPointerX }
        }
        className="pointer-events-none absolute z-0 -top-32 -left-32 h-[228px] w-[228px] sm:-top-28 sm:-left-28 sm:h-[260px] sm:w-[260px] md:-top-36 md:-left-32 md:h-[380px] md:w-[380px] lg:-top-32 lg:-left-24 lg:h-[400px] lg:w-[400px]"
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { y: leftPointerY }}
          className="w-full h-full"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: prefersReducedMotion ? 0.4 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: EASE_OUT_EXPO,
            }}
            className="w-full h-full"
          >
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [-16, 16], rotate: [-6, 6] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 8.5,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }
              }
              className="w-full h-full will-change-transform"
            >
              <AmberDonutRing variant="left" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative mid/lower-right glowing amber ring */}
      <motion.div
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? undefined
            : { y: rightParallaxY, x: rightPointerX }
        }
        className="pointer-events-none absolute z-0 -bottom-32 -right-32 h-[240px] w-[240px] sm:-bottom-28 sm:-right-28 sm:h-[276px] sm:w-[276px] md:-bottom-28 md:-right-36 md:h-[400px] md:w-[400px] lg:-bottom-24 lg:-right-28 lg:h-[420px] lg:w-[420px]"
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { y: rightPointerY }}
          className="w-full h-full"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: prefersReducedMotion ? 0.4 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: EASE_OUT_EXPO,
            }}
            className="w-full h-full"
          >
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [16, -16], rotate: [6, -6] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 10,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }
              }
              className="w-full h-full will-change-transform"
            >
              <AmberDonutRing variant="right" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Centered content column */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 text-center"
      >
        {/* 1. Badge pill */}
        <motion.div variants={badgeVariants} className="inline-flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-navy)] bg-[var(--navy-card)]/90 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[var(--amber)] shadow-xs">
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--amber)]/16 text-[var(--amber)] ring-1 ring-[var(--amber)]/35"
            >
              <Sparkles className="h-3 w-3" strokeWidth={2.2} />
            </span>
            <span className="whitespace-nowrap">{badgeText}</span>
          </span>
        </motion.div>

        {/* 2. Two-line word-by-word reveal headline */}
        <motion.h2
          id="cta-heading"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.06,
              },
            },
          }}
          className="mt-7 font-semibold tracking-tight leading-[1.05] text-4xl md:text-6xl lg:text-7xl text-[var(--white)] m-0"
        >
          {lines.map((line, lineIdx) => {
            const words = line.split(/\s+/).filter(Boolean);
            return (
              <span key={lineIdx} className="block">
                {words.map((word, wIdx) => (
                  <React.Fragment key={`${lineIdx}-${wIdx}`}>
                    <span className="inline-block overflow-hidden align-bottom py-[0.06em] -my-[0.06em]">
                      <motion.span
                        className="inline-block will-change-transform"
                        variants={
                          prefersReducedMotion
                            ? {
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: { duration: 0.35 },
                                },
                              }
                            : {
                                hidden: {
                                  y: '100%',
                                  opacity: 0,
                                  filter: 'blur(8px)',
                                },
                                show: {
                                  y: '0%',
                                  opacity: 1,
                                  filter: 'blur(0px)',
                                  transition: {
                                    duration: 0.7,
                                    ease: EASE_OUT_EXPO,
                                  },
                                },
                              }
                        }
                      >
                        {word}
                      </motion.span>
                    </span>
                    {wIdx < words.length - 1 ? ' ' : null}
                  </React.Fragment>
                ))}
              </span>
            );
          })}
        </motion.h2>

        {/* 3. Subtext */}
        <motion.p
          variants={subtextVariants}
          className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-relaxed text-[var(--muted-navy)] mb-0"
        >
          {subtext}
        </motion.p>

        {/* 4. Primary amber button */}
        <motion.div variants={buttonWrapperVariants} className="mt-9 flex justify-center">
          <motion.a
            href={href}
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            animate={
              prefersReducedMotion
                ? { boxShadow: BUTTON_GLOW_LOW }
                : isButtonHovered
                  ? { boxShadow: BUTTON_GLOW_HOVER }
                  : { boxShadow: [BUTTON_GLOW_LOW, BUTTON_GLOW_HIGH] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.15 }
                : {
                    scale: { type: 'spring', stiffness: 300, damping: 20 },
                    boxShadow: isButtonHovered
                      ? { duration: 0.25, ease: 'easeOut' }
                      : {
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'mirror',
                          ease: 'easeInOut',
                        },
                  }
            }
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--amber)] px-8 py-4 text-base font-medium text-[var(--navy)] no-underline whitespace-nowrap cursor-pointer hover:bg-[#ffd085] transition-colors [&:focus-visible]:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
          >
            <span>{buttonLabel}</span>
            <motion.span
              aria-hidden="true"
              animate={
                prefersReducedMotion ? undefined : { x: isButtonHovered ? 4 : 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};
