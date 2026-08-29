import { shopIcons } from './icons';

/**
 * المتجر — one unified section covering every product provider inside the
 * compound. The user asked for this to absorb the old "restaurants and
 * pharmacies" screen, so the category list is deliberately broad.
 */
export const shopCatDefs = [
  { key: 'all', label: 'الكل' },
  { key: 'rest', label: 'مطاعم' },
  { key: 'pharm', label: 'صيدليات' },
  { key: 'grocery', label: 'بقالة' },
  { key: 'bakery', label: 'مخبوزات' },
  { key: 'fruits', label: 'خضار وفاكهة' },
  { key: 'water', label: 'مياه وغاز' },
  { key: 'laundry', label: 'مغسلة' },
  { key: 'flowers', label: 'ورد وهدايا' },
] as const;

export type ShopCatKey = (typeof shopCatDefs)[number]['key'];

export type Store = {
  kind: Exclude<ShopCatKey, 'all'>;
  name: string;
  rating: string;
  eta: string;
  open: boolean;
  deliv: number;
  minOrder: number;
  promo?: string;
};

export const storeDefs: Store[] = [
  { kind: 'rest', name: 'مطعم بيت الجيران', rating: '4.7', eta: '35 دقيقة', open: true, deliv: 20, minOrder: 60, promo: 'خصم 15% اليوم' },
  { kind: 'rest', name: 'بيتزا المدينة', rating: '4.5', eta: '40 دقيقة', open: true, deliv: 15, minOrder: 80 },
  { kind: 'rest', name: 'عصائر النخيل', rating: '4.8', eta: '20 دقيقة', open: false, deliv: 10, minOrder: 40 },
  { kind: 'pharm', name: 'صيدلية الشفاء', rating: '4.9', eta: '25 دقيقة', open: true, deliv: 10, minOrder: 30, promo: 'توصيل مجاني للأدوية' },
  { kind: 'pharm', name: 'صيدلية النور', rating: '4.6', eta: '30 دقيقة', open: true, deliv: 12, minOrder: 30 },
  { kind: 'grocery', name: 'سوبر ماركت الجيران', rating: '4.6', eta: '30 دقيقة', open: true, deliv: 15, minOrder: 100, promo: 'عروض نهاية الأسبوع' },
  { kind: 'grocery', name: 'ميني ماركت البوابة', rating: '4.3', eta: '20 دقيقة', open: true, deliv: 10, minOrder: 50 },
  { kind: 'bakery', name: 'مخبز الأندلس', rating: '4.8', eta: '25 دقيقة', open: true, deliv: 8, minOrder: 25 },
  { kind: 'bakery', name: 'حلواني قصر الشام', rating: '4.7', eta: '45 دقيقة', open: true, deliv: 18, minOrder: 120 },
  { kind: 'fruits', name: 'خضار وفاكهة اليوم', rating: '4.5', eta: '35 دقيقة', open: true, deliv: 12, minOrder: 40 },
  { kind: 'water', name: 'مياه بيرين — توصيل', rating: '4.9', eta: '60 دقيقة', open: true, deliv: 0, minOrder: 45, promo: 'التوصيل مجانًا' },
  { kind: 'water', name: 'أنابيب غاز المدينة', rating: '4.4', eta: '90 دقيقة', open: true, deliv: 25, minOrder: 150 },
  { kind: 'laundry', name: 'مغسلة كلين برس', rating: '4.7', eta: 'استلام خلال ساعة', open: true, deliv: 15, minOrder: 60 },
  { kind: 'flowers', name: 'ورد وهدايا لافندر', rating: '4.8', eta: '50 دقيقة', open: true, deliv: 20, minOrder: 200 },
];

export type MenuItem = { name: string; price: number };

