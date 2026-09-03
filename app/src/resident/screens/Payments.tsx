import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader } from '@/ui/primitives';
import { icons } from '../data/icons';
import {
  autopaySteps,
  fmt,
  methodDefs,
  pastReceipts,
  statementItems,
  statementLabel,
  statementTotal,
} from '../data/payments';
import { UNIT } from '../data/seed';
import { useResident } from '../store';
import { DetailRow, Note, SuccessMark, Timeline } from './parts';
import { Radio } from './Marketplace';
import { t } from '@/i18n/lang';

/**
 * R10 — Statement. Carries the dual rent/installment model that is the key
 * localization proof point: the same screen serves a monthly tenant and a
 * multi-year installment buyer, switched by the segmented control.
 */
function Statement() {
  const { set, go, isRent, paid } = useResident();
  const total = statementTotal(isRent);
  const items = statementItems(isRent);

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('السداد')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: radius.pill,
            padding: 4,
            boxShadow: shadow.card,
          }}
        >
          {[
            { k: 'rent' as const, l: t('إيجار شهري') },
            { k: 'installment' as const, l: t('تقسيط تمليك') },
          ].map((m) => {
            const on = (isRent ? 'rent' : 'installment') === m.k;
            return (
              <button
                key={m.k}
                onClick={() => set({ payModelOverride: m.k })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {t(m.l)}
              </button>
            );
          })}
        </div>

        <Card pad={18} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12.5, color: color.slate }}>{statementLabel(isRent)}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ ...numeric, fontSize: 34, fontWeight: 700, color: color.navy }}>
              {fmt(total)}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: color.slate }}>{t('ريال')}</span>
          </div>

          {!isRent && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>{t('سنة 3 من 8')}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 11.5, color: color.slate }}>{t('11 قسطًا متبقيًا من 16')}</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 99,
                  background: color.tileAlt,
                  marginTop: 8,
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '31%', height: '100%', borderRadius: 99, background: color.gold }} />
              </div>
            </div>
          )}

          {isRent && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(31,59,87,0.06)',
                borderRadius: radius.pill,
                padding: '4px 12px',
                marginTop: 12,
              }}
            >
              <Icon path={icons.events} size={13} width={1.6} />
              <span style={{ fontSize: 11, fontWeight: 700, color: color.navy }}>
                {t('يتجدد الاستحقاق في 25 من كل شهر')}
              </span>
            </div>
          )}
        </Card>

        <Card pad="6px 16px" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, padding: '12px 0 4px' }}>
            {t('تفاصيل الرصيد')}
          </div>
          {items.map((li) => (
            <div
              key={t(li.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: 13, color: color.slateDark }}>{t(li.label)}</span>
              <span style={{ flex: 1 }} />
              <span style={{ ...numeric, fontSize: 13, fontWeight: 600, color: color.navy }}>
                {li.amount} ر.س
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t('الإجمالي')}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 14.5, fontWeight: 700, color: color.navy }}>
              {fmt(total)} ر.س
            </span>
          </div>
        </Card>

        <Card pad="2px 16px" style={{ marginTop: 12 }}>
          {[
            { label: t('سجل السداد والإيصالات'), to: 'payHistory' as const },
            { label: t('الخدمات المالية والتأمين'), to: 'fin' as const },
            { label: t('إدارة الدفع التلقائي'), to: 'autopay' as const },
          ].map((pl) => (
            <button
              key={t(pl.label)}
              onClick={() => go(pl.to)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '13px 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                textAlign: 'right',
              }}
            >
              <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: color.navy }}>
                {t(pl.label)}
              </span>
              <Icon path="M15 5l-7 7 7 7" size={13} stroke={color.slateLight} width={2} />
            </button>
          ))}
        </Card>

        <PillButton
          size="lg"
          full
          tone={paid ? 'green' : 'gold'}
          onClick={() => (paid ? go('payHistory') : go('payNow'))}
          style={{ marginTop: 16, boxShadow: '0 6px 18px rgba(199,154,60,0.35)' }}
        >
          {paid ? t('تم السداد ✓ — عرض الإيصال') : `${t('ادفع')} ${fmt(total)} ${t('ر.س')}`}
        </PillButton>
      </div>
    </div>
  );
}

