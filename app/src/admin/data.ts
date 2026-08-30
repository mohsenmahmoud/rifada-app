import { color } from '@/theme/tokens';

/** Admin console content, ported from `Jiwar Admin.dc.html`. */

export const COMPOUNDS = ['حدائق الأندلس', 'قرطبة هيلز'];
export const ADMIN_EMAIL = 'admin@andalus-gardens.sa';

/* ---------------- tickets ---------------- */

export type TicketStatus = 'received' | 'inprogress' | 'resolved';

export type AdminTicket = {
  id: number;
  title: string;
  cat: string;
  unit: string;
  resident: string;
  pr: 'urgent' | 'normal';
  status: TicketStatus;
  /** Index into `techs`, or null when unassigned. */
  tech: number | null;
  date: string;
  desc: string;
  notes: { by: string; time: string; text: string }[];
};

export const initialTickets: AdminTicket[] = [
  {
    id: 1042,
    title: 'تسريب مياه في الحمام الرئيسي',
    cat: 'سباكة',
    unit: 'فيلا 214',
    resident: 'عبدالله العتيبي',
    pr: 'urgent',
    status: 'inprogress',
    tech: 1,
    date: '8 يوليو — 9:14 ص',
    desc: 'تسريب مستمر أسفل حوض الحمام الرئيسي منذ يومين، مرفق صورتان.',
    notes: [
      {
        by: 'محمد الغامدي (فني)',
        time: '8 يوليو 11:30 ص',
        text: 'تم فحص التسريب وتحديد مصدره في وصلة الخلاط. سيتم استبدال الوصلة غدًا صباحًا.',
      },
    ],
  },
  {
    id: 1051,
    title: 'صيانة دورية للتكييف المركزي',
    cat: 'تكييف',
    unit: 'فيلا 214',
    resident: 'عبدالله العتيبي',
    pr: 'normal',
    status: 'received',
    tech: null,
    date: 'اليوم — 8:40 ص',
    desc: 'طلب صيانة دورية قبل ذروة الصيف.',
    notes: [],
  },
  {
    id: 1049,
    title: 'إنارة الممر الخارجي متقطعة',
    cat: 'كهرباء',
    unit: 'الحي الشرقي',
    resident: 'منطقة مشتركة',
    pr: 'normal',
    status: 'inprogress',
    tech: 0,
    date: 'أمس — 6:20 م',
    desc: 'أعمدة الإنارة 12-16 بالممر الشرقي تعمل بشكل متقطع بعد الغروب.',
    notes: [],
  },
  {
    id: 1047,
    title: 'باب الكراج لا يغلق بالكامل',
    cat: 'نجارة',
    unit: 'فيلا 96',
    resident: 'منيرة الدوسري',
    pr: 'urgent',
    status: 'received',
    tech: null,
    date: 'أمس — 3:05 م',
    desc: 'الباب يتوقف قبل الإغلاق بـ20 سم تقريبًا.',
    notes: [],
  },
  {
    id: 1044,
    title: 'تشقق في سيراميك المسبح',
    cat: 'مناطق مشتركة',
    unit: 'النادي',
    resident: 'منطقة مشتركة',
    pr: 'normal',
    status: 'inprogress',
    tech: 2,
    date: '7 يوليو — 1:00 م',
    desc: 'تشققات ظاهرة في الحوض الصغير — مطلوب معاينة قبل موسم الصيف.',
    notes: [],
  },
  {
    id: 1038,
    title: 'مصباح المدخل الخارجي لا يعمل',
    cat: 'كهرباء',
    unit: 'فيلا 214',
    resident: 'عبدالله العتيبي',
    pr: 'normal',
    status: 'resolved',
    tech: 0,
    date: '2 يوليو — 10:15 ص',
    desc: 'المصباح الرئيسي فوق باب الفيلا لا يعمل.',
    notes: [
      {
        by: 'خالد المطيري (فني)',
        time: '2 يوليو 2:40 م',
        text: 'تم استبدال المصباح والتأكد من سلامة التوصيلات.',
      },
    ],
  },
  {
    id: 1035,
    title: 'رائحة صرف في المطبخ',
    cat: 'سباكة',
    unit: 'فيلا 152',
    resident: 'فهد الشمري',
    pr: 'normal',
    status: 'resolved',
    tech: 1,
    date: '1 يوليو — 9:00 ص',
    desc: 'رائحة كريهة من بالوعة المطبخ صباحًا.',
    notes: [],
  },
];

export const ticketMeta: Record<TicketStatus, { label: string; bg: string; c: string }> = {
  received: { label: 'تم الاستلام', bg: 'rgba(107,114,128,0.12)', c: color.slate },
  inprogress: { label: 'جاري التنفيذ', bg: 'rgba(199,154,60,0.16)', c: color.goldDeep },
  resolved: { label: 'تم الحل', bg: 'rgba(63,166,107,0.14)', c: color.greenDeep },
};

export const techs = [
  { name: 'خالد المطيري', spec: 'كهرباء وإنارة', load: 3 },
  { name: 'محمد الغامدي', spec: 'سباكة', load: 2 },
  { name: 'تركي السبيعي', spec: 'أعمال عامة', load: 4 },
];

export const ticketFilterDefs = [
  { key: 'all', label: 'الكل' },
  { key: 'received', label: 'تم الاستلام' },
  { key: 'inprogress', label: 'جاري التنفيذ' },
  { key: 'resolved', label: 'تم الحل' },
];

/* ---------------- navigation ---------------- */

