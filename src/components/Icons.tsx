import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/** Brand house mark: line-drawn house with a solid dot as the smart node */
export const BrandHouseMark: React.FC<IconProps> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.5 12.5L14 4.5L23.5 12.5V22.5C23.5 23.0523 23.0523 23.5 22.5 23.5H5.5C4.94772 23.5 4.5 23.0523 4.5 22.5V12.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 23.5V17.2C10.5 16.5373 11.0373 16 11.7 16H16.3C16.9627 16 17.5 16.5373 17.5 17.2V23.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <circle cx="14" cy="11.5" r="2.3" fill="currentColor" />
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className = '', size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12 3C7.03 3 3 6.86 3 11.62C3 13.38 3.55 15.02 4.5 16.38L3.4 20.5L7.68 19.42C8.97 20.09 10.44 20.46 12 20.46C16.97 20.46 21 16.6 21 11.84C21 7.08 16.97 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.4 9.2C9.2 8.75 8.95 8.74 8.73 8.73C8.55 8.72 8.34 8.72 8.14 8.72C7.94 8.72 7.62 8.8 7.35 9.1C7.08 9.4 6.32 10.1 6.32 11.55C6.32 13 7.37 14.4 7.52 14.6C7.67 14.8 9.56 17.8 12.55 18.95C15.03 19.9 15.54 19.7 16.08 19.65C16.62 19.6 17.82 18.93 18.07 18.24C18.32 17.55 18.32 16.96 18.25 16.84C18.18 16.72 17.98 16.65 17.68 16.5C17.38 16.35 15.92 15.63 15.65 15.53C15.38 15.43 15.18 15.38 14.98 15.68C14.78 15.98 14.21 16.65 14.04 16.85C13.87 17.05 13.7 17.08 13.4 16.93C13.1 16.78 12.14 16.46 11 15.45C10.11 14.66 9.51 13.68 9.34 13.38C9.17 13.08 9.32 12.92 9.47 12.77C9.6 12.64 9.77 12.42 9.92 12.25C10.07 12.08 10.12 11.95 10.22 11.75C10.32 11.55 10.27 11.38 10.19 11.23C10.12 11.08 9.54 9.6 9.4 9.2Z"
      fill="currentColor"
    />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M12 19V5M6 11L12 5L18 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M5 12.5L9.8 17.2L19 7.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2.5L14.9 8.4L21.4 9.3L16.7 13.9L17.8 20.4L12 17.3L6.2 20.4L7.3 13.9L2.6 9.3L9.1 8.4L12 2.5Z" />
  </svg>
);

export const TrustIcon: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  switch (id) {
    case 'survey':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M9 5H7C5.895 5 5 5.895 5 7V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V7C19 5.895 18.105 5 17 5H15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="9" y="3" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'install':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-3-3 2.3-2.3z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'support':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M4 13V12a8 8 0 0 1 16 0v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="3" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <rect x="17" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M19 19v1a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M12 3L4.5 6.5V12C4.5 16.5 7.7 20.1 12 21.5C16.3 20.1 19.5 16.5 19.5 12V6.5L12 3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M9 12L11.2 14.2L15.5 9.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const ServiceIcon: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  switch (id) {
    case 'supply':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M12 12L20 7.5M12 12V21M12 12L4 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'install':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-3-3 2.3-2.3z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 13.7 3.47 15.29 4.3 16.64L3.5 20.5L7.36 19.7C8.71 20.53 10.3 21 12 21Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M9 12H9.01M12 12H12.01M15 12H15.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const ProductIcon: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  switch (id) {
    case 'locks':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="15" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'cctv':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M3 10.5L15 6L18.5 13L6.5 17.5L3 10.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M18 11.8L21 10.8V14.8L17.5 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 16.6V20H5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'switches':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="9" cy="12" r="1.2" fill="currentColor" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <circle cx="15" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'doorbells':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="7" y="3" width="10" height="18" rx="3" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="12" cy="8.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'sensors':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'gate':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M3 19V7L11 9.5V19M21 19V7L13 9.5V19M2 19H22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 8.3V19M17 8.3V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'curtains':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M3 5H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M5 5V19C7.5 17 9 14 9 5M19 5V19C16.5 17 15 14 15 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
          <path d="M12 2.5V3.5M17 8H18M6 8H7M15.8 4.2L15 5M8.2 4.2L9 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 19L6.5 14H17.5L20 19H4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const WhyUsIcon: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  switch (id) {
    case 'nigerian':
      return <BrandHouseMark size={20} className={className} />;
    case 'solar':
      return <ProductIcon id="solar" className={className} />;
    case 'pricing':
      return <TrustIcon id="survey" className={className} />;
    case 'wiring':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M13 3L5 14H12L11 21L19 10H12L13 3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case 'training':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M11 17.5H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    default:
      return <TrustIcon id="support" className={className} />;
  }
};
