import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader } from '@/ui/primitives';
import { icons } from '../data/icons';
import {
  disputeReasonDefs,
  liveStepDefs,
  providerDefs,
  reqKindDefs,
} from '../data/marketplace';
import { UNIT } from '../data/seed';
import { useResident } from '../store';
import { Stars, Timeline } from './parts';
import { t } from '@/i18n/lang';

/** R33 — Request an instant service. */
function Request() {
  const { st, set, back, go } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="اطلب خدمة فورية" onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <FieldLabel>{t('نوع الخدمة')}</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {reqKindDefs.map((k) => {
            const on = st.reqKind === k.label;
            return (
              <button
                key={t(k.label)}
                onClick={() => set({ reqKind: k.label })}
                style={{
                  borderRadius: radius.inner,
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  background: on ? 'rgba(199,154,60,0.14)' : '#fff',
                  border: `1.5px solid ${on ? color.gold : 'rgba(0,0,0,0.04)'}`,
                }}
              >
                <Icon path={k.icon} size={21} stroke={on ? color.goldDeep : color.navy} width={1.6} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: on ? color.goldDeep : color.navy,
                    fontFamily: font.sans,
                  }}
                >
                  {t(k.label)}
                </span>
              </button>
            );
          })}
        </div>

        <FieldLabel style={{ marginTop: 16 }}>{t('تفاصيل الطلب')}</FieldLabel>
        <textarea
          value={st.reqNotes}
          onChange={(e) => set({ reqNotes: e.target.value })}
          rows={3}
          placeholder="اكتب تفاصيل ما تحتاجه…"
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 13.5,
            color: color.navy,
            boxShadow: shadow.card,
            resize: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />

        <Card pad="13px 16px" style={{ borderRadius: radius.inner, marginTop: 12, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t('الوحدة')}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: color.slate }}>{t(UNIT)}</span>
        </Card>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton tone="gold" size="lg" full onClick={() => go('matching')}>
          {t('ابحث عن مقدمي خدمة متاحين')}
        </PillButton>
      </div>
    </div>
  );
}

/** R34 — Available providers, Uber-style. */
function Matching() {
  const { st, back, set } = useResident();
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="مقدمو الخدمة المتاحون" onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div style={{ fontSize: 12, color: color.slate, margin: '4px 2px 12px' }}>
          {st.reqKind} · مرتّبة حسب الأقرب والأعلى تقييمًا
        </div>
        {providerDefs.map((p, i) => (
          <Card
            key={t(p.name)}
            pad="15px 16px"
            style={{ borderRadius: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 99,
                background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 800,
                flex: 'none',
              }}
            >
              {p.name[0]}
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: color.navy }}>{t(p.name)}</span>
              <span style={{ fontSize: 11, color: color.slate }}>
                ★ {p.rating} · يصل خلال {t(p.eta)}
              </span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ ...numeric, fontSize: 13, fontWeight: 700, color: color.goldDeep }}>
                {p.price} ر.س
              </span>
              <PillButton
                size="sm"
                onClick={() =>
                  set((s) => ({
                    selProvIdx: i,
                    liveStage: 0,
                    screen: 'escrow',
                    hist: [...s.hist, 'matching'],
                  }))
                }
                style={{ padding: '6px 16px', fontSize: 11.5 }}
              >
                {t('قبول')}
              </PillButton>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** R37 — Escrow hold. The trust guarantee, shown before any work starts. */
