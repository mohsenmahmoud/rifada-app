import type { ProviderScreen } from './types';

/** The provider app's screen gallery, P1–P11. */
export const providerGallery: {
  name: string;
  screens: { id: string; key: ProviderScreen; title: string }[];
}[] = [
  {
    name: 'الفني — الدخول والمهام',
    screens: [
      { id: 'P1', key: 'login', title: 'تسجيل الدخول' },
      { id: 'P2', key: 'home', title: 'الرئيسية ومفتاح التوفر' },
      { id: 'P4', key: 'job', title: 'تنفيذ المهمة والتحويل' },
      { id: 'P8', key: 'disputeP', title: 'الإبلاغ عن مشكلة' },
    ],
  },
  {
    name: 'المحفظة ودورة السحب',
    screens: [{ id: 'P5', key: 'wallet', title: 'المحفظة والأرباح والسحب' }],
  },
  {
    name: 'المتجر — مطعم أو صيدلية',
    screens: [
      { id: 'P9', key: 'storeHome', title: 'المتجر وإدارة المنيو' },
      { id: 'P10', key: 'storeOrders', title: 'طابور الطلبات ودورة الخروج' },
      { id: 'P11', key: 'storePayout', title: 'صافي الأرباح بعد العمولة' },
    ],
  },
];

export const providerScreenCount = providerGallery.reduce((a, g) => a + g.screens.length, 0);
