import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Check, X, ChevronRight, Settings } from 'lucide-react';

const STORAGE_KEY = 'og_cookie_consent';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [functionalConsent, setFunctionalConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    // Check if consent has already been recorded
    const existing = getCookieConsent();
    if (!existing) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new CustomEvent('og_cookie_consent_updated', { detail: prefs }));
    } catch {
      // Ignore local storage errors
    }
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      necessary: true,
      functional: functionalConsent,
      analytics: analyticsConsent,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-[480px] z-50 animate-fade-in"
    >
      <div className="bg-[#0a1220] text-white border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffc46b]/15 text-[#ffc46b] flex items-center justify-center shrink-0 mt-0.5">
            <Cookie size={20} />
          </div>
          <div className="flex-1">
            <h3 id="cookie-banner-title" className="text-[16px] font-bold text-white m-0 leading-tight">
              Privacy &amp; Cookie Preferences
            </h3>
            <p id="cookie-banner-desc" className="text-[13px] text-[#b9c4d6] leading-relaxed mt-2 mb-0">
              We use necessary cookies for site security and optional cookies to remember your device preferences and analyze traffic.
              Read our{' '}
              <Link
                to="/cookie-policy"
                onClick={() => setIsVisible(false)}
                className="text-[#ffc46b] hover:underline font-medium"
              >
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy-policy"
                onClick={() => setIsVisible(false)}
                className="text-[#ffc46b] hover:underline font-medium"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* Detailed Preferences Drawer */}
        {showPreferences && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-[13px]">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
              <div>
                <span className="font-semibold text-white block">Strictly Necessary</span>
                <span className="text-[#a0aec0] text-[12px]">Form validation, spam bot check, security</span>
              </div>
              <span className="text-[11px] font-semibold text-[#ffc46b] bg-[#ffc46b]/10 px-2 py-0.5 rounded">Always On</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
              <div>
                <span className="font-semibold text-white block">Functional Preferences</span>
                <span className="text-[#a0aec0] text-[12px]">Room demo memory, selected packages</span>
              </div>
              <input
                type="checkbox"
                checked={functionalConsent}
                onChange={(e) => setFunctionalConsent(e.target.checked)}
                className="w-4 h-4 accent-[#ffc46b] cursor-pointer"
                aria-label="Toggle functional cookies"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
              <div>
                <span className="font-semibold text-white block">Performance Analytics</span>
                <span className="text-[#a0aec0] text-[12px]">Anonymous page traffic and load speeds</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 accent-[#ffc46b] cursor-pointer"
                aria-label="Toggle analytics cookies"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          {showPreferences ? (
            <>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 min-h-[38px] px-3 rounded-lg bg-[#ffc46b] text-[#0a1220] font-semibold text-[13px] hover:bg-[#ffd085] transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="min-h-[38px] px-3 rounded-lg bg-white/10 text-white font-medium text-[13px] hover:bg-white/15 transition-colors cursor-pointer"
              >
                Back
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 min-h-[38px] px-3 rounded-lg bg-[#ffc46b] text-[#0a1220] font-semibold text-[13px] hover:bg-[#ffd085] transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="min-h-[38px] px-3 rounded-lg bg-white/10 text-white font-medium text-[13px] hover:bg-white/15 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="min-h-[38px] px-2.5 rounded-lg text-white/70 hover:text-white text-[12px] hover:bg-white/5 transition-colors cursor-pointer"
                title="Manage detailed preferences"
              >
                Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
