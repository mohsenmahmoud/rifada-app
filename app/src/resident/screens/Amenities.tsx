import { color, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { amenDefs } from '../data/amenities';
import { icons } from '../data/icons';
import { useResident } from '../store';
import { t } from '@/i18n/lang';

/** R8 — Amenity list with inline slots. */
export function Amenities() {
  const { go, set } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('حجز المرافق')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {amenDefs.map((a) => (
          <Card key={a.name} pad={16} style={{ borderRadius: 18, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 13,
                  background: color.tile,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={a.icon} size={22} width={1.6} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: color.navy }}>{a.name}</span>
                <span style={{ fontSize: 11.5, color: color.slate }}>{a.sub}</span>
              </span>
              <span style={{ flex: 1 }} />
              <StatusPill tone="green">{t('متاح اليوم')}</StatusPill>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {a.slots.map((sl) => (
                <button
                  key={sl}
                  onClick={() =>
                    go('amenConfirm', { bookAmen: a.name, bookSlot: sl, bookIconPath: a.icon })
                  }
                  style={{
                    borderRadius: radius.pill,
                    padding: '7px 16px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: color.bg,
                    color: color.navy,
                    border: '1.5px solid rgba(31,59,87,0.15)',
                  }}
                >
                  {sl}
                </button>
              ))}
            </div>

            {a.hasTrainer && (
              <button
                onClick={() => {
                  set({ reqKind: t('تدريب رياضي') });
                  go('reqService');
                }}
                style={{
                  width: '100%',
                  marginTop: 10,
                  border: `1.5px dashed ${color.gold}`,
                  background: 'rgba(199,154,60,0.07)',
                  borderRadius: radius.tile,
                  padding: 10,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 800,
                  color: color.goldDeep,
                }}
              >
                احجز مدرب شخصي — عبر المطابقة الفورية
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/** R9 — Booking confirmation. */
export function AmenConfirm() {
  const { st, back, go, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="تأكيد الحجز" onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 30px' }}>
        <Card pad="22px 18px" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.card,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon path={st.bookIconPath ?? icons.amen} size={30} width={1.6} />
          </span>
          <div style={{ fontSize: 18, fontWeight: 900, color: color.navy, marginTop: 12 }}>
            {st.bookAmen}
          </div>
          <div style={{ width: '100%', marginTop: 16 }}>
            <Row label="التاريخ" value="اليوم — الجمعة 10 يوليو" />
            <Row label="الوقت" value={st.bookSlot ?? ''} />
            <Row label="المدة" value="ساعة واحدة" last />
          </div>
        </Card>
        <div style={{ fontSize: 11.5, color: color.slate, textAlign: 'center', marginTop: 12, lineHeight: 1.8 }}>
          يمكنك إلغاء الحجز حتى ساعتين قبل الموعد دون أي رسوم.
        </div>
      </div>

      <div style={{ padding: '0 20px 34px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PillButton
          size="lg"
          full
          onClick={() => {
            go('amenDone');
            showToast(`تم تأكيد حجز ${st.bookAmen}`);
          }}
        >
          تأكيد الحجز
        </PillButton>
        <PillButton tone="outline" full onClick={back} style={{ padding: 12, fontSize: 14 }}>
          إلغاء
        </PillButton>
      </div>
    </div>
  );
}

/** R9b — Booking success with the entry QR. */
export function AmenDone() {
  const { st, go } = useResident();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 26px',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 99,
          background: 'rgba(63,166,107,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon path={icons.check} size={42} stroke={color.green} width={2.6} />
      </div>
      <div style={{ fontSize: 21, fontWeight: 900, color: color.navy, marginTop: 18 }}>
        تم تأكيد حجزك
      </div>
      <div style={{ fontSize: 13.5, color: color.slate, marginTop: 6 }}>
        {st.bookAmen} — اليوم، {st.bookSlot}
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: radius.card,
          padding: 18,
          boxShadow: shadow.card,
          marginTop: 22,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon path={icons.qr} size={86} width={1.4} />
        <span style={{ fontSize: 11.5, color: color.slate }}>{t('أظهر هذا الرمز عند الدخول')}</span>
      </div>
      <PillButton size="lg" full onClick={() => go('home')} style={{ marginTop: 26 }}>
        العودة للرئيسية
      </PillButton>
    </div>
  );
}

function Row({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '11px 4px',
        borderBottom: last ? undefined : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: 12.5, color: color.slate }}>{label}</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: color.navy }}>{value}</span>
    </div>
  );
}
