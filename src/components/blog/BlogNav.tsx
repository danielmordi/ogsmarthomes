import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandHouseMark, MenuIcon, CloseIcon, WhatsAppIcon } from '../Icons';
import { CONTACT_PLACEHOLDERS } from '../../data/siteData';

export const BlogNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappHref = `https://wa.me/${CONTACT_PLACEHOLDERS.whatsappDigits}?text=${encodeURIComponent(
    'Hello OG Smarthomes, I was reading your blog and would like to ask about a smart home installation.'
  )}`;

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? 'rgba(10, 18, 32, 0.92)' : 'rgba(10, 18, 32, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <div className="site-container h-[64px] min-[820px]:h-[76px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-white no-underline whitespace-nowrap shrink-0 group"
        >
          <span className="inline-flex items-center justify-center text-[#ffc46b] transition-transform group-hover:scale-105">
            <BrandHouseMark size={28} />
          </span>
          <span className="text-[19px] min-[820px]:text-[24px] font-semibold tracking-tight leading-none text-white">
            OG Smarthomes
          </span>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Blog navigation" className="only-desktop items-center gap-6 min-[1040px]:gap-7">
          <Link
            to="/"
            className="py-2 text-[14.5px] font-medium text-white/85 hover:text-white no-underline transition-colors"
          >
            Home
          </Link>
          <a
            href="/#services"
            className="py-2 text-[14.5px] font-medium text-white/85 hover:text-white no-underline transition-colors"
          >
            Services
          </a>
          <a
            href="/#products"
            className="py-2 text-[14.5px] font-medium text-white/85 hover:text-white no-underline transition-colors"
          >
            Products
          </a>
          <a
            href="/#packages"
            className="py-2 text-[14.5px] font-medium text-white/85 hover:text-white no-underline transition-colors"
          >
            Packages
          </a>
          <a
            href="/#projects"
            className="py-2 text-[14.5px] font-medium text-white/85 hover:text-white no-underline transition-colors"
          >
            Projects
          </a>
          <Link
            to="/blog"
            className="relative py-2 text-[14.5px] font-semibold text-[#ffc46b] no-underline"
          >
            Blog
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-[#ffc46b]"
            />
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="only-desktop items-center gap-3 shrink-0">
          <a
            href="/#survey"
            className="btn-primary text-[14px] px-5 h-[44px] rounded-full inline-flex items-center justify-center font-semibold text-[#0a1220] bg-[#ffc46b] hover:bg-[#ffd085] no-underline transition-colors"
          >
            Book Free Survey
          </a>
        </div>

        {/* Mobile controls */}
        <div className="only-mobile items-center gap-2.5">
          <a
            href="/#survey"
            className="h-[40px] px-3.5 rounded-full text-[13px] font-semibold text-[#0a1220] bg-[#ffc46b] inline-flex items-center justify-center no-underline"
          >
            Free Survey
          </a>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white bg-white/10 border border-white/15 cursor-pointer"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="only-mobile flex-col bg-[#0a1220]/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-medium text-white no-underline block py-1"
          >
            Home
          </Link>
          <a
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-medium text-white no-underline block py-1"
          >
            Services
          </a>
          <a
            href="/#products"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-medium text-white no-underline block py-1"
          >
            Products
          </a>
          <a
            href="/#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-medium text-white no-underline block py-1"
          >
            Packages
          </a>
          <a
            href="/#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-medium text-white no-underline block py-1"
          >
            Projects
          </a>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[17px] font-semibold text-[#ffc46b] no-underline block py-1"
          >
            Blog Articles
          </Link>
          <div className="pt-4 flex flex-col gap-3">
            <a
              href="/#survey"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full h-[50px] text-[15px] font-semibold rounded-full flex items-center justify-center text-[#0a1220] bg-[#ffc46b] no-underline"
            >
              Book Free Site Survey
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[48px] text-[14.5px] font-medium rounded-full flex items-center justify-center gap-2 text-white bg-white/10 border border-white/20 no-underline"
            >
              <WhatsAppIcon size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
