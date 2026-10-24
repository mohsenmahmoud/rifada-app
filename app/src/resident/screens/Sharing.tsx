import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import {
  BackButton, Card, EmptyState, PillButton, ScreenHeader, StatusPill,
} from '@/ui/primitives';
import { icons, shareIcons } from '../data/icons';
import { UNIT_SHORT } from '../data/seed';
import {
  bookingStageChrome,
  bookingVoiceOf,
  bookingWording,
  shareCatDefs,
  shareDayDefs,
  shareDefs,
  shareHistDefs,
  shareHistIcon,
  shareHourDefs,
  shareIcon,
  shareKindDefs,
  shareReqDefs,
  shareUnitDefs,
} from '../data/sharing';
import { useResident } from '../store';
import type { ShareKind, ShareReqState } from '../types';
import { ChipRow, Note } from './parts';
import { Radio } from './Marketplace';
import { t } from '@/i18n/lang';

const priceLabel = (p: number) => (p === 0 ? t('مجانًا') : `${p} ${t('ر.س')}`);

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
      {/* The two tabs became header icons: a person toggles «مشاركاتي»,
          a clock opens the finished-shares log. */}
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton
          onClick={() => (st.shareTab === 'mine' ? set({ shareTab: 'browse' }) : go('home'))}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: color.navy }}>{t('استعارة')}</span>
          <span
            style={{
              fontSize: 10.5,
              color: color.slate,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {t('جيران يتشاركون ما لديهم — بالساعة أو مجانًا، وكل حجز موثّق بالوحدة')}
          </span>
        </div>
        <HeaderIconButton
          title={t('مشاركاتي')}
          path={icons.neighbors}
          on={st.shareTab === 'mine'}
          onClick={() => set((s) => ({ shareTab: s.shareTab === 'mine' ? 'browse' : 'mine' }))}
        />
        <HeaderIconButton
          title={t('سجل مشاركاتي')}
          path="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"
          onClick={() => go('shareHist')}
        />
      </div>

      {st.shareTab === 'browse' && (
        <div style={{ padding: '10px 18px 2px' }}>
          <ChipRow chips={shareCatDefs} value={st.shareCat} onPick={(k) => set({ shareCat: k })} />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 40px' }}>
        {st.shareTab === 'mine' ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '2px 2px 10px' }}>
              {t('معروضاتك المنشورة')}
            </div>

            {mine.map((ms) => (
              // A plain div, not a Card button: the row opens the listing but
              // carries its own edit/pause buttons, and a button can't nest.
              <div
                key={t(ms.title)}
                onClick={() => go('myListing')}
                style={{
                  background: color.card,
                  boxShadow: shadow.card,
                  padding: '14px 16px',
                  borderRadius: 18,
                  marginBottom: 9,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
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
                      {t(ms.title)}
                    </span>
                    <StatusPill tone="green" style={{ fontSize: 9, padding: '2px 9px', fontWeight: 800 }}>
                      {t('منشور')}
                    </StatusPill>
                  </span>
                  <span style={{ fontSize: 10.5, color: color.slate, whiteSpace: 'nowrap' }}>
                    {ms.slots.length} {t('موعد متاح ·')}{' '}
                    <b style={{ color: color.goldDeep, ...numeric }}>{priceLabel(ms.price)}</b> {t(ms.unit)}
                  </span>
                  <span style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                    <span style={chipStyle(color.navy)}>{ms.slots[0]?.[0] ?? '—'}</span>
                    <span style={chipStyle(color.slate)}>{ms.slots[0]?.[1] ?? '—'}</span>
                  </span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 'none' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      go('shareCreate');
                    }}
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
                    {t('تعديل')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      set({ sharePublished: null });
                      showToast(t('أُوقفت المشاركة — لم تعد تظهر لجيرانك'));
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
                    {t('إيقاف')}
                  </button>
                </span>
              </div>
            ))}

            {/* The stats moved out of the navy banner and under the listings. */}
            {mine.length > 0 && (
              <Card
                pad="14px 16px"
                style={{ borderRadius: 18, marginBottom: 9, display: 'flex', alignItems: 'center' }}
              >
                <MineStat value={String(mine.length)} label={t('مشاركة')} />
                <StatDivider />
                <MineStat value="38" label={t('مشاهدة')} />
                <StatDivider />
                <MineStat value="450" label={t('ر.س هذا الشهر')} tone={color.goldDeep} />
              </Card>
            )}

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
                  {t('لم تشارك شيئًا بعد')}
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
                  {t('عندك قاعة، ملعب، شنطة عدد، أو مكان انتظار زائد؟ اعرضه بالساعة أو مجانًا لجيرانك.')}
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
                      <Icon path={t(shareIcons[k])} size={13} width={1.6} />
                      {t(label)}
                    </span>
                  ))}
                </div>
              </Card>
            )}
            <PillButton
              tone="ghost"
              full
              onClick={() => go('shareCreate')}
              style={{ marginTop: 12, padding: 13, fontSize: 13 }}
            >
              {t('+ شارك شيئًا جديدًا مع جيرانك')}
            </PillButton>
          </>
        ) : (
          browseItems.map((si) => (
            <button
              key={t(si.title)}
              onClick={() => go('shareDetail', { shareSelIdx: si.i, shareSlotIdx: null })}
              style={{
                width: '100%',
                textAlign: 'start',
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
                    {t(si.title)}
                  </span>
                  {si.price === 0 && (
                    <StatusPill tone="green" style={{ fontSize: 9, padding: '2px 9px', fontWeight: 800 }}>
                      {t('مجانًا')}
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
                  {t(si.owner)} · {si.slots.filter((s) => s[2] === 'متاح').length} {t('مواعيد متاحة')}
                </span>
              </span>
              <span
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flex: 'none' }}
              >
                <span style={{ ...numeric, fontSize: 13, fontWeight: 700, color: color.goldDeep }}>
                  {priceLabel(si.price)}
                </span>
                <span style={{ fontSize: 9.5, color: color.slateLight }}>{t(si.unit)}</span>
              </span>
            </button>
          ))
        )}
      </div>

      {/* The floating «شارك شيئًا لديك» button is gone — publishing now lives
          at the foot of the «مشاركاتي» tab, where the listings are. */}
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
        title: st.shTitle.trim() || `${kindLabel} ${t('— مشاركة جديدة')}`,
        owner: `${t('عبدالله العتيبي —')} ${t(UNIT_SHORT)}`,
        rating: '—',
        price,
        unit: st.shUnit === 'مجانًا' ? 'مجانًا بين الجيران' : st.shUnit,
        desc: `${t('مشاركة جديدة من وحدتك الموثّقة — متاحة يوم')} ${st.shDay} ${t('من')} ${st.shHour}.`,
        slots: [[st.shDay, st.shHour, t('متاح')]],
      },
      // Publishing now lands on the listing itself rather than the browse
      // list, so the first thing you see is where requests will arrive.
      screen: 'myListing',
      shareTab: 'mine',
      hist: [],
      shTitle: '',
      shPrice: '',
    });
    showToast(t('تم نشر مشاركتك — سيراها جيرانك فورًا'));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        title={t('شارك شيئًا لديك')}
        sub={t('أعلن لجيرانك عن شيء تشاركه معهم')}
        onBack={back}
      />
      {/* Three numbered steps rather than one long form: what, when, and for
          how much. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <StepCard n="1" title={t('ما الذي تشاركه؟')}>
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
                <Icon path={t(shareIcons[k.key])} size={20} stroke={on ? color.goldDeep : color.navy} width={1.6} />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: on ? color.goldDeep : color.navy,
                    textAlign: 'center',
                    fontFamily: font.sans,
                  }}
                >
                  {t(k.label)}
                </span>
              </button>
            );
          })}
        </div>

        <input
          value={st.shTitle}
          onChange={(e) => set({ shTitle: e.target.value })}
          placeholder={t('مثال: قاعة استقبال بالفيلا — تتسع 20 فردًا')}
          style={{ ...inputStyle, marginTop: 16, fontSize: 13 }}
        />

        <button
          style={{
            width: '100%',
            marginTop: 12,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'transparent',
            borderRadius: radius.inner,
            padding: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Icon path={icons.camera} size={18} stroke={color.slate} width={1.5} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>{t('أضف صورًا')}</span>
          <span style={{ fontSize: 11, color: color.slateLight }}>· {t('الصور تزيد الحجوزات')}</span>
        </button>
        </StepCard>

        <StepCard n="2" title={t('متى يكون متاحًا؟')}>
        <Label>{t('أيام الإتاحة')}</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {shareDayDefs.map((d) => {
            const on = st.shDay === d;
            return (
              <button key={d} onClick={() => set({ shDay: d })} style={selectableChip(on)}>
                {t(d)}
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 16 }}>{t('الفترة')}</Label>
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
                {t(h)}
              </button>
            );
          })}
        </div>

        </StepCard>

        <StepCard n="3" title={t('التكلفة')}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#fff',
              borderRadius: radius.inner,
              boxShadow: shadow.card,
              padding: '0 14px',
            }}
          >
            <input
              value={st.shPrice}
              onChange={(e) => set({ shPrice: e.target.value })}
              dir="ltr"
              placeholder="150"
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '13px 0',
                ...numeric,
                fontSize: 14,
                fontWeight: 700,
                color: color.navy,
                textAlign: 'start',
              }}
            />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: color.slate }}>{t('ر.س')}</span>
          </span>
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
                {t(u)}
              </button>
            );
          })}
        </div>

        </StepCard>

        <div style={{ marginTop: 4 }}>
          <Note tone="navy">
            {t('وحدتك موثّقة تلقائيًا (')}{t(UNIT_SHORT)}{t(') — الحجز عبر التطبيق والدفع كاش يدًا بيد بينك وبين جارك.')}
          </Note>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={publish}>
          {t('نشر المشاركة')}
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
      showToast(t('اختر موعدًا أولًا'));
      return;
    }
    const sl = sel.slots[st.shareSlotIdx];
    // Booking now opens the three-stage lifecycle rather than dropping you
    // back on the list with a toast.
    set((s) => ({
      screen: 'shareBooking',
      hist: [...s.hist, 'shareDetail'],
      shBookedSlot: `${sl[0]} ${sl[1]}`,
      shbStage: 0,
    }));
    showToast(t('تم حجز الموعد — رتّب الاستلام مع المالك'));
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
            {t(sel.title)}
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
            {t(sel.owner)} · ★ {sel.rating}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: 18 }}>
          <div style={{ fontSize: 12.5, color: color.slateDark, lineHeight: 1.9 }}>{t(sel.desc)}</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
            <span style={{ fontSize: 12, color: color.slate }}>{t('التكلفة')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: color.goldDeep }}>
              {priceLabel(sel.price)}
            </span>
            <span style={{ fontSize: 11, color: color.slate, marginRight: 5 }}>{t(sel.unit)}</span>
          </div>
        </Card>

        <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, margin: '16px 2px 8px' }}>
          {t('المواعيد المتاحة')}
        </div>
        {sel.slots.map(([day, time, status], i) => {
          const free = status === 'متاح';
          const on = st.shareSlotIdx === i;
          return (
            <button
              key={`${day}-${time}`}
              onClick={() =>
                free ? set({ shareSlotIdx: i }) : showToast(t('هذا الموعد محجوز — اختر موعدًا آخر'))
              }
              style={{
                width: '100%',
                textAlign: 'start',
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
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(day)}</span>
                <span style={{ fontSize: 10.5, color: color.slate }}>{t(time)}</span>
              </span>
              <StatusPill tone={free ? 'green' : 'gray'} style={{ fontSize: 9.5, padding: '3px 11px', fontWeight: 800 }}>
                {t(status)}
              </StatusPill>
            </button>
          );
        })}

        {/* The رفادة escrow strip is gone: استعارة settles in cash between
            neighbours, so there is no held amount to guarantee. */}
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton size="lg" full onClick={book}>
          {st.shareSlotIdx === null ? t('اختر موعدًا للحجز') : t('أكّد الحجز')}
        </PillButton>
      </div>
    </div>
  );
}

