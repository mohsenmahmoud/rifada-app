import type { GroupKind } from '../types';
import { avatarBg } from './seed';

/**
 * الفعاليات والمجتمع (R70–R74).
 *
 * The section's thesis, in the user's words: «الفعالية تجيب الناس مرة —
 * والمجموعة تخليهم يرجعوا كل أسبوع». Events are one-off and ticketed;
 * groups are standing communities run by residents themselves.
 */

export const evIcons = {
  social: 'M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 21v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3',
  sport: 'M6.5 6.5l11 11M4 9l5 5M15 4l5 5M2 12l4-4M18 18l4-4',
  kids: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 22v-6l-2-2 2-4h8l2 4-2 2v6',
  learn: 'M12 3L2 8l10 5 10-5zM6 10v6c0 1.5 2.7 3 6 3s6-1.5 6-3v-6',
  charity: 'M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z',
  market:
    'M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
} as const;

export type EventKind = keyof typeof evIcons;

export const evTagMeta: Record<EventKind, { label: string; bg: string; c: string }> = {
  social: { label: 'اجتماعية', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  sport: { label: 'رياضية', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  kids: { label: 'أطفال', bg: 'rgba(228,103,90,0.13)', c: '#B24439' },
  learn: { label: 'تعليمية', bg: 'rgba(31,59,87,0.08)', c: '#1F3B57' },
  charity: { label: 'خيرية', bg: 'rgba(61,42,92,0.12)', c: '#3D2A5C' },
  market: { label: 'بازار', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
};

export type EventDef = {
  kind: EventKind;
  day: string;
  month: string;
  time: string;
  title: string;
  place: string;
  host: string;
  seats: number;
  taken: number;
  price: number;
  desc: string;
};

export const eventDefs: EventDef[] = [
  {
    kind: 'social',
    day: '25',
    month: 'يوليو',
    time: 'الجمعة 7 م',
    title: 'مهرجان الصيف السنوي',
    place: 'النادي الاجتماعي',
    host: 'إدارة الكمبوند',
    seats: 300,
    taken: 214,
    price: 0,
    desc: 'أمسية عائلية بأكشاك طعام من مطاعم المنطقة، ألعاب أطفال، وحفل موسيقي مباشر. الدخول مجاني لكل سكان حدائق الأندلس.',
  },
  {
    kind: 'sport',
    day: '26',
    month: 'يوليو',
    time: 'السبت 6 ص',
    title: 'ماراثون الصباح — 5 كم',
    place: 'مسار الجري الرئيسي',
    host: 'نادي الجري — مجموعة سكان',
    seats: 80,
    taken: 63,
    price: 0,
    desc: 'جري جماعي حول الكمبوند مع نقاط مياه وميداليات للمشاركين. مناسب لكل المستويات، ومسار 2 كم للأطفال.',
  },
  {
    kind: 'kids',
    day: '30',
    month: 'يوليو',
    time: 'الأربعاء 5 م',
    title: 'ورشة رسم للأطفال (6–12 سنة)',
    place: 'قاعة الأنشطة',
    host: 'أ. سارة عبدالله — فيلا 61',
    seats: 20,
    taken: 18,
    price: 120,
    desc: 'ورشة رسم بالألوان المائية مع مدرّبة فنون، تشمل كل الخامات. عدد محدود لضمان متابعة كل طفل.',
  },
  {
    kind: 'market',
    day: '2',
    month: 'أغسطس',
    time: 'السبت 4 م',
    title: 'بازار الجيران — بيع وتبادل',
    place: 'الساحة المركزية',
    host: 'لجنة السكان',
    seats: 40,
    taken: 40,
    price: 200,
    desc: 'احجز طاولتك لعرض منتجاتك المنزلية أو أغراض لم تعد تحتاجها. الرسوم لتغطية التنظيم فقط.',
  },
  {
    kind: 'charity',
    day: '8',
    month: 'أغسطس',
    time: 'الجمعة 11 ص',
    title: 'يوم تبرّع بالدم مع بنك الدم',
    place: 'المنطقة الطبية',
    host: 'إدارة الكمبوند',
    seats: 120,
    taken: 41,
    price: 0,
    desc: 'حملة تبرّع بالدم بالتعاون مع بنك الدم المركزي — فحص مجاني للهيموجلوبين والضغط لكل متبرع.',
  },
];

export const evFilterDefs = [
  { key: 'all', label: 'الكل' },
  { key: 'social', label: 'اجتماعية' },
  { key: 'sport', label: 'رياضية' },
  { key: 'kids', label: 'أطفال' },
  { key: 'learn', label: 'تعليمية' },
  { key: 'charity', label: 'خيرية' },
  { key: 'market', label: 'بازار' },
  { key: 'free', label: 'مجانية' },
];

export const clubDefs = [
  { kind: 'sport' as GroupKind, name: 'نادي الجري الصباحي', members: 46, meets: 'كل سبت 6 ص' },
  { kind: 'book' as GroupKind, name: 'نادي كتاب الأندلس', members: 23, meets: 'كل خميس 7 م' },
  { kind: 'kids' as GroupKind, name: 'مجموعة أمهات الحضانة', members: 61, meets: 'لقاء شهري' },
  { kind: 'volunteer' as GroupKind, name: 'مبادرة تشجير الكمبوند', members: 34, meets: 'كل جمعة 8 ص' },
];

/** Group kind → the icon set above. */
export const groupIcon: Record<GroupKind, string> = {
  sport: evIcons.sport,
  book: evIcons.learn,
  kids: evIcons.kids,
  volunteer: evIcons.charity,
};

export const groupAbouts = [
  'مجموعة سكان تجري معًا كل سبت صباحًا حول مسار الكمبوند — كل المستويات مرحّب بها، ومسار أقصر للمبتدئين.',
  'نقرأ كتابًا كل شهر ونناقشه في لقاء مسائي بقاعة الأنشطة — الاختيار بالتصويت بين الأعضاء.',
  'مساحة لأمهات الحضانة لتنظيم مجموعات توصيل الأطفال وتبادل الخبرات وترتيب لقاءات لعب.',
  'مبادرة تطوعية لزراعة ورعاية أشجار الشوارع الداخلية بالتعاون مع إدارة الكمبوند.',
];

export const groupNextDefs = [
  { when: 'السبت 6 ص', place: 'مسار الجري الرئيسي — بوابة 2' },
  { when: 'الخميس 7 م', place: 'قاعة الأنشطة — الدور الأول' },
  { when: 'الأحد 11 ص', place: 'كافيه النادي الاجتماعي' },
  { when: 'الجمعة 8 ص', place: 'الشارع الداخلي — القطاع ب' },
];

export const groupPostDefs: { who: string; bg: string; when: string; text: string }[][] = [
  [
    {
      who: 'فهد الشمري',
      bg: avatarBg.karim,
      when: 'أمس',
      text: 'المسار مبلّط بالكامل بعد الصيانة — نبدأ 6 الصبح بالضبط من بوابة 2.',
    },
    {
      who: 'نورة القحطاني',
      bg: avatarBg.mona,
      when: 'منذ يومين',
      text: 'أحد يقدر يجيب مياه زيادة للمجموعة؟ أنا أقدر أجيب كرتونة.',
    },
  ],
  [
    {
      who: 'منيرة الدوسري',
      bg: avatarBg.mona,
      when: 'اليوم',
      text: 'كتاب هذا الشهر انختار بالتصويت — نبدأ النقاش من الفصل الأول.',
    },
  ],
  [
    {
      who: 'سارة عبدالله',
      bg: avatarBg.hala,
      when: 'اليوم',
      text: 'محتاجين نرتب مشوار توصيل لحضانة الفصل الجديد — منهو مهتم؟',
    },
  ],
  [
    {
      who: 'سلطان الحربي',
      bg: avatarBg.tarek,
      when: 'أمس',
      text: 'وصلتنا 12 شتلة جديدة من الإدارة — بنزرعها الجمعة الجاية إن شاء الله.',
    },
  ],
];

export const pastEventDefs = [
  { kind: 'social' as EventKind, title: 'إفطار الجيران الجماعي', when: '18 يوليو', photos: 42 },
  { kind: 'sport' as EventKind, title: 'دورة كرة القدم الخماسية', when: '5 يوليو', photos: 27 },
];

export const attendeeFaces = [
  { i: 'م', bg: avatarBg.tarek },
  { i: 'ه', bg: avatarBg.mona },
  { i: 'ك', bg: avatarBg.karim },
  { i: 'ط', bg: avatarBg.hala },
];

export const evKindDefs: { key: EventKind; label: string }[] = [
  { key: 'social', label: 'اجتماعية' },
  { key: 'sport', label: 'رياضية' },
  { key: 'kids', label: 'أطفال' },
  { key: 'learn', label: 'تعليمية' },
  { key: 'charity', label: 'خيرية' },
  { key: 'market', label: 'بازار' },
];

export const gcKindDefs: { key: GroupKind; label: string }[] = [
  { key: 'sport', label: 'رياضة' },
  { key: 'book', label: 'تعليم وثقافة' },
  { key: 'kids', label: 'أطفال وأمهات' },
  { key: 'volunteer', label: 'تطوّع' },
];

export const evPlaceDefs = ['النادي الاجتماعي', 'الساحة المركزية', 'قاعة الأنشطة', 'مسار الجري'];
export const gcFreqDefs = ['أسبوعي', 'كل أسبوعين', 'شهري'];
export const gcPrivacyDefs = ['كل السكان', 'بموافقة المنظّم'];
