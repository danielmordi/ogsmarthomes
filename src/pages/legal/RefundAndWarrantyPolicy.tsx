import React from 'react';
import { LegalLayout, SectionItem } from '../../components/legal/LegalLayout';
import { RotateCcw, ShieldCheck, AlertOctagon, Wrench, Clock, FileCheck } from 'lucide-react';

const SECTIONS: SectionItem[] = [
  { id: 'overview', title: '1. Overview & Policy Scope' },
  { id: 'cancellation-windows', title: '2. Cancellation Windows & Deposit Refunds' },
  { id: 'non-refundable', title: '3. Non-Refundable Items & Services' },
  { id: 'workmanship-warranty', title: '4. 90-Day Workmanship Guarantee' },
  { id: 'hardware-warranty', title: '5. Manufacturer Hardware Warranty (12 Months)' },
  { id: 'voiding-conditions', title: '6. What Voids Your Warranty (Power & Tampering)' },
  { id: 'defective-products', title: '7. Defective Equipment & Replacement Protocol' },
  { id: 'claim-process', title: '8. How to Submit a Claim' },
  { id: 'refund-method', title: '9. Refund Method & Processing Timelines' },
  { id: 'contact', title: '10. Support & Warranty Inquiries' },
];

export const RefundAndWarrantyPolicy: React.FC = () => {
  return (
    <LegalLayout
      title="Refund &amp; Warranty Policy"
      lastUpdated="November 22, 2026"
      description="Clear policies regarding product returns, deposit cancellations, our 90-day installation workmanship guarantee, manufacturer hardware warranties, and surge protection requirements."
      canonicalUrl="/refund-and-warranty-policy"
      badge="Warranty &amp; Refunds"
      sections={SECTIONS}
    >
      {/* 1. Overview */}
      <section id="overview" className="scroll-mt-32">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          1. Overview &amp; Policy Scope
        </h2>
        <p>
          At <strong>OG Smarthomes</strong> (OG Smarhome &amp; Technology), we take pride in delivering robust, high-performance
          smart automation and physical security systems tailored to the electrical realities and architectural demands of Nigerian homes and offices.
        </p>
        <p>
          This Refund &amp; Warranty Policy outlines your rights regarding contract cancellations, equipment returns, defective hardware replacements,
          and our dual-tier warranty structure covering both <strong>technical installation craftsmanship</strong> and <strong>manufacturer hardware</strong>.
        </p>
        <div className="bg-[#0a1220]/5 border-l-4 border-[#ffc46b] p-4 rounded-r-xl my-4 text-[14.5px]">
          <p className="m-0 font-medium text-[#0f1a2b]">
            <strong>Customer Commitment:</strong> Every smart lock, CCTV system, and smart switch installed by our team is bench-tested
            prior to deployment and verified in your presence on the day of commissioning.
          </p>
        </div>
      </section>

      {/* 2. Cancellation Windows */}
      <section id="cancellation-windows" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          2. Cancellation Windows &amp; Deposit Refunds
        </h2>
        <p>
          We recognize that project schedules and construction timelines can shift. The following cancellation rules apply:
        </p>
        <div className="space-y-4 my-4 text-[14.5px]">
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="font-bold text-[#0f1a2b] m-0 mb-1">Before Hardware Procurement &amp; Dispatch</h3>
            <p className="text-gray-600 m-0 leading-relaxed">
              If you cancel your contract within <strong>forty-eight (48) hours</strong> of paying your initial deposit and prior to the dispatch
              or custom procurement of hardware, you will receive a full <strong>100% refund</strong> of your deposit, minus bank transfer charges.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="font-bold text-[#0f1a2b] m-0 mb-1">After Hardware Allocation but Before On-Site Work</h3>
            <p className="text-gray-600 m-0 leading-relaxed">
              If you cancel after hardware has been allocated from our warehouse or dispatched with technicians, your deposit will be refunded
              less a <strong>15% administrative and restocking fee</strong>. Specially ordered or custom-machined items cannot be refunded.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
            <h3 className="font-bold text-[#0f1a2b] m-0 mb-1">After Physical On-Site Installation Commences</h3>
            <p className="text-gray-600 m-0 leading-relaxed">
              Once technicians commence physical cutting, drilling, cabling, or device mounting on your premises, the installation labor fee
              is non-refundable. Unopened, undamaged hardware may be returned subject to our inspection and a 20% restocking fee.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Non-Refundable */}
      <section id="non-refundable" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          3. Non-Refundable Items &amp; Services
        </h2>
        <p>The following items and costs are strictly non-refundable once contracted and delivered:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Completed Physical Labor:</strong> Technician labor fees for completed or partially completed on-site work.</li>
          <li><strong>Cut Materials:</strong> Electrical cables, conduit pipes, trunking, and mounting brackets cut specifically to fit your premises.</li>
          <li><strong>Special Import Orders:</strong> Hardware specifically imported or custom-machined (e.g., custom-colored lock faceplates or non-standard mortises) at your request.</li>
          <li><strong>Activated Software / Cloud Subscriptions:</strong> Third-party cloud video storage licenses once generated and activated.</li>
          <li><strong>Diagnostic &amp; Call-Out Fees:</strong> Fees for emergency diagnostic inspections where faults are determined to stem from client electrical infrastructure (e.g. generator surges or dead ISP connection).</li>
        </ul>
      </section>

      {/* 4. Workmanship Warranty */}
      <section id="workmanship-warranty" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          4. 90-Day OG Smarthomes Workmanship Guarantee
        </h2>
        <p>
          OG Smarthomes provides a comprehensive <strong>90-Day Installation Workmanship Guarantee</strong> on all installation projects
          completed by our certified technicians:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-[14px]">
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 text-[#0f1a2b] font-bold mb-1.5">
              <Wrench size={16} className="text-[#ffc46b]" />
              <h4>What Is Covered</h4>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Loose or detached wiring terminations.</li>
              <li>Improper door lock mortise alignment or latch friction.</li>
              <li>Switch gang mounting and faceplate stability.</li>
              <li>Camera bracket positioning and weatherproof seal integrity.</li>
              <li>Re-visitation without labor call-out charges.</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 text-[#0f1a2b] font-bold mb-1.5">
              <Clock size={16} className="text-[#ffc46b]" />
              <h4>Timeline &amp; Support</h4>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Starts on the date of final commissioning.</li>
              <li>Priority technical dispatch within 48–72 hours of notification.</li>
              <li>Free replacement of any wiring components damaged by faulty installation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Hardware Warranty */}
      <section id="hardware-warranty" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          5. Manufacturer Hardware Warranty (Typically 12 Months)
        </h2>
        <p>
          All smart hardware supplied by OG Smarthomes (including smart biometric door locks, IP cameras, NVRs, touch switches,
          and automation hubs) carries the full <strong>Original Equipment Manufacturer (OEM) warranty</strong>, typically
          valid for <strong>twelve (12) months</strong> from purchase date.
        </p>
        <p>
          Under this warranty, hardware exhibiting internal electronic manufacturing defects, PCB failures, or biometric sensor errors
          under normal operating conditions will be repaired or replaced free of charge during the warranty term.
        </p>
      </section>

      {/* 6. Voiding Conditions */}
      <section id="voiding-conditions" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <div className="bg-[#0a1220] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-md">
          <div className="flex items-center gap-3 text-[#ff8a78] mb-3">
            <AlertOctagon size={26} />
            <h2 className="text-[20px] sm:text-[22px] font-bold m-0 text-white">
              6. What Voids Your Warranty (Exclusions &amp; Surge Notice)
            </h2>
          </div>
          <p className="text-[#b9c4d6] text-[15px] leading-relaxed mb-4">
            Due to the specific operating environment and electrical grid conditions in Nigeria, the warranty is rendered null and void
            under any of the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2.5 text-[14px] text-white/90">
            <li>
              <strong>Electrical Power Surges &amp; Lightning:</strong> High voltage spikes from power line fluctuations, sudden generator
              phase imbalances, or direct lightning strikes where the customer failed to install recommended surge protection devices (SPDs) or AVRs.
            </li>
            <li>
              <strong>Water Ingress &amp; Moisture:</strong> Water damage to indoor-rated equipment (such as indoor switches, living room hubs,
              or non-weatherproof lock backplates) caused by open windows, roof leaks, or high-pressure cleaning.
            </li>
            <li>
              <strong>Unauthorized Tampering &amp; Third-Party Repairs:</strong> Any attempt by the client or uncertified third-party electricians
              to open, disassemble, rewire, re-solder, or modify installed hardware without written authorization from OG Smarthomes.
            </li>
            <li>
              <strong>Physical Abuse &amp; Forced Entry:</strong> Cracked tempered glass panels, dented lock handles, broken camera domes,
              or impact damage caused by blunt force, vandalism, or domestic accidents.
            </li>
            <li>
              <strong>Battery Neglect &amp; Acid Leakage:</strong> Failure to replace exhausted smart lock batteries promptly, resulting in
              alkaline acid leakage corroding the internal battery bay and circuitry.
            </li>
            <li>
              <strong>Software Tampering:</strong> Flashing unauthorized, modified, or third-party firmware onto proprietary hubs or cameras.
            </li>
          </ul>
        </div>
      </section>

      {/* 7. Defective Equipment Protocol */}
      <section id="defective-products" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          7. Defective Equipment &amp; Replacement Protocol
        </h2>
        <p>If you suspect an installed device is malfunctioning:</p>
        <ol className="list-decimal pl-6 space-y-2 text-[14.5px]">
          <li><strong>Remote Diagnostics:</strong> Our technical support team will first assist via phone/WhatsApp to check app logs, network connectivity, and power levels.</li>
          <li><strong>Physical Inspection &amp; RMA:</strong> If unresolved, a technician will inspect the unit on-site. If diagnosed as a factory defect, a Return Merchandise Authorization (RMA) ticket will be generated.</li>
          <li><strong>Bench Testing &amp; Swap:</strong> The device will be tested at our service center. Verified defective units will be repaired or replaced with an identical or superior model within 5–7 business days, subject to local stock availability.</li>
        </ol>
      </section>

      {/* 8. How to Submit a Claim */}
      <section id="claim-process" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          8. How to Submit a Claim
        </h2>
        <p>To initiate a warranty or refund claim, please provide:</p>
        <ul className="list-disc pl-6 space-y-2 text-[14.5px]">
          <li>Your Full Name and Property Installation Address.</li>
          <li>Your Invoice or Quotation Reference Number (e.g., OG-XXXX).</li>
          <li>A concise description of the observed defect, accompanied by photos or short video showing the issue.</li>
        </ul>
        <p className="mt-3">
          Submit your claim by emailing <a href="mailto:privacy@ogsmarthomes.com" className="text-[#0a1220] font-semibold underline">privacy@ogsmarthomes.com</a> or
          messaging our official WhatsApp support channel. Our team will acknowledge receipt within twenty-four (24) business hours.
        </p>
      </section>

      {/* 9. Refund Method */}
      <section id="refund-method" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          9. Refund Method &amp; Processing Timelines
        </h2>
        <p>
          Approved refunds will be processed via direct Nigerian electronic bank transfer (NIP) to the original bank account from which payment was received.
          For transactions processed through online card gateways, refunds will be reversed through the gateway processor.
        </p>
        <p>
          Refund disbursements are typically credited within <strong>five (5) to ten (10) business days</strong> following final approval and return of hardware.
        </p>
      </section>

      {/* 10. Contact */}
      <section id="contact" className="scroll-mt-32 pt-6 border-t border-gray-200">
        <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0f1a2b] mb-4">
          10. Support &amp; Warranty Inquiries
        </h2>
        <p>
          For any questions concerning this Refund &amp; Warranty Policy:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-4 space-y-1 text-[14.5px]">
          <p className="font-semibold text-[#0f1a2b] m-0">OG Smarhome &amp; Technology</p>
          <p className="text-gray-600 m-0">After-Sales &amp; Warranty Department</p>
          <p className="text-gray-600 m-0">Email: <a href="mailto:privacy@ogsmarthomes.com" className="text-[#0a1220] font-medium hover:underline">privacy@ogsmarthomes.com</a></p>
          <p className="text-gray-600 m-0">WhatsApp Support: Accessible via website button</p>
          <p className="text-gray-600 m-0">Coverage Area: Lagos, Abuja, Port Harcourt, and nationwide across Nigeria</p>
        </div>
      </section>
    </LegalLayout>
  );
};
