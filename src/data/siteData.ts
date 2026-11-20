export const HERO_IMAGES = {
  tallWithout: '/src/assets/images/hero_tall_without_1795076515819.jpg',
  tallWith: '/src/assets/images/hero_tall_with_1795076697827.jpg',
  wideWithout: '/src/assets/images/hero_wide_without_1795076536302.jpg',
  wideWith: '/src/assets/images/hero_wide_with_1795076675422.jpg',
  withoutAlt:
    'Front entrance of a modern Nigerian home with ordinary hardware: a traditional brass key lock, bare wall bulb, plain plastic push-button doorbell, white rocker light switch, and bare eave with no camera.',
};

export interface HeroDevice {
  id: string;
  index: number;
  name: string;
  shortLabel: string;
  withoutText: string;
  withText: string;
  notificationText: string;
  /** Real hardware center in the tall 9:16 image (percent across / down) */
  tallPos: { x: number; y: number };
  /** Real hardware center in the wide 16:9 image (percent across / down) */
  widePos: { x: number; y: number };
  /** Preferred side for desktop floating card relative to marker */
  desktopCardSide: 'left' | 'right';
}

export const HERO_DEVICES: HeroDevice[] = [
  {
    id: 'lock',
    index: 1,
    name: 'Smart door lock',
    shortLabel: 'Smart lock',
    withoutText: 'Brass key lock · Keys get lost or copied.',
    withText: 'Fingerprint, PIN or phone · Know who came in.',
    notificationText: 'Front door unlocked by Ada · 8:42 pm',
    tallPos: { x: 51.3, y: 54.7 },
    widePos: { x: 53.7, y: 56.5 },
    desktopCardSide: 'left',
  },
  {
    id: 'cctv',
    index: 2,
    name: 'CCTV camera',
    shortLabel: 'CCTV',
    withoutText: 'No camera · A blind spot at your entrance.',
    withText: 'Records 24/7 · Watch live from your phone.',
    notificationText: 'Motion at the gate · Tap to watch live',
    tallPos: { x: 78.8, y: 20.0 },
    widePos: { x: 70.8, y: 11.2 },
    desktopCardSide: 'right',
  },
  {
    id: 'switch',
    index: 3,
    name: 'Smart switch',
    shortLabel: 'Smart switch',
    withoutText: 'Plain switch · Lights only work by hand.',
    withText: 'Touch panel · Lights, fans and scenes from your phone.',
    notificationText: 'Evening scene on · Porch and garden lights',
    tallPos: { x: 68.5, y: 50.2 },
    widePos: { x: 60.2, y: 55.2 },
    desktopCardSide: 'right',
  },
  {
    id: 'doorbell',
    index: 4,
    name: 'Video doorbell',
    shortLabel: 'Video doorbell',
    withoutText: 'Basic bell · You have to go and look.',
    withText: 'See and talk to visitors from anywhere.',
    notificationText: 'Someone is at the door · Tap to answer',
    tallPos: { x: 61.5, y: 49.6 },
    widePos: { x: 60.2, y: 45.8 },
    desktopCardSide: 'right',
  },
  {
    id: 'light',
    index: 5,
    name: 'Motion light',
    shortLabel: 'Motion light',
    withoutText: 'Ordinary bulb · Always on or always off.',
    withText: 'Lights up when it senses movement.',
    notificationText: 'Motion light triggered · Driveway',
    tallPos: { x: 49.6, y: 27.0 },
    widePos: { x: 50.2, y: 21.8 },
    desktopCardSide: 'left',
  },
];

export const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'products', label: 'Products' },
  { id: 'packages', label: 'Packages' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'projects', label: 'Projects' },
  { id: 'faq', label: 'FAQ' },
];

export const TRUST_ITEMS = [
  { id: 'survey', label: 'Free site survey' },
  { id: 'install', label: 'Professional installation' },
  { id: 'support', label: 'After-install support' },
  { id: 'warranty', label: 'Quality products with warranty [confirm terms]' },
];

