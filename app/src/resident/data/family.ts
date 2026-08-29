import type { PermKey } from '../types';
import { avatarBg } from './seed';

/** R43 — members linked to the unit. */
export const famDefs = [
  { name: 'سارة عبدالله', rel: 'الزوجة', avBg: avatarBg.mona, full: true },
  { name: 'يوسف عبدالله', rel: 'الابن — 16 سنة', avBg: avatarBg.karim, full: false },
  { name: 'أم عبدالله', rel: 'الوالدة', avBg: avatarBg.hala, full: false },
];

/** The six permissions the owner grants. Order is fixed across all screens. */
export const permDefs: { key: PermKey; label: string; sub: string }[] = [
  { key: 'pay', label: 'الدفع ودفع الفواتير', sub: 'سداد المستحقات وعرض الأرصدة' },
  { key: 'maint', label: 'إنشاء طلبات صيانة', sub: 'شامل طلب الخدمة الفورية' },
  { key: 'amen', label: 'حجز المرافق', sub: 'الجيم والمسبح والنادي' },
  { key: 'realestate', label: 'الوصول لسوق العقارات', sub: 'تصفح إعلانات البيع والإيجار' },
  { key: 'findocs', label: 'عرض الوثائق المالية', sub: 'العقود والإيصالات' },
  {
    key: 'food',
    label: 'الطلب من المتجر',
    sub: 'مطاعم، صيدليات، بقالة وغيرها — الدفع من بطاقة الوحدة',
  },
];

/** Shorter labels used when the owner creates a brand-new account. */
export const newAccountPermDefs: { key: PermKey; label: string }[] = [
  { key: 'pay', label: 'الدفع من بطاقة الوحدة' },
  { key: 'maint', label: 'طلب الخدمات وتقديم البلاغات' },
  { key: 'amen', label: 'حجز المرافق' },
  { key: 'food', label: 'الطلب من المتجر' },
  { key: 'realestate', label: 'الوصول لسوق العقارات' },
  { key: 'findocs', label: 'عرض الوثائق المالية' },
];

export const relationDefs = ['الزوجة', 'الزوج', 'ابن / ابنة', 'الوالد / الوالدة', 'مقيم آخر'];

/** Yousef is the live-editable member — the rest are illustrative. */
export const EDITABLE_MEMBER_IDX = 1;