export const navIcons = {
  home: 'M4 11l8-7 8 7v9h-5v-6h-6v6H4z',
  tickets:
    'M20.5 6.8a4.5 4.5 0 0 1-6 4.2l-7 7a2.1 2.1 0 0 1-3-3l7-7a4.5 4.5 0 0 1 5.7-5.6L14.6 5l2.4 2.4 2.6-2.6c.6.6.9 1.2.9 2z',
  residents:
    'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1a3.5 3.5 0 0 0-2.5-3.3M16.5 4.3a3.5 3.5 0 0 1 0 6.4',
  broadcast: 'M3 10v4h3l6 5V5l-6 5zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  amen: 'M2 15.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M2 19.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M8 11V7a4 4 0 0 1 8 0',
  vendors: 'M4 21V8l4-5h8l4 5v13zM4 8h16M12 12a3 3 0 0 0 3 3',
  collection: 'M3 7h18v12H3zM3 11h18M6 15h4',
  sla: 'M12 7v5l3.5 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z',
  lost: 'M15.5 15.5L21 21M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
  gate: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 17v3h-3',
  sentiment: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM8.5 10h.01M15.5 10h.01M8.5 14.5a5 5 0 0 0 7 0',
  scoring: 'M12 2l2.5 5.3 5.5.8-4 4 1 5.9-5-2.8-5 2.8 1-5.9-4-4 5.5-.8z',
  inbox: 'M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12z',
  portfolio: 'M3 21h18M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3',
  predict: 'M3 17l5-5 4 3 6-7 3 3M3 21h18',
  iot: 'M12 18h.01M8.5 15a5 5 0 0 1 7 0M5.5 12a9.5 9.5 0 0 1 13 0M2.5 9a14 14 0 0 1 19 0',
  bills: 'M14 2H6v20h12V8zM14 2v6h6M13 11l-3 4h4l-3 4',
  realestate: 'M3 21h18M5 21V9l7-5 7 5v12M9 14h6M9 17h6',
  stores: 'M4 8h16M4 8l1-4h14l1 4M4 8v13h16V8M9 21v-7h6v7',
  sourcing: 'M4 21V8l4-5h8l4 5v13zM4 8h16M9 12h6M9 16h6',
  revenue: 'M3 3v18h18M7 15l4-5 3 3 5-7',
  verify: 'M9 12l2 2 4-4M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z',
  disputes:
    'M12 9v4M12 17h.01M10.3 3.9L2.6 18a1.5 1.5 0 0 0 1.3 2.2h16.2a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0z',
  automation:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12c0-.4 0-.8-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z',
  team: 'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 19v-1a3.5 3.5 0 0 0-2.5-3.3M9 12l1.5 1.5L13 11',
  reports: 'M14 2H6v20h12V8zM14 2v6h6M9 13h6M9 17h4',
} as const;

export type SectionKey =
  | 'home' | 'tickets' | 'ticketDetail' | 'residents' | 'unit360' | 'broadcast' | 'amen'
  | 'vendors' | 'onboard' | 'collection' | 'sla' | 'sentiment' | 'scoring'
  | 'inbox' | 'lostmod' | 'gatelog'
  | 'billAgg' | 'reMod' | 'storesDir'
  | 'sourcing' | 'revenue' | 'verify' | 'disputes'
  | 'automation' | 'team' | 'reports'
  | 'portfolio' | 'predict' | 'iot';

export type NavEntry =
  | { header: string }
  | { key: SectionKey; label: string; icon: string; badge?: 'openTickets' | string };

export const navDefs: NavEntry[] = [
  { header: 'التشغيل اليومي' },
  { key: 'home', label: 'لوحة التحكم', icon: navIcons.home },
  { key: 'tickets', label: 'طابور التذاكر', icon: navIcons.tickets, badge: 'openTickets' },
  { key: 'residents', label: 'دليل السكان', icon: navIcons.residents },
  { key: 'broadcast', label: 'الإعلانات', icon: navIcons.broadcast },
  { key: 'amen', label: 'إدارة المرافق', icon: navIcons.amen },
  { key: 'vendors', label: 'الموردون ومقدمو الخدمة', icon: navIcons.vendors },
  { header: 'المالية والأداء' },
  { key: 'collection', label: 'التحصيل', icon: navIcons.collection },
  { key: 'sla', label: 'متابعة SLA', icon: navIcons.sla },
  { key: 'sentiment', label: 'مشاعر السكان', icon: navIcons.sentiment },
  { key: 'scoring', label: 'نقاط الثقة', icon: navIcons.scoring },
  { header: 'المجتمع' },
  { key: 'inbox', label: 'رسائل السكان', icon: navIcons.inbox, badge: '2' },
  { key: 'lostmod', label: 'مراجعة المفقودات', icon: navIcons.lost },
  { key: 'gatelog', label: 'سجل الزوار', icon: navIcons.gate },
  { header: 'السوق العقاري والمتاجر' },
  { key: 'billAgg', label: 'الفواتير — مزودو الفواتير', icon: navIcons.bills },
  { key: 'reMod', label: 'مراجعة إعلانات العقارات', icon: navIcons.realestate },
  { key: 'storesDir', label: 'متاجر «المتجر»', icon: navIcons.stores },
  { header: 'سوق مقدمي الخدمة' },
  { key: 'sourcing', label: 'إعدادات مصادر الخدمة', icon: navIcons.sourcing },
  { key: 'revenue', label: 'عمولة السوق والإيرادات', icon: navIcons.revenue },
  { key: 'verify', label: 'اعتماد مقدمي الخدمة', icon: navIcons.verify },
  { key: 'disputes', label: 'مركز فض النزاعات', icon: navIcons.disputes },
  { header: 'الإنتاجية والحكم' },
  { key: 'automation', label: 'قواعد الأتمتة', icon: navIcons.automation, badge: '4' },
  { key: 'team', label: 'الفريق والصلاحيات', icon: navIcons.team },
  { key: 'reports', label: 'التقارير والتصدير', icon: navIcons.reports },
  { header: 'التوسع والبيانات' },
  { key: 'portfolio', label: 'المحفظة العقارية', icon: navIcons.portfolio },
  { key: 'predict', label: 'الصيانة التنبؤية', icon: navIcons.predict },
  { key: 'iot', label: 'العدادات الذكية', icon: navIcons.iot },
];

