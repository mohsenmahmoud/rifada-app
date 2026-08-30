import type { SectionKey } from './data';

/**
 * The console's screen gallery, A1–A39. The prototype numbers its screens
 * across three build phases, so the ids are not contiguous — kept as-is so a
 * screen keeps the id the design chat refers to.
 *
 * `login` is not a `SectionKey` (it is the pre-shell state), so it carries a
 * null key and renders the logged-out console.
 */
export type AdminGalleryKey = SectionKey | 'login';

export const adminGallery: {
  name: string;
  screens: { id: string; key: AdminGalleryKey; title: string }[];
}[] = [
  {
    name: 'الدخول ومركز القيادة',
    screens: [
      { id: 'A1', key: 'login', title: 'تسجيل دخول الإدارة' },
      { id: 'A2', key: 'home', title: 'مركز القيادة — القرارات والتنبيهات' },
      { id: 'A36', key: 'unit360', title: 'ملف الوحدة الشامل 360' },
    ],
  },
  {
    name: 'التشغيل اليومي',
    screens: [
      { id: 'A3', key: 'tickets', title: 'طابور التذاكر والإجراءات الجماعية' },
      { id: 'A4', key: 'ticketDetail', title: 'تفاصيل التذكرة والإسناد' },
      { id: 'A5', key: 'residents', title: 'دليل السكان والعائلات' },
      { id: 'A6', key: 'broadcast', title: 'بث الإعلانات' },
      { id: 'A8', key: 'amen', title: 'إدارة المرافق والسعة' },
      { id: 'A7', key: 'vendors', title: 'الموردون ومقدمو الخدمة' },
      { id: 'A20', key: 'onboard', title: 'تعيين مقدم خدمة جديد' },
    ],
  },
  {
    name: 'المالية والأداء',
    screens: [
      { id: 'A9', key: 'collection', title: 'لوحة التحصيل والمتأخرات' },
      { id: 'A10', key: 'sla', title: 'متابعة اتفاقيات مستوى الخدمة' },
      { id: 'A14', key: 'sentiment', title: 'مشاعر السكان' },
      { id: 'A15', key: 'scoring', title: 'إدارة نقاط الثقة' },
    ],
  },
  {
    name: 'المجتمع',
    screens: [
      { id: 'A16', key: 'inbox', title: 'رسائل السكان والردود الجاهزة' },
      { id: 'A11', key: 'lostmod', title: 'مراجعة المفقودات' },
      { id: 'A13', key: 'gatelog', title: 'سجل الزوار والبوابات' },
    ],
  },
  {
    name: 'السوق العقاري والمتاجر',
    screens: [
      { id: 'A31', key: 'billAgg', title: 'مزودو الفواتير' },
      { id: 'A28', key: 'reMod', title: 'مراجعة إعلانات العقارات' },
      { id: 'A29', key: 'storesDir', title: 'متاجر «المتجر» الموحد' },
    ],
  },
  {
    name: 'سوق مقدمي الخدمة',
    screens: [
      { id: 'A27', key: 'sourcing', title: 'إعدادات مصادر الخدمة' },
      { id: 'A25', key: 'revenue', title: 'العمولة والإيرادات' },
      { id: 'A24', key: 'verify', title: 'اعتماد مقدمي الخدمة' },
      { id: 'A26', key: 'disputes', title: 'مركز فض النزاعات' },
    ],
  },
  {
    name: 'الإنتاجية والحكم',
    screens: [
      { id: 'A37', key: 'automation', title: 'قواعد الأتمتة' },
      { id: 'A38', key: 'team', title: 'الفريق والصلاحيات وسجل التدقيق' },
      { id: 'A39', key: 'reports', title: 'التقارير والتصدير' },
    ],
  },
  {
    name: 'التوسع والبيانات',
    screens: [
      { id: 'A17', key: 'portfolio', title: 'المحفظة العقارية' },
      { id: 'A18', key: 'predict', title: 'الصيانة التنبؤية' },
      { id: 'A19', key: 'iot', title: 'العدادات الذكية' },
    ],
  },
];

export const adminScreenCount = adminGallery.reduce((a, g) => a + g.screens.length, 0);