/** R11 — Pay now. */
function PayNow() {
  const { st, set, back, isRent } = useResident();
  const total = statementTotal(isRent);

  const doPay = () => {
    const method = methodDefs.find((m) => m.key === st.method) ?? methodDefs[0];
    set((s) => ({
      [isRent ? 'rentPaid' : 'instPaid']: true,
      paidAmount: fmt(total),
      paidMethod: method.name,
      screen: 'paySuccess',
      hist: [...s.hist, 'payNow'],
    }));
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('إتمام الدفع')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <div
          style={{
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: radius.card,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('المبلغ المطلوب')}</span>
          <span style={{ ...numeric, fontSize: 32, fontWeight: 700, color: '#fff', marginTop: 2 }}>
            {fmt(total)} <span style={{ fontSize: 15 }}>{t('ر.س')}</span>
          </span>
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, margin: '16px 0 8px' }}>
          {t('اختر طريقة الدفع')}
        </div>
        {methodDefs.map((m) => {
          const on = st.method === m.key;
          return (
            <button
              key={m.key}
              onClick={() => set({ method: m.key })}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: on ? 'rgba(199,154,60,0.1)' : '#fff',
                border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.05)'}`,
                borderRadius: radius.inner,
                padding: '13px 14px',
                cursor: 'pointer',
                marginBottom: 8,
                textAlign: 'right',
              }}
            >
              <Radio on={on} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(m.name)}</span>
                <span style={{ fontSize: 11, color: color.slate }}>{t(m.sub)}</span>
              </span>
            </button>
          );
        })}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 10,
          }}
        >
          <Icon path={icons.shield} size={14} stroke={color.slate} width={1.5} />
          <span style={{ fontSize: 11, color: color.slate }}>{t('معاملة مؤمنة عبر بوابة دفع معتمدة')}</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={doPay}
          style={{ boxShadow: '0 6px 18px rgba(199,154,60,0.35)' }}
        >
          ادفع {fmt(total)} ر.س
        </PillButton>
      </div>
    </div>
  );
}

/** R11b — Payment success with receipt. */
function PaySuccess() {
  const { st, go, showToast, isRent } = useResident();
  // Falls back to the statement figures when the screen is opened cold from
  // the gallery rather than reached through the pay flow.
  const amount = st.paidAmount || fmt(statementTotal(isRent));
  const method = st.paidMethod || methodDefs[0].name;
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
      <SuccessMark />
      <div style={{ fontSize: 22, fontWeight: 900, color: color.navy, marginTop: 18 }}>
        {t('تم الدفع بنجاح')}
      </div>
      <div style={{ fontSize: 13.5, color: color.slate, marginTop: 6 }}>
        <span style={{ ...numeric, fontWeight: 600 }}>{t(amount)}</span> {t('ر.س —')} {method}
      </div>

      <Card pad="6px 18px" style={{ width: '100%', marginTop: 22 }}>
        <DetailRow label={t('رقم الإيصال')} value={<span style={numeric}>#88412</span>} />
        <DetailRow label={t('التاريخ')} value={t('10 يوليو 2026')} />
        <DetailRow label={t('الوحدة')} value={t(UNIT)} last />
      </Card>

      <button
        onClick={() => showToast('جاري تحميل الإيصال…')}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: color.gold,
          fontSize: 13,
          fontWeight: 800,
          marginTop: 14,
          fontFamily: font.sans,
        }}
      >
        {t('تحميل الإيصال (PDF)')}
      </button>
      <PillButton size="lg" full onClick={() => go('home')} style={{ marginTop: 14 }}>
        {t('العودة للرئيسية')}
      </PillButton>
    </div>
  );
}