export const sectionTitles: Record<SectionKey, string> = {
  home: 'لوحة التحكم',
  tickets: 'طابور التذاكر',
  ticketDetail: 'تفاصيل التذكرة',
  residents: 'دليل السكان',
  unit360: 'ملف الوحدة الشامل',
  broadcast: 'الإعلانات والتعميمات',
  amen: 'إدارة المرافق',
  vendors: 'دليل الموردين',
  onboard: 'تعيين مقدم خدمة جديد',
  collection: 'لوحة التحصيل',
  sla: 'متابعة اتفاقيات مستوى الخدمة',
  sentiment: 'مشاعر السكان',
  scoring: 'إدارة نقاط الثقة',
  inbox: 'رسائل السكان',
  lostmod: 'مراجعة المفقودات',
  gatelog: 'سجل الزوار والبوابات',
  billAgg: 'خدمة الفواتير — إعدادات مزودي الفواتير',
  reMod: 'مراجعة إعلانات العقارات',
  storesDir: 'متاجر «المتجر» الموحد',
  sourcing: 'إعدادات مصادر الخدمة',
  revenue: 'عمولة السوق والإيرادات',
  verify: 'اعتماد مقدمي الخدمة',
  disputes: 'مركز فض النزاعات',
  automation: 'قواعد الأتمتة — تقليل العمل اليدوي',
  team: 'الفريق والصلاحيات وسجل التدقيق',
  reports: 'التقارير والتصدير',
  portfolio: 'المحفظة العقارية',
  predict: 'الصيانة التنبؤية',
  iot: 'العدادات الذكية',
};

/* ---------------- A2 command centre ---------------- */

export const kpiDefs = [
  {
    label: 'تذاكر مفتوحة',
    /** null means "computed from live ticket state". */
    value: null as string | null,
    trend: '↓ 3 عن الأسبوع',
    icon: navIcons.tickets,
    iconBg: 'rgba(199,154,60,0.14)',
    iconC: color.goldDeep,
    cta: 'افتح الطابور',
    to: 'tickets' as SectionKey,
    target: 'الهدف: أقل من 10',
    spark: [70, 85, 62, 78, 55, 45],
    sparkC: 'rgba(199,154,60,0.55)',
  },
  {
    label: 'معدل التحصيل',
    value: '87%',
    trend: '↑ 4% عن يونيو',
    icon: navIcons.collection,
    iconBg: 'rgba(63,166,107,0.13)',
    iconC: color.green,
    cta: '14 حساب متأخر',
    to: 'collection' as SectionKey,
    target: 'الهدف: 92%',
    spark: [62, 68, 71, 76, 83, 87],
    sparkC: 'rgba(63,166,107,0.6)',
  },
  {
    label: 'متوسط وقت الحل',
    value: '18 س',
    trend: '↓ 6 س عن يونيو',
    icon: navIcons.sla,
    iconBg: 'rgba(31,59,87,0.09)',
    iconC: color.navy,
    cta: 'تتبّع الـSLA',
    to: 'sla' as SectionKey,
    target: 'الهدف: 24 ساعة',
    spark: [95, 88, 80, 72, 66, 58],
    sparkC: 'rgba(31,59,87,0.45)',
  },
  {
    label: 'رضا السكان',
    value: '4.2',
    trend: '↑ 0.3 هذا الشهر',
    icon: navIcons.sentiment,
    iconBg: 'rgba(228,103,90,0.11)',
    iconC: color.coral,
    cta: 'تحليل الرضا',
    to: 'sentiment' as SectionKey,
    target: 'الهدف: 4.5',
    spark: [58, 60, 66, 70, 76, 84],
    sparkC: 'rgba(228,103,90,0.5)',
  },
];

export const cmdIcons = {
  unit: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z',
  ticket: 'M14 2H6v20h12V8zM14 2v6h6M9 13h6M9 17h6',
  vendor: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-2.6z',
  store: 'M4 8h16M4 8l1-4h14l1 4M4 8v13h16V8M9 21v-7h6v7',
};

export const quickActionDefs = [
  {
    label: 'بث إعلان',
    icon: 'M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM16 8a5 5 0 0 1 0 8',
    bg: color.navy,
    c: '#fff',
    to: 'broadcast' as SectionKey,
  },
  {
    label: 'تذكير تحصيل',
    icon: 'M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20h4',
    bg: 'rgba(199,154,60,0.14)',
    c: color.goldDeep,
    toast: 'أُرسل تذكير سداد لـ14 حسابًا متأخرًا عبر التطبيق والرسائل',
  },
  {
    label: 'استدعاء فني',
    icon: cmdIcons.vendor,
    bg: 'rgba(63,166,107,0.12)',
    c: color.greenDeep,
    to: 'vendors' as SectionKey,
  },
];

