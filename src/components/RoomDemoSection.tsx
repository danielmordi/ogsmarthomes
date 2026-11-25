import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ALL_INSTALL_DEVICES,
  ROOM_DEMO_DATA,
  type RoomDemoConfig,
  type RoomId,
} from '../data/roomDemoData';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface RoomDemoSectionProps {
  addedDeviceIds: string[];
  onToggleSurveyDevice: (deviceId: string) => void;
  onProceedToSurvey: (chips: string[], note: string) => void;
}

interface RoomStateMap {
  entrance: {
    lockUnlocked: boolean;
    motionLightOn: boolean;
    doorbellOpen: boolean;
    doorbellTalking: boolean;
  };
  'living-room': {
    lightsLevel: number;
    curtainsClosed: boolean;
    acTemp: number;
  };
  bedroom: {
    mainLightsOn: boolean;
    bedsideLampOn: boolean;
    nightLightOn: boolean;
    acTemp: number;
  };
  kitchen: {
    leakAlertActive: boolean;
    smartPlugOn: boolean;
    ecoModeOn: boolean;
  };
  outdoors: {
    gateStatus: 'closed' | 'opening' | 'open';
    gardenLightsOn: boolean;
    activeCamera: 'gate' | 'driveway' | 'side' | 'back';
    camerasArmed: boolean;
    motionTile: 'gate' | 'driveway' | 'side' | 'back' | null;
  };
}

interface ClockValues {
  scene: number;
  glowEntrance: number;
  livingDim: number;
  livingCurtain: number;
  livingCool: number;
  glowLamp: number;
  glowNightlight: number;
  glowPlug: number;
  glowGarden: number;
  gateOpen: number;
}

interface RoomClockTrack {
  current: ClockValues;
  start: ClockValues;
  target: ClockValues;
  startTime: number;
}

const INITIAL_ROOM_STATE: RoomStateMap = {
  entrance: {
    lockUnlocked: false,
    motionLightOn: false,
    doorbellOpen: false,
    doorbellTalking: false,
  },
  'living-room': {
    lightsLevel: 100,
    curtainsClosed: false,
    acTemp: 25,
  },
  bedroom: {
    mainLightsOn: true,
    bedsideLampOn: false,
    nightLightOn: false,
    acTemp: 26,
  },
  kitchen: {
    leakAlertActive: false,
    smartPlugOn: false,
    ecoModeOn: false,
  },
  outdoors: {
    gateStatus: 'closed',
    gardenLightsOn: false,
    activeCamera: 'gate',
    camerasArmed: true,
    motionTile: 'gate',
  },
};

const ZERO_CLOCK: ClockValues = {
  scene: 0,
  glowEntrance: 0,
  livingDim: 0,
  livingCurtain: 0,
  livingCool: 0,
  glowLamp: 0,
  glowNightlight: 0,
  glowPlug: 0,
  glowGarden: 0,
  gateOpen: 0,
};

function computeRoomTargets(roomId: RoomId, state: RoomStateMap): ClockValues {
  const out: ClockValues = { ...ZERO_CLOCK };
  if (roomId === 'entrance') {
    const s = state.entrance;
    out.scene = s.motionLightOn ? 1 : s.lockUnlocked ? 0.28 : 0;
    out.glowEntrance = s.motionLightOn ? 1 : 0;
  } else if (roomId === 'living-room') {
    const s = state['living-room'];
    const dimFraction = Math.max(0, Math.min(1, (100 - s.lightsLevel) / 100));
    out.scene = Math.min(1, dimFraction * 0.72 + (s.curtainsClosed ? 0.36 : 0));
    out.livingDim = dimFraction;
    out.livingCurtain = s.curtainsClosed ? 1 : 0;
    out.livingCool = s.acTemp < 25 ? 1 : 0;
  } else if (roomId === 'bedroom') {
    const s = state.bedroom;
    out.scene = !s.mainLightsOn
      ? 1
      : s.nightLightOn || s.bedsideLampOn
        ? 0.32
        : 0;
    out.glowLamp = s.bedsideLampOn ? 1 : 0;
    out.glowNightlight = s.nightLightOn ? 1 : 0;
  } else if (roomId === 'kitchen') {
    const s = state.kitchen;
    out.scene = s.ecoModeOn ? 1 : s.smartPlugOn ? 0.22 : 0;
    out.glowPlug = s.smartPlugOn ? 1 : 0;
  } else if (roomId === 'outdoors') {
    const s = state.outdoors;
    const isGateActive = s.gateStatus === 'open' || s.gateStatus === 'opening';
    out.scene = s.gardenLightsOn ? 1 : isGateActive ? 0.42 : 0;
    out.glowGarden = s.gardenLightsOn ? 1 : 0;
    out.gateOpen = s.gateStatus === 'open' ? 1 : s.gateStatus === 'opening' ? 0.55 : 0;
  }
  return out;
}

function writeClockVars(el: HTMLElement | null, v: ClockValues) {
  if (!el) return;
  el.style.setProperty('--room-scene', v.scene.toFixed(4));
  el.style.setProperty('--glow-entrance', v.glowEntrance.toFixed(4));
  el.style.setProperty('--living-dim', v.livingDim.toFixed(4));
  el.style.setProperty('--living-curtain', v.livingCurtain.toFixed(4));
  el.style.setProperty('--living-cool', v.livingCool.toFixed(4));
  el.style.setProperty('--glow-lamp', v.glowLamp.toFixed(4));
  el.style.setProperty('--glow-nightlight', v.glowNightlight.toFixed(4));
  el.style.setProperty('--glow-plug', v.glowPlug.toFixed(4));
  el.style.setProperty('--glow-garden', v.glowGarden.toFixed(4));
  el.style.setProperty('--gate-open', v.gateOpen.toFixed(4));
}

function formatCallTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/** Line icons for room tabs & device controls */
const RoomTabIcon: React.FC<{ roomId: RoomId; size?: number }> = ({ roomId, size = 18 }) => {
  switch (roomId) {
    case 'entrance':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 20V5a1.5 1.5 0 0 1 1.5-1.5h11A1.5 1.5 0 0 1 19 5v15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="15" cy="12" r="1.3" fill="currentColor" />
        </svg>
      );
    case 'living-room':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 13v-2.5A2.5 2.5 0 0 1 6.5 8h11A2.5 2.5 0 0 1 20 10.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 13h18v4.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6 19v1.5M18 19v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'bedroom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 10V7.5A1.5 1.5 0 0 1 6.5 6h4A1.5 1.5 0 0 1 12 7.5V10M12 10V7.5A1.5 1.5 0 0 1 13.5 6h4A1.5 1.5 0 0 1 19 7.5V10" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 16h18M4 18v1.5M20 18v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M13 3L6 13h6l-1 8 7-10h-6l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'outdoors':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3L4.5 6.5V12c0 4.5 3.2 8.1 7.5 9.5 4.3-1.4 7.5-5 7.5-9.5V6.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="11.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
  }
};

