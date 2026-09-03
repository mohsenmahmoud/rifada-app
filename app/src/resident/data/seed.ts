import type { ChatMsg, ChecklistRoom, LostItem, Ticket } from '../types';

/**
 * Seed content, verbatim from the prototype's sample content bank.
 * All names, currency and phrasing are Gulf-market (Saudi) — the user had the
 * whole app converted from Egyptian to «خليجي أبيض» late in the design chat,
 * so do not reintroduce EGP amounts or Egyptian names here.
 */

export const initialTickets: Ticket[] = [
  {
    id: 1042,
    title: 'تسريب مياه في الحمام الرئيسي',
    cat: 'سباكة',
    status: 'inprogress',
    date: '8 يوليو',
    note: 'تم فحص التسريب وتحديد مصدره في وصلة الخلاط. سيتم استبدال الوصلة غدًا صباحًا بين 9 و11.',
  },
  {
    id: 1051,
    title: 'صيانة دورية للتكييف المركزي',
    cat: 'تكييف',
    status: 'received',
    date: 'اليوم',
    note: null,
  },
  {
    id: 1038,
    title: 'مصباح المدخل الخارجي لا يعمل',
    cat: 'كهرباء',
    status: 'resolved',
    date: '2 يوليو',
    note: 'تم استبدال المصباح والتأكد من سلامة التوصيلات.',
  },
];

export const initialMoveRooms: Record<'before' | 'receive', ChecklistRoom[]> = {
  before: [
    {
      name: 'إجراءات ما قبل الانتقال',
      items: [
        { label: 'توثيق العقد وتسليم صورة البطاقة', done: true },
        { label: 'نقل عداد الكهرباء باسمك', done: false },
        { label: 'تسجيل بيانات السيارة لبوابة الكمبوند', done: false },
      ],
    },
  ],
  receive: [
    {
      name: 'غرفة المعيشة',
      items: [
        { label: 'الجدران والدهانات', done: true },
        { label: 'الأرضيات', done: false },
        { label: 'النوافذ والزجاج', done: false },
      ],
    },
    {
      name: 'المطبخ',
      items: [
        { label: 'وحدات المطبخ', done: false },
        { label: 'السباكة والحوض', done: false },
        { label: 'الكهرباء والمخارج', done: false },
      ],
    },
    {
      name: 'الحمام الرئيسي',
      items: [
        { label: 'السيراميك والجدران', done: false },
        { label: 'خلاطات المياه', done: false },
        { label: 'الصرف', done: false },
      ],
    },
  ],
};

export const initialChat: ChatMsg[] = [
  {
    me: false,
    text: 'حياك الله أستاذ عبدالله، معك مكتب إدارة الكمبوند. كيف نقدر نخدمك؟',
    time: '9:00 ص',
  },
  { me: true, text: 'لو تكرمت، متى يوصل فني السباكة اليوم؟', time: '9:02 ص' },
  {
    me: false,
    text: 'الفني محمد الغامدي في الطريق إليك — الوصول المتوقع خلال 20 دقيقة.',
    time: '9:03 ص',
  },
];

export const initialLost: LostItem[] = [
  { title: 'مفتاح سيارة', loc: 'وُجد بجوار البوابة الرئيسية', date: 'أمس', kind: 'found' },
  { title: 'نظارة شمسية رياضية', loc: 'وُجدت في الجيم', date: 'منذ 3 أيام', kind: 'found' },
  { title: 'قطة رمادية صغيرة', loc: 'فُقدت قرب الحديقة المركزية', date: 'اليوم', kind: 'lost' },
  { title: 'ساعة أطفال زرقاء', loc: 'وُجدت في منطقة الأطفال', date: 'منذ أسبوع', kind: 'found' },
];

/** Avatar gradients, reused across community, family and chat. */
export const avatarBg = {
  mona: 'linear-gradient(160deg,#8A5A83,#5C3A57)',
  hala: 'linear-gradient(160deg,#8A6D3B,#5C4A2A)',
  karim: 'linear-gradient(160deg,#3E7A5E,#2A5741)',
  tarek: 'linear-gradient(160deg,#27496F,#1F3B57)',
  me: 'linear-gradient(160deg,#27496F,#1F3B57)',
} as const;

/** The unit label shown throughout — from the invite code. */
export const UNIT = 'فيلا 214 — حي الياسمين';
export const UNIT_SHORT = 'فيلا 214';
export const UNIT_NO = 'وحدة 214';