/** Every store carries a real menu — no placeholder stores. */
export const menuByStore: Record<number, MenuItem[]> = {
  0: [
    { name: 'مشويات مشكلة (وجبة)', price: 185 },
    { name: 'مندي لحم', price: 140 },
    { name: 'أرز بخاري بالدجاج', price: 95 },
    { name: 'سلطة خضراء كبيرة', price: 35 },
  ],
  1: [
    { name: 'بيتزا مارجريتا وسط', price: 120 },
    { name: 'بيتزا سوبر سوبريم', price: 165 },
    { name: 'كرات الجبن (8 قطع)', price: 55 },
  ],
  2: [
    { name: 'عصير مانجو طازج', price: 45 },
    { name: 'كوكتيل فواكه', price: 50 },
  ],
  3: [
    { name: 'بنادول أزرق — شريط', price: 28 },
    { name: 'فيتامين سي 1000', price: 95 },
    { name: 'جهاز قياس حرارة', price: 220 },
    { name: 'شاش ومطهر جروح', price: 60 },
  ],
  4: [
    { name: 'مسكن أطفال شراب', price: 42 },
    { name: 'كمامات (علبة 50)', price: 75 },
  ],
  5: [
    { name: 'حليب طازج 1 لتر', price: 38 },
    { name: 'بيض طازج (30)', price: 130 },
    { name: 'أرز بسمتي 5 كجم', price: 210 },
    { name: 'زيت عباد الشمس 1 لتر', price: 75 },
  ],
  6: [
    { name: 'مياه صغيرة (كرتونة)', price: 60 },
    { name: 'شيبس عائلي', price: 25 },
    { name: 'مشروب غازي 1 لتر', price: 22 },
  ],
  7: [
    { name: 'خبز تميس (5 حبات)', price: 15 },
    { name: 'كرواسون سادة (6)', price: 48 },
    { name: 'كيكة شوكولاتة صغيرة', price: 220 },
  ],
  8: [
    { name: 'كنافة بالقشطة (كيلو)', price: 180 },
    { name: 'بقلاوة مشكلة (كيلو)', price: 240 },
  ],
  9: [
    { name: 'طماطم (كيلو)', price: 18 },
    { name: 'موز (كيلو)', price: 35 },
    { name: 'برتقال عصير (3 كيلو)', price: 55 },
    { name: 'خس وجرجير (حزمة)', price: 12 },
  ],
  10: [
    { name: 'قارورة مياه 19 لتر', price: 45 },
    { name: 'اشتراك شهري (8 قوارير)', price: 320 },
  ],
  11: [
    { name: 'أنبوبة غاز منزلية', price: 150 },
    { name: 'توصيل + تركيب', price: 30 },
  ],
  12: [
    { name: 'غسيل ومكوى — قميص', price: 30 },
    { name: 'بدلة كاملة', price: 120 },
    { name: 'مفارش سرير (طقم)', price: 90 },
    { name: 'استلام وتسليم من الباب', price: 0 },
  ],
  13: [
    { name: 'بوكيه ورد بلدي', price: 250 },
    { name: 'بوكس هدايا + شوكولاتة', price: 420 },
    { name: 'بالونات عيد ميلاد', price: 95 },
  ],
};

export const storeIcon = (kind: Store['kind']) => shopIcons[kind] ?? shopIcons.all;

/** Free delivery kicks in above this basket value. */
export const FREE_DELIVERY_OVER = 200;

export const orderStepDefs = ['تم استلام الطلب', 'قيد التحضير', 'في الطريق إليك', 'تم التوصيل'];
export const trackEtas = ['45 - 55 دقيقة', '35 - 45 دقيقة', '15 - 20 دقيقة', 'وصل طلبك ✓'];

/** R50 — reorderable past orders. */
export const pastOrderDefs = [
  {
    store: 'مطعم بيت الجيران',
    items: 'مشويات مشكلة × 1، سلطة × 2',
    date: 'أمس — 8:40 م',
    total: 270,
    storeIdx: 0,
    cart: { 0: 1, 3: 2 } as Record<number, number>,
  },
  {
    store: 'صيدلية الشفاء',
    items: 'بنادول × 2، فيتامين سي × 1',
    date: 'منذ 4 أيام',
    total: 166,
    storeIdx: 3,
    cart: { 0: 2, 1: 1 } as Record<number, number>,
  },
  {
    store: 'بيتزا المدينة',
    items: 'سوبريم × 1، كرات جبن × 1',
    date: 'الأسبوع الماضي',
    total: 235,
    storeIdx: 1,
    cart: { 1: 1, 2: 1 } as Record<number, number>,
  },
];
