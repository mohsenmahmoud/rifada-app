/**
 * Payment content. Amounts were re-calibrated to realistic Saudi figures during
 * the design chat — a villa in a compound is 6,500 ر.س rent, not 3,200.
 */

export const fmt = (n: number) => n.toLocaleString('en-US');

export const rentItems = [
  { label: 'الإيجار الشهري — يوليو', amount: fmt(6500) },
  { label: 'رسوم الصيانة الدورية', amount: fmt(650) },
  { label: 'اشتراك النادي', amount: fmt(250) },
];

export const instItems = [
  { label: 'القسط نصف السنوي — سنة 3 من 8', amount: fmt(145000) },
  { label: 'رسوم الصيانة الدورية', amount: fmt(2750) },
  { label: 'اشتراك النادي', amount: fmt(450) },
];

export const RENT_TOTAL = 7400;
export const INST_TOTAL = 148200;

export const statementTotal = (isRent: boolean) => (isRent ? RENT_TOTAL : INST_TOTAL);
export const statementItems = (isRent: boolean) => (isRent ? rentItems : instItems);

export const statementLabel = (isRent: boolean) =>
  isRent ? 'الرصيد المستحق حتى 25 يوليو 2026' : 'القسط القادم — يُستحق 1 سبتمبر 2026';

/** Saudi rails only — مدى / STC Pay / Apple Pay. */
export const methodDefs = [
  { key: 'card', name: 'بطاقة بنكية •••• 4821', sub: 'مدى — البنك الأهلي السعودي' },
  { key: 'wallet', name: 'STC Pay', sub: '050 123 4567' },
  { key: 'applepay', name: 'Apple Pay', sub: 'ادفع بلمسة واحدة' },
];

/** Prior receipts (R16). The current period's receipt is prepended once paid. */
export const pastReceipts = [
  { label: 'إيجار يونيو + رسوم الصيانة', date: '25 يونيو 2026', no: '88104', amount: '7,400' },
  { label: 'إيجار مايو + رسوم الصيانة', date: '25 مايو 2026', no: '87796', amount: '7,400' },
  { label: 'اشتراك النادي — ربع سنوي', date: '1 مايو 2026', no: '87211', amount: '750' },
  { label: 'إيجار أبريل + رسوم الصيانة', date: '25 أبريل 2026', no: '87018', amount: '7,400' },
];

/** R39 — the monthly auto-debit cycle, as four simulated stages. */
export const autopaySteps = [
  { label: 'تذكير قبل الخصم', sub: 'يوم 22 — إشعار بالمبلغ وتاريخ الخصم' },
  { label: 'الخصم التلقائي', sub: 'يوم 25 — من مدى •••• 4821' },
  { label: 'إيصال فوري', sub: 'يصلك الإيصال ويُحفظ في سجل السداد' },
  { label: 'تحديث الرصيد', sub: 'بطاقة الرئيسية تتحول إلى «تم السداد»' },
];