function Escrow() {
  const { st, go } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: '90px 24px 34px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            width: 74,
            height: 74,
            borderRadius: 99,
            background: 'rgba(199,154,60,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v3" size={32} stroke={color.gold} />
        </span>
        <div style={{ fontSize: 19, fontWeight: 900, color: color.navy, marginTop: 16 }}>
          {t('تم حجز المبلغ بأمان')}
        </div>
        <Card pad={18} style={{ marginTop: 18, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ ...numeric, fontSize: 30, fontWeight: 700, color: color.navy }}>
              {prov.price}
            </span>
            <span style={{ fontSize: 13, color: color.slate }}>{t('ر.س')}</span>
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: color.slateDark,
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 2,
            }}
          >
            سيتم تحويل المبلغ إلى <b style={{ color: color.navy }}>{t(prov.name)}</b> بعد أن تؤكد اكتمال
            المهمة — لن يصله شيء قبل ذلك.
          </div>
        </Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            background: 'rgba(63,166,107,0.1)',
            borderRadius: radius.pill,
            padding: '8px 16px',
          }}
        >
          <Icon path={icons.shield} size={14} stroke={color.greenDeep} width={1.6} />
          <span style={{ fontSize: 11.5, fontWeight: 800, color: color.greenDeep }}>
            {t('رفادة يضمن معاملتك حتى رضاك الكامل')}
          </span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <PillButton size="lg" full onClick={() => go('liveJob')}>
        {t('متابعة')}
      </PillButton>
    </div>
  );
}

