import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Sections } from './components/Sections';
import { SurveyAndFooter } from './components/SurveyAndFooter';
import { ALL_INSTALL_DEVICES } from './data/roomDemoData';
import { FAQS } from './data/siteData';

const HOME_TITLE = 'OG Smarthomes | Smart Home Installation in Nigeria';
const HOME_DESCRIPTION =
  'Upgrade your home with smart door locks, CCTV, lighting & switches across Lagos, Abuja & Port Harcourt. Book a free site survey with OG Smarthomes today.';
const HOME_URL = 'https://ogsmarthomes.com/';
const HOME_OG_IMAGE = 'https://ogsmarthomes.com/src/assets/images/hero_wide_with_1795076675422.jpg';

const HOME_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OG Smarthomes',
    url: HOME_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'OG Smarthomes',
    url: HOME_URL,
    image: HOME_OG_IMAGE,
    description: HOME_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lekki Phase 1, Lagos',
      addressCountry: 'NG',
    },
    areaServed: [
      { '@type': 'City', name: 'Lagos' },
      { '@type': 'City', name: 'Abuja' },
      { '@type': 'City', name: 'Port Harcourt' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://instagram.com/ogsmarthomes',
      'https://facebook.com/ogsmarthomes',
      'https://linkedin.com/company/ogsmarthomes',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  },
];

export default function App() {
  const [preselectedChips, setPreselectedChips] = useState<string[]>([]);
  const [preselectedNote, setPreselectedNote] = useState<string>('');
  const [selectionMode, setSelectionMode] = useState<'append' | 'package'>('append');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectionVersion, setSelectionVersion] = useState<number>(0);
  const [addedDeviceIds, setAddedDeviceIds] = useState<string[]>([]);

  // Global once-only scroll reveal observer (24px, 600ms, 80ms stagger)
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (targets.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSelectSurveyInterest = useCallback((chips: string[], note?: string) => {
    setSelectionMode('append');
    setPreselectedChips(chips);
    setPreselectedNote(note ?? '');
    setSelectionVersion((v) => v + 1);
  }, []);

  const handleSelectPackage = useCallback(
    (packageName: string, packageChips: string[]) => {
      const addedDevices = ALL_INSTALL_DEVICES.filter((d) => addedDeviceIds.includes(d.id));
      const roomDemoChips = addedDevices.map((d) => d.surveyChip);
      const mergedChips = Array.from(new Set([...packageChips, ...roomDemoChips]));
      const note =
        addedDevices.length > 0
          ? `Package: ${packageName}. Devices added from room demo: ${addedDevices
              .map((d) => d.name)
              .join(', ')}.`
          : '';

      setSelectedPackage(packageName);
      setSelectionMode('package');
      setPreselectedChips(mergedChips);
      setPreselectedNote(note);
      setSelectionVersion((v) => v + 1);
    },
    [addedDeviceIds]
  );

  const handleClearPackage = useCallback(() => {
    setSelectedPackage(null);
  }, []);

  const handleToggleSurveyDevice = useCallback((deviceId: string) => {
    setAddedDeviceIds((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
    );
  }, []);

  const handleStickyBarSurveyClick = useCallback(() => {
    if (addedDeviceIds.length === 0) return;
    const selected = ALL_INSTALL_DEVICES.filter((d) => addedDeviceIds.includes(d.id));
    const chips = Array.from(new Set(selected.map((d) => d.surveyChip)));
    const note = `Devices added from room demo: ${selected.map((d) => d.name).join(', ')}.`;
    handleSelectSurveyInterest(chips, note);
  }, [addedDeviceIds, handleSelectSurveyInterest]);

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <Helmet>
        <title>{HOME_TITLE}</title>
        <meta name="description" content={HOME_DESCRIPTION} />
        <link rel="canonical" href={HOME_URL} />
        <meta property="og:site_name" content="OG Smarthomes" />
        <meta property="og:locale" content="en_NG" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOME_URL} />
        <meta property="og:title" content={HOME_TITLE} />
        <meta property="og:description" content={HOME_DESCRIPTION} />
        <meta property="og:image" content={HOME_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={HOME_URL} />
        <meta name="twitter:title" content={HOME_TITLE} />
        <meta name="twitter:description" content={HOME_DESCRIPTION} />
        <meta name="twitter:image" content={HOME_OG_IMAGE} />
        {HOME_SCHEMAS.map((schema, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      <Navbar
        addedSurveyCount={addedDeviceIds.length}
        onStickySurveyClick={handleStickyBarSurveyClick}
      />
      <main>
        <Hero />
        <Sections
          addedDeviceIds={addedDeviceIds}
          onToggleSurveyDevice={handleToggleSurveyDevice}
          onSelectSurveyInterest={handleSelectSurveyInterest}
          onSelectPackage={handleSelectPackage}
        />
        <SurveyAndFooter
          preselectedChips={preselectedChips}
          preselectedNote={preselectedNote}
          selectionMode={selectionMode}
          selectedPackage={selectedPackage}
          onClearPackage={handleClearPackage}
          selectionVersion={selectionVersion}
        />
      </main>
    </div>
  );
}
