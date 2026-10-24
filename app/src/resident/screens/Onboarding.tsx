import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton } from '@/ui/primitives';
import { Wordmark } from '../Brand';
import { icons } from '../data/icons';
import { UNIT } from '../data/seed';
import { useResident } from '../store';
import { t } from '@/i18n/lang';

/**
 * R1 — Splash and sign-up. The invite code is gone: you register with the
 * phone number the compound office already has on file, which is the point of
 * the note at the foot — there are no anonymous accounts.
 */
export function Splash() {
  const { st, set, go } = useResident();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.navy,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1.15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 26px 0',
        }}
      >
        <span
          style={{
            width: 96,
            height: 96,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wordmark size={46} onDark />
        </span>
        <div
          style={{
            fontSize: 46,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            marginTop: 20,
            textShadow: '0 2px 24px rgba(0,0,0,0.25)',
          }}
        >
          {t('رفادة')}
        </div>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(199,154,60,0.95)',
            letterSpacing: 9,
            marginTop: 8,
            paddingInlineStart: 9,
          }}
        >
          RIFADA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '22px 0 15px' }}>
          <span
            style={{
              width: 26,
              height: 1,
              background: 'linear-gradient(to left, rgba(199,154,60,0.7), transparent)',
            }}
          />
          <span style={{ width: 5, height: 5, borderRadius: 99, background: color.gold }} />
          <span
            style={{
              width: 26,
              height: 1,
              background: 'linear-gradient(to right, rgba(199,154,60,0.7), transparent)',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.9,
            textAlign: 'center',
            maxWidth: 290,
          }}
        >
          {t('سندك في حيّك.. وكل ما تحتاجه أقرب')}
        </div>
      </div>

      <div style={{ padding: '0 20px 40px' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '24px 22px 20px',
            boxShadow: shadow.card,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: color.goldDeep }}>
            {t('أهلًا بك في حيّك')}
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: color.navy, marginTop: 5 }}>
            {t('سجل برقم جوالك')}
          </div>
          <div style={{ fontSize: 11.5, color: color.slate, marginTop: 5, lineHeight: 1.8 }}>
            {t('يوصلك كود تحقق برسالة SMS، وتظهر وحدتك وبياناتك تلقائيًا')}
          </div>
          <div
            dir="ltr"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid rgba(31,59,87,0.14)',
              borderRadius: 14,
              marginTop: 16,
              padding: '3px 16px',
            }}
          >
            <Icon
              path={icons.call}
              size={16}
              stroke={color.slate}
              width={1.5}
              style={{ flex: 'none', marginRight: 10 }}
            />
            <input
              value={st.invite}
              onChange={(e) => set({ invite: e.target.value })}
              placeholder="01001110001"
              inputMode="tel"
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                background: 'transparent',
                padding: '13px 0',
                ...numeric,
                fontSize: 16.5,
                fontWeight: 600,
                direction: 'ltr',
                textAlign: 'left',
                letterSpacing: 1.5,
                color: color.navy,
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => go('otp')}
            style={{
              width: '100%',
              marginTop: 14,
              border: 'none',
              cursor: 'pointer',
              background: color.navy,
              color: '#fff',
              borderRadius: radius.pill,
              padding: 15,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: font.sans,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
            }}
          >
            {t('أرسل كود التحقق')}
            <Icon
              path="M5 12h14M13 6l6 6-6 6"
              size={15}
              stroke="#fff"
              width={2}
              style={{ transform: 'scaleX(-1)' }}
            />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 16,
            justifyContent: 'center',
            padding: '0 10px',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }}>
            <path
              d="M12 2l7 4v5c0 5-3 8.5-7 11-4-2.5-7-6-7-11V6z"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke={color.gold}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontSize: 10.5,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            {t('رقمك مسجّل مسبقًا لدى إدارة الكمبوند — لا حسابات مجهولة')}
          </span>
        </div>
      </div>
    </div>
  );
}