/* ==================== The owner's side of a listing ==================== */

/**
 * The booking requests on your listing, with their derived state. Accepting
 * one declines every other request on the same slot.
 */
function useShareRequests() {
  const { st, set, go, showToast } = useResident();
  const firstName = (full: string) => full.split(' — ')[0];

  return shareReqDefs.map((rq, i) => ({
    ...rq,
    state: st.shReqs[i] ?? 'new',
    accept: () => {
      const clashes = shareReqDefs
        .map((o, k) => ({ o, k }))
        .filter(({ o, k }) => k !== i && o.slot === rq.slot && !st.shReqs[k])
        .map(({ k }) => k);
      set((s) => {
        const next = { ...s.shReqs, [i]: 'accepted' as const };
        clashes.forEach((k) => {
          next[k] = 'conflict';
        });
        return { shReqs: next };
      });
      showToast(
        clashes.length
          ? `${t('قُبل الحجز — واعتُذر تلقائيًا لـ')}${clashes.length} ${t('طلب على نفس الموعد')}`
          : `${t('قُبل الحجز — رتّب التسليم مع')} ${t(firstName(rq.name))}`,
      );
    },
    reject: () => {
      set((s) => ({ shReqs: { ...s.shReqs, [i]: 'rejected' } }));
      showToast(`${t('رفضت طلب')} ${t(firstName(rq.name))}`);
    },
    chat: () => {
      go('chat');
      showToast(`${t('فُتحت محادثة مع')} ${t(firstName(rq.name))}`);
    },
    call: () => showToast(`${t('جاري الاتصال بـ')}${t(firstName(rq.name))}…`),
  }));
}

