import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, ArrowUp, ArrowUpRight, Flame, Loader2 } from 'lucide-react';
import {
  CONTACT_PLACEHOLDERS,
  SURVEY_INTEREST_CHIPS,
} from '../data/siteData';
import { CheckIcon, CloseIcon, WhatsAppIcon } from './Icons';

interface SurveyAndFooterProps {
  preselectedChips: string[];
  preselectedNote: string;
  selectionMode: 'append' | 'package';
  selectedPackage: string | null;
  onClearPackage: () => void;
  selectionVersion: number;
}

type FormStep = 1 | 2 | 'success';

interface Step1Errors {
  fullName?: string;
  phone?: string;
  interests?: string;
  timeline?: string;
}

interface TimelineOption {
  value: string;
  label: string;
  urgent?: boolean;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: 'Urgent (ASAP / this week)', label: 'Urgent (ASAP / this week)', urgent: true },
  { value: 'Within 2 weeks', label: 'Within 2 weeks' },
  { value: 'Within a month', label: 'Within a month' },
  { value: 'Just planning / getting prices', label: 'Just planning / getting prices' },
];

const URGENT_TIMELINE_VALUE = TIMELINE_OPTIONS[0].value;

const PROPERTY_TYPE_OPTIONS = ['House', 'Apartment', 'Office', 'Shop', 'Estate'] as const;

type SurveyEnvKey =
  | 'VITE_WEB3FORMS_ACCESS_KEY'
  | 'VITE_WHATSAPP_NUMBER'
  | 'VITE_RESPONSE_TIME';

function readEnv(key: SurveyEnvKey): string {
  const raw = import.meta.env[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

/** Validate any phone number with 7–15 digits (international compatible) */
function isValidPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().+]/g, '');
  return /^\d{7,15}$/.test(cleaned);
}

/** Generate a short, human-readable lead reference ID (e.g. OG-8F4K2M) */
function generateLeadReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i += 1) {
      suffix += alphabet[bytes[i] % alphabet.length];
    }
  } else {
    for (let i = 0; i < 6; i += 1) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
  return `OG-${suffix}`;
}