export const TRUST_STATS = [
  {
    id: 'homes',
    placeholder: '[###]+',
    targetValue: null as number | null, // Replace null with confirmed number when ready
    suffix: '+',
    label: 'homes upgraded',
  },
  {
    id: 'devices',
    placeholder: '[###]+',
    targetValue: null as number | null,
    suffix: '+',
    label: 'devices installed',
  },
  {
    id: 'years',
    placeholder: '[#]',
    targetValue: null as number | null,
    suffix: '',
    label: 'years of experience',
  },
];

export interface TrustTestimonial {
  id: string;
  quote: string;
  name: string;
  area: string;
  setup: string;
}

export const TRUST_TESTIMONIALS: TrustTestimonial[] = [
  {
    id: 'trust-t-1',
    quote:
      'I stopped worrying about spare keys the day they fitted our smart lock. I see on my phone the exact minute the kids get back from school.',
    name: 'Tunde Adeyemi',
    area: 'Lekki Phase 1, Lagos',
    setup: 'Smart door lock & doorbell',
  },
  {
    id: 'trust-t-2',
    quote:
      'Their team hid every single CCTV cable inside the roof overhang. Even our architect asked who handled the installation.',
    name: 'Chidinma Okafor',
    area: 'Ikeja GRA, Lagos',
    setup: 'Compound CCTV setup',
  },
  {
    id: 'trust-t-3',
    quote:
      'One tap on the bedside switch turns off the entire downstairs and locks the entrance. It feels effortless every night.',
    name: 'Ibrahim Danjuma',
    area: 'Wuse II, Abuja',
    setup: 'Whole-home smart switches',
  },
  {
    id: 'trust-t-4',
    quote:
      'The free site survey was honest and thorough. They told us what we did not need yet so we could start with the entrance first.',
    name: 'Funke Balogun',
    area: 'Magodo Phase 2, Lagos',
    setup: 'Entrance Starter',
  },
  {
    id: 'trust-t-5',
    quote:
      'When deliveries arrive while I am at the office, I speak to the rider through the video doorbell and open the gate from my phone.',
    name: 'Emeka Nwosu',
    area: 'Victoria Island, Lagos',
    setup: 'Video doorbell & gate intercom',
  },
  {
    id: 'trust-t-6',
    quote:
      'Everything works smoothly on our inverter and solar setup. Zero drops during power switchover and the night vision cameras stay crisp.',
    name: 'Amina Bello',
    area: 'Maitama, Abuja',
    setup: 'CCTV & solar monitoring',
  },
  {
    id: 'trust-t-7',
    quote:
      'The installers did not rush out after mounting the devices. They set up the app for both me and my wife and tested every scene with us.',
    name: 'Segun Ogunleye',
    area: 'Chevron Drive, Lagos',
    setup: 'Comfort Plus',
  },
  {
    id: 'trust-t-8',
    quote:
      'Our exterior wall sconces and garden lights come on automatically at dusk and dim at midnight. The compound looks welcoming every evening.',
    name: 'Ngozi Eze',
    area: 'Ikoyi, Lagos',
    setup: 'Exterior lighting automation',
  },
  {
    id: 'trust-t-9',
    quote:
      'I generate a one-day PIN for our cleaner every Saturday morning and it expires automatically by 4 pm. That alone made the lock worth it.',
    name: 'Damilola Fashola',
    area: 'Surulere, Lagos',
    setup: 'Biometric smart lock',
  },
  {
    id: 'trust-t-10',
    quote:
      'Movie mode closes the living room curtains, dims the cove lights and cools the AC in one tap. Guests always ask how we set it up.',
    name: 'Kolawole Bankole',
    area: 'Banana Island, Lagos',
    setup: 'Living room automation',
  },
  {
    id: 'trust-t-11',
    quote:
      'Zero messy trunking on our freshly painted walls. They finished the entire apartment upgrade in one day and cleaned up completely.',
    name: 'Zainab Abdullahi',
    area: 'Gwarinpa, Abuja',
    setup: 'Apartment smart upgrade',
  },
  {
    id: 'trust-t-12',
    quote:
      'Whenever I travel for work, I check all six cameras live in seconds. The motion alerts at the gate give real peace of mind.',
    name: 'Obinna Uche',
    area: 'GRA Phase 2, Port Harcourt',
    setup: '6-camera CCTV system',
  },
  {
    id: 'trust-t-13',
    quote:
      'We started with just the front door and came back three months later for the living room switches. Expanding the system was seamless.',
    name: 'Bolanle Ajayi',
    area: 'Gbagada, Lagos',
    setup: 'Phased smart home',
  },
  {
    id: 'trust-t-14',
    quote:
      'Our water leak sensor under the kitchen sink caught a loose pipe before it ruined the cabinets. Best small add-on they recommended.',
    name: 'Chukwuma Obi',
    area: 'Asokoro, Abuja',
    setup: 'Kitchen safety sensors',
  },
  {
    id: 'trust-t-15',
    quote:
      'Even my parents picked up the wall touch panels on day one. Everything works both on the wall and on the phone without confusion.',
    name: 'Folake Williams',
    area: 'Yaba, Lagos',
    setup: 'Smart switches & lighting',
  },
  {
    id: 'trust-t-16',
    quote:
      'Clear itemised quote right after the survey, no surprise extras on installation day, and they arrived right on schedule.',
    name: 'Yusuf Lawal',
    area: 'Bodija, Ibadan',
    setup: 'Comfort Plus',
  },
  {
    id: 'trust-t-17',
    quote:
      'Turning the bedroom AC on twenty minutes before driving home through traffic has genuinely changed my evenings.',
    name: 'Nneka Igwe',
    area: 'Ajah, Lagos',
    setup: 'Smart AC & lighting',
  },
  {
    id: 'trust-t-18',
    quote:
      'Had a quick question after changing our Wi-Fi router and their support team walked me through reconnecting in five minutes.',
    name: 'Rotimi Coker',
    area: 'Sangotedo, Lagos',
    setup: 'Entrance & CCTV',
  },
  {
    id: 'trust-t-19',
    quote:
      'The black glass touch panels elevated the look of our living room immediately, and every light zone dims smoothly without flicker.',
    name: 'Adaeze Nnamdi',
    area: 'Independence Layout, Enugu',
    setup: 'Interior lighting scenes',
  },
  {
    id: 'trust-t-20',
    quote:
      'From the gate intercom to the inverter load view on my phone, dealing with one team for supply and installation saved us weeks of stress.',
    name: 'Femi Adesina',
    area: 'Ikate, Lagos',
    setup: 'Whole Home',
  },
];

