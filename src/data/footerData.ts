import { CONTACT_PLACEHOLDERS } from './siteData';

export interface FooterLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
  isInternalRoute?: boolean;
}

export interface SocialLinkItem {
  platform: 'instagram' | 'facebook' | 'x' | 'linkedin' | 'whatsapp';
  label: string;
  url: string;
  isPlaceholder?: boolean;
}

export interface FooterCTAData {
  badge: string;
  headline: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface FooterContactData {
  phoneDisplay: string;
  phoneTel: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  serviceAreas: string;
  workingHours: string;
}

// Generate default WhatsApp message link
const rawWhatsAppDigits =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) ||
  CONTACT_PLACEHOLDERS.whatsappDigits;
const cleanWhatsAppDigits = rawWhatsAppDigits.replace(/[^\d]/g, '') || '2340000000000';
const defaultWhatsAppMessage = encodeURIComponent(
  'Hello OG Smarthomes, I am interested in a smart home consultation.'
);
export const FOOTER_WHATSAPP_HREF = `https://wa.me/${cleanWhatsAppDigits}?text=${defaultWhatsAppMessage}`;

export const FOOTER_CTA: FooterCTAData = {
  badge: 'Custom Quote & Plan',
  headline: 'Ready to make your home smarter?',
  description:
    'Share your rooms, power setup, and security goals with our engineers across Lagos, Abuja, and Port Harcourt. We send a tailored compatibility check and itemised quote—or reach out for estate and trade partnerships.',
  primaryCta: {
    label: 'Get a custom quote',
    href: '#survey',
  },
  secondaryCta: {
    label: 'Chat on WhatsApp',
    href: FOOTER_WHATSAPP_HREF,
  },
};

export const FOOTER_BRAND = {
  name: 'OG Smarthomes',
  legalEntity: 'OG Smarhome & Technology',
  tagline: 'Smart home automation and security, designed and installed with care.',
  socials: [
    {
      platform: 'instagram' as const,
      label: 'Follow OG Smarthomes on Instagram',
      url: 'https://instagram.com/ogsmarthomes',
      isPlaceholder: false,
    },
    {
      platform: 'facebook' as const,
      label: 'Follow OG Smarthomes on Facebook',
      url: 'https://facebook.com/ogsmarthomes',
      isPlaceholder: false,
    },
    {
      platform: 'linkedin' as const,
      label: 'Connect with OG Smarthomes on LinkedIn',
      url: 'https://linkedin.com/company/ogsmarthomes',
      isPlaceholder: false,
    },
    {
      platform: 'whatsapp' as const,
      label: 'Message OG Smarthomes on WhatsApp',
      url: FOOTER_WHATSAPP_HREF,
      isPlaceholder: false,
    },
  ],
};

export const FOOTER_SERVICES_LINKS: FooterLinkItem[] = [
  { label: 'Smart Lighting & Switches', href: '#products' },
  { label: 'Smart Locks & Access Control', href: '#products' },
  { label: 'CCTV & Surveillance Systems', href: '#products' },
  { label: 'Alarms & Security Sensors', href: '#products' },
  { label: 'Whole Home Automation', href: '#packages' },
  { label: 'Smart Audio & Video Intercoms', href: '#products' },
];

export const FOOTER_COMPANY_LINKS: FooterLinkItem[] = [
  { label: 'About Us', href: '#services' },
  { label: 'Live Room Demo', href: '#rooms' },
  { label: 'Packages & Pricing', href: '#packages' },
  { label: 'Projects & Showcase', href: '#projects' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Blog & Articles', href: '/blog', isInternalRoute: true },
  { label: 'Get a Custom Quote', href: '#survey' },
];

export const FOOTER_CONTACT: FooterContactData = {
  phoneDisplay: CONTACT_PLACEHOLDERS.phone !== '[Phone number]' ? CONTACT_PLACEHOLDERS.phone : '+234 800 000 0000',
  phoneTel: '+2348000000000',
  whatsappDisplay: CONTACT_PLACEHOLDERS.whatsappDisplay !== '[WhatsApp number]' ? CONTACT_PLACEHOLDERS.whatsappDisplay : '+234 (WhatsApp)',
  whatsappUrl: FOOTER_WHATSAPP_HREF,
  email: CONTACT_PLACEHOLDERS.email !== '[Email]' ? CONTACT_PLACEHOLDERS.email : 'contact@ogsmarthomes.com',
  addressLine1: 'Lekki Phase 1',
  addressLine2: 'Lagos, Nigeria',
  serviceAreas: 'Serving Lagos, Abuja & Port Harcourt',
  workingHours: 'Mon – Sat: 8:00 AM – 6:00 PM',
};

export const FOOTER_LEGAL_LINKS: FooterLinkItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy', isInternalRoute: true },
  { label: 'Terms and Conditions', href: '/terms-and-conditions', isInternalRoute: true },
  { label: 'Cookie Policy', href: '/cookie-policy', isInternalRoute: true },
  { label: 'Refund and Warranty Policy', href: '/refund-and-warranty-policy', isInternalRoute: true },
];
