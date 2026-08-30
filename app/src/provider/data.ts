import type { Order, OrderStage, StoreKind } from './types';

/**
 * Provider app content. The same account can run as a technician (P1–P8) or as
 * a store (P9–P11) — the design chat settled on one app with two faces rather
 * than two apps.
 */

export const TECHNICIAN = {
  name: 'عبدالعزيز الزهراني — فني سباكة',
  initials: 'ع ز',
  company: 'أكوا فيكس · حدائق الأندلس',
  phone: '0555 208 540',
  pin: '4821',
};

export const upcomingJobs = [
  { title: 'تسريب مياه — سباكة', area: 'حي الياسمين', time: 'خلال 20 دقيقة', pay: 150 },
  { title: 'صيانة خلاط حمام', area: 'الحي الشرقي', time: 'اليوم 4:00 م', pay: 90 },
];

export const pastJobs = [
  { title: 'إصلاح تسريب مطبخ', date: 'أمس — 2:30 م', pay: 130 },
  { title: 'تركيب سخان مياه', date: 'أمس — 11:00 ص', pay: 220 },
  { title: 'صيانة دورية سباكة', date: 'منذ يومين', pay: 90 },
  { title: 'إصلاح صرف حمام', date: 'منذ 3 أيام', pay: 110 },
];

/** P3 — the incoming request shown as a countdown sheet. */
export const incomingJob = {
  title: 'تسريب مياه — سباكة',
  /** The exact unit is withheld until the provider accepts. */
  area: 'حي الياسمين — منطقة عامة (يظهر الرقم الدقيق بعد القبول)',
  note: '«تسريب مستمر أسفل حوض الحمام الرئيسي منذ يومين، مرفق صورتان.»',
  pay: 150,
  unit: 'فيلا 214 — حي الياسمين · عبدالله العتيبي',
};

export const RESPONSE_SECONDS = 20;

/** Commission taken on a matched job vs. a store order. */
export const JOB_COMMISSION_PCT = 15;
export const JOB_PAYOUT_NET = '127.50';
export const STORE_COMMISSION_PCT = 12;

export const disputeReasonDefs = [
  'الساكن غير موجود',
  'بلاغ حول الدخول للوحدة',
  'مشكلة في الدفع',
];

/* ---------------- wallet ---------------- */

export const WALLET_AVAILABLE = '1,240';
export const WALLET_HELD = 150;
export const BANK_ACCOUNT = 'البنك الأهلي — حساب •••• 8842';

export const withdrawSteps = [
  { label: 'تم إنشاء طلب السحب', sub: 'اليوم — 3:42 م' },
  { label: 'قيد التحويل البنكي', sub: 'عادةً خلال ساعات العمل — بلا رسوم' },
  { label: 'وصل الرصيد إلى حسابك', sub: 'البنك الأهلي •••• 8842' },
];

/* ---------------- store side ---------------- */

export const storeIdentity: Record<StoreKind, { name: string; icon: string }> = {
  rest: {
    name: 'مطعم بيت الجيران',
    icon: 'M7 3v7a2 2 0 0 0 2 2v9M7 3v5M11 3v5M17 3c-2 0-3 3-3 6h3v12',
  },
  pharm: {
    name: 'صيدلية الشفاء',
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8',
  },
};

export const storeMenuDefs: Record<StoreKind, { name: string; price: number }[]> = {
  rest: [
    { name: 'مشويات مشكلة (وجبة)', price: 185 },
    { name: 'مندي لحم', price: 140 },
    { name: 'أرز بخاري بالدجاج', price: 95 },
    { name: 'سلطة خضراء كبيرة', price: 35 },
  ],
  pharm: [
    { name: 'بنادول أزرق — شريط', price: 28 },
    { name: 'فيتامين سي 1000', price: 95 },
    { name: 'جهاز قياس حرارة', price: 220 },
    { name: 'شاش ومطهر جروح', price: 60 },
  ],
};

