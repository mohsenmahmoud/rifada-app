import type { ScreenKey } from './types';

/**
 * The screen gallery, grouped exactly as `Jiwar App.dc.html` groups it.
 *
 * Note: the handoff file we were pointed at (`Jiwar App standalone-src.dc.html`)
 * carried a stale copy of this list — it still advertised المنزل الذكي and
 * السوق الداخلي, both deleted during the design chat, and was missing
 * everything added afterwards (events, groups, اسأل جيرانك, رفادتنا).
 * This is the corrected, current set.
 */
export type GalleryGroup = {
  name: string;
  screens: { id: string; key: ScreenKey; title: string }[];
};

export const galleryGroups: GalleryGroup[] = [
  {
    name: 'الدخول والتفعيل',
    screens: [
      { id: 'R1', key: 'splash', title: 'شاشة البداية وكود الدعوة' },
      { id: 'R2', key: 'otp', title: 'التحقق برسالة OTP' },
      { id: 'R3', key: 'setup', title: 'إنشاء الحساب' },
    ],
  },
  {
    name: 'الرئيسية والتنقّل',
    screens: [
      { id: 'R4', key: 'home', title: 'الشاشة الرئيسية' },
      { id: 'R4b', key: 'services', title: 'خدماتك' },
      { id: 'R13', key: 'feed', title: 'الفعاليات والمجتمع' },
      { id: 'R71', key: 'eventDetail', title: 'تفاصيل الفعالية والحجز' },
      { id: 'R72', key: 'eventCreate', title: 'اقترح فعالية' },
      { id: 'R73', key: 'groupDetail', title: 'مجموعة اهتمام — اللوحة واللقاء' },
      { id: 'R74', key: 'groupCreate', title: 'أنشئ مجموعة' },
      { id: 'R75', key: 'community', title: 'اسأل جيرانك — المنشورات' },
      { id: 'R76', key: 'communityPost', title: 'المنشور والتعليقات' },
      { id: 'R77', key: 'communityNew', title: 'منشور جديد' },
      { id: 'R14', key: 'profile', title: 'الملف الشخصي' },
      { id: 'R22', key: 'notifs', title: 'الإشعارات' },
    ],
  },
  {
    name: 'الخدمات',
    screens: [
      { id: 'HUB', key: 'svcHub', title: 'الخدمات — اختيار المسار' },
      { id: 'R5', key: 'maintNew', title: 'بلاغ جديد' },
      { id: 'R6', key: 'maintList', title: 'بلاغاتي' },
      { id: 'R7', key: 'maintDetail', title: 'تفاصيل البلاغ والتقييم' },
      { id: 'R28', key: 'survey', title: 'استبيان الرضا' },
    ],
  },
  {
    name: 'المرافق',
    screens: [
      { id: 'R8', key: 'amen', title: 'حجز المرافق' },
      { id: 'R9', key: 'amenConfirm', title: 'تأكيد الحجز' },
      { id: 'R9b', key: 'amenDone', title: 'نجاح الحجز + QR' },
    ],
  },
  {
    name: 'السداد — إيجار وتقسيط',
    screens: [
      { id: 'R10', key: 'pay', title: 'كشف الحساب' },
      { id: 'R11', key: 'payNow', title: 'إتمام الدفع' },
      { id: 'R11b', key: 'paySuccess', title: 'نجاح الدفع والإيصال' },
      { id: 'R16', key: 'payHistory', title: 'سجل السداد' },
      { id: 'R39', key: 'autopay', title: 'الدفع التلقائي — دورة الخصم' },
      { id: 'R27', key: 'fin', title: 'الخدمات المالية' },
    ],
  },
  {
    name: 'الانتقال والاستلام',
    screens: [{ id: 'R12', key: 'movein', title: 'قائمة الاستلام والتسليم' }],
  },
  {
    name: 'المجتمع والخدمات',
    screens: [
      { id: 'R17', key: 'gate', title: 'سياراتك وتصاريح الزوار' },
      { id: 'R18', key: 'lost', title: 'المفقودات — تصفح' },
      { id: 'R19', key: 'lostReport', title: 'المفقودات — إبلاغ' },
      { id: 'R21', key: 'marketDetail', title: 'تفاصيل الخدمة والحجز' },
      { id: 'R23', key: 'chat', title: 'الرسائل مع الإدارة' },
    ],
  },
  {
    name: 'رفادتنا — مشاركة بين الجيران',
    screens: [
      { id: 'R67', key: 'share', title: 'رفادتنا — معروض للمشاركة' },
      { id: 'R68', key: 'shareCreate', title: 'اعرض شيئًا لديك' },
      { id: 'R69', key: 'shareDetail', title: 'تفاصيل المشاركة والحجز' },
    ],
  },
  {
    name: 'المكافآت والثقة',
    screens: [
      { id: 'R24', key: 'rewards', title: 'المكافآت' },
      { id: 'R26', key: 'score', title: 'نقاط الثقة' },
    ],
  },
  {
    name: 'سوق العقارات — بين الجيران',
    screens: [
      { id: 'R40', key: 'reBrowse', title: 'تصفح الإعلانات' },
      { id: 'R41', key: 'reCreate', title: 'أعلن عن وحدتك' },
      { id: 'R42', key: 'reDetail', title: 'تفاصيل الإعلان' },
      { id: 'R43', key: 'reMine', title: 'إعلاناتي' },
    ],
  },
  {
    name: 'حسابات العائلة',
    screens: [
      { id: 'R44', key: 'family', title: 'أفراد العائلة' },
      { id: 'R45', key: 'famPerms', title: 'صلاحيات الفرد' },
    ],
  },
  {
    name: 'فواتيرك — فواتير خارجية',
    screens: [
      { id: 'R51', key: 'bills', title: 'فواتيرك — الرئيسية' },
      { id: 'R52', key: 'billLink', title: 'ربط فاتورة جديدة' },
      { id: 'R53', key: 'billDetail', title: 'تفاصيل الفاتورة والدفع' },
      { id: 'R54', key: 'billHistory', title: 'سجل سداد الفواتير' },
      { id: 'R55', key: 'billAutopay', title: 'الدفع التلقائي للفواتير' },
    ],
  },
  {
    name: 'المتجر — قسم موحد لكل مقدمي المنتجات',
    screens: [
      { id: 'R46', key: 'food', title: 'المتجر — التصفح' },
      { id: 'R47', key: 'foodMenu', title: 'المنيو والسلة' },
      { id: 'R48', key: 'foodCart', title: 'السلة والدفع' },
      { id: 'R49', key: 'foodTrack', title: 'تتبع الطلب' },
      { id: 'R50', key: 'foodHistory', title: 'طلباتي السابقة' },
    ],
  },
  {
    name: 'سوق مقدمي الخدمة — مطابقة فورية',
    screens: [
      { id: 'R33', key: 'reqService', title: 'اطلب خدمة فورية' },
      { id: 'R34', key: 'matching', title: 'مقدمو الخدمة المتاحون' },
      { id: 'R37', key: 'escrow', title: 'حجز المبلغ (Escrow)' },
      { id: 'R35', key: 'liveJob', title: 'حالة الطلب المباشرة' },
      { id: 'R36', key: 'rateProvider', title: 'تقييم مقدم الخدمة' },
      { id: 'R38', key: 'dispute', title: 'الإبلاغ عن مشكلة' },
    ],
  },
  {
    name: 'التوسع والبيانات',
    screens: [
      { id: 'R29', key: 'consent', title: 'موافقة مشاركة البيانات' },
      { id: 'R30', key: 'pets', title: 'الحيوانات الأليفة' },
      { id: 'R32', key: 'renew', title: 'تجديد عقد الخدمات' },
      { id: 'D1', key: 'docs', title: 'الوثائق' },
      { id: 'D2', key: 'contacts', title: 'أرقام مهمة' },
      { id: 'D3', key: 'links', title: 'روابط سريعة' },
    ],
  },
];

export const galleryScreenCount = galleryGroups.reduce((a, g) => a + g.screens.length, 0);