/** Decisions the operator can close from the dashboard, without opening a screen. */
export const inboxDefs = [
  {
    key: 'rx',
    title: 'طلب صيدلية بروشتة — بانتظار مراجعة الإدارة',
    meta: 'فيلا 214 · صيدلية الشفاء · 166 ر.س',
    icon: cmdIcons.store,
    iconBg: 'rgba(31,59,87,0.08)',
    iconC: color.navy,
    approveLabel: 'اعتماد',
    rejectLabel: 'رفض',
    okMsg: 'اعتُمد الطلب — أُخطرت الصيدلية',
    noMsg: 'رُفض الطلب — استُرد مبلغ الساكن',
  },
  {
    key: 'listing',
    title: 'إعلان عقاري جديد بانتظار النشر',
    meta: 'فيلا 214 — للإيجار · 12,000 ر.س/شهر',
    icon: cmdIcons.unit,
    iconBg: 'rgba(199,154,60,0.14)',
    iconC: color.goldDeep,
    approveLabel: 'انشر',
    rejectLabel: 'ارفض',
    okMsg: 'نُشر الإعلان — وصل إشعار للمعلن',
    noMsg: 'رُفض الإعلان مع إخطار المعلن',
  },
  {
    key: 'dispute',
    title: 'نزاع مفتوح — المبلغ مجمّد في الإسكرو',
    meta: 'تسريب مياه · 150 ر.س · عبدالله العتيبي',
    icon: navIcons.disputes,
    iconBg: 'rgba(228,103,90,0.11)',
    iconC: color.coralDeep,
    approveLabel: 'ادفع للمقدم',
    rejectLabel: 'استرد للساكن',
    okMsg: 'حُوّل المبلغ لمقدم الخدمة',
    noMsg: 'استُرد المبلغ كاملًا للساكن',
  },
  {
    key: 'event',
    title: 'فعالية اقترحها ساكن — تحتاج حجز مرفق',
    meta: 'ورشة رسم للأطفال · قاعة الأنشطة · 20 مكانًا',
    icon: 'M8 2v4M16 2v4M3 10h18M5 6h14v15H5z',
    iconBg: 'rgba(61,42,92,0.1)',
    iconC: color.purple,
    approveLabel: 'اعتمد',
    rejectLabel: 'ارفض',
    okMsg: 'اعتُمدت الفعالية وحُجزت القاعة',
    noMsg: 'رُفضت الفعالية مع إخطار المنظّم',
  },
  {
    key: 'provider',
    title: 'مقدم خدمة جديد — مستندات مكتملة',
    meta: 'شركة النور للصيانة · كهرباء',
    icon: cmdIcons.vendor,
    iconBg: 'rgba(63,166,107,0.12)',
    iconC: color.greenDeep,
    approveLabel: 'فعّل',
    rejectLabel: 'أجّل',
    okMsg: 'فُعّل حساب شركة النور — أُصدرت بيانات الدخول',
    noMsg: 'أُجّل الاعتماد لحين استكمال المراجعة',
  },
];

export const opsAlertDefs = [
  { text: '3 تذاكر تجاوزت مهلة الـSLA (24 ساعة)', dot: color.coral, to: 'sla' as SectionKey },
  { text: '14 حسابًا متأخرًا — 46,800 ر.س مستحقة', dot: color.gold, to: 'collection' as SectionKey },
  { text: 'أكاديمية السباحة مكتملة — 12 على قائمة الانتظار', dot: color.gold, to: 'amen' as SectionKey },
  { text: 'مؤشر رضا «التواصل» سلبي هذا الشهر', dot: color.coral, to: 'sentiment' as SectionKey },
];

export const activityDefs = [
  { text: 'عبدالله العتيبي (فيلا 214) سدّد 7,400 ر.س — إيصال #88412', time: 'منذ ساعة' },
  { text: 'بلاغ جديد #1051 — صيانة تكييف، فيلا 214', time: '8:40 ص' },
  { text: 'تصريح زائر جديد صادر من فيلا 96', time: 'أمس' },
  { text: 'حجز الجيم اكتمل لموعد 6 مساءً', time: 'أمس' },
  { text: 'بلاغ مفقودات جديد بانتظار المراجعة', time: 'أمس' },
];

/* ---------------- A5 residents / A36 unit 360 ---------------- */

export const resDefs = [
  {
    unit: 'فيلا 214',
    name: 'عبدالله العتيبي',
    phone: '050 123 4567',
    model: 'إيجار شهري',
    pay: 'سداد منتظم',
    ok: true,
    fam: [
      { name: 'سارة عبدالله', rel: 'الزوجة', perms: 'كل الصلاحيات', avBg: 'linear-gradient(160deg,#8A5A83,#5C3A57)' },
      { name: 'يوسف عبدالله', rel: 'الابن — 16 سنة', perms: '3 من 6 صلاحيات', avBg: 'linear-gradient(160deg,#3E7A5E,#2A5741)' },
      { name: 'أم عبدالله', rel: 'الوالدة', perms: '3 من 6 صلاحيات', avBg: 'linear-gradient(160deg,#8A6D3B,#5C4A2A)' },
    ],
  },
  {
    unit: 'فيلا 96',
    name: 'منيرة الدوسري',
    phone: '053 876 4321',
    model: 'تقسيط تمليك',
    pay: 'سداد منتظم',
    ok: true,
    fam: [
      { name: 'سلطان الحربي', rel: 'الزوج', perms: 'كل الصلاحيات', avBg: 'linear-gradient(160deg,#27496F,#1F3B57)' },
    ],
  },
  { unit: 'فيلا 152', name: 'فهد الشمري', phone: '055 551 0198', model: 'تقسيط تمليك', pay: 'متأخر 6 أيام', ok: false },
  { unit: 'فيلا 88', name: 'نورة القحطاني', phone: '056 927 6645', model: 'إيجار شهري', pay: 'سداد منتظم', ok: true },
  { unit: 'فيلا 45', name: 'ماجد البقمي', phone: '054 340 7789', model: 'إيجار شهري', pay: 'متأخر 12 يومًا', ok: false },
  { unit: 'فيلا 180', name: 'تركي العسيري', phone: '058 668 1023', model: 'تقسيط تمليك', pay: 'سداد منتظم', ok: true },
  { unit: 'فيلا 12', name: 'لطيفة الزهراني', phone: '059 441 8850', model: 'إيجار شهري', pay: 'سداد منتظم', ok: true },
];

export const u360 = {
  unit: 'فيلا 214',
  owner: 'عبدالله العتيبي',
  model: 'إيجار شهري',
  balance: '7,400',
  score: '850',
  tier: 'ذهبي',
  /** Six months of payment behaviour: on time, late, or still due. */
  pay: [
    ['فبر', 'ok'],
    ['مار', 'ok'],
    ['أبر', 'late'],
    ['ماي', 'ok'],
    ['يون', 'ok'],
    ['يول', 'due'],
  ] as [string, 'ok' | 'late' | 'due'][],
};

export const payColors = { ok: color.green, late: color.gold, due: color.coral };
export const payHeights = { ok: '86%', late: '62%', due: '40%' };

