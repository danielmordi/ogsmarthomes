import { useCallback, useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Sections } from './components/Sections';
import { SurveyAndFooter } from './components/SurveyAndFooter';
import { ALL_INSTALL_DEVICES } from './data/roomDemoData';

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