type ShareReqRow = ReturnType<typeof useShareRequests>[number];

const reqStateChrome: Record<ShareReqState, { label: string; bg: string; c: string } | null> = {
  new: null,
  accepted: { label: 'مقبول — رتّب التسليم', bg: 'rgba(63,166,107,0.13)', c: '#2E7D51' },
  rejected: { label: 'مرفوض', bg: 'rgba(107,114,128,0.12)', c: '#6B7280' },
  conflict: { label: 'اعتُذر — تعارض موعد', bg: 'rgba(199,154,60,0.16)', c: '#A87F2C' },
};

/** One request row — shared by the listing screen and the full list. */
function RequestRow({ rq }: { rq: ShareReqRow }) {
  const chrome = reqStateChrome[rq.state];
  return (
    <Card pad="13px 15px" style={{ borderRadius: 18, marginBottom: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            background: rq.av,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13.5,
            fontWeight: 800,
            flex: 'none',
          }}
        >
          {t(rq.name)[0]}
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(rq.name)}</span>
          <span style={{ fontSize: 10.5, color: color.slate }}>{t(rq.slot)}</span>
        </span>
        {chrome && (
          <span
            style={{
              background: chrome.bg,
              color: chrome.c,
              borderRadius: radius.pill,
              padding: '3px 11px',
              fontSize: 9.5,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flex: 'none',
            }}
          >
            {t(chrome.label)}
          </span>
        )}
      </div>

      {rq.state === 'new' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <PillButton full tone="green" onClick={rq.accept} style={{ padding: 10, fontSize: 12 }}>
            {t('اقبل الحجز')}
          </PillButton>
          <PillButton tone="ghost" onClick={rq.reject} style={{ padding: '10px 20px', fontSize: 12 }}>
            {t('ارفض')}
          </PillButton>
        </div>
      )}

      {rq.state === 'accepted' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <PillButton
            onClick={rq.chat}
            style={{ padding: '9px 16px', fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Icon path={icons.chat} size={14} stroke="#fff" width={1.6} />
            {t('افتح محادثة')}
          </PillButton>
          <PillButton tone="ghost" onClick={rq.call} style={{ padding: '9px 16px', fontSize: 11.5 }}>
            {t('اتصال')}
          </PillButton>
          <span style={{ fontSize: 10, fontWeight: 700, color: color.slateLight }}>
            {t('كاش يدًا بيد عند التسليم')}
          </span>
        </div>
      )}
    </Card>
  );
}

