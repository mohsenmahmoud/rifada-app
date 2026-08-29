import type { BillKey, BillStatus } from '../types';
import { billIcons } from './icons';

/**
 * فواتيرك — external utility bills. Deliberately separate from السداد (R10),
 * which handles unit fees and installments. Providers are the real Saudi ones.
 */
export const billCatDefs: Record<
  BillKey,
  {
    cat: string;
    provider: string;
    account: string;
    amount: number;
    lines: { name: string; val: string }[];
    icon: string;
  }
> = {
  elec: {
    cat: 'كهرباء',
    provider: 'الشركة السعودية للكهرباء',
    account: '0442 1187 3390',
    amount: 486,
    lines: [
      { name: 'استهلاك 312 كيلووات', val: '412 ر.س' },
      { name: 'رسوم نظافة وثابتة', val: '74 ر.س' },
    ],
    icon: billIcons.elec,
  },
  water: {
    cat: 'مياه',
    provider: 'شركة المياه الوطنية',
    account: '77 0921 445',
    amount: 138,
    lines: [
      { name: 'استهلاك 21 م³', val: '118 ر.س' },
      { name: 'رسوم صرف صحي', val: '20 ر.س' },
    ],
    icon: billIcons.water,
  },
  inet: {
    cat: 'إنترنت واتصالات',
    provider: 'STC — إنترنت منزلي',
    account: '02 3345 8812',
    amount: 399,
    lines: [
      { name: 'باقة 200 ميجا — يوليو', val: '363 ر.س' },
      { name: 'ضريبة قيمة مضافة', val: '36 ر.س' },
    ],
    icon: billIcons.inet,
  },
  gas: {
    cat: 'غاز',
    provider: 'غاز المدن',
    account: '—',
    amount: 95,
    lines: [{ name: 'استهلاك شهري تقديري', val: '95 ر.س' }],
    icon: billIcons.gas,
  },
  other: {
    cat: 'أخرى',
    provider: '—',
    account: '—',
    amount: 0,
    lines: [],
    icon: billIcons.other,
  },
};

export const billOrder: BillKey[] = ['elec', 'gas', 'water', 'inet', 'other'];

export const billSubs: Record<BillKey, string> = {
  elec: 'فاتورة شهر يوليو — تستحق 28 يوليو',
  gas: 'اربط عداد الغاز لعرض الفاتورة',
  water: 'فاتورة يوليو — سُددت 12 يوليو',
  inet: 'استحقت 15 يوليو',
  other: 'اشتراكات ومدفوعات أخرى',
};

export const billStMeta: Record<BillStatus, { label: string; bg: string; c: string }> = {
  due: { label: 'مستحقة', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  paid: { label: 'مدفوعة ✓', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  overdue: { label: 'متأخرة', bg: 'rgba(228,103,90,0.13)', c: '#B24439' },
};

/** Linking a bill offers the real providers per category. */
export const linkProviderLists: Record<BillKey, string[]> = {
  elec: ['الشركة السعودية للكهرباء', 'توزيع الرياض'],
  gas: ['غاز المدن', 'موزّع أسطوانات معتمد'],
  water: ['شركة المياه الوطنية', 'المياه الوطنية — الرياض'],
  inet: ['STC', 'Mobily', 'Zain', 'Salam'],
  other: ['اشتراك نادي', 'تأمين سيارة', 'أخرى'],
};

/** R54 — settled bills. */
export const billHistoryRows: { key: BillKey; title: string; date: string; amount: string }[] = [
  { key: 'elec', title: 'كهرباء — يونيو', date: '28 يونيو 2026', amount: '512' },
  { key: 'water', title: 'مياه — يوليو', date: '12 يوليو 2026', amount: '138' },
  { key: 'inet', title: 'إنترنت STC — يونيو', date: '15 يونيو 2026', amount: '399' },
  { key: 'elec', title: 'كهرباء — مايو', date: '27 مايو 2026', amount: '445' },
  { key: 'water', title: 'مياه — يونيو', date: '11 يونيو 2026', amount: '129' },
];

export const billHistoryFilters: { key: string; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'elec', label: 'كهرباء' },
  { key: 'water', label: 'مياه' },
  { key: 'inet', label: 'إنترنت' },
  { key: 'gas', label: 'غاز' },
];

/** Rifada's flat service fee per external bill. */
export const BILL_SERVICE_FEE = 3;
export const autopayCaps = [300, 500, 800, 1200];
