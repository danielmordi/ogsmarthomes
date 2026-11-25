export type RoomId = 'entrance' | 'living-room' | 'bedroom' | 'kitchen' | 'outdoors';

export interface RoomMarkerConfig {
  id: string;
  controlId: string;
  label: string;
  /** Position across / down in percent, calibrated to the real hardware in the generated room photos */
  x: number;
  y: number;
}

export interface InstallDeviceCard {
  id: string;
  roomId: RoomId;
  name: string;
  benefit: string;
  surveyChip: string;
}

export interface RoomDemoConfig {
  id: RoomId;
  label: string;
  shortLabel: string;
  deviceCountLabel: string;
  calmImage: string;
  sceneImage: string;
  calmAlt: string;
  sceneAlt: string;
  sceneButtonLabel: string;
  markers: RoomMarkerConfig[];
  installCards: InstallDeviceCard[];
}

export const ROOM_DEMO_DATA: RoomDemoConfig[] = [
  {
    id: 'entrance',
    label: 'Entrance',
    shortLabel: 'Entrance',
    deviceCountLabel: '3 devices',
    calmImage: '/src/assets/images/room_entrance_calm_1795084535286.jpg',
    sceneImage: '/src/assets/images/room_entrance_scene_1795084589589.jpg',
    calmAlt:
      'Front entrance of a modern Nigerian home at early evening with smart door lock, video doorbell, and motion light off.',
    sceneAlt:
      'Front entrance with warm golden motion light illuminating the steps, backlit smart lock keypad, and active video doorbell.',
    sceneButtonLabel: 'Welcome home',
    markers: [
      { id: 'entrance-lock', controlId: 'entrance-lock', label: 'Smart door lock', x: 58.6, y: 54.0 },
      { id: 'entrance-doorbell', controlId: 'entrance-doorbell', label: 'Video doorbell', x: 71.4, y: 50.0 },
      { id: 'entrance-light', controlId: 'entrance-light', label: 'Motion light', x: 50.0, y: 25.0 },
    ],
    installCards: [
      {
        id: 'dev-entrance-lock',
        roomId: 'entrance',
        name: 'Smart door lock',
        benefit: 'Never worry about lost or copied keys again.',
        surveyChip: 'Smart door locks',
      },
      {
        id: 'dev-entrance-doorbell',
        roomId: 'entrance',
        name: 'Video doorbell',
        benefit: 'See and talk to visitors from anywhere.',
        surveyChip: 'Video doorbell',
      },
      {
        id: 'dev-entrance-light',
        roomId: 'entrance',
        name: 'Motion light',
        benefit: 'Lights up your entrance when you arrive.',
        surveyChip: 'Smart switches and lighting',
      },
    ],
  },
  {
    id: 'living-room',
    label: 'Living room',
    shortLabel: 'Living room',
    deviceCountLabel: '3 devices',
    calmImage: '/src/assets/images/room_living_calm_1795084398311.jpg',
    sceneImage: '/src/assets/images/room_living_scene_1795084586082.jpg',
    calmAlt:
      'Modern Nigerian living room in daylight with open sheer curtains, sofa, TV console, wall touch panel, and split AC unit.',
    sceneAlt:
      'Living room in movie mode with curtains closed, warm dimmed lighting, glowing TV screen, backlit wall panel, and active AC.',
    sceneButtonLabel: 'Movie mode',
    markers: [
      { id: 'living-lights', controlId: 'living-lights', label: 'Wall touch panel', x: 14.5, y: 47.0 },
      { id: 'living-curtains', controlId: 'living-curtains', label: 'Smart curtains', x: 61.0, y: 42.0 },
      { id: 'living-ac', controlId: 'living-ac', label: 'AC unit', x: 70.5, y: 23.0 },
    ],
    installCards: [
      {
        id: 'dev-living-switches',
        roomId: 'living-room',
        name: 'Smart switches and scenes',
        benefit: 'Set movie mode, dinner mode or all off in one tap.',
        surveyChip: 'Smart switches and lighting',
      },
      {
        id: 'dev-living-curtains',
        roomId: 'living-room',
        name: 'Smart curtains',
        benefit: 'Open and close on a schedule or from your phone.',
        surveyChip: 'Whole home',
      },
      {
        id: 'dev-living-ac',
        roomId: 'living-room',
        name: 'AC control',
        benefit: 'Cool the room before you arrive.',
        surveyChip: 'Whole home',
      },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    shortLabel: 'Bedroom',
    deviceCountLabel: '3 devices',
    calmImage: '/src/assets/images/room_bedroom_calm_1795084399941.jpg',
    sceneImage: '/src/assets/images/room_bedroom_scene_1795084589762.jpg',
    calmAlt:
      'Modern Nigerian bedroom with ceiling lights on, neatly made bed, bedside lamp, wall AC unit, and floor motion night light.',
    sceneAlt:
      'Bedroom in goodnight mode with ceiling lights off, warm floor night light glowing softly, faint bedside glow, and AC in sleep mode.',
    sceneButtonLabel: 'Goodnight',
    markers: [
      { id: 'bedroom-lamp', controlId: 'bedroom-lamp', label: 'Bedside lamp', x: 74.5, y: 54.0 },
      { id: 'bedroom-nightlight', controlId: 'bedroom-nightlight', label: 'Night light', x: 75.0, y: 78.0 },
      { id: 'bedroom-ac', controlId: 'bedroom-ac', label: 'AC unit', x: 52.0, y: 22.0 },
    ],
    installCards: [
      {
        id: 'dev-bedroom-panel',
        roomId: 'bedroom',
        name: 'Bedside touch panel',
        benefit: 'Turn off the whole house without leaving bed.',
        surveyChip: 'Smart switches and lighting',
      },
      {
        id: 'dev-bedroom-sleep',
        roomId: 'bedroom',
        name: 'Sleep scene',
        benefit: 'Doors, lights and AC set in one tap.',
        surveyChip: 'Whole home',
      },
      {
        id: 'dev-bedroom-nightlight',
        roomId: 'bedroom',
        name: 'Motion night light',
        benefit: 'A soft path to the bathroom.',
        surveyChip: 'Smart switches and lighting',
      },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen and utility',
    shortLabel: 'Kitchen',
    deviceCountLabel: '3 devices',
    calmImage: '/src/assets/images/room_kitchen_calm_1795084403697.jpg',
    sceneImage: '/src/assets/images/room_kitchen_scene_1795084585591.jpg',
    calmAlt:
      'Modern Nigerian kitchen with white cabinets, sink and water leak sensor on the left, smart plug by the kettle, and wall inverter on the right.',
    sceneAlt:
      'Kitchen dimmed to a warm eco glow with green inverter status screen and illuminated smart plug indicator.',
    sceneButtonLabel: 'Test leak alert',
    markers: [
      { id: 'kitchen-leak', controlId: 'kitchen-scene', label: 'Leak sensor & sink', x: 24.5, y: 62.0 },
      { id: 'kitchen-plug', controlId: 'kitchen-plug', label: 'Smart plug', x: 60.8, y: 45.5 },
      { id: 'kitchen-inverter', controlId: 'kitchen-power', label: 'Inverter panel', x: 76.5, y: 33.5 },
    ],
    installCards: [
      {
        id: 'dev-kitchen-plugs',
        roomId: 'kitchen',
        name: 'Smart plugs',
        benefit: 'Switch appliances off from anywhere.',
        surveyChip: 'Smart switches and lighting',
      },
      {
        id: 'dev-kitchen-sensors',
        roomId: 'kitchen',
        name: 'Leak and gas sensors',
        benefit: 'An alert before damage is done.',
        surveyChip: 'Whole home',
      },
      {
        id: 'dev-kitchen-inverter',
        roomId: 'kitchen',
        name: 'Inverter and solar monitoring',
        benefit: 'See your power use at a glance.',
        surveyChip: 'Solar and inverter',
      },
    ],
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    shortLabel: 'Outdoors',
    deviceCountLabel: '3 devices',
    calmImage: '/src/assets/images/room_outdoors_calm_1795084400797.jpg',
    sceneImage: '/src/assets/images/room_outdoors_scene_1795084599054.jpg',
    calmAlt:
      'Gated Nigerian compound at dusk with closed sliding gate, pillar intercom keypad, two white CCTV cameras, and garden lights off.',
    sceneAlt:
      'Compound illuminated with warm golden garden path lights, backlit intercom keypad, and active recording indicators on both CCTV cameras.',
    sceneButtonLabel: 'Secure the compound',
    markers: [
      { id: 'outdoors-gate', controlId: 'outdoors-gate', label: 'Motorised gate', x: 42.0, y: 60.0 },
      { id: 'outdoors-cam-gate', controlId: 'outdoors-cctv', label: 'Gate camera', x: 19.8, y: 48.5 },
      { id: 'outdoors-cam-eave', controlId: 'outdoors-cctv', label: 'Eave camera', x: 72.2, y: 42.0 },
      { id: 'outdoors-lights', controlId: 'outdoors-lights', label: 'Garden lights', x: 11.0, y: 71.0 },
    ],
    installCards: [
      {
        id: 'dev-outdoors-cctv',
        roomId: 'outdoors',
        name: 'CCTV cameras',
        benefit: 'Watch your whole compound live.',
        surveyChip: 'CCTV',
      },
      {
        id: 'dev-outdoors-gate',
        roomId: 'outdoors',
        name: 'Gate and intercom',
        benefit: 'Let people in from your phone.',
        surveyChip: 'Gate and intercom',
      },
      {
        id: 'dev-outdoors-lights',
        roomId: 'outdoors',
        name: 'Garden and path lighting',
        benefit: 'Set times that suit your family.',
        surveyChip: 'Smart switches and lighting',
      },
    ],
  },
];

export const ALL_INSTALL_DEVICES: InstallDeviceCard[] = ROOM_DEMO_DATA.flatMap(
  (room) => room.installCards
);
