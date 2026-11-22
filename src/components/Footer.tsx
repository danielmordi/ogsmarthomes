import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Mail, MapPin, Phone, Clock, Sparkles } from 'lucide-react';
import {
  BrandHouseMark,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XTwitterIcon,
} from './Icons';
import {
  FOOTER_BRAND,
  FOOTER_COMPANY_LINKS,
  FOOTER_CONTACT,
  FOOTER_CTA,
  FOOTER_LEGAL_LINKS,
  FOOTER_SERVICES_LINKS,
  FooterLinkItem,
} from '../data/footerData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon size={18} />;
      case 'facebook':
        return <FacebookIcon size={18} />;
      case 'x':
        return <XTwitterIcon size={16} />;
      case 'linkedin':
        return <LinkedInIcon size={18} />;
      case 'whatsapp':
        return <WhatsAppIcon size={19} />;
      default:
        return null;
    }
  };

  const renderLink = (link: FooterLinkItem, index: number) => {
    const isInternal = link.isInternalRoute && link.href.startsWith('/');
    const commonClasses =
      'group inline-flex items-center gap-1.5 text-[14px] leading-relaxed text-[#8a8a8a] hover:text-white no-underline transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm';

    if (isInternal) {
      return (
        <li key={index} className="leading-normal">
          <Link to={link.href} className={commonClasses}>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              {link.label}
            </span>
          </Link>
        </li>
      );
    }

    return (
      <li key={index} className="leading-normal">
        <a
          href={link.href}
          {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={commonClasses}
        >
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            {link.label}
          </span>
        </a>
      </li>
    );
  };

  return (
    <footer
      className="surface-footer relative bg-[#000000] text-white border-t border-white/[0.08] pt-16 sm:pt-20 pb-12 overflow-hidden"
      aria-label="Site Footer"
    >
      {/* Ambient background depth: subtle warm-amber top glow & delicate grid */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[340px] rounded-full bg-[#ffc46b]/[0.035] blur-[100px]"
        aria-hidden="true"
      />

      <div className="site-container relative z-10 flex flex-col gap-16 sm:gap-20">
        {/* =========================================================
            1. TOP CTA BAND: Refined rounded panel with ambient sheen
            ========================================================= */}
        <section
          aria-label="Call to Action"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101c33]/90 via-[#0a1220] to-[#040810] p-7 sm:p-10 lg:p-12 shadow-2xl"
        >
          {/* Subtle soft ambient glow inside the card */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#ffc46b]/[0.08] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#9ccbff]/[0.05] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[12px] font-medium tracking-wide text-[#ffc46b] mb-4">
                <Sparkles size={13} className="shrink-0" />
                <span>{FOOTER_CTA.badge}</span>
              </div>
              <h2 className="text-[26px] sm:text-[34px] lg:text-[40px] font-semibold text-white tracking-tight leading-[1.15] m-0">
                {FOOTER_CTA.headline}
              </h2>
              <p className="mt-3.5 mb-0 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#b9c4d6] max-w-xl">
                {FOOTER_CTA.description}
              </p>
            </div>

            {/* Right button group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
              <a
                href={FOOTER_CTA.primaryCta.href}
                className="btn-primary min-h-[48px] px-6 text-[14.5px] font-semibold text-[#0a1220] shadow-md shadow-[#ffc46b]/15 transition-transform duration-200 active:scale-[0.98]"
              >
                <span>{FOOTER_CTA.primaryCta.label}</span>
                <ArrowRight size={16} strokeWidth={2} className="shrink-0" />
              </a>

              <a
                href={FOOTER_CTA.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-[48px] px-5 text-[14.5px] font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/[0.08] transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={19} className="text-[#25D366] shrink-0" />
                <span>{FOOTER_CTA.secondaryCta.label}</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. MAIN FOOTER 12-COLUMN GRID
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Brand Column (Span 4 on desktop) */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start space-y-5">
            <a
              href="#top"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-3 text-white no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
              aria-label="OG Smarthomes — Back to top"
            >
              <span className="text-[#ffc46b] transition-transform duration-200 ease-out group-hover:scale-105">
                <BrandHouseMark size={30} />
              </span>
              <span className="text-[21px] sm:text-[23px] font-semibold tracking-tight text-white leading-none">
                {FOOTER_BRAND.name}
              </span>
            </a>

            <p className="text-[14px] leading-relaxed text-[#8a8a8a] max-w-sm m-0">
              {FOOTER_BRAND.tagline}
            </p>

            {/* Social Icons row with 44px min touch target */}
            <div className="pt-2">
              <span className="sr-only">Social media links</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {FOOTER_BRAND.socials.map((social) => {
                  const isHashPlaceholder = social.url === '#' || social.isPlaceholder;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      {...(!isHashPlaceholder ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={social.label}
                      title={social.label}
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] text-white/80 hover:text-[#0a1220] hover:bg-[#ffc46b] hover:border-[#ffc46b] no-underline transition-all duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Links container: 2-column subgrid on mobile, 8-cols on desktop */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-8">
            {/* Services Column */}
            <nav aria-label="Services navigation" className="space-y-4">
              <h3 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ccbff] leading-none">
                Services
              </h3>
              <ul className="list-none m-0 p-0 space-y-2">
                {FOOTER_SERVICES_LINKS.map((link, idx) => renderLink(link, idx))}
              </ul>
            </nav>

            {/* Company Column */}
            <nav aria-label="Company navigation" className="space-y-4">
              <h3 className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ccbff] leading-none">
                Company
              </h3>
              <ul className="list-none m-0 p-0 space-y-2">
                {FOOTER_COMPANY_LINKS.map((link, idx) => renderLink(link, idx))}
              </ul>
            </nav>

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9ccbff] leading-none">
                Contact &amp; Support
              </h3>
              <address className="not-italic space-y-3 text-[14px] leading-relaxed text-[#8a8a8a]">
                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#ffc46b] shrink-0 mt-1" aria-hidden="true" />
                  <div className="flex flex-col">
                    <a
                      href={`tel:${FOOTER_CONTACT.phoneTel}`}
                      className="text-white hover:text-[#ffc46b] no-underline transition-colors duration-150 font-medium"
                    >
                      {FOOTER_CONTACT.phoneDisplay}
                    </a>
                    <a
                      href={FOOTER_CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12.5px] text-[#25D366] hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[#ffc46b] shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${FOOTER_CONTACT.email}`}
                    className="text-white hover:text-[#ffc46b] no-underline transition-colors duration-150"
                  >
                    {FOOTER_CONTACT.email}
                  </a>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <MapPin size={16} className="text-[#ffc46b] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="m-0 text-white font-medium">{FOOTER_CONTACT.addressLine1}</p>
                    <p className="m-0 text-[12.5px] text-[#8a8a8a]">{FOOTER_CONTACT.addressLine2}</p>
                    <p className="m-0 text-[12px] text-[#5c5c5c] pt-0.5">{FOOTER_CONTACT.serviceAreas}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1 text-[13px] text-[#8a8a8a]">
                  <Clock size={15} className="text-[#ffc46b] shrink-0" aria-hidden="true" />
                  <span>{FOOTER_CONTACT.workingHours}</span>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. BOTTOM LEGAL BAR & BACK-TO-TOP BUTTON
            ========================================================= */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright notice */}
          <div className="text-[12.5px] text-[#5c5c5c] text-center md:text-left order-2 md:order-1">
            <p className="m-0">
              &copy; {currentYear} {FOOTER_BRAND.legalEntity}. All rights reserved.
            </p>
          </div>

          {/* Legal links + Back to Top */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2.5 text-[12.5px] order-1 md:order-2">
            <nav aria-label="Legal navigation" className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2">
              {FOOTER_LEGAL_LINKS.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className="text-[#8a8a8a] hover:text-white no-underline transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <span className="hidden sm:inline-block w-px h-3.5 bg-white/10" aria-hidden="true" />

            {/* Back to top button */}
            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-white text-white/80 hover:text-white text-[12px] font-medium bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Back to top</span>
              <ArrowUp
                size={13}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
