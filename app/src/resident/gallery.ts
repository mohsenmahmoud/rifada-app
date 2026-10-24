import type { ScreenKey } from './types';
import type { ScenarioKey } from './data/scenarios';

/**
 * The screen gallery, grouped exactly as `Jiwar App.dc.html` groups it, and
 * generated from that file rather than transcribed.
 *
 * Many screens now appear more than once: a `scenario` puts the app into a
 * named starting state (see `data/scenarios.ts`), so the gallery can show the
 * ticket at each of its three statuses, the cart full and empty, or the group
 * seen as a stranger, an applicant, a member and its organiser.
 *
 * Note: the handoff file we were first pointed at
 * (`Jiwar App standalone-src.dc.html`) carried a stale copy of this list — it
 * still advertised المنزل الذكي and السوق الداخلي, both deleted during the
 * design chat, and was missing everything added afterwards.
 */
export type GalleryGroup = {
  name: string;
  screens: { id: string; key: ScreenKey; title: string; scenario?: ScenarioKey }[];
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
      { id: 'R4s1', key: 'home', title: 'الرئيسية — بلا شريط تنبيه', scenario: 'home-noalert' },
      { id: 'R4s2', key: 'home', title: 'الرئيسية — وضع فرد العائلة (أقسام مقفلة)', scenario: 'fam-view' },
      { id: 'R4b', key: 'services', title: 'خدماتك' },
      { id: 'R13', key: 'feed', title: 'الفعاليات والمجتمع' },
      { id: 'R71', key: 'eventDetail', title: 'تفاصيل الفعالية والحجز' },
      { id: 'R71s1', key: 'eventDetail', title: 'الفعالية — أنت مسجّل + تصريح الدخول', scenario: 'ev-going' },
      { id: 'R72', key: 'eventCreate', title: 'اقترح فعالية' },
      { id: 'R73', key: 'groupDetail', title: 'مجموعة اهتمام — اللوحة واللقاء' },
      { id: 'R73s1', key: 'groupDetail', title: 'مجموعة — غير عضو', scenario: 'grp-nonmember' },
      { id: 'R73s2', key: 'groupDetail', title: 'طلب انضمام قيد الموافقة', scenario: 'grp-pending' },
      { id: 'R73s3', key: 'groupMembers', title: 'أعضاء المجموعة' },
      { id: 'R73s4', key: 'groupDetail', title: 'مجموعة أنشأتها — أدوات المنظّم', scenario: 'grp-organizer' },
      { id: 'R74', key: 'groupCreate', title: 'أنشئ مجموعة' },
      { id: 'R75', key: 'community', title: 'اسأل جيرانك — المنشورات' },
      { id: 'R76', key: 'communityPost', title: 'المنشور والتعليقات والردود' },
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
      { id: 'R7s1', key: 'maintDetail', title: 'البلاغ — تم الاستلام', scenario: 'md-received' },
      { id: 'R7s2', key: 'maintDetail', title: 'البلاغ — تم الحل + التقييم', scenario: 'md-resolved' },
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
      { id: 'R10s1', key: 'pay', title: 'كشف الحساب — نموذج التقسيط', scenario: 'pay-inst' },
      { id: 'R11', key: 'payNow', title: 'إتمام الدفع' },
      { id: 'R11b', key: 'paySuccess', title: 'نجاح الدفع والإيصال' },
      { id: 'R16', key: 'payHistory', title: 'سجل السداد' },
      { id: 'R39', key: 'autopay', title: 'الدفع التلقائي — دورة الخصم' },
      { id: 'R39s1', key: 'autopay', title: 'الدفع التلقائي — أثناء الدورة', scenario: 'ap-run' },
      { id: 'R27', key: 'fin', title: 'الخدمات المالية' },
    ],
  },
  {
    name: 'الانتقال والاستلام',
    screens: [
      { id: 'R12', key: 'movein', title: 'قائمة الاستلام والتسليم' },
    ],
  },
  {
    name: 'المجتمع والخدمات',
    screens: [
      { id: 'R17', key: 'gate', title: 'سياراتك وتصاريح الزوار' },
      { id: 'R17s1', key: 'gate', title: 'إصدار تصريح — النموذج', scenario: 'gate-form' },
      { id: 'R17s2', key: 'gate', title: 'التصريح صادر', scenario: 'gate-issued' },
      { id: 'R17s3', key: 'visitLog', title: 'سجل الزيارات الكامل' },
      { id: 'R18', key: 'lost', title: 'المفقودات — تصفح' },
      { id: 'R18s1', key: 'lostDetail', title: 'تفاصيل مفقود والتواصل' },
      { id: 'R19', key: 'lostReport', title: 'المفقودات — إبلاغ' },
      { id: 'R19s1', key: 'lostReport', title: 'إبلاغ — فقدتُ شيئًا', scenario: 'lost-mine' },
      { id: 'R21', key: 'marketDetail', title: 'تفاصيل الخدمة والحجز' },
      { id: 'R23', key: 'chat', title: 'الرسائل مع الإدارة' },
      { id: 'R23s1', key: 'dmChat', title: 'محادثة خاصة بين جارين', scenario: 'dm-open' },
    ],
  },
  {
    name: 'استعارة — مشاركة بين الجيران',
    screens: [
      { id: 'R67', key: 'share', title: 'استعارة — معروض للمشاركة' },
      { id: 'R68', key: 'shareCreate', title: 'اعرض شيئًا لديك' },
      { id: 'R69', key: 'shareDetail', title: 'تفاصيل المشاركة والحجز' },
      { id: 'R69s1', key: 'shareBooking', title: 'حجزي — بانتظار الاستلام' },
      { id: 'R69s2', key: 'shareBooking', title: 'حجزي — أثناء الاستخدام', scenario: 'shb-mid' },
      { id: 'R69s3', key: 'shareBooking', title: 'حجزي — انتهى + التقييم', scenario: 'shb-done' },
      { id: 'R70a', key: 'myListing', title: 'مشاركتي المنشورة', scenario: 'pub-listing' },
      { id: 'R70b', key: 'shareReqs', title: 'طلبات الحجز على معروضي', scenario: 'pub-listing' },
      { id: 'R70d', key: 'shareHist', title: 'سجل مشاركاتي المنتهية' },
      { id: 'R70e', key: 'shareHistDetail', title: 'تقرير مشاركة منتهية' },
    ],
  },
  {
    name: 'المكافآت والثقة',
    screens: [
      { id: 'R24', key: 'rewards', title: 'المكافآت' },
      { id: 'R25', key: 'rewards', title: 'نافذة الاستبدال', scenario: 'rewards-modal' },
      { id: 'R26', key: 'score', title: 'نقاط الثقة' },
    ],
  },
  {
    name: 'سوق العقارات — بين الجيران',
    screens: [
      { id: 'R39', key: 'reBrowse', title: 'تصفح الإعلانات' },
      { id: 'R39b', key: 'reBrowse', title: 'تصفح — قسم الإيجار', scenario: 're-rent' },
      { id: 'R40', key: 'reCreate', title: 'أعلن عن وحدتك' },
      { id: 'R41', key: 'reDetail', title: 'تفاصيل الإعلان' },
      { id: 'R42', key: 'reMine', title: 'إعلاناتي' },
    ],
  },
  {
    name: 'حسابات العائلة',
    screens: [
      { id: 'R43', key: 'family', title: 'أفراد العائلة' },
      { id: 'R44', key: 'famPerms', title: 'صلاحيات الفرد' },
      { id: 'R44s1', key: 'famPerms', title: 'صلاحيات فرد آخر', scenario: 'fam-sel2' },
    ],
  },
  {
    name: 'فواتيرك — فواتير خارجية',
    screens: [
      { id: 'R51', key: 'bills', title: 'فواتيرك — الرئيسية' },
      { id: 'R52', key: 'billLink', title: 'ربط فاتورة جديدة' },
      { id: 'R53', key: 'billDetail', title: 'تفاصيل الفاتورة والدفع' },
      { id: 'R53s1', key: 'billDetail', title: 'فاتورة مسددة', scenario: 'bill-paid' },
      { id: 'R53s2', key: 'billDetail', title: 'فاتورة متأخرة', scenario: 'bill-overdue' },
      { id: 'R54', key: 'billHistory', title: 'سجل سداد الفواتير' },
      { id: 'R55', key: 'billAutopay', title: 'الدفع التلقائي للفواتير' },
    ],
  },
  {
    name: 'المتجر — قسم موحد لكل مقدمي المنتجات',
    screens: [
      { id: 'R46', key: 'food', title: 'المتجر — التصفح' },
      { id: 'R47', key: 'foodMenu', title: 'المنيو والسلة' },
      { id: 'R47s1', key: 'foodMenu', title: 'منيو صيدلية', scenario: 'store-pharm' },
      { id: 'R48', key: 'foodCart', title: 'السلة والدفع' },
      { id: 'R48s1', key: 'foodCart', title: 'السلة ممتلئة', scenario: 'cart-full' },
      { id: 'R49', key: 'foodTrack', title: 'تتبع الطلب' },
      { id: 'R49s1', key: 'foodTrack', title: 'الطلب خرج مع المندوب', scenario: 'order-out' },
      { id: 'R49s2', key: 'foodTrack', title: 'تم التسليم', scenario: 'order-done' },
      { id: 'R50', key: 'foodHistory', title: 'طلباتي السابقة' },
    ],
  },
  {
    name: 'سوق مقدمي الخدمة — مطابقة فورية',
    screens: [
      { id: 'R33', key: 'reqService', title: 'اطلب خدمة فورية' },
      { id: 'R34', key: 'matching', title: 'مقدمو الخدمة المتاحون' },
      { id: 'R34s1', key: 'matching', title: 'تم العثور على مقدم خدمة', scenario: 'match-found' },
      { id: 'R34s2', key: 'provProfile', title: 'ملف مقدم الخدمة والتقييمات' },
      { id: 'R37', key: 'escrow', title: 'حجز المبلغ (Escrow)' },
      { id: 'R35', key: 'liveJob', title: 'حالة الطلب المباشرة' },
      { id: 'R35s1', key: 'liveJob', title: 'في الطريق إليك', scenario: 'live-otw' },
      { id: 'R35s2', key: 'liveJob', title: 'اكتمل — السعر والتقييم', scenario: 'live-done' },
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