/** R35 — Live job status. */
function LiveJob() {
  const { st, set, go } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  const notDone = st.liveStage < liveStepDefs.length - 1;

  const advance = () => {
    if (!notDone) return;
    const next = st.liveStage + 1;
    if (next === liveStepDefs.length - 1) {
      set((s) => ({ liveStage: next, screen: 'rateProvider', hist: [...s.hist, 'liveJob'] }));
    } else {
      set({ liveStage: next });
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '66px 22px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => go('home')} />
        <div style={{ fontSize: 19, fontWeight: 800, color: color.navy }}>{t('حالة الطلب')}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={16} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 99,
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              flex: 'none',
            }}
          >
            {prov.name[0]}
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>{t(prov.name)}</span>
            <span style={{ fontSize: 11, color: color.slate }}>
              ★ {prov.rating} · {st.reqKind}
            </span>
          </span>
          <button
            onClick={() => go('chat')}
            aria-label="محادثة مقدم الخدمة"
            style={{
              width: 38,
              height: 38,
              borderRadius: 99,
              border: 'none',
              background: color.tile,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path={icons.chat} size={17} width={1.6} />
          </button>
        </Card>

        <Card pad="18px 16px 8px" style={{ borderRadius: 18, marginTop: 12 }}>
          <Timeline
            steps={liveStepDefs.map((label) => ({ label }))}
            doneCount={st.liveStage + 1}
            currentIndex={st.liveStage}
            minLine={20}
          />
        </Card>

        <div
          style={{
            background: 'rgba(199,154,60,0.08)',
            borderRadius: radius.tile,
            padding: '11px 14px',
            marginTop: 12,
            fontSize: 11.5,
            color: color.goldDeep,
            textAlign: 'center',
          }}
        >
          المبلغ {prov.price} ر.س محجوز حتى تأكيدك اكتمال المهمة
        </div>

        {notDone && (
          <PillButton full onClick={advance} style={{ marginTop: 12, padding: 13, fontSize: 13.5 }}>
            {liveStepDefs[st.liveStage + 1]} (محاكاة)
          </PillButton>
        )}
        <button
          onClick={() => go('dispute')}
          style={{
            width: '100%',
            marginTop: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: color.coral,
            fontSize: 12,
            fontWeight: 800,
            padding: 8,
            fontFamily: font.sans,
          }}
        >
          {t('الإبلاغ عن مشكلة في الطلب')}
        </button>
      </div>
    </div>
  );
}

/** R36 — Rate the provider; this is what releases the escrow. */
function Rate() {
  const { st, set, go, showToast } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: '80px 24px 34px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            width: 64,
            height: 64,
            borderRadius: 99,
            background: 'rgba(63,166,107,0.13)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.check} size={28} stroke={color.green} width={2.4} />
        </span>
        <div style={{ fontSize: 18, fontWeight: 900, color: color.navy, marginTop: 12 }}>
          {t('تم إنهاء الخدمة')}
        </div>
        <div style={{ fontSize: 13, color: color.slate, marginTop: 4 }}>
          قيّم تجربتك مع {t(prov.name)}
        </div>
        <Stars
          value={st.provRating}
          onPick={(n) => set({ provRating: n })}
          size={32}
          style={{ marginTop: 18 }}
        />
        <textarea
          rows={3}
          placeholder="أضف تعليقًا (اختياري)"
          style={{
            width: '100%',
            marginTop: 16,
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 12.5,
            color: color.navy,
            resize: 'none',
            boxShadow: shadow.card,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />
      </div>
      <div style={{ flex: 1 }} />
      <PillButton
        size="lg"
        full
        onClick={() => {
          set({ screen: 'home', hist: [] });
          showToast(`${t('تم تحويل')} ${prov.price} ${t('ر.س لـ')}${t(prov.name)} ${t('— شكرًا لتقييمك')}`);
        }}
      >
        {t('إرسال والعودة للرئيسية')}
      </PillButton>
      <button
        onClick={() => go('dispute')}
        style={{
          width: '100%',
          marginTop: 8,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: color.coral,
          fontSize: 12,
          fontWeight: 800,
          padding: 8,
          fontFamily: font.sans,
        }}
      >
        {t('لم تكتمل الخدمة كما ينبغي؟ أبلغ عن مشكلة')}
      </button>
    </div>
  );
}

/** R38 — Dispute. Freezes the escrow pending admin review. */
function Dispute() {
  const { st, set, back, showToast } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="الإبلاغ عن مشكلة" onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <FieldLabel>{t('ما المشكلة؟')}</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {disputeReasonDefs.map((label) => {
            const on = st.disputeReason === label;
            return (
              <button
                key={label}
                onClick={() => set({ disputeReason: label })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  background: on ? 'rgba(228,103,90,0.08)' : '#fff',
                  border: `1.5px solid ${on ? color.coral : 'rgba(0,0,0,0.06)'}`,
                  borderRadius: radius.tile,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                <Radio on={on} tone={color.coral} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{label}</span>
              </button>
            );
          })}
        </div>

        <FieldLabel style={{ marginTop: 16 }}>{t('التفاصيل')}</FieldLabel>
        <textarea
          value={st.disputeNotes}
          onChange={(e) => set({ disputeNotes: e.target.value })}
          rows={4}
          placeholder="اشرح ما حدث…"
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.inner,
            padding: '13px 16px',
            fontSize: 13.5,
            color: color.navy,
            boxShadow: shadow.card,
            resize: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />
        <button
          style={{
            width: '100%',
            marginTop: 10,
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
          <span style={{ fontSize: 12.5, fontWeight: 700, color: color.slate }}>{t('إضافة صورة')}</span>
        </button>

        <div
          style={{
            background: 'rgba(228,103,90,0.08)',
            borderRadius: radius.tile,
            padding: '12px 14px',
            marginTop: 12,
            fontSize: 11.5,
            color: color.coralDeep,
            lineHeight: 1.9,
          }}
        >
          سيبقى المبلغ {prov.price} ر.س محجوزًا حتى تراجع إدارة الكمبوند البلاغ وتقرر الإجراء المناسب.
        </div>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="coral"
          size="lg"
          full
          onClick={() => {
            set({ screen: 'home', hist: [], disputeNotes: '', disputeReason: null });
            showToast('تم إرسال البلاغ — المبلغ مجمّد حتى قرار الإدارة');
          }}
        >
          {t('إرسال البلاغ')}
        </PillButton>
      </div>
    </div>
  );
}

export function Radio({ on, tone = color.gold }: { on: boolean; tone?: string }) {
  return (
    <span
      style={{
        width: 17,
        height: 17,
        borderRadius: 99,
        border: `2px solid ${on ? tone : color.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: on ? tone : 'transparent',
        }}
      />
    </span>
  );
}

function FieldLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: color.navy, marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

export const Marketplace = { Request, Matching, Escrow, LiveJob, Rate, Dispute };
