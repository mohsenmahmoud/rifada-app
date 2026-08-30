import type { CommunityPost, Comment, PostTag } from '../types';
import { avatarBg } from './seed';

const HERO = `${import.meta.env.BASE_URL}img/hero-compound.webp`;

/**
 * اسأل جيرانك (R75–R77) — a Facebook-shaped feed for the compound: posts,
 * likes, threaded replies, and attachments (image / file / link).
 *
 * Every author is a verified neighbour, so the unit number sits next to the
 * name in gold — the user asked for that specifically.
 */

export const cmTagMeta: Record<PostTag, { bg: string; c: string }> = {
  سؤال: { bg: 'rgba(31,59,87,0.08)', c: '#1F3B57' },
  توصية: { bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  عام: { bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
};

export const cmFilterDefs: { key: string; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'سؤال', label: 'أسئلة' },
  { key: 'توصية', label: 'توصيات' },
  { key: 'عام', label: 'عام' },
];

/** Unit lookup, so a comment author shows their villa too. */
export const unitOf: Record<string, string> = {
  'عبدالله العتيبي': 'فيلا 214',
  'نورة القحطاني': 'فيلا 88',
  'منيرة الدوسري': 'فيلا 96',
  'فهد الشمري': 'فيلا 152',
  'سلطان الحربي': 'فيلا 96',
};

export const cmPostDefs: (CommunityPost & { comments: Comment[] })[] = [
  {
    who: 'سلطان الحربي',
    unit: 'فيلا 96',
    avBg: avatarBg.tarek,
    time: 'منذ 30 دقيقة',
    tag: 'عام',
    text: 'صورة الكمبوند من الدرون بعد انتهاء مبادرة التشجير — شكرًا لكل جار شارك معنا',
    att: { type: 'image', name: 'الكمبوند بعد التشجير', bg: HERO },
    likes: 34,
    comments: [
      {
        who: 'نورة القحطاني',
        unit: 'فيلا 88',
        avBg: avatarBg.mona,
        time: 'منذ 20 دقيقة',
        likes: 6,
        text: 'الفرق واضح — يعطيكم العافية كل من شارك!',
        att: null,
        replies: [],
      },
    ],
  },
  {
    who: 'نورة القحطاني',
    unit: 'فيلا 88',
    avBg: avatarBg.mona,
    time: 'منذ ساعتين',
    tag: 'سؤال',
    text: 'إيش أفضل حضانة قريبة نسجّل فيها بنتي (٣ سنوات)؟ يفضّل تكون داخل الكمبوند أو عند البوابة.',
    att: null,
    likes: 12,
    comments: [
      {
        who: 'منيرة الدوسري',
        unit: 'فيلا 96',
        avBg: avatarBg.hala,
        time: 'منذ ساعة',
        likes: 5,
        text: 'حضانة ليتل ستارز جنب البوابة الشرقية ممتازة — بنتي فيها من سنة والمتابعة يومية على التطبيق.',
        att: null,
        replies: [
          {
            who: 'نورة القحطاني',
            unit: 'فيلا 88',
            avBg: avatarBg.mona,
            time: 'منذ 40 دقيقة',
            text: 'تسلمين! بحجز موعد زيارة بكرة إن شاء الله.',
            att: null,
          },
        ],
      },
      {
        who: 'فهد الشمري',
        unit: 'فيلا 152',
        avBg: avatarBg.karim,
        time: 'منذ 50 دقيقة',
        likes: 2,
        text: 'وفيه بعد Step One داخل النادي الاجتماعي — أقرب لك وأسعاره معقولة.',
        att: null,
        replies: [],
      },
    ],
  },
  {
    who: 'سلطان الحربي',
    unit: 'فيلا 96',
    avBg: avatarBg.tarek,
    time: 'منذ 5 ساعات',
    tag: 'سؤال',
    text: 'ولدي خلّص ثانوي — إيش أفضل كلية هندسة أهلية قريبة؟ وفيه مواصلات من الكمبوند؟',
    att: null,
    likes: 8,
    comments: [
      {
        who: 'نورة القحطاني',
        unit: 'فيلا 88',
        avBg: avatarBg.mona,
        time: 'منذ 4 ساعات',
        likes: 3,
        text: 'جامعة الأمير سلطان ٢٠ دقيقة من البوابة، وفيه باص خاص يمر على كمبوندات المنطقة الساعة ٧:١٥.',
        att: null,
        replies: [],
      },
    ],
  },
  {
    who: 'منيرة الدوسري',
    unit: 'فيلا 96',
    avBg: avatarBg.hala,
    time: 'أمس',
    tag: 'توصية',
    text: 'اللي يدوّر أثاث حدائق: معرض على طريق البوابة الغربية مسوّي خصم ٣٠٪ لنهاية الشهر — جودة ممتازة.',
    att: { type: 'file', name: 'قائمة أسعار جاردن هاوس.pdf', size: '1.2 MB' },
    likes: 21,
    comments: [
      {
        who: 'فهد الشمري',
        unit: 'فيلا 152',
        avBg: avatarBg.karim,
        time: 'أمس',
        likes: 4,
        text: 'أخذنا منهم طقم جلسة خارجية — فعلًا ممتاز',
        att: {
          type: 'link',
          title: 'جاردن هاوس — كتالوج المعروضات',
          url: 'gardenhouse-sa.com/catalog',
        },
        replies: [],
      },
      {
        who: 'سلطان الحربي',
        unit: 'فيلا 96',
        avBg: avatarBg.tarek,
        time: 'أمس',
        likes: 1,
        text: 'ممكن اسم المعرض بالضبط؟',
        att: null,
        replies: [
          {
            who: 'منيرة الدوسري',
            unit: 'فيلا 96',
            avBg: avatarBg.hala,
            time: 'أمس',
            text: 'جاردن هاوس — أول يمين بعد البوابة الغربية.',
            att: null,
          },
        ],
      },
    ],
  },
  {
    who: 'فهد الشمري',
    unit: 'فيلا 152',
    avBg: avatarBg.karim,
    time: 'منذ يومين',
    tag: 'عام',
    text: 'منهو جرّب يحجز حفلة ميلاد في قاعة الأنشطة؟ التجهيز زين؟ ومين أفضل أحد يسوّي الكيك في المنطقة؟',
    att: null,
    likes: 6,
    comments: [],
  },
];

export const ACTIVE_NEIGHBOURS = 312;