/** R68b — your own published listing, and the requests arriving on it. */
function MyListing() {
  const { st, set, showToast } = useResident();
  const reqs = useShareRequests();
  const ms = st.sharePublished;

  if (!ms) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader
          title={t('تفاصيل مشاركتك')}
          onBack={() => set({ screen: 'share', shareTab: 'mine' })}
        />
        <EmptyState
          icon={icons.neighbors}
          title={t('لم تشارك شيئًا بعد')}
          sub={t('انشر ما لديك ليبدأ جيرانك بإرسال طلبات الحجز.')}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        title={t('تفاصيل مشاركتك')}
        onBack={() => set({ screen: 'share', shareTab: 'mine' })}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: radius.card }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={tileStyle}>
              <Icon path={shareIcon(ms.kind)} size={20} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: color.navy }}>{t(ms.title)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ width: 6, height: 6, borderRadius: 99, background: color.green, flex: 'none' }}
                />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: color.greenDeep }}>
                  {t('منشورة — يراها جيرانك الآن')}
                </span>
              </span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 'none' }}>
              <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: color.goldDeep }}>
                {priceLabel(ms.price)}
              </span>
              <span style={{ fontSize: 10, color: color.slate }}>{t(ms.unit)}</span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 14,
              paddingTop: 13,
              borderTop: `1px solid ${color.line}`,
            }}
          >
            <span style={chipStyle(color.navy)}>{ms.slots[0]?.[0] ?? '—'}</span>
            <span style={chipStyle(color.slate)}>{ms.slots[0]?.[1] ?? '—'}</span>
            <span style={{ flex: 1 }} />
            <button
              onClick={() => set((s) => ({ screen: 'shareCreate', hist: [...s.hist, 'myListing'] }))}
              style={{
                border: '1.5px solid rgba(31,59,87,0.2)',
                background: 'transparent',
                borderRadius: radius.pill,
                padding: '6px 14px',
                fontSize: 10.5,
                fontWeight: 800,
                color: color.navy,
                cursor: 'pointer',
                fontFamily: font.sans,
              }}
            >
              {t('تعديل')}
            </button>
            <button
              onClick={() => {
                set({ sharePublished: null, screen: 'share', shareTab: 'mine' });
                showToast(t('أُوقفت المشاركة — لم تعد تظهر لجيرانك'));
              }}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: color.coral,
                fontSize: 10.5,
                fontWeight: 800,
                fontFamily: font.sans,
              }}
            >
              {t('إيقاف المشاركة')}
            </button>
          </div>
        </Card>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '18px 2px 10px' }}>
          {t('طلبات الحجز الواردة')}
        </div>
        {reqs.length === 0 ? (
          <Note>{t('لا طلبات بعد — يصلك إشعار فور أول طلب')}</Note>
        ) : (
          reqs.map((rq) => <RequestRow key={rq.name} rq={rq} />)
        )}
      </div>
    </div>
  );
}