export const u360Stats = [
  { label: 'الرصيد المستحق', value: u360.balance, sub: 'استحقاق 25 يوليو', c: color.coralDeep },
  { label: 'التزام السداد', value: '5 من 6', sub: 'آخر 6 أشهر', c: color.greenDeep },
  { label: 'تذاكر مفتوحة', value: '2', sub: 'متوسط الحل 16 س', c: color.navy },
  { label: 'نقاط الثقة', value: u360.score, sub: `مستوى ${u360.tier}`, c: color.goldDeep },
];

export const u360Assets = [
  {
    label: 'سيارة — س ن ر 2146',
    meta: 'مسجّلة',
    icon: 'M3 13l2-5h14l2 5M3 13v5h2M21 13v5h-2M6 18a1.5 1.5 0 1 0 0-3M18 18a1.5 1.5 0 1 0 0-3',
  },
  { label: 'تصريح زائر نشط', meta: 'ينتهي 6 م', icon: navIcons.gate },
  { label: 'قطة مسجّلة', meta: 'تطعيم محدّث', icon: 'M12 5l-3 3v6a3 3 0 0 0 6 0V8zM9 8L6 5v4M15 8l3-3v4' },
];

export const u360Usage = [
  { label: 'طلبات المتجر', n: '14', w: '90%' },
  { label: 'مقدمو خدمة', n: '3', w: '40%' },
  { label: 'حجز مرافق', n: '6', w: '60%' },
  { label: 'فعاليات', n: '2', w: '25%' },
];

export const u360Timeline = [
  { text: 'سدّد 7,400 ر.س — إيصال #88412', time: 'منذ ساعة', dot: color.green },
  { text: 'أنشأ بلاغ صيانة تكييف #1051', time: '8:40 ص', dot: color.gold },
  { text: 'حجز الجيم — 6 مساءً', time: 'أمس', dot: color.navy },
  { text: 'أصدر تصريح زائر لمحمد الحارثي', time: 'أمس', dot: color.navy },
];

/* ---------------- A6 broadcast ---------------- */

export const broadcastTargets = ['كل السكان', 'الحي الشرقي', 'حي الياسمين'];
export const broadcastReach = [712, 184, 226];

export const initialBroadcasts = [
  { title: 'انقطاع مياه مؤقت يوم الخميس', target: 'كل السكان', reach: 712, time: 'اليوم 8:00 ص' },
  { title: 'يوم رياضي للعائلات — السبت', target: 'كل السكان', reach: 712, time: 'أمس' },
  { title: 'أعمال تنسيق الحدائق بالحي الشرقي', target: 'الحي الشرقي', reach: 184, time: '6 يوليو' },
];

/* ---------------- A7 / A12 / A21 vendors ---------------- */

export const maintVendors = [
  { name: 'النور للكهرباء', spec: 'كهرباء وإنارة', rating: '4.7', jobs: '86', jobsLabel: 'مهمة منجزة', commission: '—', ok: true, phone: '053 442 8871' },
  { name: 'أكوا فيكس', spec: 'سباكة وصرف', rating: '4.5', jobs: '64', jobsLabel: 'مهمة منجزة', commission: '—', ok: true, phone: '0555 208 540' },
  { name: 'مصاعد الصفوة', spec: 'مصاعد وبوابات', rating: '4.2', jobs: '17', jobsLabel: 'مهمة منجزة', commission: '—', ok: false, phone: '056 903 1174' },
];

export const marketVendors = [
  { name: 'كلين هوم', spec: 'تنظيف الوحدات', rating: '4.8', jobs: '126', jobsLabel: 'حجزًا', commission: '12%', ok: true, phone: '050 771 2934' },
  { name: 'كول تك', spec: 'صيانة تكييف', rating: '4.6', jobs: '89', jobsLabel: 'حجزًا', commission: '10%', ok: true, phone: '055 620 4483' },
  { name: 'بيست كنترول السعودية', spec: 'مكافحة حشرات', rating: '4.7', jobs: '64', jobsLabel: 'حجزًا', commission: '12%', ok: true, phone: '059 348 5512' },
];

export const providerDirDefs = [
  { name: 'عبدالعزيز الزهراني', cat: 'سباكة', zone: 'حي الياسمين', rating: '4.8', jobs: 62, ok: true },
  { name: 'فهد الشمري', cat: 'سباكة', zone: 'الحي الشرقي', rating: '4.6', jobs: 41, ok: true },
  { name: 'مشاري القحطاني', cat: 'صيانة تكييف', zone: 'حي الياسمين', rating: '4.9', jobs: 28, ok: true },
  { name: 'شركة النور', cat: 'كهرباء', zone: 'كل المناطق', rating: '4.4', jobs: 19, ok: false },
];

export const onboardCats = ['سباكة', 'كهرباء', 'صيانة تكييف', 'تنظيف', 'تدريب رياضي'];

/* ---------------- A31 bill aggregator ---------------- */

