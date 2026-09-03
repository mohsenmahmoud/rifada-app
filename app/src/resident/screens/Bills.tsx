import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import {
  BILL_SERVICE_FEE,
  autopayCaps,
  billCatDefs,
  billHistoryFilters,
  billHistoryRows,
  billOrder,
  billStMeta,
  billSubs,
  linkProviderLists,
} from '../data/bills';
import { useResident } from '../store';
import type { BillKey } from '../types';
import { ChipRow, Note } from './parts';
import { Radio } from './Marketplace';
import { t } from '@/i18n/lang';

/** Resolve a bill's status from either the seeded set or a newly linked one. */
function statusOf(
  billsSt: Partial<Record<BillKey, string>>,
  linkedExtra: Partial<Record<BillKey, string>>,
  key: BillKey,
) {
  return (billsSt[key] ?? linkedExtra[key]) as keyof typeof billStMeta | undefined;
}

/** R51 — فواتيرك home. */
function Home() {
  const { st, go } = useResident();

  const totalDue = billOrder
    .filter((k) => {
      const s = statusOf(st.billsSt, st.linkedExtra, k);
      return s && s !== 'paid';
    })
    .reduce((a, k) => a + billCatDefs[k].amount, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t('فواتيرك')}</div>
        <button
          onClick={() => go('billHistory')}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: radius.pill,
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 800,
            color: color.navy,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: font.sans,
            whiteSpace: 'nowrap',
          }}
        >
          {t('سجل السداد')}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div
          style={{
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: radius.card,
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
            {t('إجمالي المستحق هذا الشهر — فواتير خارجية')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ ...numeric, fontSize: 28, fontWeight: 700, color: '#fff' }}>{totalDue}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{t('ر.س')}</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            {t('منفصلة تمامًا عن رسوم الوحدة — تُسدد عبر شريك الدفع المعتمد')}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '16px 2px 8px' }}>
          {t('فواتيرك المربوطة')}
        </div>

        {billOrder.map((key) => {
          const d = billCatDefs[key];
          const s = statusOf(st.billsSt, st.linkedExtra, key);
          const linked = !!s;
          const m = billStMeta[s ?? 'due'];
          return (
            <button
              key={key}
              onClick={() =>
                linked
                  ? go('billDetail', { selBillKey: key })
                  : go('billLink', { linkCat: key, linkProviderIdx: 0, linkAccountNo: '' })
              }
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                background: '#fff',
                borderRadius: 18,
                padding: '14px 16px',
                boxShadow: shadow.card,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'right',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: color.tile,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={d.icon} size={20} width={1.5} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: color.navy, whiteSpace: 'nowrap' }}>
                  {t(d.cat)}
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
                  {billSubs[key]}
                </span>
              </span>
              {linked ? (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ ...numeric, fontSize: 14, fontWeight: 700, color: color.navy }}>
                    {d.amount} <span style={{ fontSize: 9.5, color: color.slate }}>{t('ر.س')}</span>
                  </span>
                  <StatusPill bg={m.bg} c={m.c} style={{ fontSize: 9.5, padding: '2px 10px', fontWeight: 800 }}>
                    {t(m.label)}
                  </StatusPill>
                </span>
              ) : (
                <span
                  style={{
                    color: color.goldDeep,
                    border: `1.5px solid ${color.gold}`,
                    borderRadius: radius.pill,
                    padding: '6px 14px',
                    fontSize: 10.5,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    flex: 'none',
                  }}
                >
                  {t('+ ربط فاتورة')}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => go('billLink', { linkCat: 'elec', linkProviderIdx: 0, linkAccountNo: '' })}
          style={{
            width: '100%',
            border: `1.5px dashed ${color.gold}`,
            background: 'rgba(199,154,60,0.06)',
            borderRadius: radius.inner,
            padding: 13,
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 800,
            color: color.goldDeep,
            marginTop: 2,
            fontFamily: font.sans,
          }}
        >
          {t('+ ربط فاتورة جديدة — كهرباء، إنترنت، أو غيرها')}
        </button>
      </div>
    </div>
  );
}