export const SERVICES = [
  {
    id: 'supply',
    title: 'We supply.',
    description:
      'Smart locks, cameras, switches, sensors and more from brands we trust, with warranty.',
    linkLabel: 'Browse products',
    href: '#products',
  },
  {
    id: 'install',
    title: 'We install.',
    description:
      'Our technicians fit everything neatly, test it, and set it up on your phone before they leave.',
    linkLabel: 'How it works',
    href: '#how-it-works',
  },
  {
    id: 'support',
    title: 'We support.',
    description:
      'Training, quick fixes and upgrades after installation, so your system keeps working.',
    linkLabel: 'Talk to us',
    href: '#survey',
  },
];

export interface RoomTab {
  id: string;
  label: string;
  placeholderLabel: string;
  devices: { name: string; benefit: string }[];
}

export const ROOMS: RoomTab[] = [
  {
    id: 'entrance',
    label: 'Entrance',
    placeholderLabel: '[Entrance smart home photo]',
    devices: [
      { name: 'Smart door lock', benefit: 'no more lost keys' },
      { name: 'Video doorbell', benefit: 'see who is there' },
      { name: 'Motion light', benefit: 'welcomes you home' },
    ],
  },
  {
    id: 'living-room',
    label: 'Living room',
    placeholderLabel: '[Living room smart home photo]',
    devices: [
      { name: 'Smart switches and scenes', benefit: 'movie mode in one tap' },
      { name: 'Smart curtains', benefit: 'open and close by schedule' },
      { name: 'Air conditioner control', benefit: 'cool the room before you arrive' },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    placeholderLabel: '[Bedroom smart home photo]',
    devices: [
      { name: 'Bedside touch panel', benefit: 'lights off for the whole house' },
      { name: 'Sleep scene', benefit: 'locks, lights and AC set in one tap' },
      { name: 'Motion night light', benefit: 'a soft path to the bathroom' },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen and utility',
    placeholderLabel: '[Kitchen and utility smart photo]',
    devices: [
      { name: 'Smart plugs', benefit: 'switch appliances off from anywhere' },
      { name: 'Water and gas leak sensors', benefit: 'an alert before damage' },
      { name: 'Inverter and solar monitoring', benefit: 'see your power use' },
    ],
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    placeholderLabel: '[Outdoors compound security photo]',
    devices: [
      { name: 'CCTV cameras', benefit: 'watch the whole compound' },
      { name: 'Gate intercom and opener', benefit: 'let people in from your phone' },
      { name: 'Garden and path lighting', benefit: 'set times that suit you' },
    ],
  },
];

export interface ProductCategory {
  id: string;
  name: string;
  benefit: string;
  priceText: string;
  surveyChip: string;
  placeholderLabel: string;
}

export const PRODUCTS: ProductCategory[] = [
  {
    id: 'locks',
    name: 'Smart door locks',
    benefit: 'Unlock with fingerprint, PIN or your phone.',
    priceText: 'From [₦ price]',
    surveyChip: 'Smart door locks',
    placeholderLabel: '[Smart door locks photo]',
  },
  {
    id: 'cctv',
    name: 'CCTV and cameras',
    benefit: 'Clear day and night footage live on your phone.',
    priceText: 'From [₦ price]',
    surveyChip: 'CCTV',
    placeholderLabel: '[CCTV and cameras photo]',
  },
  {
    id: 'switches',
    name: 'Smart switches and lighting',
    benefit: 'Glass touch panels, schedules and one-tap scenes.',
    priceText: 'From [₦ price]',
    surveyChip: 'Smart switches and lighting',
    placeholderLabel: '[Smart switches and lighting photo]',
  },
  {
    id: 'doorbells',
    name: 'Video doorbells',
    benefit: 'See and speak with visitors from anywhere.',
    priceText: 'From [₦ price]',
    surveyChip: 'Video doorbell',
    placeholderLabel: '[Video doorbells photo]',
  },
  {
    id: 'sensors',
    name: 'Sensors and alarms',
    benefit: 'Instant phone alerts for motion, doors, water or gas.',
    priceText: 'From [₦ price]',
    surveyChip: 'Whole home',
    placeholderLabel: '[Sensors and alarms photo]',
  },
  {
    id: 'gate',
    name: 'Gate and intercom',
    benefit: 'Answer the gate and let visitors in from your phone.',
    priceText: 'From [₦ price]',
    surveyChip: 'Gate and intercom',
    placeholderLabel: '[Gate and intercom photo]',
  },
  {
    id: 'curtains',
    name: 'Smart curtains and blinds',
    benefit: 'Open and close by voice, phone or daily schedule.',
    priceText: 'From [₦ price]',
    surveyChip: 'Whole home',
    placeholderLabel: '[Smart curtains and blinds photo]',
  },
  {
    id: 'solar',
    name: 'Solar and inverter integration',
    benefit: 'Track power use and manage loads from your phone.',
    priceText: 'From [₦ price]',
    surveyChip: 'Solar and inverter',
    placeholderLabel: '[Solar and inverter photo]',
  },
];

export interface PackageFeature {
  text: string;
  inherited?: boolean;
}

export interface PackagePlan {
  id: string;
  name: string;
  tag: string;
  pricePrefix: string;
  priceValue: string;
  audience: string;
  popular: boolean;
  features: PackageFeature[];
  surveyChips: string[];
}

export const PRICING_BADGE = {
  /** Confirm a homes-upgraded count or set confirmedCount to null to show the fallback text */
  textWithCount: '[###]+ homes upgraded',
  fallbackText: 'Free site survey · No obligation',
  useCountPlaceholder: true,
};

export const PACKAGES: PackagePlan[] = [
  {
    id: 'starter',
    name: 'Entrance Starter',
    tag: 'Install in [1 day]',
    pricePrefix: 'From',
    priceValue: '[₦ price]',
    audience: 'Apartments and first-time smart homes',
    popular: false,
    features: [
      { text: 'Smart door lock' },
      { text: 'Video doorbell' },
      { text: 'Motion light' },
      { text: 'Setup on your phone' },
      { text: 'A short training session [confirm]' },
    ],
    surveyChips: ['Smart door locks', 'Video doorbell'],
  },
  {
    id: 'comfort',
    name: 'Comfort Plus',
    tag: 'Most popular',
    pricePrefix: 'From',
    priceValue: '[₦ price]',
    audience: 'Families who want comfort and security',
    popular: true,
    features: [
      { text: 'Everything in Entrance Starter', inherited: true },
      { text: 'Smart switches for [#] rooms' },
      { text: 'CCTV with [#] cameras' },
      { text: 'Phone training for everyone at home' },
      { text: 'Warranty on supplied products [confirm]' },
    ],
    surveyChips: ['Smart door locks', 'Video doorbell', 'CCTV', 'Smart switches and lighting'],
  },
  {
    id: 'whole-home',
    name: 'Whole Home',
    tag: 'Custom quote',
    pricePrefix: 'From',
    priceValue: '[₦ price]',
    audience: 'Larger homes, estates and full automation',
    popular: false,
    features: [
      { text: 'Everything in Comfort Plus', inherited: true },
      { text: 'Gate and intercom' },
      { text: 'Sensors and smart curtains' },
      { text: 'Solar and inverter monitoring' },
      { text: 'Priority support' },
    ],
    surveyChips: ['Whole home'],
  },
];

export const PRICING_FAQS = [
  {
    id: 'free-survey',
    question: 'Is the site survey really free?',
    answer:
      'Yes. We visit, measure and advise at no cost and with no obligation. [confirm]',
  },
  {
    id: 'custom-quote',
    question: 'Can I get a custom quote for my home?',
    answer:
      'Yes. Every package is a starting point. After your survey we build a quote around your rooms, your budget and the products you choose.',
  },
  {
    id: 'hidden-fees',
    question: 'Are there any hidden fees?',
    answer:
      'No. Your quote lists the products, the installation and any extras before you decide. [confirm]',
  },
  {
    id: 'pay-in-stages',
    question: 'Can I pay in stages or start with one area?',
    answer:
      'You can start with your entrance and add more rooms later. Ask us about payment options at your survey. [confirm]',
  },
];

export const PRICING_INCLUDED_ITEMS = [
  {
    id: 'survey',
    title: 'Free site survey',
    subtitle: 'Free, with no obligation',
  },
  {
    id: 'install',
    title: 'Professional installation',
    subtitle: 'Neat fitting and full testing',
  },
  {
    id: 'training',
    title: 'Setup and training on your phone',
    subtitle: 'Ready to use before we leave',
  },
  {
    id: 'support',
    title: 'Support after installation',
    subtitle: 'Help whenever you need it',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: 'Book a free site survey.',
    description: 'Tell us about your home. We visit, measure and listen.',
  },
  {
    number: 2,
    title: 'Get your plan and quote.',
    description: 'A clear list of products, prices and timing, with no surprises.',
  },
  {
    number: 3,
    title: 'Professional installation.',
    description: 'Our team fits everything neatly and tests every device.',
  },
  {
    number: 4,
    title: 'Handover and support.',
    description: 'We set it up on your phone, show you how it works, and stay available.',
  },
];

export const WHY_US_BENEFITS = [
  { id: 'nigerian', text: 'Designed for Nigerian homes and estates' },
  { id: 'solar', text: 'Works with your inverter and solar setup [confirm]' },
  { id: 'pricing', text: 'Clear prices after a free survey' },
  { id: 'wiring', text: 'Neat, safe wiring and clean finishes' },
  { id: 'training', text: 'Training so everyone at home can use it' },
  { id: 'support', text: 'Support after installation' },
];

export interface ProjectItem {
  id: string;
  title: string;
  area: string;
  devices: string;
  useHeroPair?: boolean;
  beforePlaceholder?: string;
  afterPlaceholder?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'project-1',
    title: '[Project 1 title — Front entrance upgrade]',
    area: '[area]',
    devices: 'Smart door lock · CCTV camera · Smart switch · Video doorbell · Motion light',
    useHeroPair: true,
  },
  {
    id: 'project-2',
    title: '[Project 2 title — Living room & lighting]',
    area: '[area]',
    devices: '[Devices installed placeholder]',
    beforePlaceholder: '[Before photo — Project 2]',
    afterPlaceholder: '[After photo — Project 2]',
  },
  {
    id: 'project-3',
    title: '[Project 3 title — Whole compound security]',
    area: '[area]',
    devices: '[Devices installed placeholder]',
    beforePlaceholder: '[Before photo — Project 3]',
    afterPlaceholder: '[After photo — Project 3]',
  },
];

export type ShowcaseCategory = 'all' | 'locks' | 'cctv' | 'lighting';

export interface ShowcaseItem {
  id: string;
  category: Exclude<ShowcaseCategory, 'all'>;
  categoryLabel: string;
  setting: string;
  title: string;
  summary: string;
  installedSpecs: string[];
  image: string;
  alt: string;
  surveyChips: string[];
}

export const SHOWCASE_CATEGORIES: { id: ShowcaseCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'locks', label: 'Smart locks' },
  { id: 'cctv', label: 'CCTV setups' },
  { id: 'lighting', label: 'Lighting' },
];

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'showcase-biometric-lock',
    category: 'locks',
    categoryLabel: 'Smart locks',
    setting: 'Main entrance',
    title: 'Matte-black biometric entry lock',
    summary:
      'Fingerprint, warm-backlit PIN pad and phone access mortised cleanly into a solid hardwood front door.',
    installedSpecs: [
      'Biometric fingerprint & backlit keypad lock',
      'Auto-relock latch with entry activity log',
      'App setup with temporary guest PIN codes',
    ],
    image: '/src/assets/images/showcase_lock_biometric_1795116965910.jpg',
    alt: 'Matte-black biometric smart door lock with warm amber backlit keypad and fingerprint ring installed on a dark hardwood entrance door.',
    surveyChips: ['Smart door locks'],
  },
  {
    id: 'showcase-apartment-lock',
    category: 'locks',
    categoryLabel: 'Smart locks',
    setting: 'Apartment foyer',
    title: 'Brushed-gunmetal security door keypad',
    summary:
      'Heavy-duty digital handle lock with PIN, card and physical key backup fitted flush on a steel-framed entry door.',
    installedSpecs: [
      'Multi-access touch keypad & handle assembly',
      'Reinforced mortise alignment on security door',
      'Low-battery phone alerts & emergency power port',
    ],
    image: '/src/assets/images/showcase_lock_glass_1795116967796.jpg',
    alt: 'Brushed-gunmetal smart door lock with touch keypad and lever handle installed on a modern apartment security entrance door.',
    surveyChips: ['Smart door locks'],
  },
  {
    id: 'showcase-eave-cctv',
    category: 'cctv',
    categoryLabel: 'CCTV setups',
    setting: 'Perimeter eave',
    title: 'Concealed eave perimeter CCTV',
    summary:
      'Weatherproof IP camera mounted neatly beneath the concrete overhang with zero exposed conduit cables.',
    installedSpecs: [
      'Weatherproof HD night-vision IP bullet camera',
      'Concealed trunking routed into roof slab',
      '24/7 recording with instant phone motion alerts',
    ],
    image: '/src/assets/images/showcase_cctv_compound_1795116979980.jpg',
    alt: 'White weatherproof smart IP CCTV security camera cleanly mounted beneath the concrete roof overhang of a modern villa at dusk.',
    surveyChips: ['CCTV'],
  },
  {
    id: 'showcase-gate-cctv',
    category: 'cctv',
    categoryLabel: 'CCTV setups',
    setting: 'Compound gate',
    title: 'Gate pillar dome camera & intercom',
    summary:
      'Wide-angle matte-black dome camera paired with a backlit video intercom for clear visitor checks from your phone.',
    installedSpecs: [
      'Wide-angle vandal-resistant dome CCTV camera',
      'Flush-mounted video intercom with keypad',
      'Live view and two-way talk from anywhere',
    ],
    image: '/src/assets/images/showcase_cctv_gate_1795117000245.jpg',
    alt: 'Matte-black dome CCTV camera and slim backlit video intercom panel installed on a modern concrete compound gate pillar at twilight.',
    surveyChips: ['CCTV', 'Gate and intercom'],
  },
  {
    id: 'showcase-living-lighting',
    category: 'lighting',
    categoryLabel: 'Lighting',
    setting: 'Living room',
    title: 'Warm cove lighting & glass touch panel',
    summary:
      'Multi-zone dimmed cove strips, ceiling downlights and a black tempered-glass wall switch wired for one-tap scenes.',
    installedSpecs: [
      'Tempered-glass smart touch switch panel',
      'Dimmable warm cove & ceiling light zones',
      'Evening, movie and all-off phone scenes',
    ],
    image: '/src/assets/images/showcase_lighting_living_1795116976048.jpg',
    alt: 'Contemporary living room glowing with warm recessed ceiling cove lighting and a black glass smart touch switch panel on the foreground wall.',
    surveyChips: ['Smart switches and lighting'],
  },
  {
    id: 'showcase-exterior-lighting',
    category: 'lighting',
    categoryLabel: 'Lighting',
    setting: 'Facade & walkway',
    title: 'Synchronized facade & pathway lighting',
    summary:
      'Automated sunset-to-sunrise schedule linking architectural wall sconces, porch downlights and garden bollards.',
    installedSpecs: [
      'Smart relay control for exterior light circuits',
      'Automatic dusk-on and late-night dimming timers',
      'Manual phone override from anywhere',
    ],
    image: '/src/assets/images/showcase_lighting_exterior_1795116964640.jpg',
    alt: 'Modern home exterior at twilight illuminated by warm amber architectural wall sconces, porch downlights, and garden walkway bollard lights.',
    surveyChips: ['Smart switches and lighting'],
  },
];

