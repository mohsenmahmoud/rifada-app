import type { ShareHistEntry, ShareKind, ShareListing, ShareReq } from '../types';
import { shareIcons } from './icons';
import { avatarBg } from './seed';

/**
 * استعارة (R67–R69f) — neighbour-to-neighbour sharing, booked by time slot.
 * Distinct from المتجر (products delivered) and the provider marketplace
 * (a technician entering your unit): here a neighbour lends what they own.
 */
export const shareKindDefs: { key: ShareKind; label: string }[] = [
  { key: 'space', label: 'مساحة أو قاعة' },
  { key: 'gear', label: 'معدات وأدوات' },
  { key: 'sport', label: 'ملعب أو رياضة' },
  { key: 'kids', label: 'أطفال وألعاب' },
  { key: 'park', label: 'مكان انتظار' },
  { key: 'skill', label: 'مهارة أو درس' },
];

export const shareCatDefs: { key: string; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'space', label: 'مساحات' },
  { key: 'gear', label: 'معدات' },
  { key: 'sport', label: 'رياضة' },
  { key: 'kids', label: 'أطفال' },
  { key: 'park', label: 'انتظار' },
  { key: 'skill', label: 'مهارات' },
];

export const shareDefs: ShareListing[] = [
  {
    kind: 'space',
    title: 'قاعة استقبال بالفيلا — 20 فردًا',
    owner: 'نورة القحطاني — فيلا 88',
    rating: '4.9',
    price: 150,
    unit: 'للساعة',
    desc: 'قاعة مكيّفة بمدخل مستقل ومطبخ صغير — مناسبة لعزومة عائلية أو اجتماع صغير. تشمل الكراسي والطاولات.',
    slots: [
      ['الجمعة 25 يوليو', '4 م – 8 م', 'متاح'],
      ['السبت 26 يوليو', '11 ص – 3 م', 'متاح'],
      ['السبت 26 يوليو', '5 م – 9 م', 'محجوز'],
      ['الأحد 27 يوليو', '6 م – 10 م', 'متاح'],
    ],
  },
  {
    kind: 'gear',
    title: 'شنطة عدّة وأدوات صيانة',
    owner: 'عبدالله العتيبي — فيلا 214',
    rating: '4.7',
    price: 0,
    unit: 'مجانًا بين الجيران',
    desc: 'دريل، مفكات، مفاتيح إنجليزي وشاكوش — للاستعارة نصف يوم. تُسلَّم عند البوابة.',
    slots: [
      ['اليوم', 'حتى 9 م', 'متاح'],
      ['غدًا', 'صباحًا', 'متاح'],
      ['الخميس', 'كل اليوم', 'محجوز'],
    ],
  },
  {
    kind: 'sport',
    title: 'ملعب بادل خاص بالفيلا',
    owner: 'سلطان الحربي — فيلا 96',
    rating: '5.0',
    price: 200,
    unit: 'للساعة',
    desc: 'ملعب بادل بإضاءة ليلية ومضارب متاحة — يفضّل الحجز قبل يوم.',
    slots: [
      ['الخميس', '7 م – 8 م', 'متاح'],
      ['الجمعة', '9 ص – 10 ص', 'متاح'],
      ['الجمعة', '8 م – 9 م', 'محجوز'],
      ['السبت', '6 م – 7 م', 'متاح'],
    ],
  },
  {
    kind: 'kids',
    title: 'بيت قفزات وألعاب حفلات',
    owner: 'منيرة الدوسري — فيلا 152',
    rating: '4.8',
    price: 250,
    unit: 'لليوم',
    desc: 'نطاطية كبيرة + طاولة ألعاب لأعياد ميلاد الأطفال، تشمل التوصيل داخل الكمبوند والتركيب.',
    slots: [
      ['الجمعة', 'كل اليوم', 'متاح'],
      ['السبت', 'كل اليوم', 'محجوز'],
      ['الجمعة القادمة', 'كل اليوم', 'متاح'],
    ],
  },
  {
    kind: 'park',
    title: 'موقف سيارة إضافي',
    owner: 'ماجد البقمي — فيلا 45',
    rating: '4.6',
    price: 400,
    unit: 'شهريًا',
    desc: 'موقف مظلل بجوار البوابة الشرقية — متاح بالشهر لجار عنده سيارة ثانية.',
    slots: [
      ['من أول أغسطس', 'شهر كامل', 'متاح'],
      ['من أول سبتمبر', 'شهر كامل', 'متاح'],
    ],
  },
  {
    kind: 'skill',
    title: 'دروس رياضيات للثانوية',
    owner: 'د. لطيفة الزهراني — فيلا 12',
    rating: '5.0',
    price: 180,
    unit: 'للحصة',
    desc: 'مدرّسة رياضيات بخبرة 12 سنة — حصص فردية أو مجموعة صغيرة في قاعة المجتمع.',
    slots: [
      ['السبت', '5 م – 6:30 م', 'متاح'],
      ['الاثنين', '5 م – 6:30 م', 'متاح'],
      ['الأربعاء', '5 م – 6:30 م', 'محجوز'],
    ],
  },
];

