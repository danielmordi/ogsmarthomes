import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { BrandHouseMark } from '../Icons';

export const BlogCTA: React.FC = () => {
  return (
    <section className="my-14 p-8 sm:p-12 rounded-[24px] bg-[#0a1220] text-white relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-radial from-[#ffc46b]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#ffc46b] text-[12.5px] font-semibold uppercase tracking-wider mb-5">
          <BrandHouseMark size={16} />
          <span>Professional Smart Home Installation</span>
        </div>

        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-tight m-0">
          Transform your home with effortless smart living.
        </h2>

        <p className="mt-4 text-[16px] sm:text-[17px] text-[#b9c4d6] leading-relaxed">
          From biometric door locks and CCTV perimeter monitoring to whole-home lighting scenes and solar integration,{' '}
          <Link to="/" className="text-white font-medium underline underline-offset-4 hover:text-[#ffc46b] transition-colors">
            OG Smarthomes
          </Link>{' '}
          supplies, neatly installs, and provides complete ongoing support across Lagos, Abuja, and Port Harcourt.
        </p>

        <ul className="mt-6 p-0 list-none flex flex-col sm:flex-row gap-3 sm:gap-6 text-[14px] text-[#d3dcea]">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#ffc46b] shrink-0" />
            <span>Custom Room & Wiring Plan</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#ffc46b] shrink-0" />
            <span>Transparent Itemized Quote</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#ffc46b] shrink-0" />
            <span>Clean, Concealed Wiring</span>
          </li>
        </ul>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            to="/#survey"
            className="btn-primary text-[15px] font-semibold h-[52px] px-8 rounded-full inline-flex items-center justify-center gap-2 text-[#0a1220] bg-[#ffc46b] hover:bg-[#ffd085] transition-all no-underline shadow-lg"
          >
            <span>Get Your Custom Quote</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/#packages"
            className="btn-secondary text-[14.5px] font-medium h-[52px] px-6 rounded-full inline-flex items-center justify-center text-white border border-white/20 hover:bg-white/10 transition-colors no-underline"
          >
            Explore Pre-configured Packages
          </Link>
        </div>
      </div>
    </section>
  );
};
