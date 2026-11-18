import type { Category, Section } from '../types';

export const sections: Section[] = [
  { id: 'power', name: 'Power', blurb: 'Intakes, exhaust, tunes and boost' },
  { id: 'chassis', name: 'Chassis & Brakes', blurb: 'Coilovers, sway bars and big brakes' },
  { id: 'wheels-tires', name: 'Wheels & Tires', blurb: 'Fitment-checked wheels and rubber' },
  { id: 'style', name: 'Aero & Interior', blurb: 'Wings, splitters and buckets' },
  { id: 'maintenance', name: 'Maintenance', blurb: 'Filters, fluids and wear items' },
];

const perf = (c: Omit<Category, 'performance' | 'defaultQty'> & { defaultQty?: number }): Category => ({
  defaultQty: 1,
  performance: true,
  ...c,
});
const maint = (c: Omit<Category, 'performance' | 'defaultQty' | 'section'>): Category => ({
  section: 'maintenance',
  defaultQty: 1,
  performance: false,
  ...c,
});

export const categories: Category[] = [
  // Power
  perf({ id: 'intake', section: 'power', name: 'Intakes', description: 'Cold air and short ram intakes', icon: '🌀', specColumns: [{ key: 'type', label: 'Type' }, { key: 'filter', label: 'Filter' }] }),
  perf({ id: 'exhaust', section: 'power', name: 'Exhaust', description: 'Cat-back and axle-back systems', icon: '💨', specColumns: [{ key: 'type', label: 'Type' }, { key: 'material', label: 'Material' }, { key: 'sound', label: 'Sound' }] }),
  perf({ id: 'headers-downpipe', section: 'power', name: 'Headers & Downpipes', description: 'Headers (NA) and downpipes (turbo)', icon: '🔥', specColumns: [{ key: 'type', label: 'Type' }, { key: 'cat', label: 'Catalyst' }] }),
  perf({ id: 'intercooler', section: 'power', name: 'Intercoolers', description: 'Front-mount and top-mount upgrades', icon: '🧊', specColumns: [{ key: 'type', label: 'Type' }, { key: 'core', label: 'Core' }] }),
  perf({ id: 'forced-induction', section: 'power', name: 'Turbo & Supercharger', description: 'Boost kits and turbo upgrades', icon: '🐌', specColumns: [{ key: 'type', label: 'Type' }, { key: 'boost', label: 'Boost' }] }),
  perf({ id: 'tune', section: 'power', name: 'ECU Tunes', description: 'Flash tuners and pro tunes', icon: '💻', specColumns: [{ key: 'device', label: 'Device' }, { key: 'stage', label: 'Stage' }] }),
  perf({ id: 'clutch', section: 'power', name: 'Clutches', description: 'Upgraded clutch kits and flywheels', icon: '⚙️', specColumns: [{ key: 'stage', label: 'Stage' }, { key: 'torque', label: 'Rated tq' }] }),
  // Chassis
  perf({ id: 'coilovers', section: 'chassis', name: 'Coilovers', description: 'Height and damping adjustable suspension', icon: '🌀', specColumns: [{ key: 'damping', label: 'Damping' }, { key: 'rates', label: 'Spring F/R' }, { key: 'drop', label: 'Drop' }] }),
  perf({ id: 'springs', section: 'chassis', name: 'Lowering Springs', description: 'Drop and stiffen on stock dampers', icon: '🪀', specColumns: [{ key: 'drop', label: 'Drop' }, { key: 'rate', label: 'Rate' }] }),
  perf({ id: 'sway-bars', section: 'chassis', name: 'Sway Bars', description: 'Adjustable anti-roll bars', icon: '➰', specColumns: [{ key: 'position', label: 'Position' }, { key: 'diameter', label: 'Diameter' }] }),
  perf({ id: 'big-brake-kit', section: 'chassis', name: 'Big Brake Kits', description: 'Multi-piston calipers and larger rotors', icon: '🛑', specColumns: [{ key: 'pistons', label: 'Pistons' }, { key: 'rotor', label: 'Rotor' }, { key: 'minWheel', label: 'Min wheel' }] }),
  // Wheels & tires
  perf({ id: 'wheels', section: 'wheels-tires', name: 'Wheels', description: 'Flow-formed and forged wheels', icon: '🛞', defaultQty: 4, specColumns: [{ key: 'size', label: 'Size' }, { key: 'offset', label: 'Offset' }, { key: 'boltPattern', label: 'Bolt' }, { key: 'weight', label: 'Weight' }, { key: 'construction', label: 'Build' }] }),
  perf({ id: 'tires', section: 'wheels-tires', name: 'Tires', description: 'Summer, 200tw, R-comp and all-terrain', icon: '⭕', defaultQty: 4, specColumns: [{ key: 'size', label: 'Size' }, { key: 'type', label: 'Type' }, { key: 'treadwear', label: 'UTQG' }] }),
  // Style
  perf({ id: 'aero', section: 'style', name: 'Aero', description: 'Wings, splitters and lips', icon: '🪽', specColumns: [{ key: 'type', label: 'Type' }, { key: 'material', label: 'Material' }] }),
  perf({ id: 'seats', section: 'style', name: 'Seats', description: 'Bucket seats (rails sold separately)', icon: '💺', specColumns: [{ key: 'type', label: 'Type' }, { key: 'material', label: 'Shell' }, { key: 'fia', label: 'FIA' }] }),
  // Maintenance
  maint({ id: 'oil-filter', name: 'Oil Filters', description: 'Spin-on and cartridge engine oil filters', icon: '🛢️', specColumns: [{ key: 'type', label: 'Type' }, { key: 'media', label: 'Media' }] }),
  maint({ id: 'engine-oil', name: 'Engine Oil', description: 'Synthetic and conventional motor oil', icon: '💧', specColumns: [{ key: 'viscosity', label: 'Viscosity' }, { key: 'volume', label: 'Volume' }] }),
  maint({ id: 'air-filter', name: 'Engine Air Filters', description: 'Paper and reusable drop-in filters', icon: '🌬️', specColumns: [{ key: 'media', label: 'Media' }, { key: 'reusable', label: 'Reusable' }] }),
  maint({ id: 'cabin-filter', name: 'Cabin Air Filters', description: 'Particulate and carbon cabin filters', icon: '🍃', specColumns: [{ key: 'media', label: 'Media' }, { key: 'carbon', label: 'Carbon' }] }),
  maint({ id: 'brake-pads', name: 'Brake Pads', description: 'Street, performance and track compounds', icon: '🧱', specColumns: [{ key: 'position', label: 'Position' }, { key: 'compound', label: 'Compound' }, { key: 'use', label: 'Use' }] }),
  maint({ id: 'spark-plugs', name: 'Spark Plugs', description: 'Iridium, platinum and colder heat ranges', icon: '⚡', specColumns: [{ key: 'material', label: 'Material' }, { key: 'heat', label: 'Heat range' }, { key: 'qty', label: 'Qty' }] }),
  maint({ id: 'wiper-blades', name: 'Wiper Blades', description: 'Beam, hybrid and conventional blades', icon: '🌧️', specColumns: [{ key: 'style', label: 'Style' }, { key: 'length', label: 'Length' }] }),
  maint({ id: 'battery', name: 'Batteries', description: 'AGM, flooded and lightweight lithium', icon: '🔋', specColumns: [{ key: 'group', label: 'Group' }, { key: 'cca', label: 'CCA' }, { key: 'weight', label: 'Weight' }] }),
];
