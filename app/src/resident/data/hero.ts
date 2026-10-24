import type { ScreenKey } from '../types';

/**
 * The home hero (R4). It used to be a single dues card; the latest design
 * turns it into an auto-rotating carousel that advances every 4 seconds.
 *
 * The dues slide is prepended only while there is a balance, so the rotation
 * is five slides for an unpaid resident and four once they have paid. The dot
 * row and the image both key off the same index.
 */

const img = (f: string) => `${import.meta.env.BASE_URL}img/${f}`;

/** Slide 0 of the dues variant — the resident's own unit. */
export const HERO_DUES_IMG = img('hero-user.webp');

export type HeroSlide = {
  label: string;
  title: string;
  sub: string;
  cta: string;
  dest: ScreenKey;
  img: string;
  /** The festival slide carries a countdown pill and a row of faces. */
  ev?: { count: string; going: string };
};

export const heroPromoSlides: HeroSlide[] = [
  {
    label: '25 يوليو · الجمعة 7 م',
    title: 'مهرجان الصيف السنوي',
    sub: 'النادي الاجتماعي · إدارة الكمبوند — الدخول مجاني',
    cta: 'احجز مكانك',
    dest: 'feed',
    img: img('hero-fest.jpg'),
    ev: { count: 'بعد 3 أيام', going: '214 من جيرانك ذاهبون' },
  },
  {
    label: 'عرض من المتجر',
    title: 'خصم 15% — مطعم بيت الجيران',
    sub: 'اليوم فقط · توصيل مجاني للطلبات فوق 200 ريال',
    cta: 'اطلب الآن',
    dest: 'food',
    img: img('hero-food.jpg'),
  },
  {
    label: 'تجديد العقد',
    title: 'شهر صيانة مجاني عند التجديد',
    sub: 'عند تجديد عقد الخدمات سنة كاملة قبل 30 سبتمبر',
    cta: 'اعرف أكثر',
    dest: 'renew',
    img: img('rephoto0.jpg'),
  },
  {
    label: 'مجتمع الحي',
    title: 'نادي الجري — لقاء السبت 6 ص',
    sub: '46 جارًا مشتركين · كل المستويات مرحّب بها',
    cta: 'انضم',
    dest: 'feed',
    img: img('hero-run.jpg'),
  },
];

/** The stacked avatars under the festival slide. */
export const heroEvFaces = [
  { i: 'م', bg: 'linear-gradient(160deg,#27496F,#1F3B57)' },
  { i: 'ه', bg: 'linear-gradient(160deg,#8A5A83,#5C3A57)' },
  { i: 'ك', bg: 'linear-gradient(160deg,#3E7A5E,#2A5741)' },
  { i: 'ط', bg: 'linear-gradient(160deg,#8A6D3B,#5C4A2A)' },
];

/** How often the carousel advances, in milliseconds. */
export const HERO_INTERVAL = 4000;
