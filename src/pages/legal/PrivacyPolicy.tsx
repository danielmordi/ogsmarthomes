import React from 'react';
import { LegalLayout, SectionItem } from '../../components/legal/LegalLayout';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SECTIONS: SectionItem[] = [
  { id: 'introduction', title: '1. Introduction & Scope' },
  { id: 'data-collected', title: '2. Personal Data We Collect' },
  { id: 'confidentiality', title: '3. Property & Security Data Confidentiality' },
  { id: 'legal-basis', title: '4. Legal Bases for Processing' },
  { id: 'how-we-use-data', title: '5. How We Use Your Information' },
  { id: 'third-party-sharing', title: '6. Third-Party Disclosures & Processors' },
  { id: 'retention', title: '7. Data Retention & Archival' },
  { id: 'security', title: '8. Technical & Organisational Security' },
  { id: 'user-rights', title: '9. Your Data Protection Rights' },
  { id: 'international-transfers', title: '10. Cross-Border Data Transfers' },
  { id: 'children-privacy', title: '11. Children’s Privacy' },
  { id: 'policy-updates', title: '12. Updates to this Policy' },
  { id: 'contact-us', title: '13. Contact & Regulatory Authority' },
];

export const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="November 22, 2026"
      description="How OG Smarthomes collects, safeguards, and processes personal information, site survey records, and property security details in accordance with the Nigeria Data Protection Act (NDPA) 2023."
      canonicalUrl="/privacy-policy"
      badge="Data Privacy Compliance"
      sections={SECTIONS}
    >
      {/* 1. Introduction */}
      <section id="introduction" className="scroll-mt-32">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          1. Introduction &amp; Scope
        </h2>
        <p>
          This Privacy Policy explains how <strong>OG Smarhome &amp; Technology</strong> (trading as{' '}
          <strong>&ldquo;OG Smarthomes&rdquo;</strong>, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects,
          uses, discloses, and protects the personal data of customers, property owners, facility managers,
          and visitors to our website (<strong>https://ogsmarthomes.com</strong>) and offline installation operations.
        </p>
        <p>
          We are committed to operating in full compliance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>,
          the General Data Protection Regulation (GDPR) standards where applicable, and relevant consumer
          protection frameworks of the Federal Republic of Nigeria.
        </p>
        <div className="bg-[#0a1220]/5 border-l-4 border-[#ffc46b] p-4 rounded-r-xl my-4 text-[14.5px]">
          <p className="m-0 font-medium text-[#0f1a2b]">
            <strong>Entity Overview:</strong> OG Smarhome &amp; Technology operates smart home design, equipment sales,
            and professional technical installations across Lagos, Abuja, Port Harcourt, and other states across Nigeria.
            Your privacy and security are foundational to our operations.
          </p>
        </div>
      </section>

      {/* 2. Personal Data We Collect */}
      <section id="data-collected" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          2. Personal Data We Collect
        </h2>
        <p>
          Depending on how you interact with our platform, schedule surveys, or procure hardware, we may collect
          the following categories of data:
        </p>
        <ul className="list-disc pl-6 space-y-2.5">
          <li>
            <strong>Contact &amp; Identification Data:</strong> Full name, email address, telephone number, WhatsApp contact
            handle, and company or estate affiliation (if booking for commercial or communal properties).
          </li>
          <li>
            <strong>Property &amp; Installation Location Data:</strong> Residential or commercial address, city, estate or area
            name, property typology (e.g. duplex, apartment, detached villa, corporate office, retail shop), building age, and
            power configuration details (e.g., generator, national grid, inverter/solar capacity).
          </li>
          <li>
            <strong>Site Survey &amp; Technical Consultation Data:</strong> Preferred inspection dates, hardware interests
            (smart door locks, CCTV cameras, automated switches, video doorbells, automated gate motors, multi-room audio),
            room dimensions, structural notes, Wi-Fi coverage assessments, and notes recorded by technicians during physical surveys.
          </li>
          <li>
            <strong>Transaction &amp; Quote Information:</strong> Itemised quotation requests, invoices, purchase orders, records
            of purchased devices, installation completion certificates, and payment references. (Note: We do not store raw payment card
            numbers or CVV codes; all card transactions are processed by certified, PCI-DSS compliant Nigerian payment gateways such as Paystack or Flutterwave).
          </li>
          <li>
            <strong>Technical &amp; Usage Data:</strong> Internet Protocol (IP) address, browser user-agent, operating system,
            referring URL, pages viewed, time spent on pages, and basic cookie markers to maintain site security and usability.
          </li>
        </ul>
      </section>

      {/* 3. Confidentiality */}
      <section id="confidentiality" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <div className="bg-[#0a1220] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-md">
          <div className="flex items-center gap-3 text-[#ffc46b] mb-3">
            <Lock size={24} />
            <h2 className="text-[20px] sm:text-[22px] font-bold m-0 text-white">
              3. Strict Confidentiality of Property &amp; Security Details
            </h2>
          </div>
          <p className="text-[#b9c4d6] text-[15px] leading-relaxed mb-4">
            We understand that smart security installations—such as biometric lock models, CCTV viewing angles, alarm sensor
            placements, gate automation triggers, and Wi-Fi network configurations—constitute sensitive physical security information.
          </p>
          <div className="space-y-3 text-[14.5px] text-white/90">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#ffc46b] shrink-0 mt-0.5" />
              <span><strong>Never Sold or Rented:</strong> We do NOT sell, rent, monetize, or trade customer property addresses or security configuration data to data brokers, marketing agencies, or advertisers under any circumstance.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#ffc46b] shrink-0 mt-0.5" />
              <span><strong>Restricted Technician Access:</strong> Only vetted technicians assigned directly to your scheduled survey or installation have access to your address and property layout notes.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#ffc46b] shrink-0 mt-0.5" />
              <span><strong>Client Ownership:</strong> You retain complete administrative ownership and master credentials over your installed devices and mobile application accounts. Technicians disconnect all temporary setup access upon commissioning.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Legal Basis */}
      <section id="legal-basis" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          4. Legal Bases for Processing (NDPA 2023)
        </h2>
        <p>
          Pursuant to Section 25 of the Nigeria Data Protection Act 2023, we process your personal data under the following lawful bases:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <h3 className="text-[16px] font-bold text-[#0f1a2b] m-0 mb-1.5">Contractual Necessity</h3>
            <p className="text-[14px] text-gray-600 m-0">
              Processing required to conduct requested site surveys, issue quotes, deliver hardware, perform electrical installation, and fulfill warranty obligations.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <h3 className="text-[16px] font-bold text-[#0f1a2b] m-0 mb-1.5">Explicit Consent</h3>
            <p className="text-[14px] text-gray-600 m-0">
              When you voluntarily check our consent box on our booking forms or opt into updates, notifications, or promotional announcements.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <h3 className="text-[16px] font-bold text-[#0f1a2b] m-0 mb-1.5">Legal Obligation</h3>
            <p className="text-[14px] text-gray-600 m-0">
              Compliance with Nigerian fiscal, tax (FIRS/LIRS), commercial accounting, and crime prevention laws.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <h3 className="text-[16px] font-bold text-[#0f1a2b] m-0 mb-1.5">Legitimate Interests</h3>
            <p className="text-[14px] text-gray-600 m-0">
              Preventing fraudulent requests, verifying property ownership before lock installation, ensuring site network safety, and improving service delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How We Use Data */}
      <section id="how-we-use-data" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          5. How We Use Your Information
        </h2>
        <p>We process your data strictly for legitimate operational purposes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To schedule, confirm, and deploy engineers for your <strong>free on-site technical inspection</strong>.</li>
          <li>To engineer tailored load calculations, device placement maps, and itemised cost proposals.</li>
          <li>To fulfill hardware orders, dispatch technicians, and mount smart devices securely on your premises.</li>
          <li>To provide after-sales support, firmware guidance, and troubleshoot Wi-Fi/mesh connectivity.</li>
          <li>To honor manufacturer warranties and our 90-day installation workmanship guarantee.</li>
          <li>To respond promptly to customer questions submitted via website forms, email, or WhatsApp.</li>
          <li>To protect our physical workforce and customers against fraudulent identity use or hazardous installation environments.</li>
        </ul>
      </section>

      {/* 6. Third-Party Sharing */}
      <section id="third-party-sharing" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          6. Third-Party Disclosures &amp; Service Providers
        </h2>
        <p>
          We do not disclose your personal information to third parties except as strictly necessary to deliver our services.
          Only the following categories of service providers are engaged under confidentiality agreements:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Form Handling &amp; Communication Relays:</strong> We utilise <em>Web3Forms</em> to securely transmit
            enquiry messages and survey booking requests via encrypted HTTPS connections.
          </li>
          <li>
            <strong>Direct Customer Messaging:</strong> <em>WhatsApp (Meta Platforms)</em> when you click to initiate a chat or
            request booking confirmations directly on your phone.
          </li>
          <li>
            <strong>Payment Gateways:</strong> Licensed Nigerian payment aggregators (such as <em>Paystack</em> or <em>Flutterwave</em>)
            for online deposit or invoice settlements.
          </li>
          <li>
            <strong>Hosting &amp; Content Delivery:</strong> Secure web hosting, CDN, and DNS providers ensuring high availability
            and SSL/TLS data encryption.
          </li>
          <li>
            <strong>Law Enforcement &amp; Legal Compliance:</strong> Only when compelled by a valid subpoena, court order, or formal
            lawful directive issued by a recognised court or statutory law enforcement agency of the Federal Republic of Nigeria.
          </li>
        </ul>
      </section>

      {/* 7. Retention */}
      <section id="retention" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          7. Data Retention &amp; Archival
        </h2>
        <p>
          We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Unconfirmed Enquiries &amp; Surveys:</strong> If you book a survey but do not proceed with an installation,
            your property details and notes are automatically deleted or anonymised after twelve (12) months.
          </li>
          <li>
            <strong>Completed Installations &amp; Warranties:</strong> Customer records, hardware serial numbers, and invoice
            records are retained for the duration of the active warranty period plus six (6) years to satisfy statutory Nigerian
            commercial tax and accounting requirements.
          </li>
          <li>
            <strong>Web Analytics &amp; Cookies:</strong> Retained for a maximum of twenty-four (24) months, aggregated and
            de-identified.
          </li>
        </ul>
      </section>

      {/* 8. Security */}
      <section id="security" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          8. Technical &amp; Organisational Security Measures
        </h2>
        <p>
          We implement rigorous administrative, physical, and technological safeguards to prevent unauthorised access, alteration,
          disclosure, or destruction of your personal data:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="text-[15px] font-bold text-[#0f1a2b] m-0 mb-1">Encrypted Transmission</h3>
            <p className="text-[13.5px] text-gray-600 m-0">All website traffic is served strictly over Transport Layer Security (TLS/HTTPS 1.3).</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="text-[15px] font-bold text-[#0f1a2b] m-0 mb-1">Role-Based Access</h3>
            <p className="text-[13.5px] text-gray-600 m-0">Property addresses and survey notes are accessible only on a verified need-to-know basis.</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="text-[15px] font-bold text-[#0f1a2b] m-0 mb-1">Technician Confidentiality</h3>
            <p className="text-[13.5px] text-gray-600 m-0">All installation technicians sign legally binding non-disclosure agreements before visiting client premises.</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="text-[15px] font-bold text-[#0f1a2b] m-0 mb-1">No Master Key Retention</h3>
            <p className="text-[13.5px] text-gray-600 m-0">Technicians never retain lock PIN codes, biometrics, or camera logins after handover.</p>
          </div>
        </div>
      </section>

      {/* 9. User Rights */}
      <section id="user-rights" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          9. Your Data Protection Rights (NDPA 2023)
        </h2>
        <p>
          Under the Nigeria Data Protection Act 2023, you are entitled to exercise the following legal rights without discrimination:
        </p>
        <ul className="list-disc pl-6 space-y-2.5">
          <li><strong>Right of Access:</strong> You may request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> You may request correction of inaccurate, incomplete, or outdated personal data.</li>
          <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request the deletion of your personal data where there is no overriding legal justification for continued retention.</li>
          <li><strong>Right to Restrict Processing:</strong> You may request that we suspend processing your data under certain circumstances (e.g. while an accuracy dispute is resolved).</li>
          <li><strong>Right to Data Portability:</strong> You may receive your personal data in a structured, commonly used, machine-readable format.</li>
          <li><strong>Right to Object:</strong> You may object to the processing of your data for direct marketing or legitimate interest grounds.</li>
          <li><strong>Right to Withdraw Consent:</strong> Where processing is predicated on consent, you may revoke your consent at any time without retroactive impact.</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please email our Data Privacy Officer at{' '}
          <a href="mailto:privacy@ogsmarthomes.com" className="text-[#ffc46b] font-semibold hover:underline">
            privacy@ogsmarthomes.com
          </a>. We verify applicant identity and respond within thirty (30) days as prescribed by law.
        </p>
      </section>

      {/* 10. Cross-Border Transfers */}
      <section id="international-transfers" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          10. Cross-Border Data Transfers
        </h2>
        <p>
          Where personal data is transferred or hosted outside the Federal Republic of Nigeria (e.g., through global cloud hosting or encrypted email relay servers),
          we ensure that such cross-border transfers satisfy the provisions of Section 41–43 of the NDPA 2023, ensuring the recipient jurisdiction provides an
          adequate level of data protection or that standard contractual clauses (SCCs) are in effect.
        </p>
      </section>

      {/* 11. Children's Privacy */}
      <section id="children-privacy" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          11. Children’s Privacy
        </h2>
        <p>
          Our website, commercial services, and site survey bookings are intended exclusively for individuals who are at least eighteen (18) years of age
          and possess legal capacity to enter into binding contracts. We do not knowingly collect personal data from minors. If you believe a minor has
          submitted details to us, please notify us immediately for prompt deletion.
        </p>
      </section>

      {/* 12. Updates */}
      <section id="policy-updates" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          12. Updates to this Privacy Policy
        </h2>
        <p>
          We may revise this Privacy Policy periodically to reflect new services, regulatory changes, or technological advancements.
          When changes occur, the &ldquo;Last updated&rdquo; timestamp at the top of this document will be revised. Significant modifications
          will be highlighted with a prominent notice on our website or communicated directly to registered clients.
        </p>
      </section>

      {/* 13. Contact & Regulatory Authority */}
      <section id="contact-us" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          13. Contact &amp; Regulatory Authority
        </h2>
        <p>
          If you have questions, feedback, or data privacy complaints, please contact our dedicated Privacy Lead:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-4 space-y-1 text-[14.5px]">
          <p className="font-semibold text-[#0f1a2b] m-0">OG Smarhome &amp; Technology</p>
          <p className="text-gray-600 m-0">Attention: Data Protection &amp; Privacy Officer</p>
          <p className="text-gray-600 m-0">Email: <a href="mailto:privacy@ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">privacy@ogsmarthomes.com</a></p>
          <p className="text-gray-600 m-0">Website: <a href="https://ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">https://ogsmarthomes.com</a></p>
          <p className="text-gray-600 m-0">Jurisdiction: Federal Republic of Nigeria</p>
        </div>
        <p className="text-[14px] text-gray-500">
          If you remain dissatisfied after contacting us, you have the statutory right under the NDPA 2023 to lodge a formal complaint with the{' '}
          <strong>Nigeria Data Protection Commission (NDPC)</strong> at{' '}
          <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-[#ffc46b] font-medium hover:underline">
            https://ndpc.gov.ng
          </a>.
        </p>
      </section>
    </LegalLayout>
  );
};