/** R16 — Receipts. The current period's receipt is prepended once paid. */
function History() {
  const { st, back, isRent, showToast } = useResident();
  const receipts = [
    ...(st.rentPaid || st.instPaid
      ? [
          {
            label: isRent ? t('إيجار يوليو + رسوم الصيانة') : t('قسط سنة 3 + رسوم الصيانة'),
            date: t('10 يوليو 2026'),
            no: '88412',
            amount: st.paidAmount || fmt(statementTotal(isRent)),
          },
        ]
      : []),
    ...pastReceipts,
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('سجل السداد')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {receipts.map((rc) => (
          <Card
            key={rc.no}
            pad="14px 16px"
            style={{ borderRadius: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(63,166,107,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path={icons.check} size={18} stroke={color.green} width={2.2} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(rc.label)}</span>
              <span style={{ fontSize: 11, color: color.slate }}>
                {t(rc.date)} {t('· إيصال')} <span style={numeric}>#{rc.no}</span>
              </span>
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
              <span style={{ ...numeric, fontSize: 14, fontWeight: 700, color: color.navy, whiteSpace: 'nowrap' }}>
                {rc.amount} ر.س
              </span>
              <button
                onClick={() => showToast('جاري تحميل الإيصال…')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: color.gold,
                  fontFamily: font.sans,
                }}
              >
                {t('تحميل PDF')}
              </button>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** R39 — Auto-pay: the resident's side of the money cycle. */
function Autopay() {
  const { st, set, back, isRent, showToast } = useResident();
  const total = statementTotal(isRent);
  const notDone = st.apStage < autopaySteps.length - 1;

  const advance = () => {
    const next = Math.min(st.apStage + 1, autopaySteps.length - 1);
    set({ apStage: next });
    // The last stage genuinely settles the balance, so the home hero flips.
    if (next === autopaySteps.length - 1) {
      set(isRent ? { rentPaid: true } : { instPaid: true });
      showToast(`${t('تم خصم')} ${fmt(total)} ${t('ر.س تلقائيًا')}`);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الدفع التلقائي')} onBack={back} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <button
          onClick={() => set({ autoPayOn: !st.autoPayOn })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: 'none',
            cursor: 'pointer',
            background: st.autoPayOn ? 'rgba(63,166,107,0.1)' : '#fff',
            borderRadius: 18,
            padding: 16,
            boxShadow: shadow.card,
            textAlign: 'right',
          }}
        >
          <span
            style={{
              width: 44,
              height: 24,
              borderRadius: 99,
              background: st.autoPayOn ? color.green : color.line,
              position: 'relative',
              flex: 'none',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2.5,
                left: st.autoPayOn ? 22.5 : 2.5,
                width: 19,
                height: 19,
                borderRadius: 99,
                background: '#fff',
                transition: 'left .2s',
              }}
            />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: st.autoPayOn ? color.greenDeep : color.navy,
              }}
            >
              {st.autoPayOn ? t('الدفع التلقائي مفعّل') : t('الدفع التلقائي متوقف')}
            </span>
            <span style={{ fontSize: 11, color: color.slate }}>
              {t('يُخصم المستحق تلقائيًا يوم 25 من كل شهر')}
            </span>
          </span>
        </button>

        <Card
          pad="15px 16px"
          style={{ borderRadius: 18, marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={icons.pay} size={19} width={1.6} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>
              بطاقة بنكية •••• 4821
            </span>
            <span style={{ fontSize: 11, color: color.slate }}>{t('مدى — البنك الأهلي السعودي')}</span>
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: color.gold }}>{t('تغيير')}</span>
        </Card>

        <div style={{ fontSize: 13.5, fontWeight: 800, color: color.navy, margin: '18px 2px 10px' }}>
          {t('كيف تعمل دورة الخصم الشهرية')}
        </div>
        <Card pad="18px 16px 8px" style={{ borderRadius: 18 }}>
          <Timeline
            steps={autopaySteps.map((s, i) => ({
              label: s.label,
              sub: i === 1 ? `${t('يُخصم')} ${fmt(total)} ${t('ر.س من بطاقتك •••• 4821 دون أي خطوة منك')}` : s.sub,
            }))}
            doneCount={st.apStage + 1}
            currentIndex={st.apStage}
            minLine={24}
          />
        </Card>

        {notDone && (
          <PillButton full onClick={advance} style={{ marginTop: 12, padding: 13, fontSize: 13.5 }}>
            {autopaySteps[st.apStage + 1].label} (محاكاة)
          </PillButton>
        )}

        {!notDone && (
          <div
            style={{
              background: 'rgba(63,166,107,0.12)',
              borderRadius: 18,
              padding: 16,
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon path={icons.check} size={22} stroke={color.green} width={2.4} />
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800, color: color.greenDeep, lineHeight: 1.7 }}>
              تم خصم {fmt(total)} ر.س تلقائيًا — الإيصال في سجل السداد
            </span>
            <button
              onClick={() => set({ apStage: -1 })}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: color.greenDeep,
                fontSize: 11,
                fontWeight: 800,
                textDecoration: 'underline',
                fontFamily: font.sans,
              }}
            >
              {t('إعادة')}
            </button>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Note tone="navy">
            {t('إذا فشل الخصم (رصيد غير كافٍ)، نعيد المحاولة تلقائيًا بعد 24 ساعة ونرسل لك إشعارًا — دون أي رسوم تأخير خلال فترة السماح (5 أيام).')}
          </Note>
        </div>
      </div>
    </div>
  );
}

/** R27 — Financial services, as the fanned card stack. */
function Financial() {
  const { back } = useResident();
  const finItems = [
    {
      dot: color.orange,
      title: t('حماية من السرقة'),
      sub: t('تغطية حتى 50,000 ر.س على محتويات الوحدة — بوليصة سارية.'),
    },
    {
      dot: color.green,
      title: t('تقييم السداد'),
      sub: t('سجل سداد إيجابي 12 شهرًا متتالية — يفيدك عند التقدم لعقود إيجار أو تقسيط مستقبلية.'),
    },
    {
      dot: color.navy,
      title: t('تأمين الوحدة'),
      sub: t('بوليصة JW-214-2026 — سارية حتى 31 ديسمبر 2026.'),
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('الخدمات المالية')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {/* fanned card stack */}
        <div style={{ position: 'relative', height: 170, margin: '14px 8px 6px' }}>
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 6,
              left: 26,
              height: 120,
              borderRadius: 18,
              background: 'linear-gradient(140deg,#E4894A,#D97036)',
              transform: 'rotate(-5deg)',
              boxShadow: '0 8px 20px rgba(217,112,54,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              left: 16,
              height: 126,
              borderRadius: 18,
              background: 'linear-gradient(140deg,#4CAF7D,#3FA66B)',
              transform: 'rotate(3deg)',
              boxShadow: '0 8px 20px rgba(63,166,107,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 8,
              left: 8,
              height: 134,
              borderRadius: 18,
              background: 'linear-gradient(140deg,#2B5A8C,#1F3B57)',
              boxShadow: '0 10px 26px rgba(31,59,87,0.35)',
              padding: '16px 18px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
              {t('تأمين الوحدة')}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {t('فيلا 214 — مؤمّنة')}
            </div>
            <div
              style={{
                ...numeric,
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 20,
                letterSpacing: 1,
              }}
            >
              POLICY RFD-214-2026
            </div>
            <div style={{ fontSize: 10.5, color: color.gold, fontWeight: 800, marginTop: 4 }}>
              {t('سارية حتى 31 ديسمبر 2026')}
            </div>
          </div>
        </div>

        {finItems.map((f) => (
          <Card
            key={t(f.title)}
            pad="14px 16px"
            style={{ borderRadius: 18, marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: 99,
                background: f.dot,
                marginTop: 5,
                flex: 'none',
              }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>{t(f.title)}</span>
              <span style={{ fontSize: 11.5, color: color.slate, lineHeight: 1.8 }}>{t(f.sub)}</span>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const Payments = { Statement, PayNow, PaySuccess, History, Autopay, Financial };
