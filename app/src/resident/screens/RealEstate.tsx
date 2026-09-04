import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { icons } from '../data/icons';
import { listingStateMeta, myListingDefs, reDefs } from '../data/realestate';
import { useResident } from '../store';
import { Avatar, Note } from './parts';
import { t } from '@/i18n/lang';

/** Background-image style, so a missing photo degrades to the gradient. */
const photoStyle = (src: string): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

/** R39 — Browse listings. */
function Browse() {
  const { st, set, back, go } = useResident();
  const list = reDefs.map((l, i) => ({ ...l, i })).filter((l) => l.type === st.reTab);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div
          style={{
            flex: 1,
            fontSize: 19,
            fontWeight: 800,
            color: color.navy,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t('سوق العقارات')}
        </div>
        <PillButton tone="gold" size="sm" onClick={() => go('reCreate')} style={{ padding: '8px 16px', fontSize: 11.5 }}>
          {t('+ أعلن عن وحدتك')}
        </PillButton>
      </div>

      <div style={{ padding: '6px 18px 4px', display: 'flex', gap: 8 }}>
        {[
          { k: 'sale' as const, l: t('للبيع') },
          { k: 'rent' as const, l: t('للإيجار') },
        ].map((tab) => {
          const on = st.reTab === tab.k;
          return (
            <button
              key={tab.k}
              onClick={() => set({ reTab: tab.k })}
              style={{
                flex: 1,
                border: 'none',
                cursor: 'pointer',
                borderRadius: radius.pill,
                padding: 9,
                fontSize: 12.5,
                fontWeight: 800,
                fontFamily: font.sans,
                background: on ? color.navy : '#fff',
                color: on ? '#fff' : color.slate,
                boxShadow: on ? undefined : shadow.card,
              }}
            >
              {t(tab.l)}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '8px 18px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[t('عدد الغرف ▾'), t('المساحة ▾'), t('نطاق السعر ▾')].map((f) => (
          <span
            key={f}
            style={{
              background: '#fff',
              borderRadius: radius.pill,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 700,
              color: color.slate,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              whiteSpace: 'nowrap',
            }}
          >
            {t(f)}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 40px' }}>
        {list.map((l) => (
          <button
            key={t(l.title)}
            onClick={() => go('reDetail', { selReIdx: l.i })}
            style={{
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              background: '#fff',
              borderRadius: radius.card,
              boxShadow: shadow.card,
              marginBottom: 12,
              overflow: 'hidden',
              textAlign: 'right',
              padding: 0,
            }}
          >
            <div
              style={{
                height: 120,
                background: `linear-gradient(160deg,${l.g1},${l.g2})`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={photoStyle(l.photo)} />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'rgba(255,255,255,0.92)',
                  color: color.navy,
                  borderRadius: radius.pill,
                  padding: '4px 12px',
                  fontSize: 10.5,
                  fontWeight: 800,
                }}
              >
                {l.type === 'sale' ? t('للبيع') : t('للإيجار')}
              </span>
            </div>
            <div style={{ padding: '13px 15px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: color.navy }}>
                  {t(l.price)}
                </span>
                <span style={{ fontSize: 11, color: color.slate, marginRight: 5 }}>{t(l.priceUnit)}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: color.slateLight }}>{t(l.ago)}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, marginTop: 4 }}>
                {t(l.title)}
              </div>
              <div style={{ fontSize: 11, color: color.slate, marginTop: 3 }}>
                {l.rooms} {t('غرف ·')} {l.area} {t('م² ·')} {t(l.zone)}
              </div>
            </div>
          </button>
        ))}

        <Note tone="navy">
          {t('رفادة يتيح الاكتشاف والتواصل بين الجيران فقط — إتمام البيع أو الإيجار يتم خارج التطبيق بالقنوات القانونية المعتادة.')}
        </Note>
      </div>
    </div>
  );
}

/** R40 — Create a listing. The unit is auto-verified from the account. */
function Create() {
  const { st, set, back, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('أعلن عن وحدتك')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Card pad="13px 16px" style={{ borderRadius: radius.inner, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t('الوحدة')}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: color.slate }}>{t('فيلا 214 — حي الياسمين (موثّقة)')}</span>
        </Card>

        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
            marginTop: 10,
          }}
        >
          {[
            { k: 'sale' as const, l: t('بيع') },
            { k: 'rent' as const, l: t('إيجار') },
          ].map((tab) => {
            const on = st.crType === tab.k;
            return (
              <button
                key={tab.k}
                onClick={() => set({ crType: tab.k })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 12.5,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {t(tab.l)}
              </button>
            );
          })}
        </div>

        <input
          value={st.crPrice}
          onChange={(e) => set({ crPrice: e.target.value })}
          placeholder={st.crType === 'sale' ? t('سعر البيع (ر.س)') : t('الإيجار الشهري (ر.س)')}
          style={inputStyle}
        />
        <textarea
          value={st.crDesc}
          onChange={(e) => set({ crDesc: e.target.value })}
          rows={3}
          placeholder={t('وصف الوحدة (التشطيب، الإطلالة، المميزات…)')}
          style={{ ...inputStyle, fontSize: 13, resize: 'none', lineHeight: 1.7 }}
        />

        <button
          style={{
            width: '100%',
            marginTop: 10,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'transparent',
            borderRadius: radius.inner,
            padding: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Icon path={icons.camera} size={18} stroke={color.slate} width={1.5} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>{t('إضافة صور الوحدة')}</span>
        </button>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, margin: '14px 0 8px' }}>
          {t('طريقة التواصل المفضلة')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { k: 'chat', l: t('شات داخل التطبيق فقط') },
            { k: 'phone', l: t('إظهار رقم الجوال') },
          ].map((c) => {
            const on = st.crContact === c.k;
            return (
              <button
                key={c.k}
                onClick={() => set({ crContact: c.k })}
                style={{
                  flex: 1,
                  borderRadius: radius.tile,
                  padding: 11,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: on ? 'rgba(199,154,60,0.14)' : '#fff',
                  color: on ? color.goldDeep : color.slate,
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.08)'}`,
                  fontFamily: font.sans,
                }}
              >
                {t(c.l)}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => {
            set({ crPrice: '', crDesc: '', screen: 'reMine' });
            showToast('تم إرسال إعلانك لمراجعة الإدارة — يُنشر خلال 24 ساعة');
          }}
        >
          {t('نشر الإعلان — بعد مراجعة الإدارة')}
        </PillButton>
      </div>
    </div>
  );
}

/** R41 — Listing detail. Contact opens the chat; no payment in-app. */
function Detail() {
  const { st, back, go, showToast } = useResident();
  const l = reDefs[st.selReIdx] ?? reDefs[0];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          height: 210,
          background: `linear-gradient(160deg,${l.g1},${l.g2})`,
          position: 'relative',
          flex: 'none',
          overflow: 'hidden',
        }}
      >
        <span style={photoStyle(l.photo)} />
        <button
          onClick={back}
          aria-label="رجوع"
          style={{
            position: 'absolute',
            top: 60,
            right: 18,
            width: 38,
            height: 38,
            borderRadius: 99,
            border: 'none',
            background: 'rgba(255,255,255,0.92)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.chevron} size={16} width={2} />
        </button>
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            right: 18,
            background: 'rgba(255,255,255,0.92)',
            color: color.navy,
            borderRadius: radius.pill,
            padding: '5px 14px',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {l.type === 'sale' ? t('للبيع') : t('للإيجار')}
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            left: 18,
            background: 'rgba(31,59,87,0.6)',
            color: '#fff',
            borderRadius: radius.pill,
            padding: '5px 12px',
            fontSize: 10.5,
            fontWeight: 700,
          }}
        >
          {t('1 / 6 صور')}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ ...numeric, fontSize: 24, fontWeight: 700, color: color.navy }}>{t(l.price)}</span>
          <span style={{ fontSize: 12, color: color.slate, marginRight: 6 }}>{t(l.priceUnit)}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 900, color: color.navy, marginTop: 6 }}>{t(l.title)}</div>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {[`${l.rooms} ${t('غرف')}`, `${l.area} ${t('م²')}`, t(l.zone)].map((f) => (
            <span
              key={f}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '8px 14px',
                fontSize: 11.5,
                fontWeight: 700,
                color: color.navy,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap',
              }}
            >
              {t(f)}
            </span>
          ))}
        </div>

        <Card
          pad="15px 16px"
          style={{ borderRadius: 18, marginTop: 12, fontSize: 12.5, color: color.slateDark, lineHeight: 2 }}
        >
          {t(l.desc)}
        </Card>

        <Card
          pad="14px 16px"
          style={{ borderRadius: 18, marginTop: 10, display: 'flex', alignItems: 'center', gap: 11 }}
        >
          <Avatar name={t(l.owner)} size={40} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(l.owner)}</span>
            <span style={{ fontSize: 10.5, color: color.slate }}>{t('جار موثّق ·')} {t(l.ownerUnit)}</span>
          </span>
          <StatusPill tone="green" style={{ fontSize: 10, padding: '3px 12px', fontWeight: 800 }}>
            {t('موثّق ✓')}
          </StatusPill>
        </Card>
      </div>

      <div style={{ padding: '0 20px 34px', display: 'flex', gap: 10 }}>
        <PillButton
          tone="outline"
          onClick={() => showToast('سجّلنا اهتمامك — سيصل إشعار للمالك')}
          style={{ flex: 1, padding: 13, fontSize: 13.5 }}
        >
          {t('أنا مهتم 🤝')}
        </PillButton>
        <PillButton onClick={() => go('chat')} style={{ flex: 1.3, padding: 13, fontSize: 13.5 }}>
          {t('تواصل مع المالك')}
        </PillButton>
      </div>
    </div>
  );
}

