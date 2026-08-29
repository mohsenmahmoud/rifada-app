import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Wordmark } from '../Brand';
import { icons } from '../data/icons';
import { serviceDefs } from '../data/services';
import { UNIT_NO, UNIT_SHORT } from '../data/seed';
import { fmt, statementTotal } from '../data/payments';
import { useResident } from '../store';

const HERO_IMG = `${import.meta.env.BASE_URL}img/hero-compound.webp`;

/** R4 — Home dashboard. The first-impression screen; kept pixel-tight. */
export function Home() {
  const { st, cfg, go, isRent, paid, firstName, initials, can, lockToast } = useResident();

  const heroLabel = paid
    ? 'كل المستحقات مسددة'
    : isRent
      ? 'المستحق حتى 25 يوليو'
      : 'القسط القادم — 1 سبتمبر';
  const total = statementTotal(isRent);
  const heroAmount = paid ? '0 ريال' : `${fmt(total)} ريال`;
  const heroSub = paid
    ? 'شكرًا لالتزامك بالسداد'
    : isRent
      ? `إيجار شهري · ${UNIT_SHORT}`
      : 'تقسيط تمليك · سنة 3 من 8';

  // move-in completion, computed off the receive checklist only
  let done = 0;
  let tot = 0;
  st.moveRooms.receive.forEach((r) =>
    r.items.forEach((it) => {
      tot++;
      if (it.done) done++;
    }),
  );
  const movePct = Math.round((done / tot) * 100);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ padding: '64px 20px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Wordmark size={28} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: color.navy, lineHeight: 1.3 }}>
            {cfg.compoundName}
          </span>
          <span style={{ fontSize: 10.5, color: color.slate }}>صباح الخير، {firstName}</span>
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
          {initials}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 130px' }}>
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
              backgroundImage: `url(${HERO_IMG})`,
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
            {UNIT_NO}
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
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                {heroLabel}
              </span>
              <span
                style={{
                  ...numeric,
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.25,
                  textShadow: '0 1px 5px rgba(0,0,0,0.4)',
                }}
              >
                {heroAmount}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                {heroSub}
              </span>
            </div>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => (can('pay') ? go('pay') : lockToast())}
              style={{
                pointerEvents: 'auto',
                border: 'none',
                cursor: 'pointer',
                background: paid ? color.green : color.gold,
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
              {paid ? 'تم السداد ✓' : 'ادفع الآن'}
            </button>
          </div>
        </div>

        {/* services grid */}
        <div style={{ display: 'flex', alignItems: 'baseline', margin: '22px 2px 10px' }}>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: color.navy }}>خدماتك</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {serviceDefs.map((s) => {
            const ok = can(s.perm);
            return (
              <button
                key={s.label}
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
                  textAlign: 'right',
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
                  {s.label}
                </span>
                {!ok && <LockBadge />}
              </button>
            );
          })}
        </div>

        {/* move-in teaser */}
        <button
          onClick={() => go('movein')}
          style={{
            width: '100%',
            marginTop: 14,
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'right',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>
              قائمة الاستلام — {UNIT_SHORT}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              متبقي 3 أيام على الاستلام · {movePct}% مكتمل
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <span
            style={{
              background: color.gold,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            متابعة
          </span>
        </button>

        {/* announcement teaser */}
        <button
          onClick={() => go('notifs')}
          style={{
            width: '100%',
            marginTop: 10,
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: 18,
            padding: '13px 16px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textAlign: 'right',
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 99,
              background: 'rgba(228,103,90,0.13)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={icons.bell} size={17} stroke={color.coral} width={1.6} />
          </span>
          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: color.navy, lineHeight: 1.5 }}>
            انقطاع مياه مؤقت يوم الخميس من 10 صباحًا حتى 2 ظهرًا
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: color.gold, whiteSpace: 'nowrap' }}>
            عرض الكل
          </span>
        </button>
      </div>

      {/* chat FAB */}
      <button
        onClick={() => go('chat')}
        aria-label="محادثة الإدارة"
        style={{
          position: 'absolute',
          bottom: 104,
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
        <div style={{ fontSize: 21, fontWeight: 900, color: color.navy }}>خدماتك</div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 18px 130px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {serviceDefs.map((s) => {
          const ok = can(s.perm);
          return (
            <button
              key={s.label}
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
                textAlign: 'right',
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
                  {s.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: ok ? '#8A9199' : '#B4B0A6' }}>
                  {s.sub}
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
 * Services hub — the merge the user asked for: one door for «اطلب مقدم خدمة»
 * (instant matching) and one for «ارفع بلاغ للإدارة» (ticket queue).
 */
export function ServiceHub() {
  const { st, go } = useResident();
  const open = st.tickets.filter((t) => t.status !== 'resolved').length;
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => go('home')}
          aria-label="رجوع"
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
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>الخدمات</div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <button
          onClick={() => go('reqService')}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: 22,
            padding: '22px 20px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 8px 24px rgba(31,59,87,0.25)',
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 15,
              background: 'rgba(199,154,60,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon path="M13 2L4 14h6l-1 8 9-12h-6z" size={24} stroke={color.gold} />
          </span>
          <span style={{ fontSize: 16.5, fontWeight: 900, color: '#fff' }}>اطلب مقدم خدمة</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
            مطابقة فورية مع أقرب فني متاح — سباكة، كهرباء، تنظيف وغيرها. تدفع بضمان رفادة ولا يُحوَّل
            المبلغ إلا بعد رضاك.
          </span>
          <span
            style={{
              background: 'rgba(199,154,60,0.2)',
              color: color.goldSoft,
              borderRadius: radius.pill,
              padding: '4px 14px',
              fontSize: 10.5,
              fontWeight: 800,
              alignSelf: 'flex-start',
            }}
          >
            يصلك خلال دقائق ⚡
          </span>
        </button>

        <button
          onClick={() => go('maintList')}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: 22,
            padding: '22px 20px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: shadow.card,
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 15,
              background: 'rgba(31,59,87,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon path={icons.file} size={24} />
          </span>
          <span style={{ fontSize: 16.5, fontWeight: 900, color: color.navy }}>
            ارفع بلاغ للإدارة وتابعه
          </span>
          <span style={{ fontSize: 12, color: color.slate, lineHeight: 1.8 }}>
            بلاغات الصيانة والمناطق المشتركة تذهب لمكتب إدارة الكمبوند — تابع حالتها خطوة بخطوة وقيّم
            الحل.
          </span>
          <span
            style={{
              background: 'rgba(63,166,107,0.12)',
              color: color.greenDeep,
              borderRadius: radius.pill,
              padding: '4px 14px',
              fontSize: 10.5,
              fontWeight: 800,
              alignSelf: 'flex-start',
            }}
          >
            {open > 0 ? `${open} بلاغات مفتوحة` : 'لا توجد بلاغات مفتوحة'}
          </span>
        </button>
      </div>
    </div>
  );
}