export const shareDayDefs = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
export const shareHourDefs = ['9 ص – 1 م', '1 م – 4 م', '4 م – 8 م', '8 م – 12 م'];
export const shareUnitDefs = ['للساعة', 'لليوم', 'مجانًا'];

export const shareIcon = (kind: ShareKind) => shareIcons[kind];

/* ===================== R68b / R69d — the owner's side ===================== */

/**
 * Booking requests arriving on your own listing. Accepting one auto-declines
 * every other request on the same slot — those flip to `conflict`, which is
 * why the state is a four-way enum rather than a boolean.
 */
export const shareReqDefs: ShareReq[] = [
  { name: 'فهد العتيبي — فيلا 152', slot: 'السبت 4–7 م', av: avatarBg.karim },
  { name: 'منى الشريف — فيلا 88', slot: 'السبت 4–7 م', av: avatarBg.mona },
  { name: 'سلطان الحربي — فيلا 96', slot: 'الاثنين 6–8 م', av: avatarBg.karim },
  { name: 'ليلى منصور — فيلا 12', slot: 'الثلاثاء 9–11 ص', av: avatarBg.hala },
  { name: 'كريم عادل — فيلا 152', slot: 'الخميس 5–9 م', av: avatarBg.tarek },
];

/** How many requests the listing card shows before «عرض كل الطلبات». */
export const SHARE_REQ_PREVIEW = 3;

/* ======================= R69c / R69f — the shares log ======================= */

export const shareHistDefs: ShareHistEntry[] = [
  {
    title: 'شنطة عدد كاملة', icon: 'wrench', uses: 3, total: '120',
    borrowers: [
      { name: 'فهد العتيبي — فيلا 152', when: 'السبت 12 يوليو — 4 ساعات', paid: '40 ر.س', stars: 5, note: 'جار ملتزم، أعادها في موعدها' },
      { name: 'منى الشريف — فيلا 88', when: 'الأربعاء 9 يوليو — يوم كامل', paid: '60 ر.س', stars: 4, note: 'تأخرت ساعة عن موعد الإعادة' },
      { name: 'سلطان الحربي — فيلا 96', when: 'الأحد 6 يوليو — ساعتان', paid: '20 ر.س', stars: 5, note: 'تجربة ممتازة' },
    ],
  },
  {
    title: 'قاعة استقبال بالفيلا', icon: 'home', uses: 2, total: '300',
    borrowers: [
      { name: 'ليلى منصور — فيلا 12', when: 'الجمعة 4 يوليو — 3 ساعات', paid: '150 ر.س', stars: 5, note: 'سلّمت القاعة بحالتها تمامًا' },
      { name: 'كريم عادل — فيلا 152', when: 'الخميس 26 يونيو — مساءً', paid: '150 ر.س', stars: 4, note: 'التزم بالموعد' },
    ],
  },
  {
    title: 'دراجة أطفال', icon: 'kid', uses: 1, total: '0',
    borrowers: [
      { name: 'منى الشريف — فيلا 88', when: 'السبت 21 يونيو — يومان', paid: 'مجانًا', stars: 5, note: 'شكرًا على اللفتة الطيبة 🌹' },
    ],
  },
];