/** R69d — every request on your listing, with the unanswered count. */
function ShareRequests() {
  const { st, back } = useResident();
  const reqs = useShareRequests();
  const pending = shareReqDefs.filter((_, i) => (st.shReqs[i] ?? 'new') === 'new').length;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>
          {t('كل طلبات الحجز')}
        </div>
        <StatusPill tone="gold" style={{ fontSize: 11, padding: '4px 13px', fontWeight: 800 }}>
          {pending}
        </StatusPill>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {reqs.map((rq) => (
          <RequestRow key={rq.name} rq={rq} />
        ))}
      </div>
    </div>
  );
}

/* ==================== The borrower's side of a booking ==================== */

/**
 * R69b — the three stages of a borrow: booked, in use, returned. The wording
 * shifts with what was borrowed (see `bookingWording`), and the last stage
 * shows the rating the owner left you.
 */
function Booking() {
  const { st, set, go, showToast } = useResident();
  const all = st.sharePublished ? [st.sharePublished, ...shareDefs] : shareDefs;
  const sel = all[st.shareSelIdx] ?? all[0];
  const w = bookingWording[bookingVoiceOf(sel.kind)];
  const stage = Math.min(st.shbStage, 2);
  const chrome = bookingStageChrome[stage];

  const advance = () => {
    const next = stage + 1;
    set({ shbStage: next });
    showToast(t(next === 1 ? w.t1 : w.t2));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تفاصيل الحجز')} onBack={() => go('share')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: radius.card }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={tileStyle}>
              <Icon path={shareIcon(sel.kind)} size={20} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: color.navy }}>{t(sel.title)}</span>
              <span style={{ fontSize: 10.5, color: color.slate }}>
                {t('الموعد المحجوز:')} {t(st.shBookedSlot)}
              </span>
            </span>
          </div>
          <div
            style={{
              background: chrome.bg,
              color: chrome.c,
              borderRadius: radius.pill,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 800,
              marginTop: 13,
              display: 'inline-block',
            }}
          >
            {t(w.st[stage])}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 14,
              paddingTop: 13,
              borderTop: `1px solid ${color.line}`,
            }}
          >
            <span style={{ fontSize: 12, color: color.slate }}>{t('التكلفة')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: color.goldDeep }}>
              {priceLabel(sel.price)}
            </span>
            <span style={{ fontSize: 11, color: color.slate, marginInlineStart: 5 }}>{t(sel.unit)}</span>
          </div>
          <div style={{ fontSize: 10.5, color: color.slateLight, marginTop: 8 }}>
            {t('الدفع كاش يدًا بيد عند الاستلام')}
          </div>
        </Card>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                flex: 'none',
              }}
            >
              {t(sel.owner)[0]}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t(sel.owner)}</span>
              <span style={{ fontSize: 10.5, color: color.slate }}>
                {t('المالك')} · {t(w.arrange)}
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
            <PillButton
              full
              onClick={() => {
                go('chat');
                showToast(`${t('فُتحت محادثة مع')} ${t(sel.owner)}`);
              }}
              style={{ padding: 11, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <Icon path={icons.chat} size={15} stroke="#fff" width={1.6} />
              {t('افتح محادثة')}
            </PillButton>
            <PillButton
              tone="ghost"
              onClick={() => showToast(`${t('جاري الاتصال بـ')}${t(sel.owner)}…`)}
              style={{ padding: '11px 20px', fontSize: 12.5 }}
            >
              {t('اتصال')}
            </PillButton>
          </div>
        </Card>

        {stage === 0 && (
          <PillButton size="lg" full onClick={advance} style={{ marginTop: 14 }}>
            {t(w.b0)}
          </PillButton>
        )}

        {stage === 1 && (
          <>
            <div style={{ marginTop: 14 }}>
              <Note>{t(w.open)}</Note>
            </div>
            <PillButton size="lg" full tone="green" onClick={advance} style={{ marginTop: 10 }}>
              {t(w.b1)}
            </PillButton>
          </>
        )}

        {stage === 2 && (
          <>
            <Card pad={16} style={{ borderRadius: 18, marginTop: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>
                {t('تقييم المالك لتجربته معك')}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} path={icons.star} size={20} stroke={color.gold} fill={color.gold} />
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: color.slate, marginTop: 10, lineHeight: 1.8 }}>
                {t(w.rate)}
              </div>
            </Card>
            <PillButton size="lg" full onClick={() => go('share')} style={{ marginTop: 12 }}>
              {t('العودة للاستعارة')}
            </PillButton>
          </>
        )}
      </div>
    </div>
  );
}

