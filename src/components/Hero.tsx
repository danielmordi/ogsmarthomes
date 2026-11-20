import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_DEVICES, HERO_IMAGES } from '../data/siteData';
import { BrandHouseMark, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface HeroProps {
  onModeChange?: (mode: 'without' | 'with') => void;
}

type Mode = 'without' | 'with';

const SWEEP_DURATION = 1400;
const AUTOPLAY_DELAY = 1800;
const TOUR_INITIAL_DELAY = 700;
const TOUR_INTERVAL = 3600;
const TOUR_PAUSE_DURATION = 6000;
const NOTIF_STAY_DURATION = 2600;

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Map image-space percent coordinates to container percent coordinates under object-fit: cover */
function mapCoverPoint(
  imgX: number,
  imgY: number,
  containerW: number,
  containerH: number,
  imgAspect: number,
  objPosX: number,
  objPosY: number
): { x: number; y: number } {
  if (containerW <= 0 || containerH <= 0) return { x: imgX, y: imgY };
  const containerAspect = containerW / containerH;
  let renderW: number;
  let renderH: number;
  let offsetX: number;
  let offsetY: number;

  if (containerAspect > imgAspect) {
    renderW = containerW;
    renderH = containerW / imgAspect;
    offsetX = 0;
    offsetY = -(renderH - containerH) * objPosY;
  } else {
    renderH = containerH;
    renderW = containerH * imgAspect;
    offsetX = -(renderW - containerW) * objPosX;
    offsetY = 0;
  }

  const px = offsetX + (imgX / 100) * renderW;
  const py = offsetY + (imgY / 100) * renderH;
  return {
    x: (px / containerW) * 100,
    y: (py / containerH) * 100,
  };
}

export const Hero: React.FC<HeroProps> = ({ onModeChange }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 820 : false
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [heroSize, setHeroSize] = useState<{ w: number; h: number }>({ w: 390, h: 800 });

  // Logical state for ARIA and UI card
  const [targetMode, setTargetMode] = useState<Mode>('without');
  const [activeDeviceIdx, setActiveDeviceIdx] = useState<number>(0);
  const [cardVisible, setCardVisible] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [slideKey, setSlideKey] = useState<number>(0);

  // Notification banner (With mode only)
  const [notifVisible, setNotifVisible] = useState<boolean>(false);
  const [notifText, setNotifText] = useState<string>(HERO_DEVICES[0].notificationText);
  const notifTimerRef = useRef<number | null>(null);

  // Single-clock engine mutable state (zero React re-renders per frame!)
  const clockRef = useRef({
    k: 0,
    k2: 0,
    sweep: -14,
    scanOpacity: 0,
    animating: false,
    startTime: 0,
    fromK: 0,
    toK: 0,
    targetMode: 'without' as Mode,
    queuedMode: null as Mode | null,
    deviceTriggerMs: [0, 140, 280, 420, 560],
    userTouchedToggle: false,
    rafId: 0,
  });

  // Tour timer refs
  const tourPausedUntilRef = useRef<number>(0);
  const activeIdxRef = useRef<number>(0);
  activeIdxRef.current = activeDeviceIdx;
  const isDesktopRef = useRef<boolean>(isDesktop);
  isDesktopRef.current = isDesktop;
  const heroSizeRef = useRef(heroSize);
  heroSizeRef.current = heroSize;

  // Touch swipe tracking for mobile docked device card
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Track viewport size & reduced motion
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 820px)');
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const onReducedChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    setIsDesktop(mqDesktop.matches);
    setReducedMotion(mqReduced.matches);
    mqDesktop.addEventListener('change', onDesktopChange);
    mqReduced.addEventListener('change', onReducedChange);

    const el = heroRef.current;
    let ro: ResizeObserver | null = null;
    if (el) {
      const rect = el.getBoundingClientRect();
      setHeroSize({ w: rect.width, h: rect.height });
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeroSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
        }
      });
      ro.observe(el);
    }

    return () => {
      mqDesktop.removeEventListener('change', onDesktopChange);
      mqReduced.removeEventListener('change', onReducedChange);
      if (ro) ro.disconnect();
    };
  }, []);

  // Compute screen coordinates for all 5 devices based on current cover mapping
  const getDeviceScreenPoints = useCallback(
    (desktop: boolean, size: { w: number; h: number }) => {
      const imgAspect = desktop ? 16 / 9 : 9 / 16;
      const objPosY = desktop ? 0.42 : 0.48;
      return HERO_DEVICES.map((d) => {
        const raw = desktop ? d.widePos : d.tallPos;
        return mapCoverPoint(raw.x, raw.y, size.w, size.h, imgAspect, 0.5, objPosY);
      });
    },
    []
  );

  const screenPoints = getDeviceScreenPoints(isDesktop, heroSize);

  // Write all computed CSS variables in one atomic batch
  const writeHeroVars = useCallback(
    (
      k: number,
      k2: number,
      sweep: number,
      scanOpacity: number,
      markerScales?: number[],
      markerAlphas?: number[]
    ) => {
      const root = heroRef.current;
      if (!root) return;

      const kInv = 1 - k;
      // Coral #ff8a78 (255,138,120) -> Amber #ffc46b (255,196,107)
      const g1 = Math.round(138 + 58 * k);
      const b1 = Math.round(120 - 13 * k);
      const g2 = Math.round(138 + 58 * k2);
      const b2 = Math.round(120 - 13 * k2);

      const accent = `rgb(255, ${g1}, ${b1})`;
      const accent2 = `rgb(255, ${g2}, ${b2})`;
      const accentSoft = `rgba(255, ${g1}, ${b1}, 0.4)`;

      // Toggle label blending: white (255,255,255) <-> navy (10,18,32)
      const wR = Math.round(255 - 245 * kInv);
      const wG = Math.round(255 - 237 * kInv);
      const wB = Math.round(255 - 223 * kInv);

      const aR = Math.round(255 - 245 * k);
      const aG = Math.round(255 - 237 * k);
      const aB = Math.round(255 - 223 * k);

      const style = root.style;
      style.setProperty('--k', k.toFixed(4));
      style.setProperty('--k2', k2.toFixed(4));
      style.setProperty('--k-inv', kInv.toFixed(4));
      style.setProperty('--sweep', `${sweep.toFixed(2)}%`);
      style.setProperty('--scan-opacity', scanOpacity.toFixed(4));
      style.setProperty('--accent', accent);
      style.setProperty('--accent2', accent2);
      style.setProperty('--accent-soft', accentSoft);
      style.setProperty('--label-without', `rgb(${wR}, ${wG}, ${wB})`);
      style.setProperty('--sub-without', `rgba(${wR}, ${wG}, ${wB}, 0.78)`);
      style.setProperty('--label-with', `rgb(${aR}, ${aG}, ${aB})`);
      style.setProperty('--sub-with', `rgba(${aR}, ${aG}, ${aB}, 0.78)`);

      // Sync navbar brand mark accent over hero
      document.documentElement.style.setProperty('--accent', accent);

      if (markerScales && markerAlphas) {
        for (let i = 0; i < HERO_DEVICES.length; i++) {
          const btn = markerRefs.current[i];
          if (btn) {
            btn.style.setProperty('--m-scale', markerScales[i].toFixed(4));
            btn.style.setProperty('--m-alpha', markerAlphas[i].toFixed(4));
          }
        }
      }
    },
    []
  );

  // Trigger lock-screen notification banner (With mode only)
  const triggerNotification = useCallback((deviceIdx: number) => {
    if (notifTimerRef.current) {
      window.clearTimeout(notifTimerRef.current);
      notifTimerRef.current = null;
    }
    const device = HERO_DEVICES[deviceIdx];
    if (!device) return;
    setNotifText(device.notificationText);
    setNotifVisible(true);
    notifTimerRef.current = window.setTimeout(() => {
      setNotifVisible(false);
    }, NOTIF_STAY_DURATION);
  }, []);

  // Start a 1400ms sweep transition driven by the single RAF loop
  const startSweep = useCallback(
    (nextMode: Mode) => {
      const c = clockRef.current;
      c.targetMode = nextMode;
      setTargetMode(nextMode);
      onModeChange?.(nextMode);

      if (nextMode === 'without') {
        if (notifTimerRef.current) {
          window.clearTimeout(notifTimerRef.current);
          notifTimerRef.current = null;
        }
        setNotifVisible(false);
      }

      // Reduced motion: instant state switch
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const finalK = nextMode === 'with' ? 1 : 0;
        c.k = finalK;
        c.k2 = finalK;
        c.sweep = nextMode === 'with' ? 114 : -14;
        c.scanOpacity = 0;
        c.animating = false;
        c.queuedMode = null;
        writeHeroVars(finalK, finalK, c.sweep, 0, [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]);
        if (nextMode === 'with') {
          triggerNotification(activeIdxRef.current);
        }
        return;
      }

      c.animating = true;
      c.startTime = performance.now();
      c.fromK = c.k;
      c.toK = nextMode === 'with' ? 1 : 0;

      // Compute exact device snap-in start times (sweep pass + 140ms sequential stagger)
      const pts = getDeviceScreenPoints(isDesktopRef.current, heroSizeRef.current);
      if (nextMode === 'with') {
        let prevStart = -140;
        c.deviceTriggerMs = pts.map((pt) => {
          // Find approximate t when sweep (-14..114) reaches pt.x
          const normalized = clamp((pt.x + 14) / 128, 0.05, 0.92);
          // Approximate inverse of easeInOutCubic for pass moment
          const passMs = normalized * SWEEP_DURATION * 0.62;
          const trigger = Math.max(passMs, prevStart + 140);
          prevStart = trigger;
          return trigger;
        });
      }

      const tick = (now: number) => {
        const elapsed = now - c.startTime;
        const t = clamp(elapsed / SWEEP_DURATION, 0, 1);
        const eased = easeInOutCubic(t);

        const goingToWith = c.toK === 1;
        const sweep = goingToWith ? -14 + eased * 128 : 114 - eased * 128;
        const scanOpacity = Math.sin(t * Math.PI);

        // k blends between t=0.15 and t=0.85
        const kProgress = easeInOutCubic(clamp((t - 0.15) / 0.7, 0, 1));
        const k = c.fromK + (c.toK - c.fromK) * kProgress;

        // k2 (headline "Smarter") blends slower between t=0.40 and t=1.00
        const k2Progress = easeInOutCubic(clamp((t - 0.4) / 0.6, 0, 1));
        const k2 = c.fromK + (c.toK - c.fromK) * k2Progress;

        // Device marker bracket snap-in (1.6 -> 1.0) in With mode
        const scales = [1, 1, 1, 1, 1];
        const alphas = [1, 1, 1, 1, 1];
        if (goingToWith) {
          for (let i = 0; i < HERO_DEVICES.length; i++) {
            const startMs = c.deviceTriggerMs[i];
            if (elapsed < startMs) {
              scales[i] = 1.6;
              alphas[i] = 0;
            } else {
              const mp = clamp((elapsed - startMs) / 340, 0, 1);
              const me = easeOutCubic(mp);
              scales[i] = 1.6 - 0.6 * me;
              alphas[i] = me;
            }
          }
        }

        c.k = k;
        c.k2 = k2;
        c.sweep = sweep;
        c.scanOpacity = scanOpacity;
        writeHeroVars(k, k2, sweep, scanOpacity, scales, alphas);

        // Ensure brackets finish settling even if last staggered marker runs slightly past 1400ms
        const maxMarkerEnd = goingToWith ? c.deviceTriggerMs[4] + 340 : SWEEP_DURATION;
        if (elapsed < Math.max(SWEEP_DURATION, maxMarkerEnd)) {
          c.rafId = requestAnimationFrame(tick);
        } else {
          c.animating = false;
          c.k = c.toK;
          c.k2 = c.toK;
          c.sweep = goingToWith ? 114 : -14;
          c.scanOpacity = 0;
          writeHeroVars(c.k, c.k2, c.sweep, 0, [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]);

          if (goingToWith) {
            triggerNotification(activeIdxRef.current);
          }

          if (c.queuedMode && c.queuedMode !== c.targetMode) {
            const nextQueued = c.queuedMode;
            c.queuedMode = null;
            startSweep(nextQueued);
          } else {
            c.queuedMode = null;
          }
        }
      };

      cancelAnimationFrame(c.rafId);
      c.rafId = requestAnimationFrame(tick);
    },
    [getDeviceScreenPoints, onModeChange, triggerNotification, writeHeroVars]
  );

  // User clicks Without or With button (supports queueing rules in Section 4)
  const handleToggleSelect = useCallback(
    (requested: Mode) => {
      const c = clockRef.current;
      c.userTouchedToggle = true;

      if (c.animating) {
        if (requested === c.targetMode) {
          c.queuedMode = null;
        } else {
          c.queuedMode = requested;
        }
        return;
      }

      if (requested === c.targetMode) return;
      startSweep(requested);
    },
    [startSweep]
  );

  // Select a specific device (user interaction pauses tour for 6 seconds)
  const selectDevice = useCallback(
    (nextIdx: number, direction: 'next' | 'prev', fromUser: boolean) => {
      const wrapped = (nextIdx + HERO_DEVICES.length) % HERO_DEVICES.length;
      if (fromUser) {
        tourPausedUntilRef.current = performance.now() + TOUR_PAUSE_DURATION;
      }
      setSlideDir(direction);
      setActiveDeviceIdx(wrapped);
      setCardVisible(true);
      setSlideKey((prev) => prev + 1);

      if (clockRef.current.targetMode === 'with' && !clockRef.current.animating) {
        triggerNotification(wrapped);
      }
    },
    [triggerNotification]
  );

  // Initialize hero resting state, 1800ms autoplay, and 700ms/3600ms tour
  useEffect(() => {
    writeHeroVars(0, 0, -14, 0, [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]);

    if (reducedMotion) {
      setCardVisible(true);
      return;
    }

    let autoplayTimer: number | null = null;
    let tourStartTimer: number | null = null;
    let tourIntervalId: number | null = null;

    const startTimers = () => {
      // 700ms after load: open Device 1, then advance every 3600ms
      tourStartTimer = window.setTimeout(() => {
        setCardVisible(true);
        setActiveDeviceIdx(0);
        setSlideKey((k) => k + 1);

        tourIntervalId = window.setInterval(() => {
          if (performance.now() < tourPausedUntilRef.current) return;
          const next = (activeIdxRef.current + 1) % HERO_DEVICES.length;
          selectDevice(next, 'next', false);
        }, TOUR_INTERVAL);
      }, TOUR_INITIAL_DELAY);

      // 1800ms after load: autoplay once to With if visitor hasn't touched toggle
      autoplayTimer = window.setTimeout(() => {
        if (!clockRef.current.userTouchedToggle && clockRef.current.targetMode === 'without') {
          startSweep('with');
        }
      }, AUTOPLAY_DELAY);
    };

    if (document.readyState === 'complete') {
      startTimers();
    } else {
      window.addEventListener('load', startTimers, { once: true });
    }

    return () => {
      window.removeEventListener('load', startTimers);
      if (autoplayTimer) window.clearTimeout(autoplayTimer);
      if (tourStartTimer) window.clearTimeout(tourStartTimer);
      if (tourIntervalId) window.clearInterval(tourIntervalId);
      if (notifTimerRef.current) window.clearTimeout(notifTimerRef.current);
      cancelAnimationFrame(clockRef.current.rafId);
    };
  }, [reducedMotion, selectDevice, startSweep, writeHeroVars]);

  // Swipe handlers for mobile docked device card
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        selectDevice(activeDeviceIdx + 1, 'next', true);
      } else {
        selectDevice(activeDeviceIdx - 1, 'prev', true);
      }
    }
  };

  const activeDevice = HERO_DEVICES[activeDeviceIdx];
  const activePoint = screenPoints[activeDeviceIdx] || { x: 50, y: 50 };

  // Compute desktop floating card position & thin leader line geometry
  const desktopCardLayout = (() => {
    const W = Math.max(heroSize.w, 820);
    const H = Math.max(heroSize.h, 600);
    const cardW = 296;
    const cardH = 128;
    const markerPxX = (activePoint.x / 100) * W;
    const markerPxY = (activePoint.y / 100) * H;

    const placeLeft = activeDevice.desktopCardSide === 'left' && markerPxX > cardW + 96;
    const gap = 74;
    let cardLeft = placeLeft ? markerPxX - gap - cardW : markerPxX + gap;
    cardLeft = clamp(cardLeft, 28, W - cardW - 28);

    // Keep floating card safely between headline area (210px) and bottom toggle dock (H - 220px)
    const minTop = 190;
    const maxTop = Math.max(minTop, H - 235 - cardH);
    const cardTop = clamp(markerPxY - cardH / 2, minTop, maxTop);

    const anchorX = placeLeft ? cardLeft + cardW : cardLeft;
    const anchorY = cardTop + cardH / 2;
    const markerEdgeX = placeLeft ? markerPxX - 30 : markerPxX + 30;
    const markerEdgeY = markerPxY;

    return {
      cardLeft,
      cardTop,
      cardW,
      markerEdgeX,
      markerEdgeY,
      anchorX,
      anchorY,
    };
  })();

  return (
    <section
      ref={heroRef}
      aria-label="Without and With Smart Features showcase"
      className="hero-root surface-navy"
    >
      {/* Layer 1 & 2: Matched Without & With photographs */}
      <div className="hero-media-layer">
        <picture>
          <source media="(min-width: 820px)" srcSet={HERO_IMAGES.wideWithout} />
          <img
            src={HERO_IMAGES.tallWithout}
            alt={HERO_IMAGES.withoutAlt}
            className="hero-img-base"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </picture>

        <div className="hero-with-mask" aria-hidden="true">
          <picture>
            <source media="(min-width: 820px)" srcSet={HERO_IMAGES.wideWith} />
            <img
              src={HERO_IMAGES.tallWith}
              alt=""
              className="hero-img-with"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </picture>
        </div>
      </div>

      {/* Vertical 3px glowing sweep line */}
      <div className="hero-scan-line" aria-hidden="true" />

      {/* Layer 3: Measured navy scrim */}
      <div className="hero-scrim" aria-hidden="true" />

      {/* Layer 4: Device markers locked in percent to real hardware centers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {HERO_DEVICES.map((device, idx) => {
          const pt = screenPoints[idx];
          const isActive = cardVisible && activeDeviceIdx === idx;
          // Offset badge corner for doorbell (#4) vs switch (#3) on tall phones so numbers never collide
          const badgeCornerClass =
            device.id === 'doorbell'
              ? '-top-2 -left-2'
              : device.id === 'switch'
                ? '-top-2 -right-2'
                : '-top-2 -right-2';
          const desktopLabelOnLeft = device.id === 'lock' || device.id === 'light';

          return (
            <button
              key={device.id}
              ref={(el) => {
                markerRefs.current[idx] = el;
              }}
              type="button"
              aria-label={device.name}
              aria-pressed={isActive}
              onClick={() =>
                selectDevice(idx, idx >= activeDeviceIdx ? 'next' : 'prev', true)
              }
              onMouseEnter={() => {
                if (isDesktop) {
                  selectDevice(idx, idx >= activeDeviceIdx ? 'next' : 'prev', true);
                }
              }}
              onFocus={() => {
                selectDevice(idx, idx >= activeDeviceIdx ? 'next' : 'prev', true);
              }}
              className={`device-marker-btn pointer-events-auto ${isActive ? 'is-active' : ''}`}
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
              }}
            >
              <span className="marker-brackets" aria-hidden="true">
                <span className="marker-corner marker-corner-tl" />
                <span className="marker-corner marker-corner-tr" />
                <span className="marker-corner marker-corner-bl" />
                <span className="marker-corner marker-corner-br" />

                {/* Pulsing ring (With mode only, disabled under reduced motion) */}
                <span className="marker-pulse-wrap">
                  <span className="marker-pulse-ring" />
                </span>

                {/* Glowing dot (With mode) */}
                <span className="marker-center-dot" />

                {/* Coral cross (Without mode) */}
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="marker-center-cross"
                >
                  <path
                    d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Mobile numbered badge 1–5 */}
                <span
                  className={`only-mobile absolute ${badgeCornerClass} w-5 h-5 rounded-full items-center justify-center text-[11px] font-bold leading-none`}
                  style={{
                    backgroundColor: '#0a1220',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  {device.index}
                </span>

                {/* Desktop concise device label beside marker */}
                <span
                  className={`only-desktop items-center whitespace-nowrap absolute top-1/2 -translate-y-1/2 text-[12px] font-semibold tracking-tight px-2 py-0.5 rounded-md ${
                    desktopLabelOnLeft ? 'right-[calc(100%+10px)]' : 'left-[calc(100%+10px)]'
                  }`}
                  style={{
                    backgroundColor: 'rgba(10, 18, 32, 0.72)',
                    color: isActive ? 'var(--accent)' : '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                  }}
                >
                  {device.shortLabel}
                </span>
              </span>
            </button>
          );
        })}

        {/* Desktop SVG leader line connecting active marker to floating card */}
        {isDesktop && cardVisible && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-15"
            aria-hidden="true"
          >
            <line
              x1={desktopCardLayout.markerEdgeX}
              y1={desktopCardLayout.markerEdgeY}
              x2={desktopCardLayout.anchorX}
              y2={desktopCardLayout.anchorY}
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.82"
            />
            <circle
              cx={desktopCardLayout.anchorX}
              cy={desktopCardLayout.anchorY}
              r="3"
              fill="var(--accent)"
            />
          </svg>
        )}

        {/* Desktop floating device card beside active marker */}
        {isDesktop && cardVisible && (
          <div
            className="hero-glass rounded-[20px] p-4 pointer-events-auto absolute z-20"
            style={{
              left: `${desktopCardLayout.cardLeft}px`,
              top: `${desktopCardLayout.cardTop}px`,
              width: `${desktopCardLayout.cardW}px`,
            }}
          >
            <div
              key={slideKey}
              className={
                slideDir === 'next' ? 'device-card-slide-next' : 'device-card-slide-prev'
              }
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[12px] font-semibold text-white/75 tabular-nums">
                  {activeDevice.index} of {HERO_DEVICES.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous device"
                    onClick={() => selectDevice(activeDeviceIdx - 1, 'prev', true)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <ChevronLeftIcon size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next device"
                    onClick={() => selectDevice(activeDeviceIdx + 1, 'next', true)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <ChevronRightIcon size={15} />
                  </button>
                </div>
              </div>

              <div
                className="text-[17px] font-semibold leading-snug mb-1.5"
                style={{ color: 'var(--accent)' }}
              >
                {activeDevice.name}
              </div>

              {/* Two status lines stacked in the exact same spot, crossfading with --k */}
              <div className="grid text-[14px] leading-snug min-h-[40px]">
                <p className="col-start-1 row-start-1 m-0 device-status-without">
                  {activeDevice.withoutText}
                </p>
                <p className="col-start-1 row-start-1 m-0 device-status-with">
                  {activeDevice.withText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phone notification banner (With mode only, slides down from top bar area) */}
      <div
        className="absolute top-[70px] min-[820px]:top-[84px] left-1/2 -translate-x-1/2 z-30 w-[calc(100%-32px)] max-w-[390px] pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className={`hero-notification ${
            notifVisible && targetMode === 'with' ? 'is-visible' : ''
          } rounded-[16px] px-3.5 py-2.5 flex items-center gap-3 shadow-lg`}
          style={{
            background: 'rgba(14, 24, 42, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <span
            className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 196, 107, 0.16)',
              color: '#ffc46b',
            }}
          >
            <BrandHouseMark size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-white truncate">
                Og Smart Homes
              </span>
              <span className="text-[12px] text-white/65 shrink-0">now</span>
            </div>
            <p className="text-[13px] text-white/90 truncate m-0 leading-tight mt-0.5">
              {notifText}
            </p>
          </div>
        </div>
      </div>

      {/* Layer 5: Hero Interface (top headline, open middle for entrance hardware, pinned bottom dock) */}
      <div className="relative z-20 h-full flex flex-col justify-between pt-[72px] pb-4 px-4 sm:px-6 pointer-events-none">
        {/* Top Headline */}
        <div className="w-full max-w-[1200px] mx-auto pt-1 sm:pt-4 pointer-events-auto">
          <h1 className="hero-headline">
            Same Home.
            <br />
            <span className="hero-headline-smarter">Smarter</span> Everything.
          </h1>
        </div>

        {/* Bottom Dock: Mobile Device Card + Without/With Toggle + Caption + Desktop CTA & Scroll Cue */}
        <div className="w-full flex flex-col items-center gap-3 pointer-events-auto">
          {/* Mobile docked device card (swipeable, prev/next arrows, 5 dots) */}
          {!isDesktop && (
            <div
              className="hero-glass rounded-[20px] w-full max-w-[440px] min-h-[108px] max-h-[128px] px-4 py-3 flex flex-col justify-between"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-live="polite"
            >
              <div
                key={slideKey}
                className={
                  slideDir === 'next' ? 'device-card-slide-next' : 'device-card-slide-prev'
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12px] font-semibold text-white/75 tabular-nums shrink-0">
                      {activeDevice.index} of {HERO_DEVICES.length}
                    </span>
                    <span
                      className="text-[17px] font-semibold truncate"
                      style={{ color: 'var(--accent)' }}
                    >
                      {activeDevice.name}
                    </span>
                  </div>

                  {/* Mobile prev/next arrows with >=44px hit areas via negative margin */}
                  <div className="flex items-center -mr-2">
                    <button
                      type="button"
                      aria-label="Previous device"
                      onClick={() => selectDevice(activeDeviceIdx - 1, 'prev', true)}
                      className="w-11 h-11 -my-2 flex items-center justify-center text-white/85 hover:text-white cursor-pointer rounded-full"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next device"
                      onClick={() => selectDevice(activeDeviceIdx + 1, 'next', true)}
                      className="w-11 h-11 -my-2 flex items-center justify-center text-white/85 hover:text-white cursor-pointer rounded-full"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  </div>
                </div>

                {/* Stacked Without / With status lines crossfading with --k */}
                <div className="grid text-[14px] leading-snug mt-0.5">
                  <p className="col-start-1 row-start-1 m-0 device-status-without">
                    {activeDevice.withoutText}
                  </p>
                  <p className="col-start-1 row-start-1 m-0 device-status-with">
                    {activeDevice.withText}
                  </p>
                </div>
              </div>

              {/* 5 position dots */}
              <div className="flex items-center justify-center gap-2 mt-1.5" role="tablist" aria-label="Smart devices">
                {HERO_DEVICES.map((dev, i) => (
                  <button
                    key={dev.id}
                    type="button"
                    role="tab"
                    aria-selected={activeDeviceIdx === i}
                    aria-label={`Show ${dev.name}`}
                    onClick={() =>
                      selectDevice(i, i >= activeDeviceIdx ? 'next' : 'prev', true)
                    }
                    className="p-1.5 -m-1 cursor-pointer bg-transparent border-0 flex items-center justify-center"
                  >
                    <span
                      className="block rounded-full"
                      style={{
                        width: activeDeviceIdx === i ? '18px' : '6px',
                        height: '6px',
                        backgroundColor:
                          activeDeviceIdx === i ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                        transition: reducedMotion ? 'none' : 'width 220ms ease-out',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Without / With Smart Features glass pill toggle */}
          <div
            role="group"
            aria-label="Smart features mode"
            className="hero-glass hero-toggle-pill relative w-full max-w-[440px] min-[820px]:max-w-[480px] h-[56px] rounded-full p-1 grid grid-cols-2 gap-1"
          >
            {/* Left button: Without Smart Features */}
            <button
              type="button"
              aria-pressed={targetMode === 'without'}
              onClick={() => handleToggleSelect('without')}
              className="relative rounded-full flex flex-col items-center justify-center px-1.5 min-[380px]:px-2 cursor-pointer border-0 bg-transparent overflow-hidden"
            >
              <span
                className="toggle-pad-without absolute inset-0 rounded-full pointer-events-none"
                aria-hidden="true"
              />
              <span className="relative z-10 toggle-label-without text-[12px] min-[370px]:text-[13px] min-[820px]:text-[14px] tracking-[-0.01em] font-semibold leading-tight whitespace-nowrap">
                Without Smart Features
              </span>
              <span className="relative z-10 toggle-sub-without text-[10.5px] min-[370px]:text-[11px] min-[820px]:text-[11.5px] font-medium leading-tight mt-0.5 truncate max-w-full">
                Keys · Switches · Blind spots
              </span>
            </button>

            {/* Right button: With Smart Features */}
            <button
              type="button"
              aria-pressed={targetMode === 'with'}
              onClick={() => handleToggleSelect('with')}
              className="relative rounded-full flex flex-col items-center justify-center px-1.5 min-[380px]:px-2 cursor-pointer border-0 bg-transparent overflow-hidden"
            >
              <span
                className="toggle-pad-with absolute inset-0 rounded-full pointer-events-none"
                aria-hidden="true"
              />
              <span className="relative z-10 toggle-label-with text-[12px] min-[370px]:text-[13px] min-[820px]:text-[14px] tracking-[-0.01em] font-semibold leading-tight whitespace-nowrap">
                With Smart Features
              </span>
              <span className="relative z-10 toggle-sub-with text-[10.5px] min-[370px]:text-[11px] min-[820px]:text-[11.5px] font-medium leading-tight mt-0.5 truncate max-w-full">
                Controlled from your phone
              </span>
            </button>
          </div>

          {/* Caption */}
          <p
            className="hero-caption text-center m-0 max-w-[560px] text-[14px] min-[820px]:text-[17px] leading-snug"
            style={{ color: '#d3dcea' }}
          >
            We sell and install smart locks, CCTV, switches and sensors you control from your phone.
          </p>

          {/* Desktop-only Primary CTA + Scroll Cue */}
          <div className="only-desktop flex-col items-center gap-3 mt-1">
            <a href="#survey" className="btn-primary">
              Book a Free Site Survey
            </a>
            <a
              href="#trust"
              aria-label="Scroll to learn more"
              className="hero-scroll-cue inline-flex flex-col items-center gap-1 text-[12px] font-medium text-white/70 hover:text-white no-underline mt-0.5"
            >
              <span>Scroll</span>
              <span className="w-[1.5px] h-5 bg-white/55 rounded-full" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