/** Build a wa.me link using VITE_WHATSAPP_NUMBER without hardcoding any phone digits */
function buildWhatsAppLink(whatsappDigits: string, message: string): string {
  const cleanDigits = whatsappDigits.replace(/[^\d]/g, '');
  const base = cleanDigits ? `https://wa.me/${cleanDigits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Fire optional analytics events if GA4, GTM, Plausible, or Meta Pixel is already on the site */
function trackSurveyEvent(
  eventName: 'form_start' | 'step1_complete' | 'step2_complete',
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;
  const win = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
    fbq?: (...args: unknown[]) => void;
  };

  try {
    if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, params ?? {});
    }
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: eventName, ...(params ?? {}) });
    }
    if (typeof win.plausible === 'function') {
      win.plausible(eventName, params ? { props: params } : undefined);
    }
    if (typeof win.fbq === 'function') {
      win.fbq('trackCustom', eventName, params ?? {});
    }
  } catch {
    // Never allow third-party analytics issues to disrupt lead submission
  }
}

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const SurveyAndFooter: React.FC<SurveyAndFooterProps> = ({
  preselectedChips,
  preselectedNote,
  selectionMode,
  selectedPackage,
  onClearPackage,
  selectionVersion,
}) => {
  // Environment-driven configuration (never hardcoded)
  const web3FormsAccessKey = readEnv('VITE_WEB3FORMS_ACCESS_KEY');
  const whatsappNumber = readEnv('VITE_WHATSAPP_NUMBER');
  const responseTime = readEnv('VITE_RESPONSE_TIME');

  // Step & submission state
  const [step, setStep] = useState<FormStep>(1);
  const [leadRef, setLeadRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeLegalNotice, setActiveLegalNotice] = useState<'privacy' | 'terms' | null>(null);

  // Step 1 fields (required)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<Step1Errors>({});

  // Step 2 fields (optional)
  const [area, setArea] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [preferredDay, setPreferredDay] = useState('');
  const [notes, setNotes] = useState('');

  // Refs for autofocus, double-submit protection, and analytics once-guard
  const isSubmittingRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const interestsFieldsetRef = useRef<HTMLFieldSetElement | null>(null);
  const timelineFieldsetRef = useRef<HTMLFieldSetElement | null>(null);
  const areaInputRef = useRef<HTMLInputElement | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const isUrgent = timeline === URGENT_TIMELINE_VALUE;
  const firstName = fullName.trim().split(/\s+/)[0] || 'there';

  const markFormStarted = () => {
    if (hasTrackedStartRef.current) return;
    hasTrackedStartRef.current = true;
    trackSurveyEvent('form_start', { form_name: 'free_site_survey' });
  };

  // Autofocus the first field on mount without yanking page scroll away from the Hero
  useEffect(() => {
    nameInputRef.current?.focus({ preventScroll: true });
  }, []);

  // Move focus cleanly when transitioning between Step 1, Step 2, and Success
  useEffect(() => {
    if (step === 2) {
      areaInputRef.current?.focus({ preventScroll: true });
    } else if (step === 'success') {
      successHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  // Sync pre-selected chips/notes when user clicks a Product, Room Demo, or Package CTA
  useEffect(() => {
    if (selectionVersion === 0) return;
    if (selectionMode === 'package') {
      setSelectedInterests(Array.from(new Set(preselectedChips)));
    } else if (preselectedChips.length > 0) {
      setSelectedInterests((prev) => Array.from(new Set([...prev, ...preselectedChips])));
    }
    if (preselectedNote) {
      setNotes(preselectedNote);
    }
    setErrors((prev) => ({ ...prev, interests: undefined }));
    setSubmitError(null);
    setStep((currentStep) => {
      if (currentStep === 'success') {
        setLeadRef('');
        hasTrackedStartRef.current = false;
        return 1;
      }
      return currentStep;
    });
    nameInputRef.current?.focus({ preventScroll: true });
  }, [preselectedChips, preselectedNote, selectionMode, selectionVersion]);

  const toggleInterest = (chip: string) => {
    markFormStarted();
    setSelectedInterests((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
    );
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: undefined }));
    }
  };

  const buildPrefilledWhatsAppMessage = (refId?: string): string => {
    const trimmedName = fullName.trim();
    const interestList =
      selectedInterests.length > 0 ? selectedInterests.join(', ') : 'a smart home setup';
    const lines = [
      `Hi, my name is ${trimmedName || 'a visitor'}. I'm interested in ${interestList} and would like to book a free site survey.`,
      timeline ? `Timeline: ${timeline}` : null,
      selectedPackage ? `Package: ${selectedPackage}` : null,
      area.trim() ? `Area / City: ${area.trim()}` : null,
      propertyType ? `Property type: ${propertyType}` : null,
      preferredDay ? `Preferred survey day: ${preferredDay}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
      refId ? `Reference: ${refId}` : null,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const postToWeb3Forms = async (payload: Record<string, string | boolean>): Promise<void> => {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: { success?: boolean; message?: string } | null = null;
    try {
      data = (await response.json()) as { success?: boolean; message?: string };
    } catch {
      data = null;
    }

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || 'Unable to submit your request right now.');
    }
  };

  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const nextErrors: Step1Errors = {};

    if (!trimmedName) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!trimmedPhone) {
      nextErrors.phone = 'Please enter your phone or WhatsApp number.';
    } else if (!isValidPhone(trimmedPhone)) {
      nextErrors.phone = 'Enter a valid phone number, e.g. 0801 234 5678 or +234 801 234 5678.';
    }
    if (selectedInterests.length === 0) {
      nextErrors.interests = 'Please choose at least one option you are interested in.';
    }
    if (!timeline) {
      nextErrors.timeline = 'Please let us know when you need the project done.';
    }

    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.fullName) {
        nameInputRef.current?.focus();
      } else if (nextErrors.phone) {
        phoneInputRef.current?.focus();
      } else if (nextErrors.interests) {
        interestsFieldsetRef.current?.querySelector<HTMLInputElement>('input')?.focus();
      } else if (nextErrors.timeline) {
        timelineFieldsetRef.current?.querySelector<HTMLInputElement>('input')?.focus();
      }
      return;
    }

    // Generate a reference ID now so Step 2 and the success screen can display it
    const refId = leadRef || generateLeadReference();
    setLeadRef(refId);

    trackSurveyEvent('step1_complete', {
      reference_id: refId,
      timeline,
      urgent: timeline === URGENT_TIMELINE_VALUE,
      interests_count: selectedInterests.length,
    });

    setStep(2);
  };

  /**
   * Single Web3Forms POST that combines all Step 1 + Step 2 fields.
   * Called from both Step 2 submit and "Skip" so we never send twice.
   */
  const submitCombinedPayload = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedArea = area.trim();
    const trimmedNotes = notes.trim();
    const interestsCsv = selectedInterests.join(', ');
    const urgentLead = timeline === URGENT_TIMELINE_VALUE;
    const subject = urgentLead
      ? `🔥 URGENT Survey Request: ${trimmedName} - ${interestsCsv}`
      : `New Survey Request: ${trimmedName} - ${interestsCsv}`;

    const payload: Record<string, string | boolean> = {
      access_key: web3FormsAccessKey,
      subject,
      from_name: 'Website Lead Form',
      botcheck,
      reference_id: leadRef,
      name: trimmedName,
      phone: trimmedPhone,
      interests: interestsCsv,
      timeline,
      area_or_city: trimmedArea || 'Not provided',
      property_type: propertyType || 'Not provided',
      preferred_survey_day: preferredDay || 'Not provided',
      notes: trimmedNotes || 'Not provided',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
    };

    if (selectedPackage) {
      payload.package = selectedPackage;
    }

    try {
      await postToWeb3Forms(payload);
      trackSurveyEvent('step2_complete', {
        reference_id: leadRef,
        has_area: Boolean(trimmedArea),
        has_property_type: Boolean(propertyType),
        has_preferred_day: Boolean(preferredDay),
      });
      setSubmitError(null);
      setStep('success');
    } catch {
      setSubmitError(
        "We couldn't send your request right now. Please try again or reach us directly on WhatsApp."
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitCombinedPayload();
  };

  const handleSkipStep2 = async () => {
    await submitCombinedPayload();
  };

  const handleReset = () => {
    setStep(1);
    setLeadRef('');
    setFullName('');
    setPhone('');
    setSelectedInterests([]);
    setTimeline('');
    setBotcheck(false);
    setArea('');
    setPropertyType('');
    setPreferredDay('');
    setNotes('');
    setErrors({});
    setSubmitError(null);
    hasTrackedStartRef.current = false;
    onClearPackage();
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const whatsAppFallbackHref = buildWhatsAppLink(
    whatsappNumber,
    buildPrefilledWhatsAppMessage(leadRef || undefined)
  );

  const todayIso = getTodayIsoDate();
  const currentYear = new Date().getFullYear();

  const footerEmail =
    CONTACT_PLACEHOLDERS.email && !CONTACT_PLACEHOLDERS.email.trim().startsWith('[')
      ? CONTACT_PLACEHOLDERS.email.trim()
      : 'hello@ogsmarthomes.com';

  const footerWhatsAppHref = buildWhatsAppLink(
    whatsappNumber || CONTACT_PLACEHOLDERS.whatsappDigits,
    'Hello Og Smart Homes, I would like to ask about a smart home installation.'
  );

  const footerCustomAddress =
    CONTACT_PLACEHOLDERS.address && !CONTACT_PLACEHOLDERS.address.trim().startsWith('[')
      ? CONTACT_PLACEHOLDERS.address.trim()
      : null;

  const footerNavLinks: Array<{ id: string; label: string; href?: string }> = [
    { id: 'top', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'packages', label: 'Packages' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'survey', label: 'Contact' },
  ];

  const handleBackToTop = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      {/* =======================================================
          6.12 FREE SITE SURVEY (on navy, main CTA)
          ======================================================= */}
      <section id="survey" className="surface-navy site-section">
        <div className="site-container">
          <div className="reveal">
            <span className="section-label">Free site survey</span>
            <h2 className="section-headline">Book your free survey.</h2>
            <p className="section-intro">
              Tell us about your home and we will visit, advise and send a clear quote. No
              obligation.
            </p>
          </div>

          <div className="mt-10 min-[820px]:mt-14 grid grid-cols-1 min-[820px]:grid-cols-[1fr_1.25fr] gap-10 min-[820px]:gap-14 items-start">
            {/* Left column on desktop (second on mobile so form comes first on phones) */}
            <div className="order-2 min-[820px]:order-1 flex flex-col gap-8">
              <div>
                <h3 className="text-[20px] font-semibold text-white m-0 mb-4">
                  What happens at your survey
                </h3>
                <ul className="list-none m-0 p-0 space-y-3.5 text-[15px] text-[#d3dcea]">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>We check your doors, walls, wiring and inverter or solar setup.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>You see the right options for your rooms and your budget.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>You get an itemised quote with clear installation timing.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-7 border-t border-white/14">
                <h3 className="text-[18px] font-semibold text-white m-0 mb-4">Contact details</h3>
                <dl className="m-0 space-y-3 text-[15px]">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9ccbff]">
                      Phone
                    </dt>
                    <dd className="m-0 text-white">{CONTACT_PLACEHOLDERS.phone}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9ccbff]">
                      WhatsApp
                    </dt>
                    <dd className="m-0 text-white">{CONTACT_PLACEHOLDERS.whatsappDisplay}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9ccbff]">
                      Email
                    </dt>
                    <dd className="m-0 text-white">{CONTACT_PLACEHOLDERS.email}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9ccbff]">
                      Address and service areas
                    </dt>
                    <dd className="m-0 text-[#d3dcea]">{CONTACT_PLACEHOLDERS.address}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9ccbff]">
                      Opening hours
                    </dt>
                    <dd className="m-0 text-[#d3dcea]">{CONTACT_PLACEHOLDERS.hours}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right column on desktop (FIRST on mobile): Form Card on lighter navy #101c33 */}
            <div className="order-1 min-[820px]:order-2 card-navy p-5 min-[820px]:p-8">
              {/* Progress indicator (Steps 1 & 2) */}
              {step !== 'success' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-3 text-[13px] font-medium mb-2.5">
                    <span className="text-[#ffc46b] font-semibold tabular-nums">
                      Step {step} of 2
                    </span>
                    <span className="text-[#b9c4d6]">
                      {step === 1 ? 'Takes under 30 seconds' : 'Optional details'}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Survey form progress"
                    aria-valuemin={1}
                    aria-valuemax={2}
                    aria-valuenow={step}
                    className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-[#ffc46b] transition-transform duration-300 ease-out origin-left"
                      style={{
                        transform: step === 1 ? 'scaleX(0.5)' : 'scaleX(1)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* =====================================================
                  STEP 1: Fast lead capture (4 required fields)
                  ===================================================== */}
              {step === 1 && (
                <form
                  key="survey-step-1"
                  onSubmit={handleStep1Submit}
                  noValidate
                  className="space-y-5 tab-panel-fade"
                >
                  {/* Hidden Web3Forms configuration & honeypot */}
                  <input type="hidden" name="access_key" value={web3FormsAccessKey} />
                  <input
                    type="checkbox"
                    name="botcheck"
                    checked={botcheck}
                    onChange={(e) => setBotcheck(e.target.checked)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {/* Selected package banner (shown when a package CTA is tapped) */}
                  {selectedPackage && (
                    <div
                      className="flex items-center justify-between gap-3 pb-4 border-b border-white/14 text-[14px]"
                      aria-live="polite"
                    >
                      <span className="text-[#d3dcea]">
                        Package:{' '}
                        <strong className="font-semibold text-[#ffc46b]">{selectedPackage}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={onClearPackage}
                        aria-label={`Remove ${selectedPackage} package`}
                        className="min-h-[44px] min-w-[44px] -my-2 -mr-2 rounded-full inline-flex items-center justify-center text-[#b9c4d6] hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  )}

                  {/* 1. Full name */}
                  <div>
                    <label
                      htmlFor="survey-name"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Full name <span className="text-[#ffc46b]">*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      id="survey-name"
                      name="fullName"
                      type="text"
                      inputMode="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onFocus={markFormStarted}
                      onChange={(e) => {
                        markFormStarted();
                        setFullName(e.target.value);
                        if (errors.fullName) {
                          setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      placeholder="Your full name"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'survey-name-error' : undefined}
                      className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border transition-colors ${errors.fullName ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                        }`}
                    />
                    {errors.fullName && (
                      <p
                        id="survey-name-error"
                        className="text-[14px] text-[#ff8a78] mt-1.5 mb-0"
                        role="alert"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Phone or WhatsApp number */}
                  <div>
                    <label
                      htmlFor="survey-phone"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Phone or WhatsApp number <span className="text-[#ffc46b]">*</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      id="survey-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onFocus={markFormStarted}
                      onChange={(e) => {
                        markFormStarted();
                        setPhone(e.target.value);
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder="0801 234 5678 or +234 801 234 5678"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'survey-phone-error' : undefined}
                      className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border transition-colors ${errors.phone ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                        }`}
                    />
                    {errors.phone && (
                      <p
                        id="survey-phone-error"
                        className="text-[14px] text-[#ff8a78] mt-1.5 mb-0"
                        role="alert"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* 3. Interests (multi-select accessible checkboxes styled as pill chips) */}
                  <fieldset
                    ref={interestsFieldsetRef}
                    className="border-0 p-0 mb-4"
                    aria-describedby={errors.interests ? 'survey-interests-error' : undefined}
                  >
                    <legend className="text-[14px] font-semibold text-white mb-2.5">
                      What are you interested in? <span className="text-[#ffc46b]">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {SURVEY_INTEREST_CHIPS.map((chip) => {
                        const active = selectedInterests.includes(chip);
                        return (
                          <label
                            key={chip}
                            className={`relative inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer select-none border transition-colors duration-150 focus-within:outline-2 focus-within:outline-white focus-within:outline-offset-2 ${active
                                ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                                : 'bg-[#0a1220] text-white border-white/18 hover:border-white/40'
                              }`}
                          >
                            <input
                              type="checkbox"
                              name="interests"
                              value={chip}
                              checked={active}
                              onChange={() => toggleInterest(chip)}
                              className="sr-only"
                            />
                            <span>{chip}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.interests && (
                      <p
                        id="survey-interests-error"
                        className="text-[14px] text-[#ff8a78] mt-2 mb-0"
                        role="alert"
                      >
                        {errors.interests}
                      </p>
                    )}
                  </fieldset>

                  {/* 4. Project timeline (single-select accessible radios styled as pill chips) */}
                  <fieldset
                    ref={timelineFieldsetRef}
                    className="border-0 p-0 mb-4"
                    aria-describedby={errors.timeline ? 'survey-timeline-error' : undefined}
                  >
                    <legend className="text-[14px] font-semibold text-white mb-2.5">
                      When do you need the project done? <span className="text-[#ffc46b]">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINE_OPTIONS.map((option) => {
                        const active = timeline === option.value;
                        const chipClasses = option.urgent
                          ? active
                            ? 'bg-gradient-to-r from-[#ff8a78] to-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                            : 'bg-[#ff8a78]/[0.12] text-[#ffd8cf] border-[#ff8a78]/50 hover:bg-[#ff8a78]/[0.2] hover:border-[#ff8a78]/75'
                          : active
                            ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                            : 'bg-[#0a1220] text-white border-white/18 hover:border-white/40';

                        return (
                          <label
                            key={option.value}
                            className={`relative inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer select-none border transition-colors duration-150 focus-within:outline-2 focus-within:outline-white focus-within:outline-offset-2 ${chipClasses}`}
                          >
                            <input
                              type="radio"
                              name="timeline"
                              value={option.value}
                              checked={active}
                              onChange={() => {
                                markFormStarted();
                                setTimeline(option.value);
                                if (errors.timeline) {
                                  setErrors((prev) => ({ ...prev, timeline: undefined }));
                                }
                              }}
                              className="sr-only"
                            />
                            {option.urgent && (
                              <Flame
                                size={15}
                                aria-hidden="true"
                                className={active ? 'text-[#0a1220]' : 'text-[#ff8a78]'}
                              />
                            )}
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.timeline && (
                      <p
                        id="survey-timeline-error"
                        className="text-[14px] text-[#ff8a78] mt-2 mb-0"
                        role="alert"
                      >
                        {errors.timeline}
                      </p>
                    )}
                  </fieldset>

                  {/* Submission error + WhatsApp fallback */}
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-[14px] bg-[#ff8a78]/[0.12] border border-[#ff8a78]/40 p-4 text-[14px] text-[#ffe1db] space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle
                          size={18}
                          aria-hidden="true"
                          className="shrink-0 mt-0.5 text-[#ff8a78]"
                        />
                        <p className="m-0 leading-relaxed">{submitError}</p>
                      </div>
                      <a
                        href={whatsAppFallbackHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-[#25d366]/15 border border-[#25d366]/45 text-[#d7ffe6] font-semibold no-underline hover:bg-[#25d366]/25 transition-colors"
                      >
                        <WhatsAppIcon size={18} />
                        <span>Chat on WhatsApp instead</span>
                      </a>
                    </div>
                  )}

                  {/* Primary CTA + concise privacy line */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="btn-primary w-full h-[54px] text-[16px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} aria-hidden="true" className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Get My Free Survey</span>
                      )}
                    </button>
                    <p className="text-[13px] text-[#b9c4d6] text-center mt-3 mb-0">
                      We only use your details to arrange your survey.
                    </p>
                  </div>
                </form>
              )}

              {/* =====================================================
                  STEP 2: Optional preparation details
                  ===================================================== */}
              {step === 2 && (
                <form
                  key="survey-step-2"
                  onSubmit={handleStep2Submit}
                  noValidate
                  className="space-y-5 tab-panel-fade"
                >
                  <input type="hidden" name="access_key" value={web3FormsAccessKey} />
                  <input
                    type="checkbox"
                    name="botcheck"
                    checked={botcheck}
                    onChange={(e) => setBotcheck(e.target.checked)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="pb-1">
                    <h3 className="text-[21px] min-[820px]:text-[23px] font-semibold text-white m-0 leading-snug">
                      Thanks {firstName}! Help us prepare for your survey (optional)
                    </h3>
                    <p className="text-[14px] text-[#b9c4d6] mt-2 mb-0">
                      Your request is already received
                      {leadRef ? ` · Ref ${leadRef}` : ''}. Add anything helpful below, or skip.
                    </p>
                  </div>

                  {/* Area or city */}
                  <div>
                    <label
                      htmlFor="survey-area"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Area or city
                    </label>
                    <input
                      ref={areaInputRef}
                      id="survey-area"
                      name="area"
                      type="text"
                      inputMode="text"
                      autoComplete="address-level2"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Lekki, Ikeja, Wuse"
                      className="w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border border-white/18 focus:border-[#ffc46b] transition-colors"
                    />
                  </div>

                  {/* Type of property */}
                  <fieldset className="border-0 p-0 m-0">
                    <legend className="text-[14px] font-semibold text-white mb-2.5">
                      Type of property
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_TYPE_OPTIONS.map((type) => {
                        const active = propertyType === type;
                        return (
                          <label
                            key={type}
                            className={`relative inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer select-none border transition-colors duration-150 focus-within:outline-2 focus-within:outline-white focus-within:outline-offset-2 ${active
                                ? 'bg-[#ffc46b] text-[#0a1220] border-[#ffc46b] font-semibold'
                                : 'bg-[#0a1220] text-white border-white/18 hover:border-white/40'
                              }`}
                          >
                            <input
                              type="radio"
                              name="propertyType"
                              value={type}
                              checked={active}
                              onChange={() => setPropertyType(type)}
                              className="sr-only"
                            />
                            <span>{type}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Preferred survey day */}
                  <div>
                    <label
                      htmlFor="survey-day"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Preferred survey day
                    </label>
                    <input
                      id="survey-day"
                      name="preferredDay"
                      type="date"
                      min={todayIso}
                      value={preferredDay}
                      onChange={(e) => setPreferredDay(e.target.value)}
                      className="w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white bg-[#0a1220] border border-white/18 focus:border-[#ffc46b] transition-colors [color-scheme:dark]"
                    />
                  </div>

                  {/* Anything else we should know? (2 rows) */}
                  <div>
                    <label
                      htmlFor="survey-notes"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Anything else we should know?
                    </label>
                    <textarea
                      id="survey-notes"
                      name="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Number of doors, cameras, rooms, or questions"
                      className="w-full p-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border border-white/18 focus:border-[#ffc46b] transition-colors resize-y"
                    />
                  </div>

                  {/* Step 2 submission error + WhatsApp fallback */}
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-[14px] bg-[#ff8a78]/[0.12] border border-[#ff8a78]/40 p-4 text-[14px] text-[#ffe1db] space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle
                          size={18}
                          aria-hidden="true"
                          className="shrink-0 mt-0.5 text-[#ff8a78]"
                        />
                        <p className="m-0 leading-relaxed">{submitError}</p>
                      </div>
                      <a
                        href={whatsAppFallbackHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-[#25d366]/15 border border-[#25d366]/45 text-[#d7ffe6] font-semibold no-underline hover:bg-[#25d366]/25 transition-colors"
                      >
                        <WhatsAppIcon size={18} />
                        <span>Send details on WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {/* Actions: Send Details + Skip text link */}
                  <div className="pt-1 flex flex-col items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="btn-primary w-full h-[54px] text-[16px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} aria-hidden="true" className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Details</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipStep2}
                      disabled={isSubmitting}
                      className="min-h-[44px] px-4 inline-flex items-center justify-center text-[14px] font-medium text-[#b9c4d6] hover:text-white underline underline-offset-4 bg-transparent border-0 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      Skip, I&apos;m done
                    </button>
                  </div>
                </form>
              )}

              {/* =====================================================
                  SUCCESS STATE
                  ===================================================== */}
              {step === 'success' && (
                <div
                  key="survey-success"
                  className="py-6 text-center flex flex-col items-center gap-5 tab-panel-fade"
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${isUrgent
                        ? 'bg-[#ff8a78]/20 text-[#ff8a78]'
                        : 'bg-[#ffc46b]/16 text-[#ffc46b]'
                      }`}
                  >
                    {isUrgent ? <Flame size={30} aria-hidden="true" /> : <CheckIcon size={32} />}
                  </span>

                  <div className="max-w-[440px] space-y-2.5">
                    <h3
                      ref={successHeadingRef}
                      tabIndex={-1}
                      className="text-[23px] min-[820px]:text-[25px] font-semibold text-white m-0 leading-snug outline-none"
                    >
                      {isUrgent
                        ? "Marked as urgent. We'll contact you as soon as possible."
                        : responseTime
                          ? `We've got your request! We'll call or WhatsApp you within ${responseTime}.`
                          : "We've got your request! We'll call or WhatsApp you shortly."}
                    </h3>

                    {isUrgent && (
                      <p className="text-[15px] text-[#ffd8cf] m-0">
                        We&apos;ve got your request and flagged it as priority for our team.
                      </p>
                    )}

                    {leadRef && (
                      <p className="text-[13px] text-[#b9c4d6] m-0 tabular-nums">
                        Reference: <span className="text-white font-medium">{leadRef}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[440px] mt-2">
                    <a
                      href={whatsAppFallbackHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex-1"
                    >
                      <WhatsAppIcon size={19} />
                      <span>Chat on WhatsApp now</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary w-full sm:w-auto text-white"
                    >
                      Send another request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          6.13 FOOTER (strictly monochrome editorial layout)
          ======================================================= */}
      <footer className="bg-[#000000] text-white border-t border-white/[0.08] pt-24 pb-28 min-[820px]:pt-24 min-[820px]:pb-12">
        <div className="site-container min-[960px]:min-h-[520px] flex flex-col justify-between">
          <div>
            {/* Top-left logo mark: thin white outline house icon inside a small rounded pill */}
            <div className="mb-12 min-[820px]:mb-14">
              <a
                href="#top"
                aria-label="Og Smart Homes — Back to top"
                className="group inline-flex items-center justify-center w-[42px] h-[24px] rounded-full border border-white/60 hover:border-white text-white no-underline transition-colors duration-200"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:scale-105"
                >
                  <path
                    d="M4.5 12.5L14 4.5L23.5 12.5V22.5C23.5 23.0523 23.0523 23.5 22.5 23.5H5.5C4.94772 23.5 4.5 23.0523 4.5 22.5V12.5Z"
                    stroke="currentColor"
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 23.5V17.4C11 16.7373 11.5373 16.2 12.2 16.2H15.8C16.4627 16.2 17 16.7373 17 17.4V23.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="14"
                    cy="11.5"
                    r="1.9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </a>
            </div>

            {/* Two-half grid: Headline + intro + email on left; 3 columns starting from page midpoint on right, top-aligned with headline */}
            <div className="grid grid-cols-1 min-[960px]:grid-cols-2 gap-14 min-[960px]:gap-12 items-start">
              {/* Left half: Clean white light-weight headline, grey intro paragraph, white email CTA */}
              <div className="max-w-[540px]">
                <h2 className="m-0 font-light uppercase text-white text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[0.01em]">
                  WE WOULD LOVE
                  <br />
                  <em className="italic font-light">TO</em> HEAR FROM YOU.
                </h2>

                <p className="mt-6 mb-0 max-w-[320px] text-[13px] leading-[1.6] text-[#8a8a8a]">
                  Feel free to reach out if you want to upgrade your home, or simply have a chat.
                </p>

                <div className="mt-9 min-[960px]:mt-10">
                  <a
                    href={`mailto:${footerEmail}`}
                    className="group inline-flex items-center gap-2.5 min-h-[44px] text-[1.25rem] font-normal tracking-[0.005em] text-white no-underline"
                  >
                    <span>{footerEmail}</span>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-white transition-transform duration-200 ease-out group-hover:translate-x-[4px]"
                    />
                  </a>
                </div>
              </div>

              {/* Right half: 3 columns aligned from midpoint, top-aligned with headline's first line */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 min-[1100px]:gap-8 items-start min-[960px]:pt-[4px]">
                {/* Column 1: OUR ADDRESS */}
                <div>
                  <h3 className="m-0 mb-5 text-[11px] font-bold uppercase tracking-[0.08em] text-white leading-none">
                    OUR ADDRESS
                  </h3>
                  <address className="not-italic text-[13px] leading-[1.6] text-[#8a8a8a] space-y-6">
                    {footerCustomAddress ? (
                      <p className="m-0">{footerCustomAddress}</p>
                    ) : (
                      <p className="m-0">
                        Lekki Phase 1
                        <br />
                        Lagos, Nigeria
                      </p>
                    )}

                    <p className="m-0 tabular-nums">
                      Serving Lagos, Abuja &amp; Port Harcourt
                      <br />
                      Mon – Sat: 8am – 6pm
                      <br />
                      Free site survey included
                      <br />
                      Supply, install &amp; after-install support
                    </p>
                  </address>
                </div>

                {/* Column 2: FOLLOW US */}
                <div>
                  <h3 className="m-0 mb-5 text-[11px] font-bold uppercase tracking-[0.08em] text-white leading-none">
                    FOLLOW US
                  </h3>

                  <div className="flex items-center gap-4 text-[13px] leading-[1.6]">
                    <a
                      href="https://facebook.com/ogsmarthomes"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Og Smart Homes on Facebook"
                      className="text-[#8a8a8a] hover:text-white no-underline transition-colors duration-150"
                    >
                      Fb
                    </a>
                    <a
                      href="https://instagram.com/ogsmarthomes"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Og Smart Homes on Instagram"
                      className="text-[#8a8a8a] hover:text-white no-underline transition-colors duration-150"
                    >
                      Ig
                    </a>
                    <a
                      href="https://linkedin.com/company/ogsmarthomes"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Og Smart Homes on LinkedIn"
                      className="text-[#8a8a8a] hover:text-white no-underline transition-colors duration-150"
                    >
                      Li
                    </a>
                    <a
                      href={footerWhatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with Og Smart Homes on WhatsApp"
                      className="text-[#8a8a8a] hover:text-white no-underline transition-colors duration-150"
                    >
                      Wa
                    </a>
                  </div>

                  <ul className="list-none m-0 p-0 mt-7 space-y-3">
                    <li>
                      <a
                        href="#survey"
                        className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:opacity-80 no-underline whitespace-nowrap transition-opacity duration-150"
                      >
                        <ArrowUpRight
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="shrink-0 text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                        <span>BOOK FREE SURVEY</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#rooms"
                        className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:opacity-80 no-underline whitespace-nowrap transition-opacity duration-150"
                      >
                        <ArrowUpRight
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="shrink-0 text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                        <span>LIVE ROOM DEMO</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={footerWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:opacity-80 no-underline whitespace-nowrap transition-opacity duration-150"
                      >
                        <ArrowUpRight
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="shrink-0 text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                        <span>WHATSAPP SUPPORT</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Nav links (no heading) */}
                <nav aria-label="Footer navigation" className="sm:pl-4 min-[1100px]:pl-8">
                  <ul className="list-none m-0 p-0 flex flex-col items-start gap-[18px]">
                    {footerNavLinks.map((link) => (
                      <li key={link.id} className="leading-none">
                        <a
                          href={link.href || `#${link.id}`}
                          className="footer-nav-link text-[11px] font-normal uppercase tracking-[0.1em] leading-none whitespace-nowrap"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom bar: optional monochrome legal notice + copyright & circular TOP button */}
          <div className="mt-20 min-[820px]:mt-28">
            {activeLegalNotice && (
              <div
                role="region"
                aria-label={activeLegalNotice === 'privacy' ? 'Privacy notice' : 'Terms notice'}
                className="mb-8 pt-5 border-t border-white/10 flex items-start justify-between gap-4 text-[13px] leading-relaxed text-[#8a8a8a] max-w-[720px]"
              >
                <p className="m-0">
                  {activeLegalNotice === 'privacy'
                    ? 'Privacy: We only use the contact details you submit to schedule your free site survey, prepare your itemised quote, and provide installation support. We never sell or share your information with third parties.'
                    : 'Terms: All site surveys are free with no obligation. Final device pricing, installation timelines, and product warranty terms are confirmed in writing on your itemised quote before work begins.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveLegalNotice(null)}
                  aria-label="Close legal notice"
                  className="shrink-0 min-h-[36px] min-w-[36px] -mt-1.5 inline-flex items-center justify-center rounded-full text-[#5c5c5c] hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  <CloseIcon size={15} />
                </button>
              </div>
            )}

            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] tracking-[0.02em] text-[#5c5c5c] pb-1">
                <span>&copy; OG SMART HOMES {currentYear} All rights reserved</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  aria-expanded={activeLegalNotice === 'privacy'}
                  onClick={() =>
                    setActiveLegalNotice((prev) => (prev === 'privacy' ? null : 'privacy'))
                  }
                  className={`bg-transparent border-0 p-0 text-[11px] tracking-[0.02em] cursor-pointer transition-colors duration-150 ${activeLegalNotice === 'privacy'
                      ? 'text-white underline underline-offset-4'
                      : 'text-[#5c5c5c] hover:text-white'
                    }`}
                >
                  Privacy
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  aria-expanded={activeLegalNotice === 'terms'}
                  onClick={() =>
                    setActiveLegalNotice((prev) => (prev === 'terms' ? null : 'terms'))
                  }
                  className={`bg-transparent border-0 p-0 text-[11px] tracking-[0.02em] cursor-pointer transition-colors duration-150 ${activeLegalNotice === 'terms'
                      ? 'text-white underline underline-offset-4'
                      : 'text-[#5c5c5c] hover:text-white'
                    }`}
                >
                  Terms
                </button>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-3 min-[820px]:mr-[76px] min-[1380px]:mr-0">
                {/* Mobile green WhatsApp button stacked above TOP button so they never overlap */}
                <a
                  href={footerWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="only-mobile w-[48px] h-[48px] rounded-full items-center justify-center bg-[#25D366] text-white no-underline shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <WhatsAppIcon size={24} />
                </a>

                <button
                  type="button"
                  onClick={handleBackToTop}
                  aria-label="Back to top"
                  className="footer-top-btn group w-[64px] h-[64px] rounded-full border border-white/40 bg-transparent text-white inline-flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-[0.1em] cursor-pointer"
                >
                  <span>TOP</span>
                  <ArrowUp size={10} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
