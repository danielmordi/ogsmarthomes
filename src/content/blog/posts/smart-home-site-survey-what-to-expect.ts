import type { BlogPost } from '../../../lib/blogTypes';

const post: BlogPost = {
  title: 'Smart Home Site Survey: Complete Checklist',
  slug: 'smart-home-site-survey-what-to-expect',
  excerpt:
    'A comprehensive walkthrough of a professional smart home site survey in Nigeria: electrical audits, Wi-Fi heatmapping, conduit inspection, and load planning.',
  category: 'guides-planning',
  tags: [
    'site-survey',
    'installation-planning',
    'electrical-audit',
    'wifi-heatmapping',
    'homeowner-checklist',
  ],
  featuredImage:
    'https://images.unsplash.com/photo-1603901622056-0a5bee231395?ixid=M3wxMTQwMTQzfDB8MXxzZWFyY2h8MXx8YXJjaGl0ZWN0JTIwYmx1ZXByaW50JTIwZmxvb3IlMjBwbGFuJTIwdGFibGV8ZW58MXwwfHx8MTc5NTI2ODc4Mnww&ixlib=rb-4.1.0',
  featuredImageAlt:
    'Architectural blueprints, drafting instruments, and floor plans on work table for smart home automation survey',
  metaTitle: 'Smart Home Site Survey: Complete Checklist (2026)',
  metaDescription:
    'Complete smart home site survey checklist for Nigerian homes. Learn how electrical audits, Wi-Fi heatmaps, and load planning guarantee flawless builds.',
  focusKeyword: 'smart home site survey checklist',
  publishedAt: '2026-03-21',
  updatedAt: '2026-03-25',
  readingTime: '8 min read',
  author: {
    name: 'Tunde Adeyemi',
    role: 'Lead Systems Engineer, OG Smarthomes',
    bio: 'Tunde leads site audits and electrical diagnostic inspections across residential developments in Lagos, Abuja, and Port Harcourt, ensuring code-compliant automation deployments.',
  },
  faq: [
    {
      question: 'How long does a professional smart home site survey take?',
      answer:
        'A comprehensive physical inspection for a standard 4-to-5 bedroom duplex typically takes between 90 minutes and 2.5 hours, depending on whether the building is at construction shell stage or fully occupied.',
    },
    {
      question: 'What documents should I prepare before the survey team arrives?',
      answer:
        'Having your architectural floor plans, electrical single-line diagrams (SLD), and existing solar/inverter specifications available speeds up the audit significantly, though our team can map conduits and measure dimensions manually if drawings are unavailable.',
    },
    {
      question: 'Is a site survey necessary before getting a quotation?',
      answer:
        'While rough budgetary estimates can be generated from floor plans, an on-site physical survey is mandatory before final pricing to inspect wall back-box depths, verify neutral wiring presence, test Wi-Fi signal attenuation through concrete walls, and check solar inverter compatibility.',
    },
  ],
  relatedSlugs: [
    'smart-home-automation-cost-nigeria',
    'professional-smart-home-installation-vs-diy',
    'smart-home-automation-nigeria-guide',
  ],
  content: `
A successful smart home installation does not happen by accident; it starts with an exhaustive physical site audit. In Nigeria's unique building environment, skipping a pre-installation survey leads to incompatible wall switches, flickering bulbs, and dead signal zones behind thick concrete walls. This guide walks you through a professional site survey checklist so you know exactly what engineers inspect before installation begins.

## Why a Physical Site Survey Is Essential in Nigeria

Generic online automation tutorials assume lightweight drywall partitions, standardized 110V neutral wiring, and continuous utility power. Nigerian residential engineering faces very different realities.

First, residential properties switch constantly between public DISCO power, diesel generators, solar hybrid inverters, and battery banks. Engineers must verify how these transitions occur to design reliable load-shedding routines.

Second, solid sandcrete blocks, reinforced concrete pillars, and security doors severely weaken wireless radio signals. Measuring this attenuation on-site prevents dead zones.

Finally, older homes frequently have shallow 25mm wall boxes or omit neutral wires at light switches. A physical survey uncovers these hidden realities upfront, eliminating costly mid-project redesigns.

> "A thorough site survey eliminates expensive surprises by catching electrical quirks and signal barriers before hardware is mounted."

## The 5 Pillars of a Professional Site Survey

During a comprehensive on-site technical inspection, engineering specialists evaluate five primary areas:

### 1. Electrical Panel and Distribution Board Audit
Technicians inspect your main distribution board to confirm whether you have single-phase or three-phase supply. They examine automatic transfer switch (ATS) timings, check sample wall switches for neutral wire presence, and measure back-box depths to ensure smart glass touch panels fit comfortably.

### 2. Wi-Fi and Radio Frequency Heatmapping
Engineers use RF spectrum analyzers to measure how wireless signals propagate through concrete slabs and partition walls. They pinpoint high-interference zones near microwave ovens or heavy transformers, designating optimal positions for ceiling access points and Zigbee coordinators.

### 3. Window Dimensions and Shading Clearance
For motorized curtains and smart blinds, technicians measure ceiling pelmet depth to ensure dual tracks fit side by side. They verify electrical power spur locations and note west-facing windows that experience intense afternoon sun to program automatic thermal shading.

### 4. Door Mortises and Perimeter Sightlines
Technicians measure door thickness, backset depth, and lock cutouts on armored entrance doors to ensure biometric smart locks mount cleanly without extra drilling. They also walk your compound fence to identify camera mounting angles and eliminate surveillance blind spots.

### 5. Family Lifestyle and Control Preferences
Every home operates differently. Engineers consult with you on how family members prefer to interact with the system—whether through physical glass touch switches, mobile widgets, voice commands, or automated sensor triggers.

> "Technology must adapt to the way your household actually lives—not the other way around."

## Homeowner Preparation Checklist

To get the most value out of your scheduled site survey, prepare the following items:

| Preparation Step | Why It Matters | Status |
|---|---|---|
| **Gather Floor Plans** | Helps engineers trace conduit paths and cable lengths | Optional but helpful |
| **Ensure Full Property Access** | Technicians must inspect breaker panels, roof spaces, and gatehouses | Required |
| **Note Known Electrical Glitches** | Highlights rooms with weak Wi-Fi, flickering lights, or power tripping | Highly valuable |
| **List Family Priorities** | Distinguishes essential must-have features from future add-ons | Required |
| **Provide Solar / Inverter Specs** | Inverter kVA rating, battery chemistry, and solar capacity | Required for energy automation |

## What Happens After the Site Survey?

Within 48 hours of completing the physical audit, your engineering team delivers a comprehensive **Smart Home Engineering Proposal**, which includes:
1. **System Architecture Diagram:** Visual wiring schematics and network topology tailored to your layout.
2. **Itemized Bill of Quantities:** Transparent, line-by-line pricing for hardware, hubs, sensors, and labor.
3. **Phased Implementation Schedule:** Clear project milestones from pre-cabling to final family onboarding.
4. **Energy Savings Projections:** Estimated monthly generator fuel and utility bill reductions achieved through smart load shedding.

## Plan Your Smart Home with Confidence

A well-engineered smart home delivers lasting convenience, physical security, and lower energy costs. Investing in a professional site survey upfront ensures every subsystem works reliably from the moment you move in.

Ready to see what is possible in your residence? Contact [OG Smarthomes](/#survey) today to book your complimentary site survey in Lagos, Abuja, or Port Harcourt and receive a customized, itemized automation plan.
`,
};

export default post;