export const billAggDefs = [
  { cat: 'كهرباء', icon: 'M13 2L5 13h5l-1 9 8-11h-5z', providers: 'الشركة السعودية للكهرباء · حساب المشترك', txns: 486 },
  { cat: 'مياه', icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z', providers: 'شركة المياه الوطنية · الرياض', txns: 342 },
  { cat: 'غاز', icon: 'M12 3s5 5 5 9.5a5 5 0 0 1-10 0C7 8 12 3 12 3zM12 21v-3', providers: 'غاز المدن · موزّعو الأسطوانات المعتمدون', txns: 218 },
  { cat: 'إنترنت واتصالات', icon: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01', providers: 'STC · Mobily · Zain · Salam', txns: 359 },
  { cat: 'أخرى', icon: navIcons.reports, providers: 'اشتراكات أندية · تأمين — قيد التفعيل', txns: 0 },
];

/* ---------------- A28 real-estate moderation ---------------- */

export const reModDefs = [
  { title: 'فيلا 214 — للإيجار (غرفة الضيوف الملحقة)', type: 'rent', owner: 'عبدالله العتيبي — فيلا 214', price: '12,000 ر.س / شهر', date: 'اليوم' },
  { title: 'شقة 12ب — البوابة الشرقية', type: 'sale', owner: 'فهد الشمري — شقة 12ب', price: '4.2M ر.س', date: 'أمس' },
  { title: 'فيلا 87 — حي الياسمين', type: 'sale', owner: 'منيرة الدوسري — فيلا 87', price: '9.4M ر.س', date: 'منذ 3 أيام' },
];

export const reModMeta = {
  pending: { label: 'بانتظار المراجعة', bg: 'rgba(199,154,60,0.16)', c: color.goldDeep },
  approved: { label: 'منشور ✓', bg: 'rgba(63,166,107,0.13)', c: color.greenDeep },
  rejected: { label: 'مرفوض', bg: 'rgba(228,103,90,0.13)', c: color.coralDeep },
} as const;

/* ---------------- A29/A30 stores ---------------- */

export const storesTableDefs = [
  { name: 'مطعم بيت الجيران', emoji: '🍽️', logoBg: 'rgba(199,154,60,0.15)', kind: 'مطعم', rating: '4.7', orders: 148, commission: '4,120', ok: true },
  { name: 'بيتزا المدينة', emoji: '🍕', logoBg: 'rgba(228,103,90,0.13)', kind: 'مطعم', rating: '4.5', orders: 96, commission: '2,660', ok: true },
  { name: 'صيدلية الشفاء', emoji: '💊', logoBg: 'rgba(31,59,87,0.1)', kind: 'صيدلية', rating: '4.9', orders: 210, commission: '3,480', ok: true },
  { name: 'عصائر النخيل', emoji: '🥤', logoBg: 'rgba(63,166,107,0.12)', kind: 'مطعم', rating: '4.8', orders: 12, commission: '190', ok: false },
];

/* ---------------- A27 / A25 / A24 / A26 marketplace ---------------- */

export const sourcingCats = ['صيانة تكييف', 'تنظيف', 'كهرباء', 'سباكة', 'تدريب رياضي'];

export const revenueByCat = [
  { cat: 'صيانة تكييف', val: '6,840', w: '92%' },
  { cat: 'تنظيف', val: '5,120', w: '70%' },
  { cat: 'سباكة', val: '3,910', w: '53%' },
  { cat: 'تدريب رياضي', val: '1,850', w: '25%' },
  { cat: 'مكافحة حشرات', val: '700', w: '10%' },
];

export const vettingDefs = [
  { name: 'عبدالعزيز الزهراني', cat: 'سباكة — أكوا فيكس', id: true, cert: true, bg: false },
  { name: 'مشاري القحطاني', cat: 'صيانة تكييف — كول تك', id: true, cert: true, bg: true },
  { name: 'سارة الدوسري', cat: 'تنظيف — كلين هوم', id: true, cert: false, bg: false },
];

export const disputeDefs = [
  { title: 'تسريب مياه — سباكة', by: 'عبدالله العتيبي (فيلا 214)', reason: 'لم يكتمل العمل', date: 'اليوم', amount: '150' },
  { title: 'تنظيف شامل للوحدة', by: 'فهد الشمري (فيلا 152)', reason: 'جودة رديئة', date: 'أمس', amount: '650' },
  { title: 'صيانة تكييف', by: 'منيرة الدوسري (فيلا 96)', reason: 'لم يحضر مقدم الخدمة', date: 'منذ يومين', amount: '350' },
];

export const disputeResolutions: Record<string, string> = {
  refund: 'استرداد كامل للساكن',
  partial: 'دفع جزئي',
  release: 'دفع كامل للمقدم',
  resolved: 'تمت المراجعة مسبقًا',
};

/* ---------------- A37 automation ---------------- */

export const ruleDefs = [
  { when: 'تذكرة كهرباء عاجلة', then: 'أسندها لعبدالعزيز الزهراني فورًا', stat: 'نفّذت 38 مرة هذا الشهر · متوسط بدء التنفيذ 11 دقيقة' },
  { when: 'تأخّر السداد 3 أيام', then: 'أرسل تذكيرًا للساكن', stat: 'نفّذت 112 مرة · 71% سدّدوا خلال 48 ساعة' },
  { when: 'تذكرة تجاوزت 20 ساعة', then: 'صعّدها لمشرف الصيانة', stat: 'معطّلة — التصعيد يدوي حاليًا' },
  { when: 'اكتمال حجز مرفق', then: 'افتح قائمة انتظار وأبلغ المسجّلين', stat: 'نفّذت 24 مرة · 12 على قائمة الانتظار الآن' },
];

export const AUTOMATED_ACTIONS = '1,284';
export const HOURS_SAVED = '62';

/* ---------------- A38 team & audit ---------------- */

export const staffDefs = [
  { name: 'نورة القحطاني', role: 'مدير المجمع', last: 'الآن', ok: true },
  { name: 'تركي العسيري', role: 'محاسب', last: 'منذ 20 دقيقة', ok: true },
  { name: 'ماجد البقمي', role: 'مشرف صيانة', last: 'منذ ساعتين', ok: true },
  { name: 'حسن الجهني', role: 'أمن البوابة', last: 'أمس', ok: false },
];

export const roleDefs = ['مدير المجمع', 'محاسب', 'مشرف صيانة', 'أمن البوابة'];

export const permLabels = [
  'عرض لوحة التحكم',
  'إدارة التذاكر والإسناد',
  'التحصيل والمبالغ المستردة',
  'فض النزاعات وتحرير الإسكرو',
  'بث الإعلانات',
  'إدارة الفريق والصلاحيات',
  'سجل البوابة والتصاريح',
];

/** roleMatrix[role][permission] */
export const roleMatrix = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 0, 0, 0],
  [1, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1],
];

