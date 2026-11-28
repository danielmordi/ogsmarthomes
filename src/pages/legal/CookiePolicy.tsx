import React from 'react';
import { LegalLayout, SectionItem } from '../../components/legal/LegalLayout';
import { Cookie, Settings, Eye, ShieldCheck, Check } from 'lucide-react';

const SECTIONS: SectionItem[] = [
  { id: 'what-are-cookies', title: '1. What Are Cookies & Local Storage?' },
  { id: 'why-we-use-them', title: '2. Why OG Smarthomes Uses Cookies' },
  { id: 'categories', title: '3. Categories of Cookies We Use' },
  { id: 'cookies-table', title: '4. Breakdown of Specific Cookies & Tokens' },
  { id: 'managing-cookies', title: '5. How You Can Manage Cookies' },
  { id: 'browser-controls', title: '6. Disabling Cookies in Your Browser' },
  { id: 'changes-policy', title: '7. Updates to this Cookie Policy' },
  { id: 'contact', title: '8. Inquiries & Contact' },
];

export const CookiePolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="November 22, 2026"
      description="Information on how OG Smarthomes uses cookies, local storage tokens, and web technologies to ensure site security, remember your demo preferences, and improve user experience."
      canonicalUrl="/cookie-policy"
      badge="Cookies &amp; Tracking"
      sections={SECTIONS}
    >
      {/* 1. What Are Cookies */}
      <section id="what-are-cookies" className="scroll-mt-32">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          1. What Are Cookies &amp; Local Storage?
        </h2>
        <p>
          Cookies are small text files that websites place on your computer, smartphone, or tablet when you visit a webpage.
          They are widely used to make websites function efficiently, remember your preferences, and provide analytical data to website owners.
        </p>
        <p>
          In addition to standard cookies, modern web applications also use <strong>Local Storage</strong> and <strong>Session Storage</strong>{' '}
          within your browser. These technologies allow websites to temporarily store small pieces of configuration data (such as devices you selected
          in our interactive Room Demo or your cookie banner preferences) without sending unnecessary data over the internet with every page request.
        </p>
      </section>

      {/* 2. Why We Use Them */}
      <section id="why-we-use-them" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          2. Why OG Smarthomes Uses Cookies
        </h2>
        <p>
          OG Smarthomes uses cookies and browser storage strictly to deliver a seamless, secure, and responsive user experience.
          We use them to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ensure website stability, rapid page rendering, and prevent automated spam submissions on our quote request forms.</li>
          <li>Remember products and smart hardware you tap in our interactive <em>Live Room Demo</em> so you don&apos;t have to re-select them on the quote form.</li>
          <li>Record whether you have accepted or declined non-essential cookies via our consent banner.</li>
          <li>Understand anonymous traffic patterns to ensure our site performs fast and reliably on Nigerian telecommunications networks.</li>
        </ul>
      </section>

      {/* 3. Categories */}
      <section id="categories" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          3. Categories of Cookies We Use
        </h2>
        <div className="space-y-4 my-4">
          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="flex items-center gap-2.5 text-[#0f1a2b] font-bold text-[16px] mb-2">
              <ShieldCheck size={20} className="text-[#ffc46b]" />
              <h3>Strictly Necessary Cookies (Always Active)</h3>
            </div>
            <p className="text-[14px] text-gray-600 m-0 leading-relaxed">
              These cookies and tokens are vital for the core technical operation of our website. They enable secure form submissions,
              protect against cross-site request forgery, prevent bot abuse on our quote request forms, and store your cookie consent preferences.
              Because the website cannot function properly without them, they cannot be switched off in our systems.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="flex items-center gap-2.5 text-[#0f1a2b] font-bold text-[16px] mb-2">
              <Settings size={20} className="text-[#ffc46b]" />
              <h3>Functionality &amp; Preference Cookies (Optional)</h3>
            </div>
            <p className="text-[14px] text-gray-600 m-0 leading-relaxed">
              These cookies remember choices you make while browsing—such as the hardware devices selected in our 3D room demo,
              your selected equipment packages, and pre-selected inquiry chips. If you disable these, you may need to re-enter your choices manually.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="flex items-center gap-2.5 text-[#0f1a2b] font-bold text-[16px] mb-2">
              <Eye size={20} className="text-[#ffc46b]" />
              <h3>Performance &amp; Analytics Cookies (Optional)</h3>
            </div>
            <p className="text-[14px] text-gray-600 m-0 leading-relaxed">
              These cookies collect aggregated, anonymous information about how visitors navigate our pages—such as which blog guides are read most often
              and whether mobile visitors encounter broken links. They do not store personally identifiable data like your name, phone number, or property address.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Cookies Table */}
      <section id="cookies-table" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          4. Breakdown of Specific Cookies &amp; Storage Tokens
        </h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse text-[13.5px] sm:text-[14px]">
            <thead>
              <tr className="bg-[#0a1220] text-white">
                <th className="p-3 font-semibold rounded-tl-lg">Token / Cookie</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Purpose</th>
                <th className="p-3 font-semibold rounded-tr-lg">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-x border-b border-gray-200 bg-white">
              <tr>
                <td className="p-3 font-mono text-[12.5px] font-bold text-[#0a1220]">og_cookie_consent</td>
                <td className="p-3 text-gray-600">Necessary</td>
                <td className="p-3 text-gray-600">Stores your accepted cookie consent choices (essential vs analytics).</td>
                <td className="p-3 text-gray-600">12 months</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[12.5px] font-bold text-[#0a1220]">web3forms_botcheck</td>
                <td className="p-3 text-gray-600">Necessary</td>
                <td className="p-3 text-gray-600">Honeypot token preventing automated spambots from flooding survey booking forms.</td>
                <td className="p-3 text-gray-600">Session</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[12.5px] font-bold text-[#0a1220]">og_room_demo_state</td>
                <td className="p-3 text-gray-600">Functional</td>
                <td className="p-3 text-gray-600">Remembers added smart hardware IDs from the interactive room demo.</td>
                <td className="p-3 text-gray-600">Session</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[12.5px] font-bold text-[#0a1220]">_ga / _ga_*</td>
                <td className="p-3 text-gray-600">Analytics (if enabled)</td>
                <td className="p-3 text-gray-600">Google Analytics aggregate telemetry (only set after explicit user consent).</td>
                <td className="p-3 text-gray-600">2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Managing Cookies */}
      <section id="managing-cookies" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          5. How You Can Manage Your Preferences
        </h2>
        <p>
          When you first visit <strong>https://ogsmarthomes.com</strong>, a cookie consent banner is displayed giving you clear options:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Accept All:</strong> Enables essential, functional, and anonymous analytics scripts.</li>
          <li><strong>Reject Non-Essential:</strong> Blocks all optional analytics and functional cookies, keeping only strictly necessary operational tokens.</li>
          <li><strong>Manage Preferences:</strong> Lets you selectively toggle categories on or off according to your preferences.</li>
        </ul>
        <p className="mt-3">
          You can reset or change your consent choice at any time by clearing your browser cache or re-opening the banner via the Cookie settings link in our footer.
        </p>
      </section>

      {/* 6. Browser Controls */}
      <section id="browser-controls" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          6. Disabling Cookies in Your Browser
        </h2>
        <p>
          Most modern web browsers allow you to manage and block cookies directly through their settings.
          Here is how you can access cookie controls across major browsers:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[14.5px]">
          <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Third-party cookies.</li>
          <li><strong>Apple Safari (iOS / macOS):</strong> Settings &rarr; Safari &rarr; Advanced &rarr; Block All Cookies.</li>
          <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Enhanced Tracking Protection.</li>
          <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.</li>
        </ul>
        <p className="mt-3 text-[14px] text-gray-500">
          <em>Note:</em> Completely disabling all cookies in your browser settings may affect the visual layout and responsiveness of our booking tools.
        </p>
      </section>

      {/* 7. Changes */}
      <section id="changes-policy" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          7. Updates to this Cookie Policy
        </h2>
        <p>
          We may update this Cookie Policy from time to time to accommodate new website features or regulatory guidance from the
          Nigeria Data Protection Commission (NDPC). The latest revision date will always be visible at the top of this document.
        </p>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          8. Inquiries &amp; Contact
        </h2>
        <p>
          If you have questions regarding our use of cookies or web tracking, please reach out:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-4 space-y-1 text-[14.5px]">
          <p className="font-semibold text-[#0f1a2b] m-0">OG Smarhome &amp; Technology</p>
          <p className="text-gray-600 m-0">Email: <a href="mailto:privacy@ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">privacy@ogsmarthomes.com</a></p>
          <p className="text-gray-600 m-0">Website: <a href="https://ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">https://ogsmarthomes.com</a></p>
        </div>
      </section>
    </LegalLayout>
  );
};
