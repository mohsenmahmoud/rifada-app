const img = (n: number) => `${import.meta.env.BASE_URL}img/rephoto${n}.jpg`;

/**
 * R39–R42 — neighbour-to-neighbour property listings. Discovery and contact
 * only: no in-app transaction, by explicit product decision.
 *
 * Photos were lifted out of the design tool's offline bundle so the listings
 * keep the real imagery instead of falling back to gradients.
 */
export type Listing = {
  type: 'sale' | 'rent';
  title: string;
  price: string;
  priceUnit: string;
  rooms: number;
  area: number;
  zone: string;
  ago: string;
  g1: string;
  g2: string;
  owner: string;
  ownerUnit: string;
  desc: string;
  photo: string;
};

export const reDefs: Listing[] = [
  {
    type: 'sale',
    title: 'فيلا 87 — حي الياسمين',
    price: '9.4M',
    priceUnit: 'ر.س',
    rooms: 4,
    area: 320,
    zone: 'حي الياسمين',
    ago: 'منذ 3 أيام',
    g1: '#27496F',
    g2: '#1F3B57',
    owner: 'منيرة الدوسري',
    ownerUnit: 'فيلا 87',
    desc: 'فيلا مستقلة بتشطيب فاخر، حديقة خاصة 120 م²، إطلالة على اللاندسكيب الرئيسي، ومطبخ مجهز بالكامل.',
    photo: img(0),
  },
  {
    type: 'sale',
    title: 'شقة 12ب — البوابة الشرقية',
    price: '4.2M',
    priceUnit: 'ر.س',
    rooms: 3,
    area: 165,
    zone: 'الحي الشرقي',
    ago: 'منذ أسبوع',
    g1: '#3D2A5C',
    g2: '#1F3B57',
    owner: 'فهد الشمري',
    ownerUnit: 'شقة 12ب',
    desc: 'شقة بواجهة شمالية، دور ثالث بمصعد، تشطيب حديث، قريبة من النادي والمنطقة التجارية.',
    photo: img(1),
  },
  {
    type: 'rent',
    title: 'شقة 44 — حي النرجس',
    price: '28,000',
    priceUnit: 'ر.س / شهر',
    rooms: 2,
    area: 130,
    zone: 'حي النرجس',
    ago: 'منذ يومين',
    g1: '#8A6D3B',
    g2: '#5C4A2A',
    owner: 'تركي العسيري',
    ownerUnit: 'فيلا 102',
    desc: 'شقة مفروشة بالكامل للإيجار السنوي، مكيفة، تصلح لعائلة صغيرة، متاحة من أغسطس.',
    photo: img(2),
  },
  {
    type: 'rent',
    title: 'فيلا 156 — دوبلكس',
    price: '65,000',
    priceUnit: 'ر.س / شهر',
    rooms: 4,
    area: 280,
    zone: 'حي الياسمين',
    ago: 'اليوم',
    g1: '#2E5E4A',
    g2: '#1F3B57',
    owner: 'ريم الشهري',
    ownerUnit: 'فيلا 156',
    desc: 'دوبلكس بحديقة، إيجار سنوي فقط، غير مفروش، والصيانة على المالك.',
    photo: img(3),
  },
];

export const myListingDefs = [
  {
    title: 'فيلا 214 — للإيجار (غرفة الضيوف الملحقة)',
    price: '12,000 ر.س / شهر',
    views: 84,
    interested: 5,
  },
  { title: 'موقف مغطى إضافي — للإيجار', price: '1,500 ر.س / شهر', views: 31, interested: 2 },
];

export const listingStateMeta = {
  active: { label: 'نشط', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  paused: { label: 'متوقف', bg: 'rgba(107,114,128,0.13)', c: '#6B7280' },
  done: { label: 'تم التأجير', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
} as const;