export const auditRows = [
  { time: '10:42 ص', who: 'تركي العسيري', what: 'حرّر مبلغ إسكرو 150 ر.س لمقدم الخدمة عبدالعزيز الزهراني (نزاع #D-118)', tag: 'مالي', tagBg: 'rgba(228,103,90,0.11)', tagC: color.coralDeep },
  { time: '10:05 ص', who: 'نورة القحطاني', what: 'غيّرت حصة دعوات الضيوف من 5 إلى 10 شهريًا', tag: 'إعدادات', tagBg: 'rgba(31,59,87,0.08)', tagC: color.navy },
  { time: '9:31 ص', who: 'ماجد البقمي', what: 'أسند التذكرة #1049 إلى فهد الشمري ورفع الأولوية لعاجلة', tag: 'تشغيل', tagBg: 'rgba(199,154,60,0.16)', tagC: color.goldDeep },
  { time: '9:12 ص', who: 'النظام (قاعدة أتمتة)', what: 'أرسل تذكير سداد لـ14 حسابًا متأخرًا', tag: 'أتمتة', tagBg: 'rgba(63,166,107,0.13)', tagC: color.greenDeep },
  { time: 'أمس', who: 'نورة القحطاني', what: 'اعتمدت إعلان فيلا 87 للبيع ونشرته في سوق العقارات', tag: 'محتوى', tagBg: 'rgba(61,42,92,0.12)', tagC: color.purple },
];

/* ---------------- A39 reports ---------------- */

export const reportPeriods = ['يوليو 2026', 'الربع الثاني', 'سنة 2026'];

export const reportDefs = [
  { title: 'تقرير التحصيل', desc: 'المحصّل والمتأخر لكل وحدة مع أعمار المديونية.', headline: '87%', unit: 'معدل التحصيل', icon: navIcons.collection, iconBg: 'rgba(63,166,107,0.13)', iconC: color.greenDeep },
  { title: 'تقرير الصيانة', desc: 'التذاكر بالفئة والفني وزمن الحل مقابل الـSLA.', headline: '18 س', unit: 'متوسط الحل', icon: navIcons.tickets, iconBg: 'rgba(199,154,60,0.14)', iconC: color.goldDeep },
  { title: 'تقرير رضا السكان', desc: 'نتائج الاستبيان بالفئة مع الاتجاه الشهري.', headline: '4.2 / 5', unit: 'المؤشر العام', icon: navIcons.sentiment, iconBg: 'rgba(228,103,90,0.11)', iconC: color.coralDeep },
  { title: 'تقرير إيراد السوق', desc: 'العمولة بالفئة وحصة الإدارة من كل خدمة.', headline: '18,420', unit: 'ر.س هذا الشهر', icon: navIcons.revenue, iconBg: 'rgba(31,59,87,0.09)', iconC: color.navy },
  { title: 'تقرير استخدام المرافق', desc: 'الحجوزات بالمرفق والساعة ونسب الإشغال.', headline: '78%', unit: 'إشغال الذروة', icon: navIcons.amen, iconBg: 'rgba(61,42,92,0.1)', iconC: color.purple },
  { title: 'تقرير مجلس الملاك', desc: 'ملخّص شامل جاهز للعرض في الاجتماع الشهري.', headline: '9 صفحات', unit: 'جاهز للطباعة', icon: navIcons.reports, iconBg: 'rgba(199,154,60,0.14)', iconC: color.goldDeep },
];

/* ---------------- A8 amenities ---------------- */

export const amenDefs = [
  { key: 'gym', name: 'الجيم', hours: '6 ص – 11 م', booked: 9 },
  { key: 'pool', name: 'المسبح', hours: '10 ص – 8 م', booked: 14 },
  { key: 'club', name: 'النادي الاجتماعي', hours: '9 ص – 12 م', booked: 22 },
  { key: 'kids', name: 'منطقة الأطفال', hours: '9 ص – 9 م', booked: 6 },
];

/* ---------------- A9 collection ---------------- */

export const overdueDefs = [
  { unit: 'فيلا 45', name: 'ماجد البقمي', amount: '7,400', days: 12 },
  { unit: 'فيلا 152', name: 'فهد الشمري', amount: '148,200', days: 6 },
  { unit: 'شقة 3-14', name: 'العنود الرشيد', amount: '3,050', days: 9 },
  { unit: 'فيلا 201', name: 'بندر المالكي', amount: '7,400', days: 21 },
  { unit: 'شقة 7-02', name: 'ريم الشهري', amount: '3,050', days: 4 },
];

/* ---------------- A10 SLA ---------------- */

export const slaDefs = [
  { cat: 'سباكة', actual: 14, target: 24 },
  { cat: 'كهرباء', actual: 11, target: 24 },
  { cat: 'تكييف', actual: 31, target: 24 },
  { cat: 'نجارة', actual: 20, target: 36 },
  { cat: 'مناطق مشتركة', actual: 52, target: 48 },
];

export const SLA_MAX_HOURS = 60;

/* ---------------- A11 lost moderation ---------------- */

export const initialLostMod = [
  { title: 'سماعة بلوتوث', loc: 'ملعب كرة القدم', by: 'فيلا 88', date: 'اليوم', kind: 'found', state: 'pending' },
  { title: 'مفتاح سيارة', loc: 'بجوار البوابة الرئيسية', by: 'فيلا 12', date: 'أمس', kind: 'found', state: 'approved' },
  { title: 'قطة رمادية صغيرة', loc: 'الحديقة المركزية', by: 'فيلا 214', date: 'اليوم', kind: 'lost', state: 'pending' },
  { title: 'نظارة شمسية رياضية', loc: 'الجيم', by: 'فيلا 45', date: 'منذ 3 أيام', kind: 'found', state: 'approved' },
];

/* ---------------- A13 gate log ---------------- */

export const gateLog = [
  { name: 'مشاري الحمود (زائر)', unit: 'فيلا 96', in: 'اليوم 5:04 م', out: '—', status: 'داخل الكمبوند', inside: true },
  { name: 'شركة كلين هوم', unit: 'فيلا 88', in: 'اليوم 1:12 م', out: 'اليوم 4:50 م', status: 'غادر', inside: false },
  { name: 'أسرة د. حاتم الشريف (3 أفراد)', unit: 'فيلا 214', in: 'أمس 7:30 م', out: 'أمس 11:15 م', status: 'غادر', inside: false },
  { name: 'مندوب توصيل', unit: 'شقة 3-14', in: 'أمس 2:20 م', out: 'أمس 2:35 م', status: 'غادر', inside: false },
  { name: 'كابتن عمر (مدرب)', unit: 'النادي', in: 'أمس 9:00 ص', out: 'أمس 12:00 م', status: 'غادر', inside: false },
];

