import type { Vehicle, VisitEntry } from '../types';
import { icons } from './icons';

/** R22 — notification inbox. The right-edge bar marks unread priority. */
export const notifDefs = [
  {
    icon: icons.pay,
    title: 'تذكير: مستحقات يوليو',
    sub: 'يُستحق السداد 25 يوليو',
    time: 'منذ ساعة',
    bar: '#C79A3C',
  },
  {
    icon: icons.maint,
    title: 'تحديث بلاغ #1042',
    sub: 'الفني محمد في الطريق إليك الآن',
    time: '9:03 ص',
    bar: '#3FA66B',
  },
  {
    icon: icons.lost,
    title: 'عنصر جديد في المفقودات',
    sub: 'مفتاح سيارة — بجوار البوابة الرئيسية',
    time: 'أمس',
    bar: 'transparent',
  },
  {
    icon: icons.amen,
    title: 'تم تأكيد حجز الجيم',
    sub: 'اليوم 6 مساءً — أظهر QR عند الدخول',
    time: 'أمس',
    bar: 'transparent',
  },
  {
    icon: icons.docs,
    title: 'عقد الصيانة يقترب من الانتهاء',
    sub: 'جدّد الآن واحصل على شهر مجاني',
    time: 'منذ يومين',
    bar: 'transparent',
  },
];

/** R17 — registered vehicles with automatic gate entry. */
export const vehicleDefs = [
  { name: 'تويوتا كورولا — أبيض', plate: 'س ن ر 2146' },
  { name: 'هيونداي توسان — رمادي', plate: 'م ص ع 731' },
];

/** R24 — redemption tiles and the cash/points ladder. */
export const redeemTiles = [
  {
    label: 'بطاقة هدايا',
    icon: 'M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7C12 7 10 2 7 3s-1 4 5 4M12 7c0 0 2-5 5-4s1 4-5 4',
  },
  { label: 'بطاقة مسبقة الدفع', icon: icons.pay },
  { label: 'خصم على رسوم الوحدة', icon: 'M4 11l8-7 8 7v9H4zM9.5 16l5-5M10 11.5h.01M14.5 16h.01' },
  { label: 'قسائم شركاء', icon: icons.star },
];

export const redeemDefs = [
  { cash: '50 ر.س', pts: 1250 },
  { cash: '100 ر.س', pts: 2500 },
  { cash: '250 ر.س', pts: 6000 },
];

/** R26 — how the trust score was earned. */
export const scoreItems = [
  { label: 'سداد منتظم 12 شهرًا', pts: '+400', positive: true },
  { label: 'تقييم البلاغات بعد الحل', pts: '+180', positive: true },
  { label: 'المشاركة في فعاليات المجتمع', pts: '+150', positive: true },
  { label: 'حجوزات مرافق دون تغيّب', pts: '+160', positive: true },
  { label: 'إلغاء حجز متأخر — مرة واحدة', pts: '-40', positive: false },
];

export const TRUST_SCORE = 850;
export const TRUST_MAX = 1000;

/** R28 — post-resolution pulse survey. */
export const surveyChipDefs = ['الصيانة', 'النظافة', 'الأمن', 'التواصل', 'المرافق'];

/** R32 — renewal offers. */
export const renewDefs = [
  { title: 'شهر مجاني من رسوم الصيانة', sub: 'عند التجديد لسنة كاملة قبل 30 سبتمبر' },
  { title: 'خصم 10% على قيمة العقد', sub: 'عند الدفع مقدمًا دفعة واحدة' },
  { title: 'ترقية باقة الأمن مجانًا', sub: 'كاميرا إضافية + استجابة أولوية' },
];

/** D1–D3 — documents, contacts, quick links. */
export const docDefs = [
  { name: 'عقد الوحدة — فيلا 214', sub: 'PDF · 2.4 م.ب' },
  { name: 'لائحة الكمبوند الداخلية', sub: 'PDF · 800 ك.ب' },
  { name: 'مخطط الوحدة المعماري', sub: 'PDF · 5.1 م.ب' },
  { name: 'وثيقة التأمين', sub: 'PDF · 300 ك.ب' },
];

