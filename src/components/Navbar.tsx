import React, { useEffect, useRef, useState } from 'react';
import { CONTACT_PLACEHOLDERS, NAV_LINKS } from '../data/siteData';
import { BrandHouseMark, CloseIcon, MenuIcon, WhatsAppIcon } from './Icons';

const MOBILE_MENU_LINKS = [
  ...NAV_LINKS,
  { id: 'survey', label: 'Contact' },
];

interface NavbarProps {
  addedSurveyCount?: number;
  onStickySurveyClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  addedSurveyCount = 0,
  onStickySurveyClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Scroll listener for navbar glass background (>= 40px) & sticky mobile bar (past hero)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setPastHero(y > Math.max(window.innerHeight * 0.78, 520));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section spy + survey visibility spy
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));

    const surveyEl = document.getElementById('survey');
    let surveyObserver: IntersectionObserver | null = null;
    if (surveyEl) {
      surveyObserver = new IntersectionObserver(
        (entries) => {
          setSurveyVisible(entries[0]?.isIntersecting ?? false);
        },
        { threshold: 0.12 }
      );
      surveyObserver.observe(surveyEl);
    }

    return () => {
      observer.disconnect();
      surveyObserver?.disconnect();
    };
  }, []);

  // Body scroll lock, Escape close, resize > 820px close, and focus trap for full-screen mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus to close button on open
    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const onResize = () => {
      if (window.innerWidth > 820) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      menuBtnRef.current?.focus();
    };
  }, [menuOpen]);

  const whatsappHref = `https://wa.me/${CONTACT_PLACEHOLDERS.whatsappDigits}?text=${encodeURIComponent(
    'Hello OG Smarthomes, I would like to ask about a smart home installation.'
  )}`;

  const showStickyMobileBar = pastHero && !menuOpen && !surveyVisible;

  return (
    <>
      {/* Fixed Top Navigation Bar */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-200"
        style={{
          backgroundColor: scrolled ? 'rgba(10, 18, 32, 0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(255, 255, 255, 0.14)'
            : '1px solid transparent',
        }}
      >
        <div className="site-container h-[64px] min-[820px]:h-[76px] flex items-center justify-between gap-4 min-[820px]:gap-8">
          {/* Brand Logo */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 text-white no-underline whitespace-nowrap shrink-0"
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ color: scrolled ? '#ffc46b' : 'var(--accent)' }}
            >
              <BrandHouseMark size={28} />
            </span>
            <span className="text-[19px] min-[820px]:text-[24px] font-semibold tracking-tight leading-none">
              OG Smarthomes
            </span>
          </a>

          {/* Desktop Centered Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="only-desktop items-center gap-6 min-[1040px]:gap-7"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              const linkHref = (link as { href?: string }).href || `#${link.id}`;
              return (
                <a
                  key={link.id}
                  href={linkHref}
                  className="relative py-2 text-[15px] font-medium text-white/85 hover:text-white no-underline whitespace-nowrap shrink-0 transition-colors"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full transition-transform duration-200 origin-left"
                    style={{
                      backgroundColor: '#ffc46b',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop Primary CTA */}
          <div className="only-desktop items-center shrink-0">
            <a href="#survey" className="btn-primary text-[14px] px-5">
              Get a Custom Quote
            </a>
          </div>

          {/* Mobile Right Controls (>=400px pill + 44px round glass menu button) */}
          <div className="only-mobile items-center gap-2.5 shrink-0">
            <a
              href="#survey"
              className="mobile-nav-survey-pill items-center justify-center h-[44px] px-4 rounded-full text-[13px] font-semibold no-underline whitespace-nowrap"
              style={{
                backgroundColor: '#ffc46b',
                color: '#0a1220',
              }}
            >
              Get Quote
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-dialog"
              onClick={() => setMenuOpen(true)}
              className="hero-glass w-[44px] h-[44px] rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <MenuIcon size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Modal */}
      <div
        id="mobile-nav-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        className={`mobile-menu mobile-menu-overlay fixed inset-0 z-[100] flex flex-col justify-between ${menuOpen ? 'is-open' : ''
          }`}
        style={{
          backgroundColor: 'rgba(10, 18, 32, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          visibility: menuOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Top bar inside menu repeating logo & close button in exact same spot */}
        <div className="site-container h-[64px] flex items-center justify-between shrink-0">
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            className="inline-flex items-center gap-2.5 text-white no-underline whitespace-nowrap"
          >
            <span style={{ color: '#ffc46b' }}>
              <BrandHouseMark size={28} />
            </span>
            <span className="text-[19px] font-semibold tracking-tight leading-none">
              OG Smarthomes
            </span>
          </a>

          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="hero-glass w-[44px] h-[44px] rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            <CloseIcon size={21} />
          </button>
        </div>

        {/* Stacked vertical links */}
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="list-none m-0 p-0">
            {MOBILE_MENU_LINKS.map((item, idx) => {
              const linkHref = (item as { href?: string }).href || `#${item.id}`;
              return (
                <li
                  key={item.id}
                  className="mobile-menu-link"
                  style={{
                    transitionDelay: menuOpen ? `${100 + idx * 60}ms` : '0ms',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                >
                  <a
                    href={linkHref}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between min-h-[56px] py-2 text-white no-underline font-medium tracking-tight hover:text-[#ffc46b] transition-colors"
                    style={{ fontSize: 'clamp(34px, 8.5vw, 42px)', lineHeight: 1.15 }}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pinned bottom actions */}
        <div className="px-4 pt-4 flex flex-col gap-3 shrink-0">
          <a
            href="#survey"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full h-[56px] text-[16px]"
          >
            Get a Custom Quote
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="btn-secondary w-full h-[52px] text-white text-[15px]"
          >
            <WhatsAppIcon size={19} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Sticky Phone Action Bar (past hero, hides when menu or survey visible) */}
      <div
        className={`only-mobile sticky-phone-bar fixed bottom-0 inset-x-0 z-40 px-4 pt-3 ${showStickyMobileBar ? 'is-visible' : ''
          }`}
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          background:
            'linear-gradient(to top, rgba(10, 18, 32, 0.94) 65%, rgba(10, 18, 32, 0) 100%)',
        }}
        aria-hidden={!showStickyMobileBar}
      >
        <div className="w-full max-w-[440px] mx-auto flex items-center gap-3">
          <a
            href="#survey"
            tabIndex={showStickyMobileBar ? 0 : -1}
            onClick={onStickySurveyClick}
            className="btn-primary flex-1 h-[48px] text-[15px] shadow-lg"
          >
            <span>Get Quote</span>
            {addedSurveyCount > 0 && (
              <span
                aria-label={`${addedSurveyCount} devices selected`}
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#0a1220] text-[#ffc46b] text-[13px] font-bold tabular-nums leading-none"
              >
                {addedSurveyCount}
              </span>
            )}
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={showStickyMobileBar ? 0 : -1}
            aria-label="Chat on WhatsApp"
            className="w-[48px] h-[48px] rounded-full shrink-0 flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon size={24} />
          </a>
        </div>
      </div>

      {/* Desktop Floating WhatsApp Button (bottom right) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="only-desktop fixed right-6 bottom-6 z-40 w-[54px] h-[54px] rounded-full items-center justify-center text-white shadow-xl hover:-translate-y-0.5 transition-transform"
        style={{ backgroundColor: '#25D366' }}
      >
        <WhatsAppIcon size={26} />
      </a>
    </>
  );
};
