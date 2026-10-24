import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Wordmark } from '../Brand';
import { icons } from '../data/icons';
import { serviceDefs } from '../data/services';
import { HERO_DUES_IMG, heroEvFaces, heroPromoSlides, type HeroSlide } from '../data/hero';
import { UNIT_NO, UNIT_SHORT } from '../data/seed';
import { fmt, statementTotal } from '../data/payments';
import { useResident } from '../store';
import { t } from '@/i18n/lang';

/** R4 — Home dashboard. The first-impression screen; kept pixel-tight. */
export function Home() {
  const { st, cfg, set, go, isRent, paid, firstName, initials, can, lockToast, showToast } =
    useResident();

  // The dues slide leads the rotation, and drops out once the balance clears.
  const total = statementTotal(isRent);
  const duesSlide: HeroSlide = {
    label: isRent ? 'المستحق حتى 25 يوليو — باقي 5 أيام' : 'القسط القادم — 1 سبتمبر',
    title: `${fmt(total)} ${t('ريال')}`,
    sub: isRent ? `${t('إيجار شهري ·')} ${t(UNIT_SHORT)}` : 'تقسيط تمليك · سنة 3 من 8',
    cta: 'ادفع الآن',
    dest: 'pay',
    img: HERO_DUES_IMG,
  };
  const slides = paid ? heroPromoSlides : [duesSlide, ...heroPromoSlides];
  const idx = st.heroIdx % slides.length;
  const slide = slides[idx];
  const isDues = !paid && idx === 0;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ padding: '64px 20px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Wordmark size={28} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: color.navy, lineHeight: 1.3 }}>
            {t(cfg.compoundName)}
          </span>
          <span style={{ fontSize: 10.5, color: color.slate }}>{t('صباح الخير،')} {t(firstName)}</span>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => go('notifs')}
          aria-label="الإشعارات"
          style={{
            position: 'relative',
            width: 42,
            height: 42,
            borderRadius: 99,
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.bell} size={19} width={1.6} />
          <span
            style={{
              position: 'absolute',
              top: 9,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: 99,
              background: color.coral,
              border: '1.5px solid #fff',
            }}
          />
        </button>
        <button
          onClick={() => go('profile')}
          aria-label="الملف الشخصي"
          style={{
            width: 42,
            height: 42,
            borderRadius: 99,
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            color: '#fff',
            fontFamily: font.sans,
            fontSize: 14,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {t(initials)}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 40px' }}>
        {/* hero card */}
        <div
          style={{
            position: 'relative',
            height: 212,
            borderRadius: radius.card,
            overflow: 'hidden',
            boxShadow: shadow.cardLift,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(160deg,${color.navyLift},${color.navy})`,
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Darkening ramp — strengthened during the design chat so the amount
              stays legible over any compound photo. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(195deg,rgba(21,42,63,0) 20%,rgba(21,42,63,0.55) 55%,rgba(21,42,63,0.92) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: 'rgba(255,255,255,0.94)',
              borderRadius: radius.pill,
              padding: '4px 14px',
              fontSize: 12,
              fontWeight: 800,
              color: color.navy,
            }}
          >
            {t(UNIT_NO)}
          </div>
          {/* carousel position */}
          <div style={{ position: 'absolute', top: 22, right: 16, display: 'flex', gap: 5 }}>
            {slides.map((s, i) => (
              <span
                key={s.title}
                style={{
                  width: i === idx ? 18 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === idx ? color.gold : 'rgba(255,255,255,0.5)',
                  transition: 'all .3s',
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              right: 16,
              left: 16,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {slide.ev && (
                  <span
                    style={{
                      background: color.gold,
                      color: '#fff',
                      borderRadius: radius.pill,
                      padding: '3px 12px',
                      fontSize: 9.5,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t(slide.ev.count)}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {t(slide.label)}
                </span>
              </span>
              <span
                style={{
                  // The dues figure is a number and sets in the Latin face;
                  // every other slide is a headline and stays in Cairo.
                  ...(isDues ? numeric : { fontFamily: font.sans }),
                  fontSize: isDues ? 26 : 21,
                  fontWeight: isDues ? 700 : 900,
                  color: '#fff',
                  lineHeight: 1.35,
                  textShadow: '0 1px 5px rgba(0,0,0,0.4)',
                }}
              >
                {t(slide.title)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                {t(slide.sub)}
              </span>
              {slide.ev && (
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}
                >
                  <span style={{ display: 'flex' }}>
                    {heroEvFaces.map((f) => (
                      <span
                        key={f.i}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 99,
                          background: f.bg,
                          border: '2px solid rgba(255,255,255,0.85)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 800,
                          marginInlineStart: -7,
                        }}
                      >
                        {f.i}
                      </span>
                    ))}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.85)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      whiteSpace: 'nowrap',
                      marginInlineEnd: 9,
                    }}
                  >
                    {t(slide.ev.going)}
                  </span>
                </span>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <button
              onClick={() =>
                slide.dest === 'pay' && !can('pay') ? lockToast() : go(slide.dest)
              }
              style={{
                pointerEvents: 'auto',
                border: 'none',
                cursor: 'pointer',
                background: color.gold,
                color: '#fff',
                borderRadius: radius.pill,
                padding: '10px 22px',
                fontSize: 13.5,
                fontWeight: 800,
                fontFamily: font.sans,
                boxShadow: shadow.button,
                whiteSpace: 'nowrap',
              }}
            >
              {t(slide.cta)}
            </button>
          </div>
        </div>

        {/* Live alert strip — a running incident, dismissed when it clears. */}
        {st.alertOn && (
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: '12px 14px',
              boxShadow: shadow.card,
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'rgba(228,103,90,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon
                path="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"
                size={18}
                stroke={color.coral}
                width={1.5}
              />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: color.coral,
                    animation: 'pulse 1.4s ease infinite',
                  }}
                />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#B24439' }}>
                  {t('جارٍ الآن')}
                </span>
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: color.navy, lineHeight: 1.6 }}>
                {t('انقطاع مياه مؤقت الآن حتى 2 ظهرًا — أعمال صيانة بشبكة المياه الرئيسية')}
              </span>
            </span>
            <button
              onClick={() => {
                set({ alertOn: false });
                showToast(t('انتهى الانقطاع — اختفى التنبيه من الرئيسية'));
              }}
              title={t('انتهى الانقطاع (محاكاة)')}
              style={{
                border: 'none',
                background: color.bg,
                cursor: 'pointer',
                color: color.slate,
                fontSize: 12,
                fontWeight: 800,
                padding: '6px 10px',
                borderRadius: radius.pill,
                flex: 'none',
                fontFamily: font.sans,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* services grid */}
        <div style={{ display: 'flex', alignItems: 'baseline', margin: '22px 2px 10px' }}>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: color.navy }}>{t('خدماتك')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {serviceDefs.map((s) => {
            const ok = can(s.perm);
            return (
              <button
                key={t(s.label)}
                onClick={() => (ok ? go(s.dest) : lockToast())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: ok ? '#fff' : '#EFECE4',
                  border: 'none',
                  borderRadius: 18,
                  padding: 13,
                  boxShadow: shadow.card,
                  cursor: 'pointer',
                  textAlign: 'start',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: ok ? color.tile : '#E4E0D6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <Icon path={s.icon} size={20} stroke={ok ? color.navy : color.slateLight} width={1.6} />
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: ok ? color.navy : color.slateLight,
                  }}
                >
                  {t(s.label)}
                </span>
                {!ok && <LockBadge />}
              </button>
            );
          })}
        </div>

        {/* The move-in and announcement teasers that used to sit here are gone
            in the latest design: the alert strip above carries live notices,
            and the move-in checklist is reached from the profile. */}
      </div>

      {/* chat FAB */}
      <button
        onClick={() => go('chat')}
        aria-label="محادثة الإدارة"
        style={{
          position: 'absolute',
          bottom: 22,
          left: 18,
          width: 52,
          height: 52,
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          background: color.navy,
          boxShadow: '0 8px 22px rgba(31,59,87,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 25,
        }}
      >
        <Icon path={icons.chat} size={23} stroke="#fff" />
      </button>
    </div>
  );
}

/** Grey lock chip on a permission-denied tile — shown, never hidden. */
function LockBadge({ inline = false }: { inline?: boolean }) {
  return (
    <span
      style={{
        position: inline ? 'static' : 'absolute',
        top: 8,
        left: 8,
        width: 18,
        height: 18,
        borderRadius: 99,
        background: color.line,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** R4b — «خدماتك» list view, reached from the bottom bar. */
export function ServicesList() {
  const { go, can, lockToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px' }}>
        <div style={{ fontSize: 21, fontWeight: 900, color: color.navy }}>{t('خدماتك')}</div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 18px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {serviceDefs.map((s) => {
          const ok = can(s.perm);
          return (
            <button
              key={t(s.label)}
              onClick={() => (ok ? go(s.dest) : lockToast())}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                background: ok ? '#fff' : '#EFECE4',
                border: 'none',
                borderRadius: 18,
                padding: '13px 16px',
                boxShadow: shadow.card,
                cursor: 'pointer',
                textAlign: 'start',
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  background: ok ? color.tile : '#E4E0D6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={s.icon} size={21} stroke={ok ? color.navy : color.slateLight} width={1.6} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: ok ? color.navy : color.slateLight }}>
                  {t(s.label)}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: ok ? '#8A9199' : '#B4B0A6' }}>
                  {t(s.sub)}
                </span>
              </span>
              {!ok && <LockBadge inline />}
              <Icon path="M15 5l-7 7 7 7" size={14} stroke={color.slateLight} width={2} style={{ flex: 'none' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * One route card on the services hub. Both roads out of here look the same
 * now: a kicker saying who handles it, the icon, the pitch, and a footer
 * pairing the time it usually takes with the way in.
 */
function RouteCard({
  kicker,
  kickerBg,
  kickerC,
  iconPath,
  iconBg,
  iconStroke,
  title,
  sub,
  meta,
  ctaC,
  onClick,
}: {
  kicker: string;
  kickerBg: string;
  kickerC: string;
  iconPath: string;
  iconBg: string;
  iconStroke: string;
  title: string;
  sub: string;
  meta: string;
  ctaC: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        background: '#fff',
        borderRadius: 20,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'start',
        boxShadow: shadow.card,
        marginBottom: 12,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <span
          style={{
            background: kickerBg,
            color: kickerC,
            borderRadius: radius.pill,
            padding: '3px 12px',
            fontSize: 9.5,
            fontWeight: 800,
          }}
        >
          {kicker}
        </span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon path={iconPath} size={22} stroke={iconStroke} width={1.5} />
        </span>
      </span>
      <span style={{ fontSize: 17.5, fontWeight: 900, color: color.navy, marginTop: 14 }}>
        {title}
      </span>
      <span style={{ fontSize: 11.5, color: color.slate, lineHeight: 1.85, marginTop: 5 }}>
        {sub}
      </span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          marginTop: 15,
          paddingTop: 13,
          borderTop: '1px solid rgba(31,59,87,0.07)',
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: color.slateLight, whiteSpace: 'nowrap' }}>
          {meta}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: ctaC }}>{t('ابدأ')} ←</span>
      </span>
    </button>
  );
}

/**
 * HUB — one door for «اطلب مقدم خدمة» (instant matching) and one for
 * «بلّغ الإدارة» (the ticket queue). The latest design levels the two: the
 * navy/white hierarchy is gone, and each card now leads with who handles it
 * and how long it usually takes, so the choice is about the route, not the
 * emphasis.
 */
export function ServiceHub() {
  const { go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => go('home')}
          aria-label={t('رجوع')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            border: 'none',
            background: '#fff',
            boxShadow: shadow.card,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.chevron} size={16} width={2} />
        </button>
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('الخدمات')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 40px' }}>
        <div
          style={{
            fontSize: 21,
            fontWeight: 900,
            color: color.navy,
            lineHeight: 1.5,
            margin: '4px 2px 16px',
          }}
        >
          {t('وش تحتاج اليوم؟')}
        </div>

        <RouteCard
          kicker={t('فوري')}
          kickerBg="rgba(199,154,60,0.15)"
          kickerC={color.goldDeep}
          iconPath={icons.wrench}
          iconBg="rgba(199,154,60,0.14)"
          iconStroke={color.goldDeep}
          title={t('اطلب مقدم خدمة')}
          sub={t('سباكة، كهرباء، تكييف، تنظيف — أقرب فني متاح يوصلك خلال دقائق')}
          meta={t('متوسط الوصول 12 دقيقة')}
          ctaC={color.goldDeep}
          onClick={() => go('reqService')}
        />

        <RouteCard
          kicker={t('عبر الإدارة')}
          kickerBg="rgba(31,59,87,0.08)"
          kickerC={color.navy}
          iconPath={icons.clipboardCheck}
          iconBg="rgba(31,59,87,0.08)"
          iconStroke={color.navy}
          title={t('بلّغ الإدارة عن مشكلة')}
          sub={t('عطل في وحدتك أو المناطق المشتركة؟ وصّله لمكتب الإدارة وتابع حالته أولًا بأول')}
          meta={t('متوسط الحل 18 ساعة')}
          ctaC={color.navy}
          onClick={() => go('maintList')}
        />
      </div>
    </div>
  );
}
