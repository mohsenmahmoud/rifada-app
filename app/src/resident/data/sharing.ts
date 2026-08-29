import type { ShareKind, ShareListing } from '../types';
import { shareIcons } from './icons';

/**
 * رفادتنا (R67–R69) — neighbour-to-neighbour sharing, booked by time slot.
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