/** R52 — Link a new bill: category first, then that category's providers. */
function Link() {
  const { st, set, back, showToast } = useResident();
  const cat = st.linkCat ?? 'elec';
  const providers = linkProviderLists[cat] ?? [];

  const confirm = () => {
    set((s) => ({
      linkedExtra: { ...s.linkedExtra, [cat]: 'due' },
      screen: 'bills',
      hist: s.hist.slice(0, -1),
    }));
    showToast(`${t('تم ربط فاتورة')} ${billCatDefs[cat].cat} ${t('— سيظهر المستحق فور صدوره')}`);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('ربط فاتورة جديدة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Label>{t('نوع الفاتورة')}</Label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
          {billOrder.map((key) => {
            const on = cat === key;
            return (
              <button
                key={key}
                onClick={() => set({ linkCat: key, linkProviderIdx: 0 })}
                style={{
                  borderRadius: radius.pill,
                  padding: '8px 16px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: on ? color.navy : '#fff',
                  color: on ? '#fff' : color.slate,
                  border: `1.5px solid ${on ? color.navy : 'rgba(0,0,0,0.08)'}`,
                  fontFamily: font.sans,
                }}
              >
                {billCatDefs[key].cat}
              </button>
            );
          })}
        </div>

        <Label>{t('اختر مقدم الخدمة —')} {billCatDefs[cat].cat}</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {providers.map((label, i) => {
            const on = st.linkProviderIdx === i;
            return (
              <button
                key={label}
                onClick={() => set({ linkProviderIdx: i })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  background: on ? 'rgba(199,154,60,0.08)' : '#fff',
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: radius.tile,
                  padding: '13px 15px',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                <Radio on={on} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t(label)}</span>
              </button>
            );
          })}
        </div>

        <Label style={{ marginTop: 16 }}>{t('رقم الحساب / العداد / المشترك')}</Label>
        <input
          dir="ltr"
          value={st.linkAccountNo}
          onChange={(e) => set({ linkAccountNo: e.target.value })}
          placeholder={t('مثال: 0442 1187 3390')}
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            ...numeric,
            fontSize: 14,
            fontWeight: 600,
            color: color.navy,
            boxShadow: shadow.card,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: 12 }}>
          <Note tone="navy">
            {t('يتم الربط والاستعلام عبر شريك الدفع المعتمد — لا يشارك رفادة بياناتك مع أي طرف آخر.')}
          </Note>
        </div>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={confirm}>
          {t('ربط الفاتورة')}
        </PillButton>
      </div>
    </div>
  );
}