export const contactDefs = [
  { name: 'أمن البوابة الرئيسية', sub: 'متاح 24 ساعة' },
  { name: 'مكتب إدارة الكمبوند', sub: 'يوميًا 9 ص – 9 م' },
  { name: 'الطوارئ والإسعاف', sub: 'عيادة الكمبوند — متاحة 24 ساعة' },
  { name: 'خدمة العملاء — رفادة', sub: 'داخل التطبيق أو 19214' },
];

export const linkDefs = [
  { name: 'بوابة قراءة العدادات', sub: 'شركة الكهرباء — تسجيل القراءة الشهرية' },
  { name: 'موقع المطور العقاري', sub: 'أخبار المشروع والمراحل الجديدة' },
  { name: 'دليل خدمات المدينة', sub: 'مستشفيات، مدارس، مراكز تسوق قريبة' },
];

/** R30 — the registered pet and its vaccination record. */
export const petDef = {
  name: 'لونا — قطة شيرازي',
  sub: 'مسجلة لدى إدارة الكمبوند · فيلا 214',
  vaccines: [
    { label: 'التطعيم السنوي الشامل', until: 'ساري حتى مارس 2027' },
    { label: 'تطعيم السعار', until: 'ساري حتى يناير 2027' },
  ],
  policy:
    'سياسة الكمبوند: يُسمح بالحيوانات الأليفة المسجلة في المناطق المفتوحة مع مقود، ولا يُسمح بدخولها منطقة الأطفال والمسبح.',
};

/** R12 — move-in tabs. Handover unlocks only when a move-out is filed. */
export const moveTabDefs = [
  { key: 'before' as const, label: 'قبل الانتقال' },
  { key: 'receive' as const, label: 'الاستلام' },
  { key: 'handover' as const, label: 'التسليم' },
];

/**
 * R17 — gate. The visitor pass went from a name box to a scheduled permit
 * (date, start, optional end, validity), and the two parked cars became an
 * editable list. A visit log sits under both.
 */
export const initialVehicles: Vehicle[] = [
  { name: 'تويوتا كورولا — أبيض', plate: 'س ن ر 2146' },
  { name: 'هيونداي توسان — رمادي', plate: 'م ص ع 731' },
];

export const initialVisitLog: VisitEntry[] = [
  { name: 'محمد الشناوي', when: 'أمس — 5 م حتى 8 م', st: 'out', exit: '7:42 م', period: 'week' },
  { name: 'مندوب شحنة أثاث', when: 'الثلاثاء — 11 ص', st: 'out', exit: '11:35 ص', period: 'week' },
  { name: 'خالد العتيبي', when: 'الأحد — 8 م', st: 'out', exit: '11:20 م', period: 'week' },
  { name: 'فني ستائر', when: 'الأسبوع الماضي — 4 م', st: 'out', exit: '6:05 م', period: 'month' },
  { name: 'أم فهد (الجارة)', when: 'الأسبوع الماضي — 1 ظ', st: 'out', exit: '3:30 م', period: 'month' },
  { name: 'شركة تنظيف الخزانات', when: '14 أغسطس — 9 ص', st: 'out', exit: '12:40 م', period: 'older' },
  { name: 'عمّ عبدالله وعائلته', when: '2 أغسطس — 6 م', st: 'out', exit: '11:55 م', period: 'older' },
];

export const passDayDefs = [
  { key: 'today' as const, label: 'اليوم' },
  { key: 'tomorrow' as const, label: 'غدًا' },
  { key: 'custom' as const, label: '📅 تاريخ آخر' },
];

export const passValidityDefs = ['مرة واحدة', '24 ساعة', 'طوال اليوم'];

export const visitFilterDefs = [
  { key: 'all' as const, label: 'الكل' },
  { key: 'week' as const, label: 'هذا الأسبوع' },
  { key: 'month' as const, label: 'هذا الشهر' },
  { key: 'older' as const, label: 'أقدم' },
];

/** Chrome for one visit-log row, by state. */
export const visitStateMeta = {
  out: { label: 'خرج', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  in: { label: 'بالداخل الآن', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  upcoming: { label: 'قادمة', bg: 'rgba(107,114,128,0.12)', c: '#6B7280' },
} as const;