export const orderDefs: Record<StoreKind, Order[]> = {
  rest: [
    {
      id: '#2842',
      who: 'فيلا 88 — نورة القحطاني',
      time: 'الآن',
      lines: [
        { name: 'مندي لحم × 1', price: 140 },
        { name: 'أرز بخاري × 2', price: 190 },
      ],
      total: 345,
      net: '303.60',
    },
    {
      id: '#2841',
      who: 'فيلا 214 — عبدالله العتيبي',
      time: 'منذ 8 دقائق',
      lines: [
        { name: 'مشويات مشكلة × 1', price: 185 },
        { name: 'سلطة خضراء × 2', price: 70 },
      ],
      total: 270,
      net: '224.40',
    },
    {
      id: '#2839',
      who: 'فيلا 96 — منيرة الدوسري',
      time: 'منذ ساعتين',
      lines: [{ name: 'أرز بخاري × 1', price: 95 }],
      total: 110,
      net: '83.60',
    },
  ],
  pharm: [
    {
      id: '#P-311',
      who: 'فيلا 214 — عبدالله العتيبي',
      time: 'الآن',
      rx: true,
      lines: [
        { name: 'بنادول أزرق × 2', price: 56 },
        { name: 'فيتامين سي × 1', price: 95 },
      ],
      total: 166,
      net: '132.88',
    },
    {
      id: '#P-309',
      who: 'فيلا 12 — لطيفة الزهراني',
      time: 'منذ 20 دقيقة',
      lines: [{ name: 'جهاز قياس حرارة × 1', price: 220 }],
      total: 235,
      net: '193.60',
    },
    {
      id: '#P-305',
      who: 'فيلا 45 — ماجد البقمي',
      time: 'صباحًا',
      lines: [{ name: 'مسكن أطفال × 1', price: 42 }],
      total: 57,
      net: '36.96',
    },
  ],
};

export const orderFlow: OrderStage[] = ['new', 'preparing', 'ready', 'out', 'delivered'];

export const orderMeta: Record<OrderStage, { label: string; bg: string; c: string }> = {
  new: { label: 'طلب جديد', bg: 'rgba(228,103,90,0.13)', c: '#B24439' },
  preparing: { label: 'قيد التحضير', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  ready: { label: 'جاهز — بانتظار المندوب', bg: 'rgba(31,59,87,0.1)', c: '#1F3B57' },
  out: { label: 'خرج مع المندوب', bg: 'rgba(61,42,92,0.12)', c: '#3D2A5C' },
  delivered: { label: 'مُسلَّم ✓', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
};

/** The CTA that moves an order to the next stage. */
export const nextAction = (
  stage: OrderStage,
  kind: StoreKind,
): { label: string; tone: string } | null => {
  switch (stage) {
    case 'new':
      return {
        label:
          kind === 'pharm'
            ? 'الروشتة سليمة — قبول وتسجيل الطلب'
            : 'قبول وتسجيل الطلب — بدء التحضير',
        tone: '#3FA66B',
      };
    case 'preparing':
      return { label: 'الأوردر جاهز ✓ — استدعاء مندوب التوصيل', tone: '#1F3B57' };
    case 'ready':
      return { label: 'خروج الأوردر — تسليم للمندوب', tone: '#C79A3C' };
    case 'out':
      return { label: 'تأكيد وصوله للساكن (محاكاة)', tone: '#1F3B57' };
    default:
      return null;
  }
};

export const advanceToasts: Partial<Record<OrderStage, string>> = {
  preparing: 'تم تسجيل الطلب وقبوله — وصل إشعار «قيد التحضير» للساكن',
  ready: 'الأوردر جاهز — تم إشعار أقرب مندوب توصيل',
  out: 'خرج الأوردر من المتجر — الساكن يتتبع المندوب الآن',
  delivered: 'تم التسليم — يُحرَّر المبلغ بعد تأكيد الساكن',
};

export const COURIER = 'مشعل الرشيدي';