/** R53 — Bill detail and payment. */
function Detail() {
  const { st, set, back, go, showToast } = useResident();
  const key = st.selBillKey;
  const d = billCatDefs[key];
  const s = statusOf(st.billsSt, st.linkedExtra, key) ?? 'due';
  const m = billStMeta[s];
  const isPaid = s === 'paid';

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, color: color.navy }}>{t(d.cat)}</div>
        <button
          onClick={() => go('billAutopay')}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: radius.pill,
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 800,
            color: color.navy,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: font.sans,
            whiteSpace: 'nowrap',
          }}
        >
          {t('الدفع التلقائي')}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={18} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: color.slate }}>
            {t(d.provider)} · {d.account}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ ...numeric, fontSize: 34, fontWeight: 700, color: color.navy }}>
              {d.amount}
            </span>
            <span style={{ fontSize: 13, color: color.slate }}>{t('ر.س')}</span>
          </div>
          <StatusPill bg={m.bg} c={m.c} style={{ fontSize: 10.5, padding: '3px 14px', fontWeight: 800, marginTop: 8 }}>
            {t(m.label)}
          </StatusPill>
        </Card>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t('تفاصيل الفاتورة')}</div>
          {d.lines.map((bl) => (
            <div
              key={t(bl.name)}
              style={{
                display: 'flex',
                fontSize: 12,
                color: color.slateDark,
                padding: '6px 0',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <span>{t(bl.name)}</span>
              <span style={{ flex: 1 }} />
              <span style={{ ...numeric, fontWeight: 700 }}>{t(bl.val)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', fontSize: 11, color: color.slate, paddingTop: 8 }}>
            <span>{t('رسوم خدمة رفادة')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontWeight: 700 }}>{BILL_SERVICE_FEE} {t('ر.س')}</span>
          </div>
        </Card>

        {isPaid && (
          <div
            style={{
              background: 'rgba(63,166,107,0.1)',
              borderRadius: radius.tile,
              padding: 13,
              marginTop: 12,
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: color.greenDeep,
            }}
          >
            {t('تم سداد هذه الفاتورة ✓ — الإيصال في سجل السداد')}
          </div>
        )}
      </div>

      {!isPaid && (
        <div style={{ padding: '0 20px 34px' }}>
          <PillButton
            tone="gold"
            size="lg"
            full
            onClick={() => {
              set((s2) => ({ billsSt: { ...s2.billsSt, [key]: 'paid' } }));
              showToast(`${t('تم سداد فاتورة')} ${t(d.cat)} ${t('بنجاح ✓ — الإيصال في سجل السداد')}`);
            }}
            style={{ boxShadow: '0 6px 18px rgba(199,154,60,0.35)' }}
          >
            ادفع الآن — {d.amount + BILL_SERVICE_FEE} ر.س
          </PillButton>
        </div>
      )}
    </div>
  );
}

/** R54 — Bill payment history. */
function History() {
  const { st, set, back, showToast } = useResident();
  const rows = billHistoryRows.filter((r) => st.bhFilter === 'all' || r.key === st.bhFilter);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('سجل سداد الفواتير')} onBack={back} />
      <div style={{ padding: '6px 20px 4px' }}>
        <ChipRow
          chips={billHistoryFilters}
          value={st.bhFilter}
          onPick={(k) => set({ bhFilter: k })}
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {rows.map((r, i) => (
          <Card
            key={`${r.key}-${i}`}
            pad="13px 15px"
            style={{ borderRadius: radius.inner, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 11 }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={billCatDefs[r.key].icon} size={17} width={1.5} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: color.navy, whiteSpace: 'nowrap' }}>
                {t(r.title)}
              </span>
              <span style={{ fontSize: 10, color: color.slate, whiteSpace: 'nowrap' }}>{t(r.date)}</span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
              <span style={{ ...numeric, fontSize: 12.5, fontWeight: 700, color: color.navy, whiteSpace: 'nowrap' }}>
                {r.amount} ر.س
              </span>
              <button
                onClick={() => showToast(`${t('جارٍ تحميل إيصال')} ${t(r.title)} (PDF)`)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: color.goldDeep,
                  fontSize: 9.5,
                  fontWeight: 800,
                  padding: 0,
                  fontFamily: font.sans,
                }}
              >
                تحميل الإيصال ↓
              </button>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** R55 — Per-bill autopay with an alert ceiling. */
function Autopay() {
  const { st, set, back } = useResident();
  const key = st.selBillKey;
  const on = !!st.billAutopay[key];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={`${t('الدفع التلقائي —')} ${billCatDefs[key].cat}`} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <button
          onClick={() => set((s) => ({ billAutopay: { ...s.billAutopay, [key]: !on } }))}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: 18,
            padding: '15px 16px',
            boxShadow: shadow.card,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 44,
              height: 24,
              borderRadius: 99,
              background: on ? color.green : color.line,
              position: 'relative',
              flex: 'none',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2.5,
                left: on ? 22.5 : 2.5,
                width: 19,
                height: 19,
                borderRadius: 99,
                background: '#fff',
                transition: 'left .2s',
              }}
            />
          </span>
          <span style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>
              {on ? t('الخصم التلقائي مفعّل') : t('الخصم التلقائي متوقف')}
            </span>
            <span style={{ fontSize: 10.5, color: color.slate }}>
              {t('تُسدد تلقائيًا في تاريخ الاستحقاق من بطاقتك المحفوظة')}
            </span>
          </span>
        </button>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{t('حد التنبيه')}</div>
          <div style={{ fontSize: 10.5, color: color.slate, marginTop: 2 }}>
            {t('نبهك قبل السداد إذا تجاوزت الفاتورة هذا المبلغ')}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {autopayCaps.map((v) => {
              const sel = st.billCap === v;
              return (
                <button
                  key={v}
                  onClick={() => set({ billCap: v })}
                  style={{
                    flex: 1,
                    borderRadius: radius.pill,
                    padding: '9px 4px',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: sel ? color.navy : '#fff',
                    color: sel ? '#fff' : color.slate,
                    border: `1.5px solid ${sel ? color.navy : 'rgba(0,0,0,0.08)'}`,
                    fontFamily: font.sans,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v} ر.س
                </button>
              );
            })}
          </div>
        </Card>

        <div style={{ marginTop: 12 }}>
          <Note>{t('عند تجاوز الحد، يتوقف السداد التلقائي وتصلك رسالة لمراجعة الفاتورة قبل الدفع.')}</Note>
        </div>
      </div>
    </div>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

export const Bills = { Home, Link, Detail, History, Autopay };
