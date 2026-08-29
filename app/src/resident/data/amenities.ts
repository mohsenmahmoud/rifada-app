import { icons } from './icons';

/** R8 — bookable amenities, each with today's open slots. */
export const amenDefs = [
  {
    name: 'الجيم',
    sub: 'مبنى النادي — الدور الأول',
    icon: 'M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8',
    slots: ['6 مساءً', '7 مساءً', '9 مساءً'],
    /** The gym also offers a personal trainer via instant matching. */
    hasTrainer: true,
  },
  {
    name: 'المسبح',
    sub: 'النادي الاجتماعي',
    icon: icons.amen,
    slots: ['10 صباحًا', '4 مساءً', '6 مساءً'],
    hasTrainer: false,
  },
  {
    name: 'النادي الاجتماعي',
    sub: 'القاعة الكبرى',
    icon: 'M3 20h18M5 20V8l7-5 7 5v12M9 20v-6h6v6',
    slots: ['5 مساءً', '8 مساءً'],
    hasTrainer: false,
  },
  {
    name: 'منطقة الأطفال',
    sub: 'الحديقة المركزية',
    icon: 'M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 5v7M12 12l-4 8M12 12l4 8M6 8l6 1 6-1',
    slots: ['9 صباحًا', '5 مساءً', '6 مساءً'],
    hasTrainer: false,
  },
];

/** R5 — ticket categories. */
export const catDefs = [
  { label: 'سباكة', icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z' },
  { label: 'كهرباء', icon: 'M13 2L5 13h5l-1 9 8-11h-5z' },
  { label: 'تكييف', icon: 'M12 3v18M5 6.5l14 11M19 6.5l-14 11' },
  { label: 'نجارة', icon: 'M14.5 4.5l5 5-2 2-5-5zM12.5 6.5L4 15l-1 4 4-1 8.5-8.5' },
  { label: 'مناطق مشتركة', icon: 'M12 3l5 7.5h-3.5L18 17H6l4.5-6.5H7zM12 17v4' },
  { label: 'أخرى', icon: 'M5 12h.01M12 12h.01M19 12h.01' },
];

/** R7 — the four-step ticket timeline. */
export const ticketSteps = [
  { label: 'تم استلام البلاغ', time: '9:14 ص' },
  { label: 'تم تعيين الفني — محمد الغامدي', time: '11:30 ص' },
  { label: 'جاري التنفيذ', sub: 'الفني في الطريق إليك' },
  { label: 'تم الحل', sub: 'بانتظار تقييمك' },
];

export const stepsDoneFor = { received: 1, inprogress: 3, resolved: 4 } as const;