export const shareHistIcon: Record<ShareHistEntry['icon'], string> = {
  wrench: 'M20.5 6.8a4.5 4.5 0 0 1-6 4.2l-7 7a2.1 2.1 0 0 1-3-3l7-7a4.5 4.5 0 0 1 5.7-5.6L14.6 5l2.4 2.4 2.6-2.6c.6.6.9 1.2.9 2z',
  home: 'M3 21h18M5 21V9l7-5 7 5v12M9 14h6M9 17h6',
  kid: 'M5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM5 14.5L8 7h5l4 7.5M13 7l-2-2h-2',
};

/* ==================== R69b — the booking lifecycle ==================== */

/**
 * The borrower's three-stage flow. Its wording depends on what was booked:
 * you *collect and return* gear, *arrive at and hand back* a place, and
 * *start and finish* a session. The prototype folds the six listing kinds
 * into these three voices.
 */
export type BookingVoice = 'gear' | 'place' | 'session';

export const bookingVoiceOf = (kind: ShareKind): BookingVoice =>
  kind === 'space' || kind === 'sport' || kind === 'park'
    ? 'place'
    : kind === 'skill'
      ? 'session'
      : 'gear';

export type BookingWording = {
  /** Status pill per stage. */
  st: [string, string, string];
  /** The button that advances out of stage 0, then stage 1. */
  b0: string;
  b1: string;
  open: string;
  arrange: string;
  rate: string;
  /** Toasts on reaching stage 1 and stage 2. */
  t1: string;
  t2: string;
};

export const bookingWording: Record<BookingVoice, BookingWording> = {
  gear: {
    st: ['محجوز — بانتظار الاستلام', 'الأدوات معك — الطلب مفتوح', 'أُعيدت الأدوات — اكتمل الطلب'],
    b0: 'استلمت الأدوات',
    b1: 'أنهيت وأعدت الأدوات',
    open: 'يبقى الطلب مفتوحًا حتى تؤكد إعادة الأدوات لصاحبها',
    arrange: 'رتّب معه موعد ومكان الاستلام',
    rate: '«جار ملتزم — استلم وأعاد الأدوات في موعدها وبحالتها»',
    t1: 'استلمت الأدوات — الطلب يبقى مفتوحًا حتى تعيدها',
    t2: 'أُغلق الطلب — أُعيدت الأدوات وقيّم المالك تجربته معك',
  },
  place: {
    st: ['محجوز — بانتظار موعدك', 'الحجز جارٍ — الطلب مفتوح', 'انتهى الحجز — اكتمل الطلب'],
    b0: 'وصلت وبدأت الاستخدام',
    b1: 'انتهيت وسلّمت المكان',
    open: 'يبقى الطلب مفتوحًا حتى تؤكد انتهاء الاستخدام وتسليم المكان',
    arrange: 'رتّب معه الدخول واستلام المكان',
    rate: '«جار ملتزم — التزم بالموعد وسلّم المكان بحالته»',
    t1: 'بدأ استخدامك — الطلب يبقى مفتوحًا حتى تسلّم المكان',
    t2: 'أُغلق الطلب — سُلّم المكان وقيّم المالك تجربته معك',
  },
  session: {
    st: ['محجوز — بانتظار الجلسة', 'الجلسة جارية — الطلب مفتوح', 'انتهت الجلسة — اكتمل الطلب'],
    b0: 'بدأت الجلسة',
    b1: 'انتهت الجلسة',
    open: 'يبقى الطلب مفتوحًا حتى تنتهي الجلسة',
    arrange: 'رتّب معه موعد ومكان الجلسة',
    rate: '«جار ملتزم — حضر في الموعد وكانت التجربة ممتازة»',
    t1: 'بدأت الجلسة — الطلب يبقى مفتوحًا حتى تنتهي',
    t2: 'أُغلق الطلب — انتهت الجلسة وقيّم المالك تجربته معك',
  },
};

/** Status-pill chrome per booking stage, in order. */
export const bookingStageChrome = [
  { bg: 'rgba(107,114,128,0.13)', c: '#6B7280' },
  { bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  { bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
];
