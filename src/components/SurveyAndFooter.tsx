import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import {
  CONTACT_PLACEHOLDERS,
  PACKAGES,
} from '../data/siteData';
import { CheckIcon, CloseIcon, WhatsAppIcon } from './Icons';
import { Footer } from './Footer';

interface SurveyAndFooterProps {
  preselectedChips: string[];
  preselectedNote: string;
  selectionMode: 'append' | 'package';
  selectedPackage: string | null;
  onClearPackage: () => void;
  selectionVersion: number;
}

interface FormErrors {
  email?: string;
  phone?: string;
  houseType?: string;
  buildingStatus?: string;
  roomCount?: string;
  consent?: string;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const HOUSE_TYPE_OPTIONS: string[] = [
  'Flat',
  'Apartment Building',
  'Duplex',
  'Mansion',
  'Hotel',
  'Office',
  'Other Residential Property',
  'Other Commercial Property',
];

const BUILDING_STATUS_OPTIONS: string[] = [
  'Under Planning',
  'Under Construction',
  'Finished & Occupied',
  'Finished & Unoccupied',
];

type SurveyEnvKey =
  | 'VITE_WEB3FORMS_ACCESS_KEY'
  | 'VITE_WHATSAPP_NUMBER'
  | 'VITE_RESPONSE_TIME';

function readEnv(key: SurveyEnvKey): string {
  const raw = import.meta.env[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

/** Validate email format */
function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
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
  selectedPackage,
  onClearPackage,
  selectionVersion,
}) => {
  // Environment-driven configuration (never hardcoded)
  const web3FormsAccessKey = readEnv('VITE_WEB3FORMS_ACCESS_KEY');
  const whatsappNumber = readEnv('VITE_WHATSAPP_NUMBER');
  const responseTime = readEnv('VITE_RESPONSE_TIME');

  // Submission state
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadRef, setLeadRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [houseType, setHouseType] = useState(HOUSE_TYPE_OPTIONS[0]);
  const [buildingStatus, setBuildingStatus] = useState(BUILDING_STATUS_OPTIONS[0]);
  const [roomCount, setRoomCount] = useState('');
  const [notes, setNotes] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Refs for autofocus, double-submit protection, and analytics once-guard
  const isSubmittingRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const houseTypeSelectRef = useRef<HTMLSelectElement | null>(null);
  const buildingStatusSelectRef = useRef<HTMLSelectElement | null>(null);
  const roomCountInputRef = useRef<HTMLInputElement | null>(null);
  const consentInputRef = useRef<HTMLInputElement | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const markFormStarted = () => {
    if (hasTrackedStartRef.current) return;
    hasTrackedStartRef.current = true;
    trackSurveyEvent('form_start', { form_name: 'custom_quote_request' });
  };

  // Autofocus the first field on mount without yanking page scroll away from the Hero
  useEffect(() => {
    nameInputRef.current?.focus({ preventScroll: true });
  }, []);

  // Move focus cleanly when transitioning to Success
  useEffect(() => {
    if (isSuccess) {
      successHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [isSuccess]);

  // Sync pre-selected package/notes when user clicks another CTA
  useEffect(() => {
    if (selectionVersion === 0) return;
    if (preselectedNote) {
      setNotes(preselectedNote);
    } else if (selectedPackage) {
      setNotes((prev) => prev || `Interested in: ${selectedPackage}`);
    } else if (preselectedChips.length > 0) {
      setNotes((prev) => prev || `Interested in: ${preselectedChips.join(', ')}`);
    }
    setSubmitError(null);
    if (isSuccess) {
      setIsSuccess(false);
      setLeadRef('');
      hasTrackedStartRef.current = false;
    }
    nameInputRef.current?.focus({ preventScroll: true });
  }, [preselectedChips, preselectedNote, selectedPackage, selectionVersion, isSuccess]);

  const buildPrefilledWhatsAppMessage = (refId?: string): string => {
    const trimmedName = fullName.trim();
    const lines = [
      `Hi, my name is ${trimmedName || 'a visitor'}. I'd like a custom smart home quote.`,
      phone.trim() ? `Number: ${phone.trim()}` : null,
      email.trim() ? `Email: ${email.trim()}` : null,
      `House type: ${houseType}`,
      `Status of Building: ${buildingStatus}`,
      roomCount.trim() ? `Number of Rooms: ${roomCount.trim()}` : null,
      selectedPackage ? `Package: ${selectedPackage}` : null,
      notes.trim() ? `Additional Message: ${notes.trim()}` : null,
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedRoomCount = roomCount.trim();
    const parsedRooms = Number(trimmedRoomCount);
    const trimmedNotes = notes.trim();
    const nextErrors: FormErrors = {};

    if (!trimmedPhone) {
      nextErrors.phone = 'Please enter your phone number.';
    } else if (!isValidPhone(trimmedPhone)) {
      nextErrors.phone = 'Enter a valid phone number, e.g. 0801 234 5678 or +234 801 234 5678.';
    }
    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!houseType) {
      nextErrors.houseType = 'Please select a house type.';
    }
    if (!buildingStatus) {
      nextErrors.buildingStatus = 'Please select the building status.';
    }
    if (!trimmedRoomCount) {
      nextErrors.roomCount = 'Please enter the number of rooms (1–12).';
    } else if (!Number.isInteger(parsedRooms) || parsedRooms < 1 || parsedRooms > 12) {
      nextErrors.roomCount = 'Enter a whole number between 1 and 12.';
    }
    if (!consentAgreed) {
      nextErrors.consent = 'You must agree to the Terms and Conditions and Privacy Policy.';
    }

    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.phone) {
        phoneInputRef.current?.focus();
      } else if (nextErrors.email) {
        emailInputRef.current?.focus();
      } else if (nextErrors.houseType) {
        houseTypeSelectRef.current?.focus();
      } else if (nextErrors.buildingStatus) {
        buildingStatusSelectRef.current?.focus();
      } else if (nextErrors.roomCount) {
        roomCountInputRef.current?.focus();
      } else if (nextErrors.consent) {
        consentInputRef.current?.focus();
      }
      return;
    }

    const refId = leadRef || generateLeadReference();
    setLeadRef(refId);

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const payload: Record<string, string | boolean> = {
      access_key: web3FormsAccessKey,
      subject: `New Smart Home Inquiry: ${trimmedName || trimmedPhone} (${houseType}, ${parsedRooms} rooms)`,
      from_name: 'Website Lead Form',
      botcheck,
      terms_and_privacy_agreed: true,
      reference_id: refId,
      name: trimmedName || 'Not provided',
      phone: trimmedPhone,
      email: trimmedEmail,
      house_type: houseType,
      building_status: buildingStatus,
      number_of_rooms: String(parsedRooms),
      selected_package: selectedPackage || 'Not specified',
      additional_message: trimmedNotes || 'Not provided',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
    };

    try {
      await postToWeb3Forms(payload);
      trackSurveyEvent('step2_complete', {
        reference_id: refId,
        house_type: houseType,
        building_status: buildingStatus,
        rooms: parsedRooms,
      });
      setSubmitError(null);
      setIsSuccess(true);
    } catch {
      setSubmitError(
        "We couldn't send your request right now. Please try again or reach us directly on WhatsApp."
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setLeadRef('');
    setFullName('');
    setPhone('');
    setEmail('');
    setHouseType(HOUSE_TYPE_OPTIONS[0]);
    setBuildingStatus(BUILDING_STATUS_OPTIONS[0]);
    setRoomCount('');
    setNotes('');
    setBotcheck(false);
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

  return (
    <>
      {/* =======================================================
          6.12 CUSTOM QUOTE & PLAN (on navy, main CTA)
          ======================================================= */}
      <section id="survey" className="surface-navy site-section">
        <div className="site-container">
          <div className="reveal">
            <span className="section-label">Custom Quote & Plan</span>
            <h2 className="section-headline">Get your custom smart home plan.</h2>
            <p className="section-intro">
              Share your rooms, doors, and power setup. We send an itemised quote and compatibility
              check with clear installation timing—no obligation.
            </p>
          </div>

          <div className="mt-10 min-[820px]:mt-14 grid grid-cols-1 min-[820px]:grid-cols-[1fr_1.25fr] gap-10 min-[820px]:gap-14 items-start">
            {/* Left column on desktop (second on mobile so form comes first on phones) */}
            <div className="order-2 min-[820px]:order-1 flex flex-col gap-8">
              <div>
                <h3 className="text-[20px] font-semibold text-white m-0 mb-4">
                  What your plan includes
                </h3>
                <ul className="list-none m-0 p-0 space-y-3.5 text-[15px] text-[#d3dcea]">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>Solar, inverter, and wiring compatibility check for your home.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>Room-by-room product recommendations tailored to your budget.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[#ffc46b]">
                      <CheckIcon size={17} />
                    </span>
                    <span>An itemised quote with clear installation timing.</span>
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
              {!isSuccess && (
                <form
                  key="survey-contact-form"
                  onSubmit={handleFormSubmit}
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

                  {/* 2-column grid on desktop: Name, Number, Email, House type, Status of Building, Number of Rooms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Name (optional) */}
                    <div>
                      <label
                        htmlFor="survey-name"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        Name
                      </label>
                      <input
                        ref={nameInputRef}
                        id="survey-name"
                        name="fullName"
                        type="text"
                        inputMode="text"
                        autoComplete="name"
                        value={fullName}
                        onFocus={markFormStarted}
                        onChange={(e) => {
                          markFormStarted();
                          setFullName(e.target.value);
                        }}
                        placeholder="Your name"
                        className="w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border border-white/18 focus:border-[#ffc46b] transition-colors"
                      />
                    </div>

                    {/* 2. Number * */}
                    <div>
                      <label
                        htmlFor="survey-phone"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        Number <span className="text-[#ff8a78]">*</span>
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
                        placeholder="0801 234 5678"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'survey-phone-error' : undefined}
                        className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border transition-colors ${errors.phone ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                          }`}
                      />
                      {errors.phone && (
                        <p
                          id="survey-phone-error"
                          className="text-[13px] text-[#ff8a78] mt-1.5 mb-0"
                          role="alert"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* 3. Email Address * */}
                    <div>
                      <label
                        htmlFor="survey-email"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        Email Address <span className="text-[#ff8a78]">*</span>
                      </label>
                      <input
                        ref={emailInputRef}
                        id="survey-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        required
                        autoComplete="email"
                        value={email}
                        onFocus={markFormStarted}
                        onChange={(e) => {
                          markFormStarted();
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'survey-email-error' : undefined}
                        className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border transition-colors ${errors.email ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                          }`}
                      />
                      {errors.email && (
                        <p
                          id="survey-email-error"
                          className="text-[13px] text-[#ff8a78] mt-1.5 mb-0"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* 4. House type * */}
                    <div>
                      <label
                        htmlFor="survey-house-type"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        House type <span className="text-[#ff8a78]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          ref={houseTypeSelectRef}
                          id="survey-house-type"
                          name="houseType"
                          required
                          value={houseType}
                          onFocus={markFormStarted}
                          onChange={(e) => {
                            markFormStarted();
                            setHouseType(e.target.value);
                            if (errors.houseType) {
                              setErrors((prev) => ({ ...prev, houseType: undefined }));
                            }
                          }}
                          aria-invalid={Boolean(errors.houseType)}
                          aria-describedby={errors.houseType ? 'survey-house-type-error' : undefined}
                          className={`w-full h-[52px] pl-4 pr-10 rounded-[14px] text-[15px] text-white bg-[#0a1220] border appearance-none cursor-pointer transition-colors ${errors.houseType ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                            }`}
                        >
                          {HOUSE_TYPE_OPTIONS.map((option) => (
                            <option key={option} value={option} className="bg-[#0a1220] text-white">
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b9c4d6]"
                        />
                      </div>
                      {errors.houseType && (
                        <p
                          id="survey-house-type-error"
                          className="text-[13px] text-[#ff8a78] mt-1.5 mb-0"
                          role="alert"
                        >
                          {errors.houseType}
                        </p>
                      )}
                    </div>

                    {/* 5. Status of Building * */}
                    <div>
                      <label
                        htmlFor="survey-building-status"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        Status of Building <span className="text-[#ff8a78]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          ref={buildingStatusSelectRef}
                          id="survey-building-status"
                          name="buildingStatus"
                          required
                          value={buildingStatus}
                          onFocus={markFormStarted}
                          onChange={(e) => {
                            markFormStarted();
                            setBuildingStatus(e.target.value);
                            if (errors.buildingStatus) {
                              setErrors((prev) => ({ ...prev, buildingStatus: undefined }));
                            }
                          }}
                          aria-invalid={Boolean(errors.buildingStatus)}
                          aria-describedby={
                            errors.buildingStatus ? 'survey-building-status-error' : undefined
                          }
                          className={`w-full h-[52px] pl-4 pr-10 rounded-[14px] text-[15px] text-white bg-[#0a1220] border appearance-none cursor-pointer transition-colors ${errors.buildingStatus ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                            }`}
                        >
                          {BUILDING_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option} className="bg-[#0a1220] text-white">
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b9c4d6]"
                        />
                      </div>
                      {errors.buildingStatus && (
                        <p
                          id="survey-building-status-error"
                          className="text-[13px] text-[#ff8a78] mt-1.5 mb-0"
                          role="alert"
                        >
                          {errors.buildingStatus}
                        </p>
                      )}
                    </div>

                    {/* 6. Number of Rooms(1-12) * */}
                    <div>
                      <label
                        htmlFor="survey-room-count"
                        className="block text-[14px] font-semibold text-white mb-2"
                      >
                        Number of Rooms(1-12) <span className="text-[#ff8a78]">*</span>
                      </label>
                      <input
                        ref={roomCountInputRef}
                        id="survey-room-count"
                        name="roomCount"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={12}
                        step={1}
                        required
                        value={roomCount}
                        onFocus={markFormStarted}
                        onChange={(e) => {
                          markFormStarted();
                          setRoomCount(e.target.value);
                          if (errors.roomCount) {
                            setErrors((prev) => ({ ...prev, roomCount: undefined }));
                          }
                        }}
                        placeholder="e.g. 4"
                        aria-invalid={Boolean(errors.roomCount)}
                        aria-describedby={errors.roomCount ? 'survey-room-count-error' : undefined}
                        className={`w-full h-[52px] px-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border transition-colors ${errors.roomCount ? 'border-[#ff8a78]' : 'border-white/18 focus:border-[#ffc46b]'
                          }`}
                      />
                      {errors.roomCount && (
                        <p
                          id="survey-room-count-error"
                          className="text-[13px] text-[#ff8a78] mt-1.5 mb-0"
                          role="alert"
                        >
                          {errors.roomCount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 7. Additional Message */}
                  <div>
                    <label
                      htmlFor="survey-notes"
                      className="block text-[14px] font-semibold text-white mb-2"
                    >
                      Additional Message
                    </label>
                    <textarea
                      id="survey-notes"
                      name="notes"
                      rows={4}
                      value={notes}
                      onFocus={markFormStarted}
                      onChange={(e) => {
                        markFormStarted();
                        setNotes(e.target.value);
                      }}
                      placeholder="Any specific automation goals, doors, or solar/inverter details"
                      className="w-full p-4 rounded-[14px] text-[16px] text-white placeholder:text-white/40 bg-[#0a1220] border border-white/18 focus:border-[#ffc46b] transition-colors resize-y"
                    />
                  </div>

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

                  {/* Required Terms & Privacy Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-[13.5px] text-[#b9c4d6] leading-snug">
                      <input
                        ref={consentInputRef}
                        type="checkbox"
                        name="consent"
                        checked={consentAgreed}
                        onChange={(e) => {
                          markFormStarted();
                          setConsentAgreed(e.target.checked);
                          if (errors.consent) {
                            setErrors((prev) => ({ ...prev, consent: undefined }));
                          }
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-white/30 bg-[#0a1220] accent-[#ffc46b] focus:ring-[#ffc46b] cursor-pointer shrink-0"
                      />
                      <span>
                        I agree to the{' '}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ffc46b] hover:underline font-medium"
                        >
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ffc46b] hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-[13px] text-[#ff8a78] mt-1.5 mb-0">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Primary CTA */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="btn-primary w-full sm:w-auto sm:min-w-[200px] h-[52px] text-[16px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} aria-hidden="true" className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* =====================================================
                  SUCCESS STATE
                  ===================================================== */}
              {isSuccess && (
                <div
                  key="survey-success"
                  className="py-6 text-center flex flex-col items-center gap-5 tab-panel-fade"
                  role="status"
                  aria-live="polite"
                >
                  <span className="w-16 h-16 rounded-full flex items-center justify-center bg-[#ffc46b]/16 text-[#ffc46b]">
                    <CheckIcon size={32} />
                  </span>

                  <div className="max-w-[440px] space-y-2.5">
                    <h3
                      ref={successHeadingRef}
                      tabIndex={-1}
                      className="text-[23px] min-[820px]:text-[25px] font-semibold text-white m-0 leading-snug outline-none"
                    >
                      {responseTime
                        ? `We've got your request! We'll call or WhatsApp you within ${responseTime}.`
                        : "We've got your request! We'll call or WhatsApp you shortly."}
                    </h3>

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
          6.13 FOOTER (Modern, Sleek, Premium Apple-inspired Footer)
          ======================================================= */}
      <Footer />
    </>
  );
};