/* ====================== The log of finished shares ====================== */

/** R69c — everything you have lent out, and what it earned. */
function SharesLog() {
  const { back, go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('سجل مشاركاتك')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {shareHistDefs.map((h, i) => (
          <Card
            key={t(h.title)}
            pad="14px 16px"
            onClick={() => go('shareHistDetail', { shHistSelIdx: i })}
            style={{ borderRadius: 18, marginBottom: 9 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={tileStyle}>
                <Icon path={shareHistIcon[h.icon]} size={20} width={1.6} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(h.title)}</span>
                <span style={{ fontSize: 10.5, color: color.slate }}>
                  {t('انتهت —')} {h.uses} {t('استخدامات')}
                </span>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 'none' }}>
                <span style={{ ...numeric, fontSize: 16, fontWeight: 700, color: color.goldDeep }}>
                  {h.total}
                </span>
                <span style={{ fontSize: 10, color: color.slate }}>{t('ر.س')}</span>
              </span>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** R69f — one finished listing: who borrowed it, when, and how it went. */
function SharesLogDetail() {
  const { st, back } = useResident();
  const h = shareHistDefs[st.shHistSelIdx] ?? shareHistDefs[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('تقرير المشاركة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ borderRadius: radius.card }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: color.navy }}>{t(h.title)}</div>
          <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
            {t('انتهت —')} {h.uses} {t('استخدامات')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 14,
              paddingTop: 13,
              borderTop: `1px solid ${color.line}`,
            }}
          >
            <span style={{ fontSize: 12, color: color.slate }}>{t('الإجمالي المحصّل كاش')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 18, fontWeight: 700, color: color.goldDeep }}>
              {h.total} <span style={{ fontSize: 11, color: color.slate }}>{t('ر.س')}</span>
            </span>
          </div>
        </Card>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '18px 2px 10px' }}>
          {t('من استخدمها')}
        </div>
        {h.borrowers.map((b) => (
          <Card key={t(b.name)} pad="13px 15px" style={{ borderRadius: 18, marginBottom: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  flex: 'none',
                }}
              >
                {t(b.name)[0]}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t(b.name)}</span>
                <span style={{ fontSize: 10.5, color: color.slate }}>{t(b.when)}</span>
              </span>
              <span
                style={{ ...numeric, fontSize: 12, fontWeight: 800, color: color.goldDeep, flex: 'none' }}
              >
                {t(b.paid)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${color.line}`,
              }}
            >
              <span style={{ fontSize: 12, color: color.gold, letterSpacing: 1, flex: 'none' }}>
                {'★'.repeat(b.stars)}
                {'☆'.repeat(5 - b.stars)}
              </span>
              <span style={{ fontSize: 10.5, color: color.slate, lineHeight: 1.7 }}>{t(b.note)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Small shared pieces
 * ---------------------------------------------------------------- */

/** A round icon button in a screen header. */
function HeaderIconButton({
  title,
  path,
  on = false,
  onClick,
}: {
  title: string;
  path: string;
  on?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 99,
        border: 'none',
        cursor: 'pointer',
        background: on ? color.navy : '#fff',
        boxShadow: shadow.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon path={path} size={18} stroke={on ? '#fff' : color.navy} width={1.6} />
    </button>
  );
}

function MineStat({ value, label, tone = color.navy }: { value: string; label: string; tone?: string }) {
  return (
    <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <span style={{ ...numeric, fontSize: 17, fontWeight: 700, color: tone }}>{value}</span>
      <span style={{ fontSize: 9.5, color: color.slate }}>{label}</span>
    </span>
  );
}

function StatDivider() {
  return <span style={{ width: 1, alignSelf: 'stretch', background: color.line }} />;
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

/** One numbered step on «شارك شيئًا لديك», each a card of its own. */
function StepCard({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Card pad={16} style={{ borderRadius: 18, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 99,
            background: color.navy,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...numeric,
            fontSize: 11,
            fontWeight: 700,
            flex: 'none',
          }}
        >
          {n}
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{title}</span>
      </div>
      {children}
    </Card>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

export const Sharing = {
  Browse, Create, Detail,
  MyListing, ShareRequests, Booking, SharesLog, SharesLogDetail,
};