/** R42 — My listings. */
function Mine() {
  const { st, set, back, go, showToast } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t('إعلاناتي')}</div>
        <PillButton tone="gold" size="sm" onClick={() => go('reCreate')} style={{ padding: '8px 16px', fontSize: 11.5 }}>
          {t('+ إعلان جديد')}
        </PillButton>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {myListingDefs.map((m, i) => {
          const state = st.myListingsState[i] ?? 'active';
          const meta = listingStateMeta[state];
          return (
            <Card key={t(m.title)} pad="15px 16px" style={{ borderRadius: 18, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(m.title)}</span>
                <span style={{ flex: 1 }} />
                <StatusPill bg={meta.bg} c={meta.c} style={{ fontSize: 10, padding: '3px 12px', fontWeight: 800 }}>
                  {t(meta.label)}
                </StatusPill>
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
                {t(m.price)} · {m.views} {t('مشاهدة ·')} {m.interested} {t('مهتم')}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <SmallAction
                  onClick={() =>
                    set((s) => ({
                      myListingsState: {
                        ...s.myListingsState,
                        [i]: state === 'active' ? 'paused' : 'active',
                      },
                    }))
                  }
                >
                  {state === 'active' ? t('إيقاف مؤقت') : t('إعادة تفعيل')}
                </SmallAction>
                <SmallAction onClick={() => go('reCreate')}>{t('تعديل')}</SmallAction>
                <SmallAction
                  tone="green"
                  onClick={() => {
                    set((s) => ({ myListingsState: { ...s.myListingsState, [i]: 'done' } }));
                    showToast('ألف مبروك! تم وضع علامة «تم التأجير» — سيُخفى الإعلان من السوق');
                  }}
                >
                  {t('تم التأجير ✓')}
                </SmallAction>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SmallAction({
  children,
  onClick,
  tone = 'navy',
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: 'navy' | 'green';
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        cursor: 'pointer',
        background: 'transparent',
        color: tone === 'green' ? color.greenDeep : color.navy,
        border: `1.5px solid ${tone === 'green' ? color.green : 'rgba(31,59,87,0.25)'}`,
        borderRadius: radius.pill,
        padding: 8,
        fontSize: 11,
        fontWeight: 800,
        fontFamily: font.sans,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 10,
  background: '#fff',
  border: 'none',
  borderRadius: radius.inner,
  padding: '13px 16px',
  fontSize: 13.5,
  color: color.navy,
  boxShadow: shadow.card,
  boxSizing: 'border-box',
  fontFamily: font.sans,
};

export const RealEstate = { Browse, Create, Detail, Mine };
