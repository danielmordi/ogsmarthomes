import React from 'react';
import { Link } from 'react-router-dom';
import { BrandHouseMark, WhatsAppIcon } from '../Icons';
import { CONTACT_PLACEHOLDERS } from '../../data/siteData';
import { ArrowUp, Rss } from 'lucide-react';

export const BlogFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${CONTACT_PLACEHOLDERS.whatsappDigits}?text=${encodeURIComponent(
    'Hello Og Smart Homes, I would like to inquire about smart home installation.'
  )}`;

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="surface-footer bg-black text-white pt-16 pb-12 border-t border-white/10">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white no-underline">
              <span className="text-[#ffc46b]">
                <BrandHouseMark size={28} />
              </span>
              <span className="text-[22px] font-semibold tracking-tight text-white">
                Og Smart Homes
              </span>
            </Link>
            <p className="text-[14.5px] text-[#8a8a8a] max-w-md leading-relaxed m-0">
              Complete smart home design, supply, installation, and ongoing support for luxury and modern residences, penthouses, and commercial properties across Nigeria.
            </p>
            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[13.5px] font-medium no-underline hover:bg-[#25D366]/30 transition-colors"
              >
                <WhatsAppIcon size={17} />
                <span>{CONTACT_PLACEHOLDERS.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#9ccbff] mb-4">
              Explore
            </h4>
            <ul className="list-none p-0 m-0 space-y-2.5 text-[14px]">
              <li>
                <Link to="/" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#services" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/#products" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
                  Smart Products
                </a>
              </li>
              <li>
                <a href="/#packages" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
                  Pricing & Packages
                </a>
              </li>
              <li>
                <a href="/#projects" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-[#ffc46b] font-medium no-underline hover:underline">
                  Blog & Knowledge Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Feeds */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#9ccbff] mb-4">
              Resources & Feed
            </h4>
            <ul className="list-none p-0 m-0 space-y-2.5 text-[14px]">
              <li>
                <a
                  href="/#survey"
                  className="text-[#8a8a8a] hover:text-white no-underline transition-colors"
                >
                  Book Free Site Survey
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="text-[#8a8a8a] hover:text-white no-underline transition-colors"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/blog/rss.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[#ffc46b] hover:text-[#ffd085] no-underline transition-colors"
                >
                  <Rss size={14} />
                  <span>RSS 2.0 Feed</span>
                </a>
              </li>
              <li>
                <span className="text-[#5c5c5c] text-[13px] block mt-4">
                  Service Areas: Lagos (Lekki, Ikoyi, Ikeja), Abuja (Maitama, Wuse), Port Harcourt.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#5c5c5c]">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <p className="m-0">
              &copy; {currentYear} Og Smart Homes. All rights reserved.
            </p>
            <span aria-hidden="true">·</span>
            <Link to="/privacy-policy" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms-and-conditions" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/cookie-policy" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
              Cookie Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/refund-and-warranty-policy" className="text-[#8a8a8a] hover:text-white no-underline transition-colors">
              Refund &amp; Warranty
            </Link>
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-[12px] cursor-pointer transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
