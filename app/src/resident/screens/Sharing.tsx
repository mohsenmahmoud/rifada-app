import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { icons, shareIcons } from '../data/icons';
import { UNIT_SHORT } from '../data/seed';
import {
  shareCatDefs,
  shareDayDefs,
  shareDefs,
  shareHourDefs,
  shareIcon,
  shareKindDefs,
  shareUnitDefs,
} from '../data/sharing';
import { useResident } from '../store';
import type { ShareKind } from '../types';
import { ChipRow, Note } from './parts';
import { Radio } from './Marketplace';
import { t } from '@/i18n/lang';

const priceLabel = (p: number) => (p === 0 ? t('مجانًا') : `${p} ر.س`);

/** R67 — Browse what neighbours are sharing, plus your own listings. */
function Browse() {
  const { st, set, go, showToast } = useResident();

  const all = st.sharePublished ? [st.sharePublished, ...shareDefs] : shareDefs;
  const browseItems = all
    .map((it, i) => ({ ...it, i }))
    .filter((it) => st.shareCat === 'all' || it.kind === st.shareCat);
  const mine = st.sharePublished ? [st.sharePublished] : [];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: color.navy }}>{t('رفادتنا')}</span>
          <span
            style={{
              fontSize: 10.5,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            جيران يتشاركون ما لديهم — بالساعة أو مجانًا، وكل حجز موثّق بالوحدة
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderRadius: radius.pill,
          margin: '2px 18px 0',
          padding: 4,
          boxShadow: shadow.card,
        }}
      >
        {[
          { k: 'browse' as const, l: t('معروض للمشاركة') },
          { k: 'mine' as const, l: t('مشاركاتي') },
        ].map((t) => {
          const on = st.shareTab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => set({ shareTab: t.k })}
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
              {t.l}
            </button>
          );
        })}
      </div>

      {st.shareTab === 'browse' && (
        <div style={{ padding: '10px 18px 2px' }}>
          <ChipRow chips={shareCatDefs} value={st.shareCat} onPick={(k) => set({ shareCat: k })} />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 130px' }}>
        {st.shareTab === 'mine' ? (
          <>
            <div
              style={{
                background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                borderRadius: radius.card,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 11,
                    background: 'rgba(199,154,60,0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <Icon path={icons.plus} size={17} stroke={color.gold} width={2} />
                </span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 800, color: '#fff' }}>
                  {mine.length > 0 ? t('مشاركتك منشورة لجيرانك') : t('اعرض ما لديك على جيرانك')}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 9, lineHeight: 1.8 }}>
                تعرض ما لديك بالوقت الذي يناسبك، والدفع يصلك بضمان رفادة بعد انتهاء الموعد.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <Stat value={String(mine.length)} label="مشاركة منشورة" />
                <Stat value={mine.length ? '38' : '0'} label="مشاهدة من الجيران" tone={color.greenBright} />
                <Stat value={mine.length ? '450' : '0'} label="ر.س هذا الشهر" tone={color.goldSoft} />
              </div>
            </div>

            {mine.map((ms) => (
              <Card
                key={ms.title}
                pad="14px 16px"
                style={{ borderRadius: 18, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span style={tileStyle}>
                  <Icon path={shareIcon(ms.kind)} size={20} width={1.6} />
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: color.navy,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ms.title}
                    </span>
                    <StatusPill tone="green" style={{ fontSize: 9, padding: '2px 9px', fontWeight: 800 }}>
                      منشور
                    </StatusPill>
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                    {ms.slots.length} موعد متاح ·{' '}
                    <b style={{ color: color.goldDeep, ...numeric }}>{priceLabel(ms.price)}</b> {ms.unit}
                  </span>
                  <span style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                    <span style={chipStyle(color.navy)}>{ms.slots[0]?.[0] ?? '—'}</span>
                    <span style={chipStyle(color.slate)}>{ms.slots[0]?.[1] ?? '—'}</span>
                  </span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 'none' }}>
                  <button
                    onClick={() => go('shareCreate')}
                    style={{
                      border: '1.5px solid rgba(31,59,87,0.2)',
                      background: 'transparent',
                      borderRadius: radius.pill,
                      padding: '5px 12px',
                      fontSize: 9.5,
                      fontWeight: 800,
                      color: color.navy,
                      cursor: 'pointer',
                      fontFamily: font.sans,
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      set({ sharePublished: null });
                      showToast('أُوقفت المشاركة — لم تعد تظهر لجيرانك');
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: color.coral,
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: 2,
                      fontFamily: font.sans,
                    }}
                  >
                    إيقاف
                  </button>
                </span>
              </Card>
            ))}

            {mine.length === 0 && (
              <Card
                pad="30px 22px"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <span
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 99,
                    background: color.tile,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon path={icons.neighbors} size={26} width={1.6} />
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy, marginTop: 14 }}>
                  لم تشارك شيئًا بعد
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: color.slate,
                    marginTop: 8,
                    lineHeight: 1.9,
                    textAlign: 'center',
                  }}
                >
                  عندك قاعة، ملعب، شنطة عدد، نطاطية أطفال، أو مكان انتظار زائد؟ اعرضه بالساعة أو
                  مجانًا لجيرانك.
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 7,
                    justifyContent: 'center',
                    marginTop: 16,
                  }}
                >
                  {(
                    [
                      ['space', t('قاعة أو مساحة')],
                      ['gear', t('معدات')],
                      ['sport', t('ملعب')],
                      ['park', t('مكان انتظار')],
                    ] as [ShareKind, string][]
                  ).map(([k, label]) => (
                    <span
                      key={k}
                      style={{
                        background: color.bg,
                        color: color.navy,
                        borderRadius: radius.pill,
                        padding: '6px 14px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon path={shareIcons[k]} size={13} width={1.6} />
                      {label}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          browseItems.map((si) => (
            <button
              key={si.title}
              onClick={() => go('shareDetail', { shareSelIdx: si.i, shareSlotIdx: null })}
              style={{
                width: '100%',
                textAlign: 'right',
                background: '#fff',
                border: 'none',
                borderRadius: 18,
                padding: '14px 16px',
                boxShadow: shadow.card,
                cursor: 'pointer',
                marginBottom: 9,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={tileStyle}>
                <Icon path={shareIcon(si.kind)} size={20} width={1.6} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: color.navy,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {si.title}
                  </span>
                  {si.price === 0 && (
                    <StatusPill tone="green" style={{ fontSize: 9, padding: '2px 9px', fontWeight: 800 }}>
                      مجانًا
                    </StatusPill>
                  )}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: color.slate,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {si.owner} · {si.slots.filter((s) => s[2] === 'متاح').length} مواعيد متاحة
                </span>
              </span>
              <span
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flex: 'none' }}
              >
                <span style={{ ...numeric, fontSize: 13, fontWeight: 700, color: color.goldDeep }}>
                  {priceLabel(si.price)}
                </span>
                <span style={{ fontSize: 9.5, color: color.slateLight }}>{si.unit}</span>
              </span>
            </button>
          ))
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, padding: '0 18px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => go('shareCreate')}
          style={{ boxShadow: '0 8px 24px rgba(199,154,60,0.38)', fontSize: 14 }}
        >
          + شارك شيئًا لديك مع جيرانك
        </PillButton>
      </div>
    </div>
  );
}

/** R68 — Publish a sharing listing. */
function Create() {
  const { st, set, back, showToast } = useResident();

  const publish = () => {
    const price = st.shUnit === 'مجانًا' ? 0 : parseInt(st.shPrice, 10) || 150;
    const kindLabel = shareKindDefs.find((k) => k.key === st.shKind)?.label ?? '';
    set({
      sharePublished: {
        kind: st.shKind,
        title: st.shTitle.trim() || `${kindLabel} — مشاركة جديدة`,
        owner: `عبدالله العتيبي — ${UNIT_SHORT}`,
        rating: '—',
        price,
        unit: st.shUnit === 'مجانًا' ? 'مجانًا بين الجيران' : st.shUnit,
        desc: `مشاركة جديدة من وحدتك الموثّقة — متاحة يوم ${st.shDay} من ${st.shHour}.`,
        slots: [[st.shDay, st.shHour, t('متاح')]],
      },
      screen: 'share',
      shareTab: 'mine',
      shTitle: '',
      shPrice: '',
    });
    showToast('تم نشر مشاركتك — سيراها جيرانك فورًا');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="شارك شيئًا لديك" onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Label>{t('النوع')}</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {shareKindDefs.map((k) => {
            const on = st.shKind === k.key;
            return (
              <button
                key={k.key}
                onClick={() => set({ shKind: k.key })}
                style={{
                  borderRadius: radius.inner,
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  background: on ? 'rgba(199,154,60,0.14)' : '#fff',
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                <Icon path={shareIcons[k.key]} size={20} stroke={on ? color.goldDeep : color.navy} width={1.6} />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: on ? color.goldDeep : color.navy,
                    textAlign: 'center',
                    fontFamily: font.sans,
                  }}
                >
                  {k.label}
                </span>
              </button>
            );
          })}
        </div>

        <input
          value={st.shTitle}
          onChange={(e) => set({ shTitle: e.target.value })}
          placeholder="مثال: قاعة استقبال بالفيلا — تتسع 20 فردًا"
          style={{ ...inputStyle, marginTop: 16, fontSize: 13 }}
        />

        <Label style={{ marginTop: 16 }}>{t('أيام الإتاحة')}</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {shareDayDefs.map((d) => {
            const on = st.shDay === d;
            return (
              <button key={d} onClick={() => set({ shDay: d })} style={selectableChip(on)}>
                {d}
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 16 }}>{t('من الساعة — إلى الساعة')}</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          {shareHourDefs.map((h) => {
            const on = st.shHour === h;
            return (
              <button
                key={h}
                onClick={() => set({ shHour: h })}
                style={{
                  ...selectableChip(on),
                  flex: 1,
                  borderRadius: radius.tile,
                  padding: '11px 4px',
                }}
              >
                {h}
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 16 }}>{t('التكلفة')}</Label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={st.shPrice}
            onChange={(e) => set({ shPrice: e.target.value })}
            dir="ltr"
            placeholder="150"
            style={{ ...inputStyle, marginTop: 0, flex: 1, ...numeric, fontSize: 14, fontWeight: 700 }}
          />
          {shareUnitDefs.map((u) => {
            const on = st.shUnit === u;
            return (
              <button
                key={u}
                onClick={() => set({ shUnit: u })}
                style={{
                  borderRadius: radius.pill,
                  padding: '11px 15px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: on ? 'rgba(199,154,60,0.14)' : '#fff',
                  color: on ? color.goldDeep : color.slate,
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.08)'}`,
                  whiteSpace: 'nowrap',
                  fontFamily: font.sans,
                }}
              >
                {u}
              </button>
            );
          })}
        </div>

        <button
          style={{
            width: '100%',
            marginTop: 14,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'transparent',
            borderRadius: radius.inner,
            padding: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Icon path={icons.camera} size={18} stroke={color.slate} width={1.5} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>{t('أضف صورًا')}</span>
        </button>

        <div style={{ marginTop: 12 }}>
          <Note tone="navy">
            وحدتك موثّقة تلقائيًا مع الإعلان ({UNIT_SHORT}) — والحجز والدفع يمران بضمان رفادة حتى
            انتهاء الموعد.
          </Note>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={publish}>
          نشر المشاركة
        </PillButton>
      </div>
    </div>
  );
}

/** R69 — Detail and slot booking. */
function Detail() {
  const { st, set, back, showToast } = useResident();
  const all = st.sharePublished ? [st.sharePublished, ...shareDefs] : shareDefs;
  const sel = all[st.shareSelIdx] ?? all[0];

  const book = () => {
    if (st.shareSlotIdx === null) {
      showToast('اختر موعدًا أولًا');
      return;
    }
    const sl = sel.slots[st.shareSlotIdx];
    set({ screen: 'share', shareSlotIdx: null });
    showToast(`تم الحجز: ${sel.title} — ${sl[0]} ${sl[1]}`);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
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
          <Icon path={shareIcon(sel.kind)} size={20} width={1.6} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: color.navy,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sel.title}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sel.owner} · ★ {sel.rating}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: 18 }}>
          <div style={{ fontSize: 12.5, color: color.slateDark, lineHeight: 1.9 }}>{sel.desc}</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <span style={{ fontSize: 12, color: color.slate }}>{t('التكلفة')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: color.goldDeep }}>
              {priceLabel(sel.price)}
            </span>
            <span style={{ fontSize: 11, color: color.slate, marginRight: 5 }}>{sel.unit}</span>
          </div>
        </Card>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, margin: '16px 2px 8px' }}>
          المواعيد المتاحة
        </div>
        {sel.slots.map(([day, time, status], i) => {
          const free = status === 'متاح';
          const on = st.shareSlotIdx === i;
          return (
            <button
              key={`${day}-${time}`}
              onClick={() =>
                free ? set({ shareSlotIdx: i }) : showToast('هذا الموعد محجوز — اختر موعدًا آخر')
              }
              style={{
                width: '100%',
                textAlign: 'right',
                border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.06)'}`,
                background: on ? 'rgba(199,154,60,0.08)' : '#fff',
                borderRadius: radius.inner,
                padding: '13px 16px',
                cursor: free ? 'pointer' : 'default',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                opacity: free ? 1 : 0.55,
              }}
            >
              <Radio on={on} />
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{day}</span>
                <span style={{ fontSize: 10.5, color: color.slate }}>{time}</span>
              </span>
              <StatusPill tone={free ? 'green' : 'gray'} style={{ fontSize: 9.5, padding: '3px 11px', fontWeight: 800 }}>
                {status}
              </StatusPill>
            </button>
          );
        })}

        <div
          style={{
            background: 'rgba(63,166,107,0.1)',
            borderRadius: radius.tile,
            padding: '12px 14px',
            marginTop: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <Icon path={icons.shield} size={15} stroke={color.greenDeep} width={1.6} style={{ flex: 'none' }} />
          <span style={{ fontSize: 10.5, fontWeight: 800, color: color.greenDeep, lineHeight: 1.7 }}>
            المبلغ محجوز بضمان رفادة ولا يُحوَّل لجارك إلا بعد انتهاء الموعد
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton size="lg" full onClick={book}>
          {st.shareSlotIdx === null ? t('اختر موعدًا للحجز') : t('أكّد الحجز')}
        </PillButton>
      </div>
    </div>
  );
}

function Stat({ value, label, tone = '#fff' }: { value: string; label: string; tone?: string }) {
  return (
    <span
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: radius.tile,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: tone }}>{value}</span>
      <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
    </span>
  );
}

const tileStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 13,
  background: color.tile,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
};

const chipStyle = (c: string): React.CSSProperties => ({
  background: color.bg,
  color: c,
  borderRadius: radius.pill,
  padding: '3px 10px',
  fontSize: 9.5,
  fontWeight: 800,
  whiteSpace: 'nowrap',
});

const selectableChip = (on: boolean): React.CSSProperties => ({
  borderRadius: radius.pill,
  padding: '8px 15px',
  fontSize: 11.5,
  fontWeight: 800,
  cursor: 'pointer',
  background: on ? color.navy : '#fff',
  color: on ? '#fff' : color.slate,
  border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
  fontFamily: font.sans,
  whiteSpace: 'nowrap',
});

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

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

export const Sharing = { Browse, Create, Detail };
