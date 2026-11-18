// Sample vehicle data. Specs are approximate and for demo purposes only.
import type { Vehicle } from '../types';

type V = Omit<Vehicle, 'id'> & { id?: string };

const list: V[] = [
  // Enthusiast platforms
  { year: 2019, make: 'Honda', model: 'Civic', trim: 'Si', chassis: 'FC1', engine: '1.5L I4 Turbo', aspiration: 'Turbo', drivetrain: 'FWD', transmission: 'Manual', stockHp: 205, stockTq: 192, curbWeight: 2889, boltPattern: '5x114.3', centerBore: 64.1, stockWheel: { diameter: 18, width: 8, offset: 50 }, stockTire: '235/40R18', minWheelDiameter: 16, platform: 'civic-fc' },
  { year: 2022, make: 'Toyota', model: 'GR86', trim: 'Premium', chassis: 'ZN8', engine: '2.4L H4', aspiration: 'NA', drivetrain: 'RWD', transmission: 'Manual/Auto', stockHp: 228, stockTq: 184, curbWeight: 2811, boltPattern: '5x100', centerBore: 56.1, stockWheel: { diameter: 18, width: 7.5, offset: 48 }, stockTire: '215/40R18', minWheelDiameter: 17, platform: 'zn8' },
  { year: 2019, make: 'Mazda', model: 'MX-5 Miata', trim: 'Club', chassis: 'ND2', engine: '2.0L I4', aspiration: 'NA', drivetrain: 'RWD', transmission: 'Manual', stockHp: 181, stockTq: 151, curbWeight: 2341, boltPattern: '4x100', centerBore: 54.1, stockWheel: { diameter: 17, width: 7, offset: 45 }, stockTire: '205/45R17', minWheelDiameter: 16, platform: 'nd' },
  { year: 2019, make: 'Subaru', model: 'WRX', trim: 'Premium', chassis: 'VA', engine: '2.0L H4 Turbo', aspiration: 'Turbo', drivetrain: 'AWD', transmission: 'Manual', stockHp: 268, stockTq: 258, curbWeight: 3267, boltPattern: '5x114.3', centerBore: 56.1, stockWheel: { diameter: 18, width: 8.5, offset: 55 }, stockTire: '245/40R18', minWheelDiameter: 17, platform: 'wrx-va' },
  { year: 2019, make: 'Volkswagen', model: 'Golf GTI', trim: 'SE', chassis: 'Mk7', engine: '2.0L I4 Turbo', aspiration: 'Turbo', drivetrain: 'FWD', transmission: 'Manual/Auto', stockHp: 228, stockTq: 258, curbWeight: 3031, boltPattern: '5x112', centerBore: 57.1, stockWheel: { diameter: 18, width: 7.5, offset: 49 }, stockTire: '225/40R18', minWheelDiameter: 17, platform: 'mk7' },
  { year: 2018, make: 'Ford', model: 'Mustang', trim: 'GT', chassis: 'S550', engine: '5.0L V8 Coyote', aspiration: 'NA', drivetrain: 'RWD', transmission: 'Manual/Auto', stockHp: 460, stockTq: 420, curbWeight: 3705, boltPattern: '5x114.3', centerBore: 70.5, stockWheel: { diameter: 19, width: 9, offset: 45 }, stockTire: '255/40R19', minWheelDiameter: 18, platform: 's550' },
  { year: 2018, make: 'Ford', model: 'F-150', trim: 'XLT', chassis: 'P552', engine: '5.0L V8', aspiration: 'NA', drivetrain: '4WD', transmission: 'Automatic', stockHp: 395, stockTq: 400, curbWeight: 4900, boltPattern: '6x135', centerBore: 87.1, stockWheel: { diameter: 18, width: 7.5, offset: 44 }, stockTire: '265/60R18', minWheelDiameter: 17, platform: 'f150-v8', id: 'v-f150-2018' },
  { year: 2021, make: 'Ford', model: 'F-150', trim: 'Lariat', chassis: 'P702', engine: '3.5L V6 EcoBoost', aspiration: 'Turbo', drivetrain: '4WD', transmission: 'Automatic', stockHp: 400, stockTq: 500, curbWeight: 5000, boltPattern: '6x135', centerBore: 87.1, stockWheel: { diameter: 18, width: 7.5, offset: 44 }, stockTire: '265/60R18', minWheelDiameter: 17, platform: 'f150-eco', id: 'v-f150-2021' },
  { year: 2019, make: 'Chevrolet', model: 'Silverado 1500', trim: 'LT', chassis: 'T1', engine: '5.3L V8', aspiration: 'NA', drivetrain: '4WD', transmission: 'Automatic', stockHp: 355, stockTq: 383, curbWeight: 4900, boltPattern: '6x139.7', centerBore: 78.1, stockWheel: { diameter: 18, width: 8.5, offset: 28 }, stockTire: '265/65R18', minWheelDiameter: 17, platform: 'silverado', id: 'v-silverado-2019' },
  // Everyday cars (mostly maintenance)
  { year: 2018, make: 'Honda', model: 'Civic', trim: 'LX', chassis: 'FC', engine: '2.0L I4', aspiration: 'NA', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 158, stockTq: 138, curbWeight: 2771, boltPattern: '5x114.3', centerBore: 64.1, stockWheel: { diameter: 16, width: 7, offset: 45 }, stockTire: '215/55R16', minWheelDiameter: 15, platform: 'civic-fc-na', id: 'v-civic-2018' },
  { year: 2021, make: 'Honda', model: 'Civic', trim: 'EX', chassis: 'FC', engine: '1.5L I4 Turbo', aspiration: 'Turbo', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 174, stockTq: 162, curbWeight: 2906, boltPattern: '5x114.3', centerBore: 64.1, stockWheel: { diameter: 17, width: 7, offset: 45 }, stockTire: '215/50R17', minWheelDiameter: 16, platform: 'civic-fc-15t', id: 'v-civic-2021' },
  { year: 2019, make: 'Honda', model: 'Accord', trim: 'Sport', chassis: 'CV', engine: '1.5L I4 Turbo', aspiration: 'Turbo', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 192, stockTq: 192, curbWeight: 3131, boltPattern: '5x114.3', centerBore: 64.1, stockWheel: { diameter: 19, width: 8, offset: 55 }, stockTire: '235/40R19', minWheelDiameter: 17, platform: 'accord-cv', id: 'v-accord-2019' },
  { year: 2020, make: 'Honda', model: 'CR-V', trim: 'EX', chassis: 'RW', engine: '1.5L I4 Turbo', aspiration: 'Turbo', drivetrain: 'AWD', transmission: 'Automatic', stockHp: 190, stockTq: 179, curbWeight: 3428, boltPattern: '5x114.3', centerBore: 64.1, stockWheel: { diameter: 18, width: 7.5, offset: 45 }, stockTire: '235/60R18', minWheelDiameter: 17, platform: 'crv', id: 'v-crv-2020' },
  { year: 2019, make: 'Toyota', model: 'Camry', trim: 'SE', chassis: 'XV70', engine: '2.5L I4', aspiration: 'NA', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 203, stockTq: 184, curbWeight: 3340, boltPattern: '5x114.3', centerBore: 60.1, stockWheel: { diameter: 18, width: 8, offset: 50 }, stockTire: '235/45R18', minWheelDiameter: 17, platform: 'camry', id: 'v-camry-2019' },
  { year: 2020, make: 'Toyota', model: 'Corolla', trim: 'LE', chassis: 'E210', engine: '1.8L I4', aspiration: 'NA', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 139, stockTq: 126, curbWeight: 2910, boltPattern: '5x100', centerBore: 54.1, stockWheel: { diameter: 16, width: 6.5, offset: 40 }, stockTire: '205/55R16', minWheelDiameter: 15, platform: 'corolla', id: 'v-corolla-2020' },
  { year: 2021, make: 'Toyota', model: 'RAV4', trim: 'XLE', chassis: 'XA50', engine: '2.5L I4', aspiration: 'NA', drivetrain: 'AWD', transmission: 'Automatic', stockHp: 203, stockTq: 184, curbWeight: 3490, boltPattern: '5x114.3', centerBore: 60.1, stockWheel: { diameter: 18, width: 7, offset: 35 }, stockTire: '225/60R18', minWheelDiameter: 17, platform: 'rav4', id: 'v-rav4-2021' },
  { year: 2020, make: 'Mazda', model: 'Mazda3', trim: 'Premium', chassis: 'BP', engine: '2.5L I4', aspiration: 'NA', drivetrain: 'FWD', transmission: 'Automatic', stockHp: 186, stockTq: 186, curbWeight: 3080, boltPattern: '5x114.3', centerBore: 67.1, stockWheel: { diameter: 18, width: 7, offset: 45 }, stockTire: '215/45R18', minWheelDiameter: 16, platform: 'mazda3', id: 'v-mazda3-2020' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const vehicles: Vehicle[] = list.map((v) => ({
  ...v,
  id: v.id ?? `v-${slug(`${v.model}-${v.chassis}-${v.year}`)}`,
}));

export const byPlatform = (...platforms: string[]) =>
  vehicles.filter((v) => platforms.includes(v.platform)).map((v) => v.id);

export const vehicleIdsWhere = (pred: (v: Vehicle) => boolean) => vehicles.filter(pred).map((v) => v.id);