export const FAQS = [
  {
    question: 'How much does a smart home cost?',
    answer:
      'It depends on your home and the products you choose. We give you a clear quote after a free survey, and you can start with one area and add more later.',
  },
  {
    question: 'How long does installation take?',
    answer:
      'A single entrance can often be done in [a day]. A whole home takes longer. We confirm the timing in your quote. [confirm]',
  },
  {
    question: 'Will it work with my existing wiring?',
    answer:
      'In most homes, yes. Our technician checks this during the free survey and tells you if anything needs to change.',
  },
  {
    question: 'What happens if there is a power cut or the internet goes down?',
    answer:
      'We design systems to cope with this, for example with battery backup and local control where the product supports it. We explain exactly what keeps working at your survey. [confirm]',
  },
  {
    question: 'Do I need a smartphone?',
    answer:
      'Most features are controlled from the phone app, and many products also work with a keypad, a wall panel or a remote.',
  },
  {
    question: 'Is my camera footage private?',
    answer:
      'Yes. Only you and the people you choose can view your cameras, and we show you how to manage access. [confirm]',
  },
  {
    question: 'Do you offer a warranty and support after installation?',
    answer:
      'Yes. Products come with warranty and we offer support after installation. [confirm terms]',
  },
  {
    question: 'Can I start small and add more later?',
    answer: 'Yes. Our systems are designed to grow with you.',
  },
];

export const SURVEY_PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Estate home',
  'Office or shop',
];

export const SURVEY_INTEREST_CHIPS = [
  'Smart door locks',
  'CCTV',
  'Smart switches and lighting',
  'Video doorbell',
  'Gate and intercom',
  'Solar and inverter',
  'Whole home',
];

export const CONTACT_PLACEHOLDERS = {
  phone: '[Phone number]',
  whatsappDisplay: '[WhatsApp number]',
  whatsappDigits: '2340000000000', // Replace with real WhatsApp number without +
  email: '[Email]',
  address: '[Address and service areas]',
  hours: '[Opening hours]',
};
