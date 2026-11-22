import React from 'react';
import { LegalLayout, SectionItem } from '../../components/legal/LegalLayout';
import { AlertCircle, CheckCircle, Scale, ShieldAlert } from 'lucide-react';

const SECTIONS: SectionItem[] = [
  { id: 'acceptance', title: '1. Acceptance & Eligibility' },
  { id: 'services-scope', title: '2. Scope of Services & Website Use' },
  { id: 'surveys-quotes', title: '3. Site Surveys, Quotes & Validity' },
  { id: 'orders-payments', title: '4. Orders, Deposits & Payment Terms' },
  { id: 'installation-access', title: '5. Installation & Premises Access' },
  { id: 'customer-responsibilities', title: '6. Customer Responsibilities (Power & Internet)' },
  { id: 'hardware-warranties', title: '7. Hardware & Manufacturer Warranties' },
  { id: 'disclaimer-liability', title: '8. Critical Security Disclaimers' },
  { id: 'limitation-liability', title: '9. Limitation of Liability' },
  { id: 'indemnification', title: '10. Indemnification' },
  { id: 'intellectual-property', title: '11. Intellectual Property' },
  { id: 'cancellation-termination', title: '12. Cancellations & Rescheduling' },
  { id: 'governing-law', title: '13. Governing Law & Dispute Resolution' },
  { id: 'contact', title: '14. Contact Information' },
];