const ControlIcon: React.FC<{ name: string; size?: number }> = ({ name, size = 18 }) => {
  switch (name) {
    case 'lock':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'light':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.5 17h5M10.5 20h3M12 2.5v1.5M18.4 5.2l-1.1 1.1M5.6 5.2l1.1 1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'doorbell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="7" y="3" width="10" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'curtains':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 5h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 5v14c2.5-2 4-5 4-14M19 5v14c-2.5-2-4-5-4-14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ac':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 9.5h10M8 16.5c0 1.4-1 2.2-1 3M12 16.5c0 1.4-1 2.2-1 3M16 16.5c0 1.4-1 2.2-1 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'fan':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path d="M12 9.8c0-3 2-5.3 4.2-4.8 1.5.3 1.8 2.4-.5 4.2M14.2 12c3 0 5.3 2 4.8 4.2-.3 1.5-2.4 1.8-4.2-.5M12 14.2c0 3-2 5.3-4.2 4.8-1.5-.3-1.8-2.4.5-4.2M9.8 12c-3 0-5.3-2-4.8-4.2.3-1.5 2.4-1.8 4.2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'plug':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3v6M8 5.2a7.5 7.5 0 1 0 8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'drop':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3.5C12 3.5 6 10.2 6 14.5a6 6 0 0 0 12 0C18 10.2 12 3.5 12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'gate':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 19V7l8 2.5V19M21 19V7l-8 2.5V19M2 19h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'camera':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 10.5L15 6l3.5 7-12 4.5L3 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M18 11.8l3-1v4l-3.5-.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'play':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      );
    case 'scene':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
};

/** Accessible toggle switch (>= 44px tap area) */
const DemoSwitch: React.FC<{
  checked: boolean;
  label: string;
  onToggle: () => void;
  demoTarget?: string;
}> = ({ checked, label, onToggle, demoTarget }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    data-demo-target={demoTarget}
    onClick={onToggle}
    className="relative inline-flex items-center justify-center min-w-[52px] min-h-[44px] p-0 bg-transparent border-0 cursor-pointer shrink-0"
  >
    <span
      className="relative inline-flex items-center w-[50px] h-[28px] rounded-full transition-colors duration-200"
      style={{
        backgroundColor: checked ? '#ffc46b' : 'rgba(255, 255, 255, 0.16)',
      }}
    >
      <span
        className="block w-[22px] h-[22px] rounded-full shadow-sm transition-transform duration-250"
        style={{
          backgroundColor: checked ? '#0a1220' : '#ffffff',
          transform: checked ? 'translateX(25px)' : 'translateX(3px)',
        }}
      />
    </span>
  </button>
);

export const RoomDemoSection: React.FC<RoomDemoSectionProps> = ({
  addedDeviceIds,
  onToggleSurveyDevice,
  onProceedToSurvey,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<RoomId>('entrance');
  const [roomState, setRoomState] = useState<RoomStateMap>(INITIAL_ROOM_STATE);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Track which rooms should preload images (active + next once section is near screen)
  const [loadedRooms, setLoadedRooms] = useState<Set<RoomId>>(
    () => new Set<RoomId>(['entrance'])
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Interactive highlight & toast & live region
  const [activeControlId, setActiveControlId] = useState<string | null>(null);
  const [pulsingControlId, setPulsingControlId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState<number>(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  // Doorbell live timer & CCTV timestamp ticker
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [cctvSecondOffset, setCctvSecondOffset] = useState<number>(18);

  // Auto-demo cursor state
  const [demoCursor, setDemoCursor] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tapping: boolean;
  }>({ visible: false, x: 0, y: 0, tapping: false });
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  // Refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const phonePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileTabRowRef = useRef<HTMLDivElement | null>(null);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  // Timers & demo cancellation
  const toastTimerRef = useRef<number | null>(null);
  const leakTimerRef = useRef<number | null>(null);
  const gateTimersRef = useRef<number[]>([]);
  const demoTimersRef = useRef<number[]>([]);
  const hasPlayedInitialDemoRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);
  const activeRoomRef = useRef<RoomId>(activeRoomId);
  activeRoomRef.current = activeRoomId;

  // Single 700ms rAF clock state for all 5 rooms
  const clockTracksRef = useRef<Record<RoomId, RoomClockTrack>>({
    entrance: { current: { ...ZERO_CLOCK }, start: { ...ZERO_CLOCK }, target: { ...ZERO_CLOCK }, startTime: 0 },
    'living-room': { current: { ...ZERO_CLOCK }, start: { ...ZERO_CLOCK }, target: { ...ZERO_CLOCK }, startTime: 0 },
    bedroom: { current: { ...ZERO_CLOCK }, start: { ...ZERO_CLOCK }, target: { ...ZERO_CLOCK }, startTime: 0 },
    kitchen: { current: { ...ZERO_CLOCK }, start: { ...ZERO_CLOCK }, target: { ...ZERO_CLOCK }, startTime: 0 },
    outdoors: { current: { ...ZERO_CLOCK }, start: { ...ZERO_CLOCK }, target: { ...ZERO_CLOCK }, startTime: 0 },
  });
  const rafIdRef = useRef<number | null>(null);

  const activeRoomIndex = ROOM_DEMO_DATA.findIndex((r) => r.id === activeRoomId);
  const activeRoom: RoomDemoConfig = ROOM_DEMO_DATA[activeRoomIndex] ?? ROOM_DEMO_DATA[0];

  // Track prefers-reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Preload active room + next room when section approaches viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoadedRooms((prev) => {
            const next = new Set(prev);
            next.add('entrance');
            next.add('living-room');
            return next;
          });
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px 450px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Ensure active room and next room are marked for preloading on room change
  useEffect(() => {
    const nextRoom = ROOM_DEMO_DATA[(activeRoomIndex + 1) % ROOM_DEMO_DATA.length];
    setLoadedRooms((prev) => {
      if (prev.has(activeRoomId) && prev.has(nextRoom.id)) return prev;
      const next = new Set(prev);
      next.add(activeRoomId);
      next.add(nextRoom.id);
      return next;
    });
  }, [activeRoomId, activeRoomIndex]);

  // Trigger image preloading for next room cleanly via Image objects
  useEffect(() => {
    loadedRooms.forEach((rId) => {
      const cfg = ROOM_DEMO_DATA.find((r) => r.id === rId);
      if (!cfg) return;
      const imgCalm = new Image();
      imgCalm.src = cfg.calmImage;
      const imgScene = new Image();
      imgScene.src = cfg.sceneImage;
    });
  }, [loadedRooms]);

  // Single rAF clock loop: eases every room's scene & overlay amounts over 700ms into CSS vars
  const tickClock = useCallback((now: number) => {
    let anyActive = false;
    const keys = Object.keys(ZERO_CLOCK) as (keyof ClockValues)[];
    const roomIds: RoomId[] = ['entrance', 'living-room', 'bedroom', 'kitchen', 'outdoors'];

    for (const rId of roomIds) {
      const track = clockTracksRef.current[rId];
      if (track.startTime === 0) continue;
      const rawT = Math.min(1, (now - track.startTime) / 700);
      const eased = 1 - Math.pow(1 - rawT, 3);
      for (const k of keys) {
        track.current[k] = track.start[k] + (track.target[k] - track.start[k]) * eased;
      }
      if (rawT < 1) {
        anyActive = true;
      } else {
        track.startTime = 0;
      }
    }

    const activeTrack = clockTracksRef.current[activeRoomRef.current];
    writeClockVars(stageRef.current, activeTrack.current);

    if (anyActive) {
      rafIdRef.current = requestAnimationFrame(tickClock);
    } else {
      rafIdRef.current = null;
    }
  }, []);

  // Update clock targets whenever roomState changes
  useEffect(() => {
    const roomIds: RoomId[] = ['entrance', 'living-room', 'bedroom', 'kitchen', 'outdoors'];
    const keys = Object.keys(ZERO_CLOCK) as (keyof ClockValues)[];
    const now = performance.now();
    let needsFrame = false;

    for (const rId of roomIds) {
      const nextTarget = computeRoomTargets(rId, roomState);
      const track = clockTracksRef.current[rId];
      const changed = keys.some((k) => Math.abs(track.target[k] - nextTarget[k]) > 0.0005);
      if (changed) {
        if (reducedMotion) {
          track.current = { ...nextTarget };
          track.start = { ...nextTarget };
          track.target = { ...nextTarget };
          track.startTime = 0;
        } else {
          track.start = { ...track.current };
          track.target = { ...nextTarget };
          track.startTime = now;
          needsFrame = true;
        }
      }
    }

    // Write active room vars immediately
    writeClockVars(stageRef.current, clockTracksRef.current[activeRoomId].current);

    if (needsFrame && rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(tickClock);
    }
  }, [roomState, activeRoomId, reducedMotion, tickClock]);

  // Immediately sync CSS variables when switching rooms
  useEffect(() => {
    writeClockVars(stageRef.current, clockTracksRef.current[activeRoomId].current);
  }, [activeRoomId]);

  // Cleanup rAF and timers on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (leakTimerRef.current !== null) window.clearTimeout(leakTimerRef.current);
      gateTimersRef.current.forEach((id) => window.clearTimeout(id));
      demoTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Doorbell live call timer
  useEffect(() => {
    if (!roomState.entrance.doorbellOpen) {
      setCallSeconds(0);
      return;
    }
    const interval = window.setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [roomState.entrance.doorbellOpen]);

  // Outdoors CCTV demo timestamp ticker (only when outdoors tab is active)
  useEffect(() => {
    if (activeRoomId !== 'outdoors') return;
    const interval = window.setInterval(() => {
      setCctvSecondOffset((s) => (s + 1) % 60);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeRoomId]);

  // Scroll active mobile pill horizontally into view WITHOUT jumping vertical page scroll
  useEffect(() => {
    const row = mobileTabRowRef.current;
    const btn = mobileTabRefs.current[activeRoomIndex];
    if (!row || !btn) return;
    const targetLeft = btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2;
    row.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [activeRoomIndex, reducedMotion]);

  // Toast & live region announcement + brief pulse on changed control
  const showFeedback = useCallback((message: string, controlId?: string) => {
    setToastText(message);
    setToastKey((k) => k + 1);
    setLiveAnnouncement(message);
    if (controlId) {
      setActiveControlId(controlId);
      setPulsingControlId(controlId);
      window.setTimeout(() => {
        setPulsingControlId((curr) => (curr === controlId ? null : curr));
      }, 540);
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastText(null);
    }, 2200);
  }, []);

  // Stop scripted auto-demo immediately on any user interaction
  const stopDemo = useCallback(() => {
    demoTimersRef.current.forEach((id) => window.clearTimeout(id));
    demoTimersRef.current = [];
    setDemoCursor((prev) => (prev.visible ? { ...prev, visible: false, tapping: false } : prev));
    setIsDemoPlaying(false);
  }, []);

  const handleUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
    stopDemo();
  }, [stopDemo]);

  // =========================================================
  // ROOM CONTROL HANDLERS
  // =========================================================
  const triggerEntranceScene = useCallback(() => {
    setRoomState((prev) => ({
      ...prev,
      entrance: { ...prev.entrance, lockUnlocked: true, motionLightOn: true },
    }));
    showFeedback('Welcome home', 'entrance-scene');
  }, [showFeedback]);

  const toggleEntranceLock = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.entrance.lockUnlocked;
      showFeedback(
        next ? 'Front door unlocked · 8:42 pm' : 'Front door locked · 8:42 pm',
        'entrance-lock'
      );
      return { ...prev, entrance: { ...prev.entrance, lockUnlocked: next } };
    });
  }, [showFeedback]);

  const toggleEntranceLight = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.entrance.motionLightOn;
      showFeedback(next ? 'Motion light on · Porch lit' : 'Motion light turned off', 'entrance-light');
      return { ...prev, entrance: { ...prev.entrance, motionLightOn: next } };
    });
  }, [showFeedback]);

  const openDoorbellCall = useCallback(() => {
    setRoomState((prev) => ({
      ...prev,
      entrance: { ...prev.entrance, doorbellOpen: true, doorbellTalking: false },
    }));
    showFeedback('Visitor call answered', 'entrance-doorbell');
  }, [showFeedback]);

  const closeDoorbellCall = useCallback(() => {
    setRoomState((prev) => ({
      ...prev,
      entrance: { ...prev.entrance, doorbellOpen: false, doorbellTalking: false },
    }));
    showFeedback('Doorbell call closed', 'entrance-doorbell');
  }, [showFeedback]);

  const toggleDoorbellTalk = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.entrance.doorbellTalking;
      showFeedback(next ? 'Two-way audio active' : 'Microphone muted', 'entrance-doorbell');
      return { ...prev, entrance: { ...prev.entrance, doorbellTalking: next } };
    });
  }, [showFeedback]);

  // Living room handlers
  const triggerLivingMovieMode = useCallback(() => {
    setRoomState((prev) => ({
      ...prev,
      'living-room': { lightsLevel: 15, curtainsClosed: true, acTemp: 23 },
    }));
    showFeedback('Movie mode · Lights 15%, curtains closed, AC 23°C', 'living-scene');
  }, [showFeedback]);

  const setLivingLights = useCallback(
    (level: number) => {
      const clamped = Math.max(0, Math.min(100, level));
      setRoomState((prev) => ({
        ...prev,
        'living-room': { ...prev['living-room'], lightsLevel: clamped },
      }));
      showFeedback(`Living room lights at ${clamped}%`, 'living-lights');
    },
    [showFeedback]
  );

  const toggleLivingCurtains = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev['living-room'].curtainsClosed;
      showFeedback(next ? 'Curtains closed' : 'Curtains opened', 'living-curtains');
      return { ...prev, 'living-room': { ...prev['living-room'], curtainsClosed: next } };
    });
  }, [showFeedback]);

  const stepLivingAc = useCallback(
    (delta: number) => {
      setRoomState((prev) => {
        const next = Math.max(18, Math.min(28, prev['living-room'].acTemp + delta));
        showFeedback(
          `Living room AC set to ${next}°C${next < 25 ? ' · Cooling' : ''}`,
          'living-ac'
        );
        return { ...prev, 'living-room': { ...prev['living-room'], acTemp: next } };
      });
    },
    [showFeedback]
  );

  // Bedroom handlers
  const triggerBedroomGoodnight = useCallback(() => {
    setRoomState((prev) => ({
      ...prev,
      entrance: { ...prev.entrance, lockUnlocked: false },
      bedroom: {
        mainLightsOn: false,
        bedsideLampOn: false,
        nightLightOn: true,
        acTemp: 25,
      },
    }));
    showFeedback('Goodnight · Front door locked, AC 25°C', 'bedroom-scene');
  }, [showFeedback]);

  const toggleBedsideLamp = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.bedroom.bedsideLampOn;
      showFeedback(next ? 'Bedside lamp turned on' : 'Bedside lamp turned off', 'bedroom-lamp');
      return { ...prev, bedroom: { ...prev.bedroom, bedsideLampOn: next } };
    });
  }, [showFeedback]);

  const toggleNightLight = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.bedroom.nightLightOn;
      showFeedback(
        next ? 'Motion night light on · Floor path lit' : 'Motion night light turned off',
        'bedroom-nightlight'
      );
      return { ...prev, bedroom: { ...prev.bedroom, nightLightOn: next } };
    });
  }, [showFeedback]);

  const stepBedroomAc = useCallback(
    (delta: number) => {
      setRoomState((prev) => {
        const next = Math.max(18, Math.min(28, prev.bedroom.acTemp + delta));
        showFeedback(`Bedroom AC set to ${next}°C · Sleep mode`, 'bedroom-ac');
        return { ...prev, bedroom: { ...prev.bedroom, acTemp: next } };
      });
    },
    [showFeedback]
  );

  // Kitchen handlers
  const triggerKitchenLeakTest = useCallback(() => {
    if (leakTimerRef.current !== null) window.clearTimeout(leakTimerRef.current);
    setRoomState((prev) => ({
      ...prev,
      kitchen: { ...prev.kitchen, leakAlertActive: true },
    }));
    showFeedback('Leak detected · Water valve closed', 'kitchen-scene');

    leakTimerRef.current = window.setTimeout(() => {
      setRoomState((prev) => ({
        ...prev,
        kitchen: { ...prev.kitchen, leakAlertActive: false },
      }));
      showFeedback('Water sensor normal · Valve ready', 'kitchen-scene');
    }, 4000);
  }, [showFeedback]);

  const toggleKitchenPlug = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.kitchen.smartPlugOn;
      showFeedback(next ? 'Kettle smart plug switched on' : 'Kettle smart plug switched off', 'kitchen-plug');
      return { ...prev, kitchen: { ...prev.kitchen, smartPlugOn: next } };
    });
  }, [showFeedback]);

  const toggleKitchenEco = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.kitchen.ecoModeOn;
      showFeedback(next ? 'Eco mode on · Prioritising solar' : 'Standard power mode active', 'kitchen-power');
      return { ...prev, kitchen: { ...prev.kitchen, ecoModeOn: next } };
    });
  }, [showFeedback]);

  // Outdoors handlers
  const triggerOutdoorsSecure = useCallback(() => {
    gateTimersRef.current.forEach((id) => window.clearTimeout(id));
    gateTimersRef.current = [];
    setRoomState((prev) => ({
      ...prev,
      outdoors: {
        ...prev.outdoors,
        gateStatus: 'closed',
        gardenLightsOn: true,
        camerasArmed: true,
        activeCamera: 'gate',
        motionTile: 'gate',
      },
    }));
    showFeedback('Compound secured · Gate closed, lights on', 'outdoors-scene');
  }, [showFeedback]);

  const toggleOutdoorsGate = useCallback(() => {
    gateTimersRef.current.forEach((id) => window.clearTimeout(id));
    gateTimersRef.current = [];

    setRoomState((prev) => {
      if (prev.outdoors.gateStatus !== 'closed') {
        showFeedback('Gate closed', 'outdoors-gate');
        return { ...prev, outdoors: { ...prev.outdoors, gateStatus: 'closed' } };
      }
      showFeedback('Opening compound gate…', 'outdoors-gate');
      const t1 = window.setTimeout(() => {
        setRoomState((curr) => ({
          ...curr,
          outdoors: { ...curr.outdoors, gateStatus: 'open' },
        }));
        showFeedback('Gate open · Auto-closing in 3s', 'outdoors-gate');
      }, 850);
      const t2 = window.setTimeout(() => {
        setRoomState((curr) => ({
          ...curr,
          outdoors: { ...curr.outdoors, gateStatus: 'closed' },
        }));
        showFeedback('Gate closed', 'outdoors-gate');
      }, 3850);
      gateTimersRef.current = [t1, t2];
      return { ...prev, outdoors: { ...prev.outdoors, gateStatus: 'opening' } };
    });
  }, [showFeedback]);

  const toggleGardenLights = useCallback(() => {
    setRoomState((prev) => {
      const next = !prev.outdoors.gardenLightsOn;
      showFeedback(
        next ? 'Garden lights on · Scheduled for 6:30 pm' : 'Garden lights off · Scheduled for 6:30 pm',
        'outdoors-lights'
      );
      return { ...prev, outdoors: { ...prev.outdoors, gardenLightsOn: next } };
    });
  }, [showFeedback]);

  const selectCameraTile = useCallback(
    (cam: 'gate' | 'driveway' | 'side' | 'back', label: string) => {
      setRoomState((prev) => ({
        ...prev,
        outdoors: { ...prev.outdoors, activeCamera: cam, motionTile: cam },
      }));
      showFeedback(`${label} camera highlighted`, 'outdoors-cctv');
    },
    [showFeedback]
  );

  // =========================================================
  // SCRIPTED AUTO-DEMO & REPLAY DEMO
  // =========================================================
  const moveCursorToTarget = useCallback((targetAttr: string): boolean => {
    const phoneEl = phonePanelRef.current;
    if (!phoneEl) return false;
    const targetEl = phoneEl.querySelector<HTMLElement>(`[data-demo-target="${targetAttr}"]`);
    if (!targetEl) return false;
    const pRect = phoneEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();
    const x = tRect.left - pRect.left + tRect.width / 2;
    const y = tRect.top - pRect.top + tRect.height / 2;
    setDemoCursor({ visible: true, x, y, tapping: false });
    return true;
  }, []);

  const runScriptedSteps = useCallback(
    (steps: { target: string; action: () => void; delayAfter: number }[]) => {
      stopDemo();
      setIsDemoPlaying(true);

      let elapsed = 350;
      const timers: number[] = [];

      steps.forEach((step, idx) => {
        // Move cursor over control
        timers.push(
          window.setTimeout(() => {
            moveCursorToTarget(step.target);
          }, elapsed)
        );
        // Tap press
        timers.push(
          window.setTimeout(() => {
            setDemoCursor((prev) => ({ ...prev, tapping: true }));
            step.action();
          }, elapsed + 520)
        );
        // Release tap
        timers.push(
          window.setTimeout(() => {
            setDemoCursor((prev) => ({ ...prev, tapping: false }));
          }, elapsed + 860)
        );

        elapsed += 860 + step.delayAfter;

        if (idx === steps.length - 1) {
          timers.push(
            window.setTimeout(() => {
              setDemoCursor((prev) => ({ ...prev, visible: false, tapping: false }));
              setIsDemoPlaying(false);
            }, elapsed + 320)
          );
        }
      });

      demoTimersRef.current = timers;
    },
    [moveCursorToTarget, stopDemo]
  );

  // Initial once-only Entrance auto-demo when section reaches ~40% visibility
  useEffect(() => {
    if (reducedMotion || hasPlayedInitialDemoRef.current) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || entry.intersectionRatio < 0.38) return;
        if (hasPlayedInitialDemoRef.current || userInteractedRef.current) return;
        hasPlayedInitialDemoRef.current = true;
        observer.disconnect();

        // Reset entrance to calm, then tap Smart door lock -> Motion light
        setActiveRoomId('entrance');
        setRoomState((prev) => ({
          ...prev,
          entrance: {
            lockUnlocked: false,
            motionLightOn: false,
            doorbellOpen: false,
            doorbellTalking: false,
          },
        }));

        runScriptedSteps([
          {
            target: 'entrance-lock',
            action: () => {
              setRoomState((prev) => ({
                ...prev,
                entrance: { ...prev.entrance, lockUnlocked: true },
              }));
              showFeedback('Front door unlocked · 8:42 pm', 'entrance-lock');
            },
            delayAfter: 900,
          },
          {
            target: 'entrance-light',
            action: () => {
              setRoomState((prev) => ({
                ...prev,
                entrance: { ...prev.entrance, motionLightOn: true },
              }));
              showFeedback('Motion light on · Porch lit', 'entrance-light');
            },
            delayAfter: 700,
          },
        ]);
      },
      { threshold: [0.38, 0.45] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, runScriptedSteps, showFeedback]);

  // Replay demo for whichever room is currently active (scene button + one more control)
  const handleReplayDemo = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (reducedMotion) return;
      hasPlayedInitialDemoRef.current = true;

      if (activeRoomId === 'entrance') {
        setRoomState((prev) => ({
          ...prev,
          entrance: { ...INITIAL_ROOM_STATE.entrance },
        }));
        runScriptedSteps([
          { target: 'entrance-scene', action: triggerEntranceScene, delayAfter: 950 },
          { target: 'entrance-doorbell', action: openDoorbellCall, delayAfter: 1600 },
        ]);
      } else if (activeRoomId === 'living-room') {
        setRoomState((prev) => ({
          ...prev,
          'living-room': { ...INITIAL_ROOM_STATE['living-room'] },
        }));
        runScriptedSteps([
          { target: 'living-scene', action: triggerLivingMovieMode, delayAfter: 1000 },
          { target: 'living-ac-minus', action: () => stepLivingAc(-1), delayAfter: 700 },
        ]);
      } else if (activeRoomId === 'bedroom') {
        setRoomState((prev) => ({
          ...prev,
          bedroom: { ...INITIAL_ROOM_STATE.bedroom },
        }));
        runScriptedSteps([
          { target: 'bedroom-scene', action: triggerBedroomGoodnight, delayAfter: 1000 },
          { target: 'bedroom-lamp', action: toggleBedsideLamp, delayAfter: 700 },
        ]);
      } else if (activeRoomId === 'kitchen') {
        setRoomState((prev) => ({
          ...prev,
          kitchen: { ...INITIAL_ROOM_STATE.kitchen },
        }));
        runScriptedSteps([
          { target: 'kitchen-scene', action: triggerKitchenLeakTest, delayAfter: 1200 },
          { target: 'kitchen-eco', action: toggleKitchenEco, delayAfter: 700 },
        ]);
      } else if (activeRoomId === 'outdoors') {
        setRoomState((prev) => ({
          ...prev,
          outdoors: { ...INITIAL_ROOM_STATE.outdoors },
        }));
        runScriptedSteps([
          { target: 'outdoors-scene', action: triggerOutdoorsSecure, delayAfter: 1000 },
          {
            target: 'outdoors-cam-driveway',
            action: () => selectCameraTile('driveway', 'Driveway'),
            delayAfter: 800,
          },
        ]);
      }
    },
    [
      activeRoomId,
      openDoorbellCall,
      reducedMotion,
      runScriptedSteps,
      selectCameraTile,
      stepLivingAc,
      toggleBedsideLamp,
      toggleKitchenEco,
      triggerBedroomGoodnight,
      triggerEntranceScene,
      triggerKitchenLeakTest,
      triggerLivingMovieMode,
      triggerOutdoorsSecure,
    ]
  );

  // =========================================================
  // ROOM NAVIGATION & SWIPE & MARKER CLICK
  // =========================================================
  const selectRoom = useCallback(
    (roomId: RoomId) => {
      handleUserInteraction();
      setActiveRoomId(roomId);
      setActiveControlId(null);
      setHoveredMarkerId(null);
    },
    [handleUserInteraction]
  );

  const handleRoomTabKeyDown = (
    e: React.KeyboardEvent,
    idx: number,
    isDesktop: boolean
  ) => {
    let nextIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % ROOM_DEMO_DATA.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + ROOM_DEMO_DATA.length) % ROOM_DEMO_DATA.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = ROOM_DEMO_DATA.length - 1;
    } else {
      return;
    }
    const nextRoom = ROOM_DEMO_DATA[nextIdx];
    selectRoom(nextRoom.id);
    const refArr = isDesktop ? desktopTabRefs.current : mobileTabRefs.current;
    refArr[nextIdx]?.focus();
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      const nextIdx =
        dx < 0
          ? (activeRoomIndex + 1) % ROOM_DEMO_DATA.length
          : (activeRoomIndex - 1 + ROOM_DEMO_DATA.length) % ROOM_DEMO_DATA.length;
      selectRoom(ROOM_DEMO_DATA[nextIdx].id);
    }
  };

  const handleMarkerClick = (markerId: string, controlId: string) => {
    handleUserInteraction();
    setHoveredMarkerId(markerId);
    setActiveControlId(controlId);
    setPulsingControlId(controlId);
    window.setTimeout(() => {
      setPulsingControlId((curr) => (curr === controlId ? null : curr));
    }, 650);

    const controlEl = phonePanelRef.current?.querySelector<HTMLElement>(
      `[data-control-row="${controlId}"]`
    );
    if (controlEl) {
      controlEl.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }
  };

  // Compute marker visual state from live room state
  const getMarkerStatus = (markerId: string) => {
    switch (markerId) {
      case 'entrance-lock':
        return {
          color: roomState.entrance.lockUnlocked ? '#25d366' : '#ffc46b',
          statusText: roomState.entrance.lockUnlocked ? 'Unlocked' : 'Locked',
          fastPulse: false,
          liveRing: false,
        };
      case 'entrance-doorbell':
        return {
          color: roomState.entrance.doorbellOpen ? '#ffffff' : '#ffc46b',
          statusText: roomState.entrance.doorbellOpen ? 'Call active' : 'Ready',
          fastPulse: roomState.entrance.doorbellOpen,
          liveRing: roomState.entrance.doorbellOpen,
        };
      case 'entrance-light':
        return {
          color: '#ffc46b',
          statusText: roomState.entrance.motionLightOn ? 'On' : 'Off',
          fastPulse: false,
          liveRing: false,
        };
      case 'living-lights':
        return {
          color: '#ffc46b',
          statusText: `${roomState['living-room'].lightsLevel}%`,
          fastPulse: false,
          liveRing: false,
        };
      case 'living-curtains':
        return {
          color: '#ffc46b',
          statusText: roomState['living-room'].curtainsClosed ? 'Closed' : 'Open',
          fastPulse: false,
          liveRing: false,
        };
      case 'living-ac':
        return {
          color: roomState['living-room'].acTemp < 25 ? '#9ccbff' : '#ffc46b',
          statusText: `${roomState['living-room'].acTemp}°C`,
          fastPulse: false,
          liveRing: false,
        };
      case 'bedroom-lamp':
        return {
          color: '#ffc46b',
          statusText: roomState.bedroom.bedsideLampOn ? 'On' : 'Off',
          fastPulse: false,
          liveRing: false,
        };
      case 'bedroom-nightlight':
        return {
          color: '#ffc46b',
          statusText: roomState.bedroom.nightLightOn ? 'On' : 'Off',
          fastPulse: false,
          liveRing: false,
        };
      case 'bedroom-ac':
        return {
          color: '#9ccbff',
          statusText: `${roomState.bedroom.acTemp}°C`,
          fastPulse: false,
          liveRing: false,
        };
      case 'kitchen-leak':
        return {
          color: roomState.kitchen.leakAlertActive ? '#ff5a5f' : '#ffc46b',
          statusText: roomState.kitchen.leakAlertActive ? 'Leak detected' : 'Dry',
          fastPulse: roomState.kitchen.leakAlertActive,
          liveRing: false,
        };
      case 'kitchen-plug':
        return {
          color: roomState.kitchen.smartPlugOn ? '#25d366' : '#ffc46b',
          statusText: roomState.kitchen.smartPlugOn ? 'On' : 'Off',
          fastPulse: false,
          liveRing: false,
        };
      case 'kitchen-inverter':
        return {
          color: roomState.kitchen.ecoModeOn ? '#25d366' : '#ffc46b',
          statusText: roomState.kitchen.ecoModeOn ? 'Eco mode' : '84% battery',
          fastPulse: false,
          liveRing: false,
        };
      case 'outdoors-gate':
        return {
          color: roomState.outdoors.gateStatus === 'open' ? '#9ccbff' : '#ffc46b',
          statusText:
            roomState.outdoors.gateStatus === 'opening'
              ? 'Opening…'
              : roomState.outdoors.gateStatus === 'open'
                ? 'Open'
                : 'Closed',
          fastPulse: roomState.outdoors.gateStatus === 'opening',
          liveRing: false,
        };
      case 'outdoors-cam-gate': {
        const selected =
          roomState.outdoors.activeCamera === 'gate' ||
          roomState.outdoors.activeCamera === 'driveway';
        return {
          color: selected ? '#ffffff' : '#ffc46b',
          statusText: 'Live',
          fastPulse: selected,
          liveRing: selected,
        };
      }
      case 'outdoors-cam-eave': {
        const selected =
          roomState.outdoors.activeCamera === 'side' ||
          roomState.outdoors.activeCamera === 'back';
        return {
          color: selected ? '#ffffff' : '#ffc46b',
          statusText: 'Live',
          fastPulse: selected,
          liveRing: selected,
        };
      }
      case 'outdoors-lights':
      default:
        return {
          color: '#ffc46b',
          statusText: roomState.outdoors.gardenLightsOn ? 'On' : '6:30 pm',
          fastPulse: false,
          liveRing: false,
        };
    }
  };

  // Final survey CTA derivation
  const addedDevices = useMemo(
    () => ALL_INSTALL_DEVICES.filter((d) => addedDeviceIds.includes(d.id)),
    [addedDeviceIds]
  );

  const handleFinalSurveyClick = () => {
    if (addedDevices.length === 0) {
      onProceedToSurvey([], '');
      return;
    }
    const chips = Array.from(new Set(addedDevices.map((d) => d.surveyChip)));
    const note = `Devices added from room demo: ${addedDevices.map((d) => d.name).join(', ')}.`;
    onProceedToSurvey(chips, note);
  };

  const calmFailed = failedImages[`${activeRoom.id}-calm`];
  const sceneFailed = failedImages[`${activeRoom.id}-scene`];
  const formattedCctvTime = `20:42:${String(cctvSecondOffset).padStart(2, '0')}`;

  // Kitchen power bars (demo data)
  const powerBars = roomState.kitchen.ecoModeOn
    ? [
      { label: 'Solar', pct: 86, color: '#ffc46b' },
      { label: 'Inverter', pct: 28, color: '#25d366' },
      { label: 'Grid', pct: 6, color: '#9ccbff' },
    ]
    : [
      { label: 'Solar', pct: 64, color: '#ffc46b' },
      { label: 'Inverter', pct: 52, color: '#25d366' },
      { label: 'Grid', pct: 24, color: '#9ccbff' },
    ];

  const rowHighlightClass = (controlId: string) =>
    `${pulsingControlId === controlId ? 'control-pulse' : ''} ${activeControlId === controlId ? 'border-[#ffc46b]/70 bg-[#142544]' : 'border-white/12 bg-[#0a1220]/75'
    }`;

  return (
    <section
      ref={sectionRef}
      id="rooms"
      aria-labelledby="rooms-heading"
      onPointerDown={handleUserInteraction}
      onKeyDown={handleUserInteraction}
      className="surface-navy pt-[72px] pb-[168px] min-[820px]:py-[120px]"
    >
      {/* Screen reader polite live region for control outcomes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="site-container">
        {/* Section Header */}
        <div className="reveal">
          <span className="section-label">See it in action</span>
          <h2 id="rooms-heading" className="section-headline">
            A smarter home, room by room.
          </h2>
          <p className="section-intro">
            Pick a room, then tap the controls on the phone. Watch the room respond.
          </p>
        </div>

        {/* =======================================================
            MOBILE HORIZONTAL SCROLLING ROOM TABS (< 820px)
            ======================================================= */}
        <div className="only-mobile-block relative mt-8 -mx-5 px-5">
          <div
            ref={mobileTabRowRef}
            role="tablist"
            aria-label="Home rooms"
            className="snap-row gap-2.5 pb-1 pr-10"
          >
            {ROOM_DEMO_DATA.map((room, idx) => {
              const isSelected = room.id === activeRoom.id;
              return (
                <button
                  key={room.id}
                  ref={(el) => {
                    mobileTabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`mobile-room-tab-${room.id}`}
                  aria-selected={isSelected}
                  aria-controls={`room-panel-${room.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectRoom(room.id)}
                  onKeyDown={(e) => handleRoomTabKeyDown(e, idx, false)}
                  className="snap-start shrink-0 h-[48px] px-4 rounded-full inline-flex items-center gap-2 text-[15px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#ffc46b' : 'rgba(16, 28, 51, 0.8)',
                    color: isSelected ? '#0a1220' : '#ffffff',
                    border: isSelected
                      ? '1px solid #ffc46b'
                      : '1px solid rgba(255, 255, 255, 0.14)',
                    backdropFilter: isSelected ? 'none' : 'blur(10px)',
                  }}
                >
                  <RoomTabIcon roomId={room.id} size={17} />
                  <span>{room.label}</span>
                </button>
              );
            })}
          </div>
          {/* Right-edge fade indicator showing more tabs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 bottom-0 w-12"
            style={{
              background: 'linear-gradient(to left, #0a1220 20%, rgba(10, 18, 32, 0))',
            }}
          />
        </div>

        {/* =======================================================
            MAIN INTERACTIVE STAGE: DESKTOP 2-COL / MOBILE STACK
            ======================================================= */}
        <div className="mt-6 min-[820px]:mt-14 w-full min-w-0 grid grid-cols-1 min-[820px]:grid-cols-[224px_minmax(0,1fr)] min-[1100px]:grid-cols-[260px_minmax(0,1fr)] gap-6 min-[820px]:gap-6 min-[1100px]:gap-8 items-start">
          {/* Desktop Vertical Room Tabs + Replay Demo (820px+) */}
          <div className="only-desktop flex-col gap-3">
            <div
              role="tablist"
              aria-label="Home rooms"
              aria-orientation="vertical"
              className="flex flex-col gap-2.5"
            >
              {ROOM_DEMO_DATA.map((room, idx) => {
                const isSelected = room.id === activeRoom.id;
                return (
                  <button
                    key={room.id}
                    ref={(el) => {
                      desktopTabRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`desktop-room-tab-${room.id}`}
                    aria-selected={isSelected}
                    aria-controls={`room-panel-${room.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => selectRoom(room.id)}
                    onKeyDown={(e) => handleRoomTabKeyDown(e, idx, true)}
                    className="w-full h-[64px] px-4 rounded-[18px] flex items-center gap-3.5 text-left cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isSelected ? '#ffc46b' : '#101c33',
                      color: isSelected ? '#0a1220' : '#ffffff',
                      border: isSelected
                        ? '1px solid #ffc46b'
                        : '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(10, 18, 32, 0.12)'
                          : 'rgba(255, 255, 255, 0.07)',
                        color: isSelected ? '#0a1220' : '#ffc46b',
                      }}
                    >
                      <RoomTabIcon roomId={room.id} size={19} />
                    </span>
                    <span className="min-w-0 flex flex-col">
                      <span className="text-[15px] font-semibold leading-tight truncate">
                        {room.label}
                      </span>
                      <span
                        className="text-[13px] leading-tight mt-0.5"
                        style={{
                          color: isSelected ? 'rgba(10, 18, 32, 0.78)' : '#b9c4d6',
                        }}
                      >
                        {room.deviceCountLabel}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {!reducedMotion && (
              <button
                type="button"
                onClick={handleReplayDemo}
                className="mt-2 self-start inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[14px] font-semibold text-white bg-[#101c33] border border-white/16 hover:border-[#ffc46b]/70 hover:text-[#ffc46b] cursor-pointer transition-colors"
              >
                <ControlIcon name="play" size={14} />
                <span>{isDemoPlaying ? 'Playing demo…' : 'Replay demo'}</span>
              </button>
            )}
          </div>

          {/* Right Column (Desktop) / Stacked Stage + Phone (Mobile) */}
          <div
            id={`room-panel-${activeRoom.id}`}
            role="tabpanel"
            aria-labelledby={`desktop-room-tab-${activeRoom.id} mobile-room-tab-${activeRoom.id}`}
            className="relative w-full min-w-0 max-w-full flex flex-col gap-6 min-[820px]:block min-[820px]:min-h-[600px] min-[1100px]:min-h-[668px]"
          >
            {/* ROOM PICTURE STAGE */}
            <div className="w-full max-w-full min-w-0 min-[820px]:w-[84%] min-[1100px]:w-[82%]">
              <div
                ref={stageRef}
                onPointerDown={handleStagePointerDown}
                onPointerUp={handleStagePointerUp}
                className="room-stage w-full aspect-[4/3] min-[820px]:aspect-[16/10] rounded-[20px] min-[820px]:rounded-[24px] border border-white/14 shadow-2xl touch-pan-y select-none"
              >
                {/* Crossfading Room Image Pair (Calm base + Clock-driven Scene top) */}
                <div key={activeRoom.id} className="room-enter-anim absolute inset-0">
                  {calmFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#101c33]">
                      <span className="text-[14px] font-semibold text-[#ffc46b] mb-1">
                        OG Smarthomes
                      </span>
                      <span className="text-[20px] font-semibold text-white">
                        {activeRoom.label}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={activeRoom.calmImage}
                      alt={activeRoom.calmAlt}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [`${activeRoom.id}-calm`]: true }))
                      }
                      className="room-photo-calm"
                    />
                  )}

                  {!sceneFailed && !calmFailed && (
                    <img
                      src={activeRoom.sceneImage}
                      alt={activeRoom.sceneAlt}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [`${activeRoom.id}-scene`]: true }))
                      }
                      className="room-photo-scene"
                    />
                  )}
                </div>

                {/* Single-clock CSS variable overlays (zero transitions) */}
                {activeRoom.id === 'entrance' && <div className="room-overlay-entrance-glow" />}
                {activeRoom.id === 'living-room' && (
                  <>
                    <div className="room-overlay-living-dim" />
                    <div className="room-overlay-living-curtain" />
                    <div className="room-overlay-living-cool" />
                  </>
                )}
                {activeRoom.id === 'bedroom' && (
                  <>
                    <div className="room-overlay-bedroom-lamp" />
                    <div className="room-overlay-bedroom-nightlight" />
                  </>
                )}
                {activeRoom.id === 'kitchen' && <div className="room-overlay-kitchen-plug" />}
                {activeRoom.id === 'outdoors' && (
                  <>
                    <div className="room-overlay-outdoors-garden" />
                    <div className="room-overlay-outdoors-gate" />
                  </>
                )}

                {/* Subtle top gradient scrim for chip legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-20"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(10, 18, 32, 0.52) 0%, rgba(10, 18, 32, 0) 100%)',
                  }}
                />

                {/* Top-left room name chip */}
                <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1220]/80 backdrop-blur-md border border-white/16 text-white text-[13px] font-semibold">
                  <span className="text-[#ffc46b]">
                    <RoomTabIcon roomId={activeRoom.id} size={15} />
                  </span>
                  <span>{activeRoom.label}</span>
                </div>

                {/* Interactive Device Markers */}
                {activeRoom.markers.map((marker) => {
                  const status = getMarkerStatus(marker.id);
                  const isFocused =
                    hoveredMarkerId === marker.id || activeControlId === marker.controlId;
                  const alignRight = marker.x > 64;
                  const alignLeft = marker.x < 30;
                  return (
                    <div
                      key={marker.id}
                      className="absolute z-20"
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleMarkerClick(marker.id, marker.controlId)}
                        onMouseEnter={() => setHoveredMarkerId(marker.id)}
                        onMouseLeave={() =>
                          setHoveredMarkerId((curr) => (curr === marker.id ? null : curr))
                        }
                        onFocus={() => setHoveredMarkerId(marker.id)}
                        onBlur={() =>
                          setHoveredMarkerId((curr) => (curr === marker.id ? null : curr))
                        }
                        aria-label={`${marker.label} — ${status.statusText}. Highlight control in phone.`}
                        className="relative w-[44px] h-[44px] flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
                        style={{ color: status.color }}
                      >
                        {/* Pulsing ring */}
                        <span
                          aria-hidden="true"
                          className={`room-marker-pulse ${status.fastPulse ? 'room-marker-pulse-fast' : ''
                            }`}
                        />

                        {/* 28px round marker */}
                        <span
                          className="relative w-[28px] h-[28px] rounded-full flex items-center justify-center shadow-lg transition-transform duration-150"
                          style={{
                            backgroundColor: 'rgba(10, 18, 32, 0.86)',
                            border: status.liveRing
                              ? '2.5px solid #ffffff'
                              : `2px solid ${status.color}`,
                            transform: isFocused ? 'scale(1.12)' : 'scale(1)',
                          }}
                        >
                          <span
                            className="w-[10px] h-[10px] rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                        </span>
                      </button>

                      {/* Marker label tooltip on hover/tap or desktop active control */}
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-full mt-1 max-w-[190px] truncate whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0a1220]/92 border border-white/18 text-[13px] font-semibold text-white shadow-lg transition-opacity duration-150 ${isFocused ? 'opacity-100' : 'opacity-0'
                          }`}
                        style={{
                          left: alignRight ? 'auto' : alignLeft ? '0' : '50%',
                          right: alignRight ? '0' : 'auto',
                          transform: alignRight || alignLeft ? 'none' : 'translateX(-50%)',
                        }}
                      >
                        <span>{marker.label}</span>
                        <span className="text-[#b9c4d6] font-normal"> · {status.statusText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Five Room Dots + Keyboard/Tap Prev & Next + Mobile Replay Demo */}
              <div className="mt-3.5 w-full min-w-0 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 min-[820px]:max-w-[calc(100%-170px)] min-[1100px]:max-w-[calc(100%-185px)]">
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous room"
                    onClick={() =>
                      selectRoom(
                        ROOM_DEMO_DATA[
                          (activeRoomIndex - 1 + ROOM_DEMO_DATA.length) % ROOM_DEMO_DATA.length
                        ].id
                      )
                    }
                    className="w-[40px] min-[390px]:w-[44px] h-[44px] rounded-full inline-flex items-center justify-center text-[#d3dcea] hover:text-white bg-transparent border border-white/12 cursor-pointer transition-colors shrink-0"
                  >
                    <ChevronLeftIcon size={17} />
                  </button>

                  <div className="flex items-center" role="group" aria-label="Room slides">
                    {ROOM_DEMO_DATA.map((room, idx) => {
                      const active = idx === activeRoomIndex;
                      return (
                        <button
                          key={room.id}
                          type="button"
                          aria-label={`Show ${room.label}`}
                          aria-current={active ? 'true' : undefined}
                          onClick={() => selectRoom(room.id)}
                          className="w-[22px] min-[390px]:w-[26px] h-[44px] inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer shrink-0"
                        >
                          <span
                            className="block rounded-full transition-all duration-200"
                            style={{
                              width: active ? '18px' : '7px',
                              height: '7px',
                              backgroundColor: active ? '#ffc46b' : 'rgba(255, 255, 255, 0.3)',
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    aria-label="Next room"
                    onClick={() =>
                      selectRoom(ROOM_DEMO_DATA[(activeRoomIndex + 1) % ROOM_DEMO_DATA.length].id)
                    }
                    className="w-[40px] min-[390px]:w-[44px] h-[44px] rounded-full inline-flex items-center justify-center text-[#d3dcea] hover:text-white bg-transparent border border-white/12 cursor-pointer transition-colors shrink-0"
                  >
                    <ChevronRightIcon size={17} />
                  </button>
                </div>

                {/* Mobile Replay Demo button */}
                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={handleReplayDemo}
                    className="only-mobile items-center justify-center gap-1.5 min-h-[44px] px-3 min-[390px]:px-3.5 rounded-full text-[13px] font-semibold text-white bg-[#101c33] border border-white/16 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ControlIcon name="play" size={13} />
                    <span>{isDemoPlaying ? 'Playing…' : 'Replay demo'}</span>
                  </button>
                )}
              </div>

              {/* Desktop room guidance strip beneath picture to left of overlapping phone */}
              <p className="only-desktop-block mt-4 text-[14px] text-[#b9c4d6] max-w-[calc(100%-180px)] min-[1100px]:max-w-[420px] leading-relaxed">
                Tap any glowing marker in the room or try the live controls on the phone. Your
                room states stay remembered as you explore.
              </p>
            </div>

            {/* =======================================================
                PHONE APP PANEL (Flat card on phones; Floating drawn
                phone frame overlapping right edge at bottom on desktop)
                ======================================================= */}
            <div className="w-full max-w-full min-w-0 min-[820px]:w-[260px] min-[1100px]:w-[300px] min-[820px]:absolute min-[820px]:right-0 min-[820px]:top-[24px] min-[1100px]:top-[36px] z-30">
              <div className="phone-frame-float w-full min-w-0">
                <div
                  ref={phonePanelRef}
                  className="relative w-full max-w-full overflow-hidden bg-[#101c33] rounded-[24px] min-[820px]:rounded-[36px] border border-white/14 min-[820px]:border-[6px] min-[820px]:border-[#1b2b48] min-[820px]:ring-1 min-[820px]:ring-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.55)] min-[820px]:h-[560px] min-[1100px]:h-[600px] flex flex-col"
                >
                  {/* Desktop pill-shaped camera cut-out */}
                  <div
                    aria-hidden="true"
                    className="only-desktop-block absolute top-2.5 left-1/2 -translate-x-1/2 w-[74px] h-[18px] rounded-full bg-[#070d18] z-30"
                  />

                  {/* Status Bar (Time 8:42, signal & battery icons) */}
                  <div className="px-4 min-[390px]:px-5 pt-3.5 pb-2 min-[820px]:pt-3 flex items-center justify-between text-[13px] font-semibold text-white/90 tabular-nums border-b border-white/8 bg-[#0b1528]/70 shrink-0">
                    <span>8:42</span>
                    <div className="flex items-center gap-2 text-white/85" aria-hidden="true">
                      {/* Signal bars */}
                      <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
                        <rect x="0" y="8" width="2.5" height="4" rx="0.8" />
                        <rect x="4" y="5.5" width="2.5" height="6.5" rx="0.8" />
                        <rect x="8" y="3" width="2.5" height="9" rx="0.8" />
                        <rect x="12" y="0.5" width="2.5" height="11.5" rx="0.8" />
                      </svg>
                      {/* Battery */}
                      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                        <rect x="0.75" y="1" width="18" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="2.5" y="2.8" width="12.5" height="6.4" rx="1.2" fill="currentColor" />
                        <path d="M20.5 4.2v3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Phone Screen Body */}
                  <div
                    key={activeRoom.id}
                    className="phone-content-enter relative flex-1 min-w-0 px-3.5 min-[390px]:px-4 pt-3.5 pb-4 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden"
                  >
                    {/* Title Row: Room Name + Online */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[18px] font-semibold text-white m-0 leading-tight truncate">
                        {activeRoom.label}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#d3dcea] shrink-0">
                        <span
                          aria-hidden="true"
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#25d366' }}
                        />
                        <span>Online</span>
                      </span>
                    </div>

                    {/* Kitchen Red Leak Alert Banner */}
                    {activeRoom.id === 'kitchen' && roomState.kitchen.leakAlertActive && (
                      <div
                        role="alert"
                        className="px-3.5 py-2.5 rounded-[14px] bg-[#ff5a5f]/20 border border-[#ff5a5f] text-white text-[13px] font-semibold flex items-center gap-2"
                      >
                        <span className="text-[#ff8a78] shrink-0">
                          <ControlIcon name="drop" size={16} />
                        </span>
                        <span>Leak detected · Water valve closed</span>
                      </div>
                    )}

                    {/* Scene Button at Top */}
                    <button
                      type="button"
                      data-demo-target={`${activeRoom.id === 'living-room' ? 'living' : activeRoom.id}-scene`}
                      onClick={() => {
                        if (activeRoom.id === 'entrance') triggerEntranceScene();
                        else if (activeRoom.id === 'living-room') triggerLivingMovieMode();
                        else if (activeRoom.id === 'bedroom') triggerBedroomGoodnight();
                        else if (activeRoom.id === 'kitchen') triggerKitchenLeakTest();
                        else triggerOutdoorsSecure();
                      }}
                      className="w-full min-h-[46px] px-4 rounded-full bg-[#ffc46b] hover:bg-[#ffd085] text-[#0a1220] text-[14px] font-semibold inline-flex items-center justify-center gap-2 border-0 cursor-pointer transition-colors shrink-0"
                    >
                      <ControlIcon
                        name={
                          activeRoom.id === 'bedroom'
                            ? 'moon'
                            : activeRoom.id === 'kitchen'
                              ? 'drop'
                              : 'scene'
                        }
                        size={16}
                      />
                      <span>{activeRoom.sceneButtonLabel}</span>
                    </button>

                    {/* ==========================================
                        ENTRANCE CONTROLS
                        ========================================== */}
                    {activeRoom.id === 'entrance' && (
                      <div className="flex flex-col gap-2.5">
                        {/* Smart door lock */}
                        <div
                          data-control-row="entrance-lock"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'entrance-lock'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: roomState.entrance.lockUnlocked
                                  ? 'rgba(37, 211, 102, 0.16)'
                                  : 'rgba(255, 196, 107, 0.14)',
                                color: roomState.entrance.lockUnlocked ? '#25d366' : '#ffc46b',
                              }}
                            >
                              <ControlIcon name="lock" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Smart door lock
                              </div>
                              <div
                                className="text-[14px] leading-tight mt-0.5 truncate"
                                style={{
                                  color: roomState.entrance.lockUnlocked ? '#7ef0a6' : '#b9c4d6',
                                }}
                              >
                                {roomState.entrance.lockUnlocked ? 'Unlocked' : 'Locked'}
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.entrance.lockUnlocked}
                            label="Smart door lock"
                            onToggle={toggleEntranceLock}
                            demoTarget="entrance-lock"
                          />
                        </div>

                        {/* Motion light */}
                        <div
                          data-control-row="entrance-light"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'entrance-light'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: roomState.entrance.motionLightOn
                                  ? 'rgba(255, 196, 107, 0.22)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                color: roomState.entrance.motionLightOn ? '#ffc46b' : '#b9c4d6',
                              }}
                            >
                              <ControlIcon name="light" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Motion light
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState.entrance.motionLightOn ? 'On · Porch lit' : 'Off'}
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.entrance.motionLightOn}
                            label="Motion light"
                            onToggle={toggleEntranceLight}
                            demoTarget="entrance-light"
                          />
                        </div>

                        {/* Video doorbell */}
                        <div
                          data-control-row="entrance-doorbell"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'entrance-doorbell'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="doorbell" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Video doorbell
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState.entrance.doorbellOpen
                                  ? `Live · ${formatCallTime(callSeconds)}`
                                  : 'Visitor at front door'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            data-demo-target="entrance-doorbell"
                            onClick={
                              roomState.entrance.doorbellOpen ? closeDoorbellCall : openDoorbellCall
                            }
                            className="min-h-[44px] px-3.5 rounded-full text-[14px] font-semibold border-0 cursor-pointer shrink-0 transition-colors"
                            style={{
                              backgroundColor: roomState.entrance.doorbellOpen
                                ? '#ff5a5f'
                                : '#25d366',
                              color: '#0a1220',
                            }}
                          >
                            {roomState.entrance.doorbellOpen ? 'Close' : 'Answer'}
                          </button>
                        </div>

                        {/* In-phone Visitor View Overlay */}
                        {roomState.entrance.doorbellOpen && (
                          <div className="rounded-[16px] overflow-hidden border border-white/18 bg-[#070d18]">
                            <div className="relative h-[124px] w-full overflow-hidden">
                              <img
                                src={activeRoom.sceneImage}
                                alt="Video doorbell live feed"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-75 scale-110"
                              />
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-[#070d18]/65"
                              />
                              <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                                <span className="w-2 h-2 rounded-full bg-[#ff5a5f]" />
                                <span>Front porch</span>
                              </div>
                              <div className="absolute top-2.5 right-2.5 text-[13px] font-semibold text-white tabular-nums">
                                {formatCallTime(callSeconds)}
                              </div>
                              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={toggleDoorbellTalk}
                                  className="flex-1 min-h-[44px] rounded-full text-[13px] font-semibold border-0 cursor-pointer transition-colors"
                                  style={{
                                    backgroundColor: roomState.entrance.doorbellTalking
                                      ? '#ffc46b'
                                      : 'rgba(255,255,255,0.16)',
                                    color: roomState.entrance.doorbellTalking ? '#0a1220' : '#ffffff',
                                  }}
                                >
                                  {roomState.entrance.doorbellTalking ? 'Talking…' : 'Talk'}
                                </button>
                                <button
                                  type="button"
                                  onClick={closeDoorbellCall}
                                  className="min-h-[44px] px-4 rounded-full text-[13px] font-semibold bg-white/14 text-white border-0 cursor-pointer"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ==========================================
                        LIVING ROOM CONTROLS
                        ========================================== */}
                    {activeRoom.id === 'living-room' && (
                      <div className="flex flex-col gap-2.5">
                        {/* Lights slider */}
                        <div
                          data-control-row="living-lights"
                          className={`min-h-[76px] px-3.5 py-2.5 rounded-[16px] border flex flex-col gap-1 transition-colors ${rowHighlightClass(
                            'living-lights'
                          )}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-8 h-8 rounded-[10px] bg-[#ffc46b]/16 text-[#ffc46b] flex items-center justify-center shrink-0">
                                <ControlIcon name="light" size={17} />
                              </span>
                              <label
                                htmlFor="living-lights-slider"
                                className="text-[15px] font-semibold text-white truncate"
                              >
                                Lights
                              </label>
                            </div>
                            <span className="text-[14px] font-semibold text-[#ffc46b] tabular-nums">
                              {roomState['living-room'].lightsLevel}%
                            </span>
                          </div>
                          <input
                            id="living-lights-slider"
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={roomState['living-room'].lightsLevel}
                            aria-label="Living room lights brightness"
                            aria-valuetext={`${roomState['living-room'].lightsLevel} percent`}
                            onChange={(e) => setLivingLights(Number(e.target.value))}
                            className="demo-range -my-2"
                          />
                        </div>

                        {/* Curtains switch */}
                        <div
                          data-control-row="living-curtains"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'living-curtains'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="curtains" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Curtains
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState['living-room'].curtainsClosed ? 'Closed' : 'Open'}
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState['living-room'].curtainsClosed}
                            label="Living room curtains closed"
                            onToggle={toggleLivingCurtains}
                            demoTarget="living-curtains"
                          />
                        </div>

                        {/* AC stepper */}
                        <div
                          data-control-row="living-ac"
                          className={`min-h-[68px] px-3.5 py-2.5 rounded-[16px] border flex flex-wrap min-[375px]:flex-nowrap min-[820px]:flex-wrap min-[1100px]:flex-nowrap items-center justify-between gap-2 transition-colors ${rowHighlightClass(
                            'living-ac'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#9ccbff]/14 text-[#9ccbff] flex items-center justify-center shrink-0">
                              <ControlIcon name="ac" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Air conditioner
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 flex items-center gap-1.5">
                                {roomState['living-room'].acTemp < 25 ? (
                                  <>
                                    <span className="inline-flex text-[#9ccbff] fan-spin">
                                      <ControlIcon name="fan" size={14} />
                                    </span>
                                    <span className="text-[#9ccbff]">Cooling</span>
                                  </>
                                ) : (
                                  <span>Eco standby</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-auto">
                            <button
                              type="button"
                              data-demo-target="living-ac-minus"
                              aria-label="Decrease living room temperature"
                              disabled={roomState['living-room'].acTemp <= 18}
                              onClick={() => stepLivingAc(-1)}
                              className="w-[36px] h-[44px] rounded-[12px] bg-white/10 hover:bg-white/18 disabled:opacity-40 text-white text-[18px] font-semibold border-0 cursor-pointer flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="min-w-[34px] text-center text-[15px] font-semibold text-white tabular-nums">
                              {roomState['living-room'].acTemp}°
                            </span>
                            <button
                              type="button"
                              aria-label="Increase living room temperature"
                              disabled={roomState['living-room'].acTemp >= 28}
                              onClick={() => stepLivingAc(1)}
                              className="w-[36px] h-[44px] rounded-[12px] bg-white/10 hover:bg-white/18 disabled:opacity-40 text-white text-[18px] font-semibold border-0 cursor-pointer flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ==========================================
                        BEDROOM CONTROLS
                        ========================================== */}
                    {activeRoom.id === 'bedroom' && (
                      <div className="flex flex-col gap-2.5">
                        {/* Bedside lamp */}
                        <div
                          data-control-row="bedroom-lamp"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'bedroom-lamp'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/16 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="light" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Bedside lamp
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState.bedroom.bedsideLampOn ? 'On · Warm glow' : 'Off'}
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.bedroom.bedsideLampOn}
                            label="Bedside lamp"
                            onToggle={toggleBedsideLamp}
                            demoTarget="bedroom-lamp"
                          />
                        </div>

                        {/* Motion night light */}
                        <div
                          data-control-row="bedroom-nightlight"
                          className={`min-h-[68px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'bedroom-nightlight'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="moon" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Motion night light
                              </div>
                              <div className="text-[13px] text-[#b9c4d6] leading-snug mt-0.5">
                                Soft path light for night trips
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.bedroom.nightLightOn}
                            label="Motion night light"
                            onToggle={toggleNightLight}
                            demoTarget="bedroom-nightlight"
                          />
                        </div>

                        {/* Bedroom AC stepper with Sleep mode */}
                        <div
                          data-control-row="bedroom-ac"
                          className={`min-h-[68px] px-3.5 py-2.5 rounded-[16px] border flex flex-wrap min-[375px]:flex-nowrap min-[820px]:flex-wrap min-[1100px]:flex-nowrap items-center justify-between gap-2 transition-colors ${rowHighlightClass(
                            'bedroom-ac'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#9ccbff]/14 text-[#9ccbff] flex items-center justify-center shrink-0">
                              <ControlIcon name="ac" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Air conditioner
                              </div>
                              <div className="text-[14px] text-[#9ccbff] leading-tight mt-0.5 truncate">
                                Sleep mode
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-auto">
                            <button
                              type="button"
                              aria-label="Decrease bedroom temperature"
                              disabled={roomState.bedroom.acTemp <= 18}
                              onClick={() => stepBedroomAc(-1)}
                              className="w-[36px] h-[44px] rounded-[12px] bg-white/10 hover:bg-white/18 disabled:opacity-40 text-white text-[18px] font-semibold border-0 cursor-pointer flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="min-w-[34px] text-center text-[15px] font-semibold text-white tabular-nums">
                              {roomState.bedroom.acTemp}°
                            </span>
                            <button
                              type="button"
                              aria-label="Increase bedroom temperature"
                              disabled={roomState.bedroom.acTemp >= 28}
                              onClick={() => stepBedroomAc(1)}
                              className="w-[36px] h-[44px] rounded-[12px] bg-white/10 hover:bg-white/18 disabled:opacity-40 text-white text-[18px] font-semibold border-0 cursor-pointer flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ==========================================
                        KITCHEN AND UTILITY CONTROLS
                        ========================================== */}
                    {activeRoom.id === 'kitchen' && (
                      <div className="flex flex-col gap-2.5">
                        {/* Smart plug */}
                        <div
                          data-control-row="kitchen-plug"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'kitchen-plug'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: roomState.kitchen.smartPlugOn
                                  ? 'rgba(37, 211, 102, 0.16)'
                                  : 'rgba(255, 196, 107, 0.14)',
                                color: roomState.kitchen.smartPlugOn ? '#25d366' : '#ffc46b',
                              }}
                            >
                              <ControlIcon name="plug" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Smart plug · Kettle
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState.kitchen.smartPlugOn ? 'On · Powered' : 'Off'}
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.kitchen.smartPlugOn}
                            label="Kettle smart plug"
                            onToggle={toggleKitchenPlug}
                            demoTarget="kitchen-plug"
                          />
                        </div>

                        {/* Power panel card (Solar, Inverter, Grid + Battery [84%] + Eco mode) */}
                        <div
                          data-control-row="kitchen-power"
                          className={`p-3.5 rounded-[16px] border flex flex-col gap-2.5 transition-colors ${rowHighlightClass(
                            'kitchen-power'
                          )}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[15px] font-semibold text-white">
                              Power panel
                            </span>
                            <span className="text-[13px] font-semibold text-[#ffc46b] tabular-nums">
                              Battery [84%]
                            </span>
                          </div>

                          <div className="space-y-2">
                            {powerBars.map((bar) => (
                              <div key={bar.label} className="space-y-1">
                                <div className="flex items-center justify-between text-[13px]">
                                  <span className="text-[#d3dcea]">{bar.label}</span>
                                  <span className="text-white font-medium tabular-nums">
                                    {bar.pct}%
                                  </span>
                                </div>
                                <div className="h-[6px] w-full rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${bar.pct}%`,
                                      backgroundColor: bar.color,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span
                              className="text-[13px] font-medium"
                              style={{
                                color: roomState.kitchen.ecoModeOn ? '#7ef0a6' : '#b9c4d6',
                              }}
                            >
                              {roomState.kitchen.ecoModeOn ? 'Eco mode on' : 'Standard mode'}
                            </span>
                            <button
                              type="button"
                              data-demo-target="kitchen-eco"
                              onClick={toggleKitchenEco}
                              className="w-full min-[400px]:w-auto min-[820px]:w-full min-h-[44px] px-3.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
                              style={{
                                backgroundColor: roomState.kitchen.ecoModeOn
                                  ? '#ffc46b'
                                  : 'rgba(255, 255, 255, 0.08)',
                                color: roomState.kitchen.ecoModeOn ? '#0a1220' : '#ffffff',
                                borderColor: roomState.kitchen.ecoModeOn
                                  ? '#ffc46b'
                                  : 'rgba(255, 255, 255, 0.18)',
                              }}
                            >
                              {roomState.kitchen.ecoModeOn ? 'Eco mode on' : 'Switch to eco mode'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ==========================================
                        OUTDOORS CONTROLS
                        ========================================== */}
                    {activeRoom.id === 'outdoors' && (
                      <div className="flex flex-col gap-2.5">
                        {/* Gate */}
                        <div
                          data-control-row="outdoors-gate"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'outdoors-gate'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="gate" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Gate
                              </div>
                              <div className="text-[14px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                {roomState.outdoors.gateStatus === 'opening'
                                  ? 'Opening…'
                                  : roomState.outdoors.gateStatus === 'open'
                                    ? 'Open'
                                    : 'Closed'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            data-demo-target="outdoors-gate"
                            onClick={toggleOutdoorsGate}
                            className="min-h-[44px] px-3.5 rounded-full text-[14px] font-semibold border cursor-pointer shrink-0 transition-colors"
                            style={{
                              backgroundColor:
                                roomState.outdoors.gateStatus === 'closed'
                                  ? 'rgba(255, 255, 255, 0.1)'
                                  : '#ffc46b',
                              color:
                                roomState.outdoors.gateStatus === 'closed' ? '#ffffff' : '#0a1220',
                              borderColor:
                                roomState.outdoors.gateStatus === 'closed'
                                  ? 'rgba(255, 255, 255, 0.2)'
                                  : '#ffc46b',
                            }}
                          >
                            {roomState.outdoors.gateStatus === 'closed' ? 'Open' : 'Close'}
                          </button>
                        </div>

                        {/* Garden lights */}
                        <div
                          data-control-row="outdoors-lights"
                          className={`min-h-[64px] px-3.5 py-2.5 rounded-[16px] border flex items-center justify-between gap-2.5 transition-colors ${rowHighlightClass(
                            'outdoors-lights'
                          )}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-[11px] bg-[#ffc46b]/14 text-[#ffc46b] flex items-center justify-center shrink-0">
                              <ControlIcon name="light" size={18} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                                Garden lights
                              </div>
                              <div className="text-[13px] text-[#b9c4d6] leading-tight mt-0.5 truncate">
                                Scheduled for 6:30 pm
                              </div>
                            </div>
                          </div>
                          <DemoSwitch
                            checked={roomState.outdoors.gardenLightsOn}
                            label="Garden lights"
                            onToggle={toggleGardenLights}
                            demoTarget="outdoors-lights"
                          />
                        </div>

                        {/* CCTV 2x2 Grid */}
                        <div
                          data-control-row="outdoors-cctv"
                          className={`p-2.5 rounded-[16px] border transition-colors ${rowHighlightClass(
                            'outdoors-cctv'
                          )}`}
                        >
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[14px] font-semibold text-white">
                              CCTV cameras
                            </span>
                            <span className="text-[13px] text-[#b9c4d6]">
                              {roomState.outdoors.camerasArmed ? 'Armed' : 'Live'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {(
                              [
                                { id: 'gate', label: 'Gate' },
                                { id: 'driveway', label: 'Driveway' },
                                { id: 'side', label: 'Side yard' },
                                { id: 'back', label: 'Back' },
                              ] as const
                            ).map((cam) => {
                              const isSelected = roomState.outdoors.activeCamera === cam.id;
                              const hasMotion = roomState.outdoors.motionTile === cam.id;
                              return (
                                <button
                                  key={cam.id}
                                  type="button"
                                  data-demo-target={`outdoors-cam-${cam.id}`}
                                  aria-pressed={isSelected}
                                  onClick={() => selectCameraTile(cam.id, cam.label)}
                                  className="relative min-w-0 min-h-[72px] min-[820px]:min-h-[66px] rounded-[11px] overflow-hidden text-left p-2 flex flex-col justify-between cursor-pointer bg-[#070d18]"
                                  style={{
                                    border: isSelected
                                      ? '1.5px solid #ffc46b'
                                      : '1px solid rgba(255, 255, 255, 0.14)',
                                  }}
                                >
                                  <img
                                    src={activeRoom.sceneImage}
                                    alt=""
                                    aria-hidden="true"
                                    referrerPolicy="no-referrer"
                                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                                  />
                                  {/* Moving motion tracking box */}
                                  {hasMotion && (
                                    <span
                                      aria-hidden="true"
                                      className="cctv-motion-box absolute top-2 left-2 w-[26px] h-[18px] border border-white/90 rounded-[3px] pointer-events-none"
                                    />
                                  )}

                                  <div className="relative z-10 flex items-center justify-between gap-1">
                                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-white leading-none shrink-0">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a5f]" />
                                      <span>Live</span>
                                    </span>
                                    {hasMotion ? (
                                      <span className="text-[13px] font-medium text-[#ffc46b] leading-none truncate">
                                        Motion
                                      </span>
                                    ) : (
                                      <span className="text-[13px] text-white/75 tabular-nums leading-none truncate">
                                        {formattedCctvTime.slice(3)}
                                      </span>
                                    )}
                                  </div>

                                  <div className="relative z-10 flex items-center justify-between gap-1">
                                    <span className="text-[13px] font-semibold text-white truncate leading-none">
                                      {cam.label}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Confirmation Toast at bottom of phone */}
                    {toastText && (
                      <div
                        key={toastKey}
                        className="demo-toast mt-auto pt-1"
                        role="status"
                      >
                        <div className="px-3.5 py-2.5 rounded-[14px] bg-[#070d18]/95 border border-[#ffc46b]/45 text-white text-[13px] font-medium flex items-center gap-2 shadow-lg">
                          <span className="text-[#ffc46b] shrink-0">
                            <CheckIcon size={15} />
                          </span>
                          <span className="leading-snug">{toastText}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scripted Auto-Demo White Finger Cursor */}
                  {!reducedMotion && demoCursor.visible && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 left-0 z-40 transition-transform duration-500 ease-out"
                      style={{
                        transform: `translate3d(${demoCursor.x}px, ${demoCursor.y}px, 0)`,
                      }}
                    >
                      {demoCursor.tapping && (
                        <span className="demo-cursor-tap-ring absolute top-0 left-0 w-9 h-9 rounded-full border-2 border-[#ffc46b]" />
                      )}
                      <span
                        className="block -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 border-2 border-[#0a1220] shadow-[0_6px_18px_rgba(0,0,0,0.5)] transition-transform duration-150"
                        style={{
                          transform: demoCursor.tapping
                            ? 'translate(-50%, -50%) scale(0.82)'
                            : 'translate(-50%, -50%) scale(1)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Required demo data disclaimer line directly under the phone */}
              <p className="text-[13px] text-[#b9c4d6] text-center mt-2.5 mb-0">
                Demo data for illustration
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            WHAT WE WOULD INSTALL — 3 DEVICE CARDS + SURVEY LINK
            ======================================================= */}
        <div className="mt-10 min-[820px]:mt-14 pt-8 border-t border-white/12">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <h3 className="text-[20px] min-[820px]:text-[22px] font-semibold text-white m-0">
              What we would install in your {activeRoom.label.toLowerCase()}
            </h3>
            {addedDevices.length > 0 && (
              <span className="text-[14px] font-medium text-[#ffc46b] tabular-nums">
                {addedDevices.length}{' '}
                {addedDevices.length === 1 ? 'device' : 'devices'} added to your survey
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 min-[820px]:grid-cols-3 gap-4 min-[820px]:gap-6">
            {activeRoom.installCards.map((card) => {
              const isAdded = addedDeviceIds.includes(card.id);
              return (
                <article
                  key={card.id}
                  className="card-navy p-5 min-[820px]:p-6 flex flex-col justify-between gap-5"
                >
                  <div>
                    <h4 className="text-[17px] font-semibold text-white leading-snug m-0">
                      {card.name}
                    </h4>
                    <p className="text-[15px] text-[#b9c4d6] leading-relaxed mt-2 mb-0">
                      {card.benefit}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-pressed={isAdded}
                    onClick={() => {
                      handleUserInteraction();
                      onToggleSurveyDevice(card.id);
                    }}
                    className="self-start inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[14px] font-semibold cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isAdded ? '#ffc46b' : 'rgba(255, 255, 255, 0.08)',
                      color: isAdded ? '#0a1220' : '#ffffff',
                      border: isAdded
                        ? '1px solid #ffc46b'
                        : '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    {isAdded ? (
                      <>
                        <CheckIcon size={16} />
                        <span>Added</span>
                      </>
                    ) : (
                      <span>Add to my survey</span>
                    )}
                  </button>
                </article>
              );
            })}
          </div>

          {/* Full-width amber pill CTA leading into the Free Site Survey form */}
          <div className="mt-6 min-[820px]:mt-8">
            <button
              type="button"
              onClick={handleFinalSurveyClick}
              className="btn-primary w-full h-[54px] text-[16px]"
            >
              {addedDevices.length > 0
                ? `Get these ${addedDevices.length} surveyed`
                : 'Book a free site survey'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
