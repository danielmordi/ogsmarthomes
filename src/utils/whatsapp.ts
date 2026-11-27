import type React from 'react';
import { CONTACT_PLACEHOLDERS } from '../data/siteData';

export const isMobileUserAgent = (): boolean =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const getWhatsAppLinks = (message: string) => {
  const encoded = encodeURIComponent(message);
  const phone = CONTACT_PLACEHOLDERS.whatsappDigits;
  return {
    webUrl: `https://wa.me/${phone}?text=${encoded}`,
    deeplinkUrl: `whatsapp://send?phone=${phone}&text=${encoded}`,
  };
};

export const getWhatsAppLinkProps = (message: string) => {
  const { webUrl, deeplinkUrl } = getWhatsAppLinks(message);
  const mobile = isMobileUserAgent();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!mobile) return;

    e.preventDefault();
    const startedAt = Date.now();
    window.location.href = deeplinkUrl;
    window.setTimeout(() => {
      if (document.visibilityState === 'visible' && Date.now() - startedAt < 1800) {
        window.location.href = webUrl;
      }
    }, 1000);
  };

  return {
    href: mobile ? deeplinkUrl : webUrl,
    target: mobile ? undefined : ('_blank' as const),
    rel: mobile ? undefined : 'noopener noreferrer',
    onClick,
  };
};