export const TermsAndConditions: React.FC = () => {
  return (
    <LegalLayout
      title="Terms and Conditions"
      lastUpdated="November 22, 2026"
      description="The standard contractual terms governing smart home product purchases, free site surveys, engineering quotations, and technical installations by OG Smarthomes."
      canonicalUrl="/terms-and-conditions"
      badge="Contractual Terms"
      sections={SECTIONS}
    >
      {/* 1. Acceptance */}
      <section id="acceptance" className="scroll-mt-32">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          1. Acceptance of Terms &amp; Eligibility
        </h2>
        <p>
          These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
          (the &ldquo;Customer&rdquo;, &ldquo;Client&rdquo;, or &ldquo;User&rdquo;) and <strong>OG Smarhome &amp; Technology</strong>{' '}
          (trading as <strong>&ldquo;OG Smarthomes&rdquo;</strong>, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
          governing your access to our website (<strong>https://ogsmarthomes.com</strong>), request for site surveys,
          hardware purchases, and technical smart home installation services.
        </p>
        <p>
          By accessing this website, submitting an inquiry, scheduling a site survey, or signing an itemised installation quote,
          you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
          If you do not agree to these Terms, you must refrain from using our website and services.
        </p>
        <p>
          You represent and warrant that you are at least 18 years of age and possess the legal power and authority to enter into
          contracts on your own behalf or on behalf of the entity you represent.
        </p>
      </section>

      {/* 2. Scope */}
      <section id="services-scope" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          2. Scope of Services &amp; Website Use
        </h2>
        <p>
          OG Smarthomes provides professional smart home automation and physical security engineering services, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>System consultation, site assessments, and electrical feasibility surveys.</li>
          <li>Procurement and retail supply of verified smart door locks, IP CCTV cameras, touch switches, automated gate systems, smart thermostats, video intercoms, and energy monitoring hubs.</li>
          <li>Physical on-site cabling, mounting, device programming, calibration, and client mobile application commissioning.</li>
          <li>Post-installation technical support, device maintenance, and firmware guidance.</li>
        </ul>
        <p className="mt-3">
          You agree to use our website and consultation services only for lawful purposes in accordance with applicable laws in the
          Federal Republic of Nigeria. You shall not attempt to reverse engineer, disrupt, or introduce malicious code to our platform.
        </p>
      </section>

      {/* 3. Surveys & Quotes */}
      <section id="surveys-quotes" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          3. Site Surveys, Quotes &amp; Validity
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Free Site Surveys:</strong> Our site survey bookings are offered free of charge and carry no purchase obligation.
            Surveys allow our technical team to assess door lock dimensions, mortise compatibility, wiring conduits, neutral wire availability,
            and Wi-Fi signal distribution across your premises.
          </li>
          <li>
            <strong>Estimates vs. Binding Quotes:</strong> Any price indications provided via website calculators, verbal chats, or WhatsApp
            are preliminary estimates only. A legally binding commitment arises only upon issuance of an official, itemised written quotation or proforma invoice.
          </li>
          <li>
            <strong>Quote Validity:</strong> Due to fluctuating hardware import tariffs, manufacturer price adjustments, and foreign exchange rates,
            written quotations remain valid for <strong>fourteen (14) calendar days</strong> from the date of issuance unless explicitly stated otherwise in writing.
            Quotes unaccepted after 14 days are subject to re-pricing.
          </li>
        </ul>
      </section>

      {/* 4. Orders & Payments */}
      <section id="orders-payments" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          4. Orders, Deposits &amp; Payment Terms
        </h2>
        <p>
          Unless otherwise agreed in a customized enterprise agreement, our standard payment milestones are as follows:
        </p>
        <div className="space-y-3 my-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#0a1220] text-white flex items-center justify-center font-bold text-[14px] shrink-0">1</span>
            <div>
              <p className="font-bold text-[#0f1a2b] m-0">Equipment Deposit (70% - 80%)</p>
              <p className="text-[14px] text-gray-600 m-0">Payable upon contract acceptance to secure hardware inventory, initiate pre-configuration, and schedule installation dates.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#0a1220] text-white flex items-center justify-center font-bold text-[14px] shrink-0">2</span>
            <div>
              <p className="font-bold text-[#0f1a2b] m-0">Handover Balance (20% - 30%)</p>
              <p className="text-[14px] text-gray-600 m-0">Payable immediately upon physical completion of installation, functional testing, client demonstration, and signing of the commissioning handover sheet.</p>
            </div>
          </div>
        </div>
        <p className="text-[14.5px]">
          All payments must be made in Nigerian Naira (NGN) directly into the designated corporate bank account of{' '}
          <strong>OG Smarhome &amp; Technology</strong> or via our approved digital checkout gateways. Technicians are not authorized
          to accept personal cash transfers.
        </p>
      </section>

      {/* 5. Installation & Premises Access */}
      <section id="installation-access" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          5. Installation &amp; Premises Access
        </h2>
        <p>
          To ensure timely and safe installation, the Customer agrees to provide:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lawful Access:</strong> Safe, unobstructed physical access to the property, entrance doors, ceilings, distribution boards, and gate motors during agreed installation hours.</li>
          <li><strong>Authorisations:</strong> Necessary approvals or gate passes from residential estates, landlords, facility managers, or local authorities prior to the arrival of technicians.</li>
          <li><strong>Authorized Representative:</strong> An adult representative over 18 years of age present during the installation to grant approvals, inspect completed work, and accept handover credentials.</li>
        </ul>
      </section>

      {/* 6. Customer Responsibilities */}
      <section id="customer-responsibilities" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          6. Customer Responsibilities (Power &amp; Internet Infrastructure)
        </h2>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 my-4 text-[14.5px]">
          <p className="font-semibold text-[#0f1a2b] m-0 mb-1 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>Infrastructure Prerequisites:</span>
          </p>
          <p className="text-gray-700 m-0">
            Smart home and security systems depend directly on reliable local power and internet infrastructure.
            The Customer is solely responsible for maintaining these prerequisites:
          </p>
        </div>
        <ul className="list-disc pl-6 space-y-2.5">
          <li>
            <strong>Electrical Power Stability:</strong> Standard 220V–240V AC power must be supplied. While our technicians implement
            protective relays where contracted, damage resulting from catastrophic power surges, lightning, erratic phase imbalance, or faulty
            generator switchovers is not covered under warranty. We strongly recommend adequate inverter/battery backup and whole-home surge arrestors.
          </li>
          <li>
            <strong>Internet Connectivity &amp; Wi-Fi Bandwidth:</strong> Remote CCTV streaming, remote lock unlocking, and mobile notifications
            require active internet connectivity with a minimum recommended speed (typically 10 Mbps+ upload for HD CCTV streaming) and 2.4 GHz
            Wi-Fi network coverage at device locations. OG Smarthomes is not liable for device offline status caused by ISP outages, data bundle exhaustion, or weak router range.
          </li>
        </ul>
      </section>

      {/* 7. Hardware & Warranties */}
      <section id="hardware-warranties" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          7. Hardware &amp; Manufacturer Warranties
        </h2>
        <p>
          Products supplied by OG Smarthomes are sourced from reputable original equipment manufacturers (OEMs).
          We pass through all manufacturer warranties to you (typically twelve (12) months on smart locks and security hardware).
        </p>
        <p>
          Additionally, OG Smarthomes provides a <strong>90-Day Workmanship Guarantee</strong> covering wiring, alignment,
          and mounting craftsmanship carried out by our team. For full details on coverage, voiding events, and claim procedures,
          please consult our dedicated <a href="/refund-and-warranty-policy" className="text-[#0a1220] font-semibold underline">Refund &amp; Warranty Policy</a>.
        </p>
      </section>

      {/* 8. Disclaimers */}
      <section id="disclaimer-liability" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <div className="bg-[#0a1220] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-md">
          <div className="flex items-center gap-3 text-[#ffc46b] mb-3">
            <ShieldAlert size={26} />
            <h2 className="text-[20px] sm:text-[22px] font-bold m-0 text-white">
              8. Critical Security Disclaimers &amp; Risk Mitigation
            </h2>
          </div>
          <p className="text-[#b9c4d6] text-[15px] leading-relaxed mb-4">
            Smart home devices, biometric locks, intrusion alarms, and surveillance cameras are designed as deterrents, convenience tools,
            and monitoring aids that reduce risk. However, <strong>no technological system can provide 100% security or eliminate risk entirely</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2.5 text-[14.5px] text-white/90">
            <li>
              <strong>No Guarantee of Prevention:</strong> OG Smarthomes does not represent, warrant, or guarantee that our installed systems
              will avert, prevent, or stop theft, burglary, home invasion, unauthorized entry, fire, water leakage, or property damage.
            </li>
            <li>
              <strong>Not an Insurance Policy:</strong> Our products and installations do NOT constitute an insurance policy against loss.
              Customers must procure and maintain adequate property, casualty, and contents insurance with a licensed Nigerian insurance underwriter.
            </li>
            <li>
              <strong>Third-Party Platform Dependency:</strong> We are not responsible for downtime, server disruptions, or delays in third-party
              cloud applications, mobile operating systems (iOS / Android), or telecom network SMS/push alert deliveries.
            </li>
          </ul>
        </div>
      </section>

      {/* 9. Limitation of Liability */}
      <section id="limitation-liability" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          9. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law in the Federal Republic of Nigeria, in no event shall
          <strong> OG Smarhome &amp; Technology</strong>, its directors, officers, technicians, or affiliates be liable for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[15px]">
          <li>Any indirect, incidental, punitive, consequential, or special damages whatsoever.</li>
          <li>Loss of profits, revenue, data, business interruption, or loss of property value.</li>
          <li>Losses resulting from client failure to maintain passwords, battery power, internet connection, or emergency key access.</li>
        </ul>
        <p className="mt-3">
          Our total aggregate liability for any and all claims arising out of or related to an installation project shall under no circumstances
          exceed the <strong>actual total amount paid by the Customer to OG Smarthomes</strong> under the specific quotation or invoice in dispute.
        </p>
      </section>

      {/* 10. Indemnification */}
      <section id="indemnification" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          10. Indemnification
        </h2>
        <p>
          You agree to defend, indemnify, and hold harmless OG Smarhome &amp; Technology and its employees from and against any claims,
          damages, obligations, losses, liabilities, costs, or debt (including legal fees) arising from:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-[15px]">
          <li>Your breach of any provision of these Terms.</li>
          <li>Unauthorized modification, tampering, or amateur rewiring of installed systems by third parties.</li>
          <li>Failure to obtain necessary landlord, co-owner, or estate authorisations for installation work.</li>
        </ul>
      </section>

      {/* 11. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          11. Intellectual Property
        </h2>
        <p>
          All content on our website—including trademarks, logos, texts, photographs, custom diagrams, software code, and educational guides—is
          the exclusive property of OG Smarhome &amp; Technology or its licensors and is protected by Nigerian copyright and intellectual property laws.
          No content may be reproduced or used without prior written authorization.
        </p>
      </section>

      {/* 12. Cancellations */}
      <section id="cancellation-termination" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          12. Cancellations &amp; Rescheduling
        </h2>
        <p>
          Site surveys may be rescheduled or cancelled at any time without penalty by notifying us at least 24 hours in advance.
          For installation projects where deposits have been paid, cancellation fees may apply to cover restocking, shipping, or non-refundable
          custom-ordered items as outlined in our Refund &amp; Warranty Policy.
        </p>
      </section>

      {/* 13. Governing Law */}
      <section id="governing-law" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          13. Governing Law &amp; Dispute Resolution
        </h2>
        <p>
          These Terms shall be governed by, construed, and enforced in accordance with the laws of the{' '}
          <strong>Federal Republic of Nigeria</strong>.
        </p>
        <p>
          In the event of any controversy, claim, or dispute arising out of or relating to these Terms, the parties shall first attempt to resolve
          the matter amicably through good-faith negotiation within twenty-one (21) days. If unresolved, the dispute shall be submitted to mediation
          at the <em>Lagos State Multi-Door Courthouse (LMDC)</em> or another mutually agreed mediation centre in Nigeria before recourse to litigation.
        </p>
      </section>

      {/* 14. Contact */}
      <section id="contact" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          14. Contact Information
        </h2>
        <p>
          For contract inquiries, notices, or formal communications regarding these Terms:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-4 space-y-1 text-[14.5px]">
          <p className="font-semibold text-[#0f1a2b] m-0">OG Smarhome &amp; Technology</p>
          <p className="text-gray-600 m-0">Email: <a href="mailto:privacy@ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">privacy@ogsmarthomes.com</a></p>
          <p className="text-gray-600 m-0">WhatsApp Support: Available via our official website link</p>
          <p className="text-gray-600 m-0">Website: <a href="https://ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">https://ogsmarthomes.com</a></p>
        </div>
      </section>
    </LegalLayout>
  );
};
