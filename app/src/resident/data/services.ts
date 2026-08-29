import type { PermKey, ScreenKey } from '../types';
import { icons } from './icons';

export type ServiceDef = {
  label: string;
  sub: string;
  icon: string;
  dest: ScreenKey;
  perm: PermKey | null;
};

/**
 * The home grid, in the exact order the user dictated late in the design chat:
 * «الخدمات / المتجر / المفقودات / سياراتك / رفادتنا / فواتيرك / الفعاليات /
 *  السداد / سوق العقارات / المرافق / أرقام مهمة / روابط سريعة /
 *  الحيوانات الأليفة / الوثائق» — with المكافآت appended after it moved off
 * the bottom bar to make room for «اسأل جيرانك».
 *
 * `perm` gates the tile for family sub-accounts. A denied tile is greyed with a
 * lock and still shown — never hidden. That was an explicit product requirement.
 */
export const serviceDefs: ServiceDef[] = [
  { label: 'الخدمات', sub: 'اطلب فني أو ارفع بلاغ للإدارة', icon: icons.maint, dest: 'svcHub', perm: 'maint' },
  { label: 'المتجر', sub: 'مطاعم وصيدليات وبقالة بتوصيل', icon: icons.cart, dest: 'food', perm: 'food' },
  { label: 'المفقودات', sub: 'أبلغ عن مفقود أو موجود', icon: icons.lost, dest: 'lost', perm: null },
  { label: 'سياراتك', sub: 'التصاريح وتصاريح الزوار', icon: icons.cars, dest: 'gate', perm: null },
  { label: 'رفادتنا', sub: 'شارك واستأجر بين الجيران', icon: icons.neighbors, dest: 'share', perm: null },
  { label: 'فواتيرك', sub: 'كهرباء ومياه وإنترنت في مكان واحد', icon: icons.bill, dest: 'bills', perm: 'pay' },
  { label: 'الفعاليات', sub: 'فعاليات ومجموعات الحي', icon: icons.events, dest: 'feed', perm: null },
  { label: 'السداد', sub: 'المستحقات والدفع التلقائي', icon: icons.pay, dest: 'pay', perm: 'pay' },
  { label: 'سوق العقارات', sub: 'إعلانات البيع والإيجار في الحي', icon: icons.realestate, dest: 'reBrowse', perm: 'realestate' },
  { label: 'المرافق', sub: 'احجز الجيم والمسبح والنادي', icon: icons.amen, dest: 'amen', perm: 'amen' },
  { label: 'أرقام مهمة', sub: 'الأمن والصيانة والطوارئ', icon: icons.contacts, dest: 'contacts', perm: null },
  { label: 'روابط سريعة', sub: 'خدمات ومواقع مهمة قريبة', icon: icons.links, dest: 'links', perm: null },
  { label: 'الحيوانات الأليفة', sub: 'التسجيل وسجل التطعيمات', icon: icons.pets, dest: 'pets', perm: null },
  { label: 'الوثائق', sub: 'عقد الوحدة والإيصالات', icon: icons.docs, dest: 'docs', perm: 'findocs' },
  { label: 'المكافآت', sub: 'اجمع نقاطك واستبدلها', icon: icons.gem, dest: 'rewards', perm: null },
];

/** Maintenance ticket status chrome. */
export const ticketMeta = {
  received: { label: 'تم الاستلام', bg: 'rgba(107,114,128,0.12)', c: '#6B7280' },
  inprogress: { label: 'جاري التنفيذ', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
  resolved: { label: 'تم الحل', bg: 'rgba(63,166,107,0.14)', c: '#2E7D51' },
} as const;