/** R2 — OTP verification. */
export function Otp() {
  const { cfg, back, go, showToast } = useResident();
  const digits = ['7', '2', '4', '9'];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: '66px 22px 30px',
        boxSizing: 'border-box',
      }}
    >
      <BackButton onClick={back} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            background: 'rgba(199,154,60,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.phone} size={30} stroke={color.gold} />
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, color: color.navy, marginTop: 16 }}>
          {t('تحقق من رقم جوالك')}
        </div>
        <div style={{ fontSize: 13, color: color.slate, marginTop: 6 }}>
          {t('تم إرسال كود التحقق إلى')}{' '}
          <span dir="ltr" style={{ fontFamily: font.mono, fontWeight: 600 }}>
            050 123 4567
          </span>
        </div>
        <div dir="ltr" style={{ display: 'flex', gap: 10, marginTop: 26 }}>
          {digits.map((d, i) => {
            const last = i === digits.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 62,
                  background: '#fff',
                  borderRadius: radius.inner,
                  boxShadow: last ? undefined : shadow.card,
                  border: last ? `2px solid ${color.gold}` : undefined,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...numeric,
                  fontSize: 24,
                  fontWeight: 700,
                  color: last ? color.gold : color.navy,
                }}
              >
                {t(d)}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12.5, color: color.slate, marginTop: 18 }}>
          {t('لم يصلك الكود؟')}{' '}
          <span style={{ color: color.gold, fontWeight: 700 }}>{t('إعادة الإرسال خلال 00:24')}</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      {/* Verification now lands straight on the home screen. The account is
          already on file against the phone number, so there is nothing left to
          set up — which is why the design dropped R3 from its own map. */}
      <button
        onClick={() => {
          go('home');
          showToast(`${t('حياك الله في')} ${t(cfg.compoundName)}`);
        }}
        style={{
          width: '100%',
          border: 'none',
          cursor: 'pointer',
          background: color.navy,
          color: '#fff',
          borderRadius: radius.pill,
          padding: 14,
          fontSize: 15,
          fontWeight: 800,
          fontFamily: font.sans,
        }}
      >
        {t('تحقق ومتابعة')}
      </button>
    </div>
  );
}

/** R3 — Account setup, with the unit prefilled from the invite code. */
export function Setup() {
  const { back, go, cfg, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('إنشاء الحساب')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 22px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 18px' }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 99,
              border: `2px dashed ${'rgba(31,59,87,0.3)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: '#fff',
            }}
          >
            <Icon path={icons.camera} size={24} stroke={color.slate} width={1.5} />
            <span style={{ fontSize: 9.5, color: color.slate }}>{t('إضافة صورة')}</span>
          </div>
        </div>

        <FieldLabel>{t('الاسم الكامل')}</FieldLabel>
        <input
          // Pre-filled but editable, so it stays uncontrolled. Keying it on the
          // translated name re-initialises the field when the language changes,
          // which an uncontrolled input would otherwise ignore.
          key={t(cfg.residentName)}
          defaultValue={t(cfg.residentName)}
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 14.5,
            fontWeight: 600,
            color: color.navy,
            boxShadow: shadow.card,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />

        <FieldLabel style={{ marginTop: 16 }}>{t('الوحدة')}</FieldLabel>
        <div
          style={{
            background: 'rgba(199,154,60,0.12)',
            border: '1px solid rgba(199,154,60,0.4)',
            borderRadius: radius.inner,
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: color.navy }}>{t(UNIT)}</span>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: color.goldDeep,
              background: 'rgba(199,154,60,0.18)',
              borderRadius: radius.pill,
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {t('مرتبطة برقم جوالك')}
          </span>
        </div>

        <FieldLabel style={{ marginTop: 16 }}>{t('الرقم السري (PIN)')}</FieldLabel>
        <input
          type="password"
          defaultValue="1234"
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 14.5,
            letterSpacing: 6,
            color: color.navy,
            boxShadow: shadow.card,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />
      </div>

      <div style={{ padding: '0 22px 34px' }}>
        <button
          onClick={() => {
            go('home');
            showToast(t('أهلًا بك في رفادة — وحدتك جاهزة'));
          }}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: color.gold,
            color: '#fff',
            borderRadius: radius.pill,
            padding: 14,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: font.sans,
          }}
        >
          {t('إنشاء الحساب والدخول')}
        </button>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 6, ...style }}>
      {children}
    </div>
  );
}
