import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton } from '@/ui/primitives';
import { Wordmark } from '../Brand';
import { icons } from '../data/icons';
import { UNIT } from '../data/seed';
import { useResident } from '../store';
import { t } from '@/i18n/lang';

/** R1 — Splash / invite-code entry. */
export function Splash() {
  const { st, set, go } = useResident();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(170deg,${color.navyLight} 0%,${color.navy} 45%,${color.navyDeep} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '130px 26px 46px',
        boxSizing: 'border-box',
      }}
    >
      <Wordmark size={66} onDark />
      <div style={{ fontSize: 46, fontWeight: 900, color: '#fff', marginTop: 10, lineHeight: 1.2 }}>
        {t('رفادة')}
      </div>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 13,
          fontWeight: 600,
          color: color.gold,
          letterSpacing: 6,
          marginTop: 2,
        }}
      >
        RIFADA
      </div>
      <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.75)', marginTop: 14 }}>
        {t('سندك في حيّك.. وكل ما تحتاجه أقرب')}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: radius.card,
          padding: 18,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
          {t('أدخل كود الدعوة الخاص بوحدتك')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={st.invite}
            onChange={(e) => set({ invite: e.target.value })}
            placeholder="RFD-2146-A"
            style={{
              flex: 1,
              minWidth: 0,
              background: '#fff',
              border: 'none',
              borderRadius: radius.tile,
              padding: '12px 14px',
              fontFamily: font.mono,
              fontSize: 15,
              fontWeight: 600,
              direction: 'ltr',
              textAlign: 'center',
              letterSpacing: 2,
              color: color.navy,
            }}
          />
          <button
            title={t('مسح QR')}
            style={{
              width: 48,
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: radius.tile,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon path={icons.qr} size={20} stroke="#fff" width={1.6} />
          </button>
        </div>
        <button
          onClick={() => go('otp')}
          style={{
            width: '100%',
            marginTop: 12,
            border: 'none',
            cursor: 'pointer',
            background: color.gold,
            color: '#fff',
            borderRadius: radius.pill,
            padding: 13,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: font.sans,
          }}
        >
          {t('متابعة')}
        </button>
      </div>
      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 12 }}>
        {t('الكود موجود في رسالة الترحيب من إدارة الكمبوند')}
      </div>
    </div>
  );
}

/** R2 — OTP verification. */
export function Otp() {
  const { back, go } = useResident();
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
      <button
        onClick={() => go('setup')}
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
          defaultValue={cfg.residentName}
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
            {t('من كود الدعوة')}
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
            showToast('أهلًا بك في رفادة — وحدتك جاهزة');
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