/* ---------------- A14 sentiment ---------------- */

export const sentimentDefs = [
  { cat: 'الصيانة', count: 45, pos: true, pct: 82, note: 'أشاد السكان بسرعة الاستجابة' },
  { cat: 'الأمن', count: 41, pos: true, pct: 88, note: 'ثقة عالية في فريق البوابات' },
  { cat: 'التواصل', count: 38, pos: false, pct: 34, note: 'بلاغات من تأخر الرد على الرسائل' },
  { cat: 'النظافة', count: 36, pos: true, pct: 71, note: 'تحسن ملحوظ بعد تغيير المورد' },
  { cat: 'المرافق', count: 29, pos: true, pct: 76, note: 'طلبات لزيادة مواعيد المسبح' },
  { cat: 'السداد', count: 25, pos: false, pct: 46, note: 'طلب تفعيل التقسيط على الرسوم' },
];

/* ---------------- A15 scoring ---------------- */

export const initialScoreRules = [
  { label: 'سداد في الموعد (شهريًا)', val: 40 },
  { label: 'تقييم بلاغ بعد الحل', val: 15 },
  { label: 'حضور فعالية مجتمعية', val: 25 },
  { label: 'حجز مرفق دون تغيّب', val: 10 },
  { label: 'تأخر سداد أكثر من 15 يومًا', val: -60 },
  { label: 'إلغاء حجز متأخر', val: -20 },
];

export const scoreDist = [
  { label: 'ذهبي (800+)', count: 212, w: '30%', c: color.gold },
  { label: 'فضي (600–799)', count: 328, w: '46%', c: color.slateLight },
  { label: 'برونزي (400–599)', count: 141, w: '20%', c: '#C88A5B' },
  { label: 'تحت المراجعة (<400)', count: 31, w: '4%', c: color.coral },
];

/* ---------------- A16 messages ---------------- */

export const threadDefs = [
  { name: 'عبدالله العتيبي', unit: 'فيلا 214', unread: false },
  { name: 'نورة القحطاني', unit: 'فيلا 88', unread: true },
  { name: 'لطيفة الزهراني', unit: 'فيلا 12', unread: true },
];

export const initialThreadMsgs: Record<number, { me: boolean; text: string }[]> = {
  0: [
    { me: false, text: 'لو تكرمت، متى يوصل فني السباكة اليوم؟' },
    { me: true, text: 'الفني محمد الغامدي في الطريق إليك — الوصول المتوقع خلال 20 دقيقة.' },
  ],
  1: [{ me: false, text: 'هل يمكن حجز القاعة الكبرى لعيد ميلاد يوم الجمعة؟' }],
  2: [
    { me: false, text: 'متى يتم تفعيل بطاقة الدخول الجديدة؟' },
    { me: true, text: 'تم تفعيلها بالفعل — جربها على البوابة وأخبرنا.' },
    { me: false, text: 'تعمل الآن، شكرًا جزيلًا!' },
  ],
};

export const cannedReplies = [
  'تم استلام طلبك وجارٍ المتابعة',
  'الفني في الطريق إليك',
  'تم الحل — نرجو تقييم الخدمة',
];

/* ---------------- A17 portfolio ---------------- */

/**
 * Cities were left in Egypt by the Gulf conversion pass in the design chat —
 * corrected here to Riyadh districts to match the rest of the product.
 */
export const portfolioDefs = [
  { name: 'حدائق الأندلس', city: 'شمال الرياض', units: 712, collection: '87%', open: '12', csat: '4.2' },
  { name: 'قرطبة هيلز', city: 'شرق الرياض', units: 1250, collection: '91%', open: '28', csat: '4.4' },
  { name: 'النخيل ريزيدنس', city: 'غرب الرياض', units: 486, collection: '78%', open: '9', csat: '3.9' },
];

export const portfolioBars = [
  { name: 'قرطبة هيلز', val: '91%', w: '91%', c: color.green },
  { name: 'حدائق الأندلس', val: '87%', w: '87%', c: color.gold },
  { name: 'النخيل ريزيدنس', val: '78%', w: '78%', c: color.coral },
];

/* ---------------- A18 predictive ---------------- */

export const assetDefs = [
  { name: 'مضخة المياه الرئيسية — رقم 2', loc: 'غرفة المضخات', last: 'منذ 14 شهرًا', risk: 'مرتفع 84%', level: 'high' },
  { name: 'مصعد البرج B', loc: 'الحي الشرقي', last: 'منذ 9 أشهر', risk: 'مرتفع 71%', level: 'high' },
  { name: 'تشيلر النادي الاجتماعي', loc: 'النادي', last: 'منذ 7 أشهر', risk: 'متوسط 55%', level: 'mid' },
  { name: 'بوابة الجراج الآلية — مدخل 3', loc: 'البوابة الجنوبية', last: 'منذ 4 أشهر', risk: 'منخفض 22%', level: 'low' },
];

/* ---------------- A19 IoT ---------------- */

export const iotZones = [
  { name: 'حي الياسمين', val: '61.2 م.و.س', w: '78%', c: color.gold, anomaly: false },
  { name: 'الحي الشرقي', val: '74.8 م.و.س', w: '95%', c: color.coral, anomaly: true },
  { name: 'الحي الغربي', val: '48.1 م.و.س', w: '61%', c: color.gold, anomaly: false },
  { name: 'المرافق المشتركة', val: '30.5 م.و.س', w: '39%', c: '#2B5A8C', anomaly: false },
];

export const IOT_CONNECTED = 683;
export const IOT_TOTAL = 712;
