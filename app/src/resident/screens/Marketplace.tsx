import { useEffect } from 'react';
import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { BackButton, Card, PillButton, ScreenHeader, StatusPill } from '@/ui/primitives';
import { icons } from '../data/icons';
import {
  disputeReasonDefs,
  liveStepDefs,
  MATCH_DELAY,
  providerDefs,
  provReviewDefs,
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
      <ScreenHeader title={t('اطلب خدمة فورية')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <FieldLabel>{t('نوع الخدمة')}</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {reqKindDefs.map((k) => {
            const on = st.reqKind === k.label;
            return (
              <button
                key={t(k.label)}
                onClick={() => set({ reqKind: t(k.label) })}
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
          placeholder={t('اكتب تفاصيل ما تحتاجه…')}
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
        {/* Reset the match so a second request starts searching again
            rather than re-showing whoever accepted the last one. */}
        <PillButton
          tone="gold"
          size="lg"
          full
          onClick={() => go('matching', { matchFound: false, jobAccepted: false, liveStage: 0 })}
        >
          {t('ابحث عن مقدمي خدمة متاحين')}
        </PillButton>
      </div>
    </div>
  );
}

/** R34 — Available providers, Uber-style. */
/**
 * R34 — matching. The list of bidders is gone: the request goes out to every
 * nearby provider and the first to accept is the one you see. You take their
 * offer or wait for the next.
 */
function Matching() {
  const { st, cfg, back, set, showToast } = useResident();
  const prov = providerDefs[0];

  // The accept arrives on its own after a beat. Gallery tiles are pinned to
  // one screen and must hold the state they were opened in, so the timer only
  // runs in the live app. Clearing it on unmount keeps it from firing onto a
  // screen that has already been left.
  const live = !cfg.fixedScreen;
  useEffect(() => {
    if (!live || st.matchFound) return;
    const id = window.setTimeout(() => set({ matchFound: true }), MATCH_DELAY);
    return () => window.clearTimeout(id);
  }, [live, st.matchFound, set]);

  if (!st.matchFound) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title={t('البحث عن مقدم خدمة')} onBack={back} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 32px 60px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {[0, 0.5, 1].map((delay) => (
              <span
                key={delay}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 99,
                  background: 'rgba(199,154,60,0.18)',
                  animation: `radar 1.8s ease-out ${delay}s infinite`,
                }}
              />
            ))}
            <span
              style={{
                position: 'relative',
                width: 58,
                height: 58,
                borderRadius: 99,
                background: color.navy,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon path="M13 2L4 14h6l-1 8 9-12h-6z" size={26} stroke={color.gold} />
            </span>
          </span>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: color.navy, marginTop: 26 }}>
            {t('أرسلنا طلبك لمقدمي الخدمة القريبين…')}
          </div>
          <div style={{ fontSize: 12, color: color.slate, marginTop: 10, lineHeight: 1.9 }}>
            {t('بانتظار أول موافقة — أقرب فنيي')} {t(st.reqKind)} {t('يشوفون طلبك الآن')}
          </div>
          <PillButton tone="ghost" onClick={back} style={{ marginTop: 26, padding: '11px 26px', fontSize: 12.5 }}>
            {t('إلغاء الطلب')}
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('البحث عن مقدم خدمة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(63,166,107,0.1)',
            borderRadius: radius.pill,
            padding: '9px 16px',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 99, background: color.green, flex: 'none' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: color.greenDeep }}>
            {t(prov.name)} {t('وافق على طلبك ✓')}
          </span>
        </div>

        <Card pad={20} style={{ marginTop: 12, textAlign: 'center' }}>
          <span
            style={{
              width: 62,
              height: 62,
              borderRadius: 99,
              margin: '0 auto',
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            {t(prov.name)[0]}
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: color.navy, marginTop: 12 }}>
            {t(prov.name)}
          </div>
          <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>
            ★ {prov.rating} · {t(st.reqKind)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <OfferStat label={t('يصل خلال')} value={t(prov.eta)} />
            <OfferStat label={t('التكلفة')} value={`${prov.price} ${t('ر.س')}`} tone={color.goldDeep} />
          </div>
        </Card>

        <PillButton
          size="lg"
          full
          onClick={() => {
            set((s) => ({
              selProvIdx: 0,
              liveStage: 0,
              jobAccepted: false,
              screen: 'liveJob',
              hist: [...s.hist, 'matching'],
            }));
            showToast(t('الدفع بعد اكتمال المهمة وتأكيدك'));
          }}
          style={{ marginTop: 16 }}
        >
          {t('تأكيد ومتابعة الدفع')}
        </PillButton>
        <PillButton
          tone="ghost"
          full
          onClick={() => set({ matchFound: false })}
          style={{ marginTop: 9, padding: 12, fontSize: 12.5 }}
        >
          {t('رفض وانتظار موافقة أخرى')}
        </PillButton>
      </div>
    </div>
  );
}

function OfferStat({ label, value, tone = color.navy }: { label: string; value: string; tone?: string }) {
  return (
    <span
      style={{
        flex: 1,
        background: color.bg,
        borderRadius: radius.tile,
        padding: '11px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <span style={{ fontSize: 10, color: color.slate }}>{label}</span>
      <span style={{ ...numeric, fontSize: 14, fontWeight: 700, color: tone }}>{value}</span>
    </span>
  );
}

/** R35b — the provider's profile, reached from the live job. */
function ProviderProfile() {
  const { st, back } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={t('ملف مقدم الخدمة')} onBack={back} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        <Card pad={20} style={{ textAlign: 'center' }}>
          <span
            style={{
              width: 70,
              height: 70,
              borderRadius: 99,
              margin: '0 auto',
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            {t(prov.name)[0]}
          </span>
          <div style={{ fontSize: 17, fontWeight: 900, color: color.navy, marginTop: 12 }}>
            {t(prov.name)}
          </div>
          <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>{t(st.reqKind)}</div>
          <StatusPill
            tone="green"
            style={{ marginTop: 10, fontSize: 10.5, padding: '4px 14px', fontWeight: 800 }}
          >
            {t('معتمد من إدارة الكمبوند')}
          </StatusPill>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <OfferStat label={t('التقييم')} value={`★ ${prov.rating}`} tone={color.goldDeep} />
            <OfferStat label={t('مهمة منفذة')} value="312" />
            <OfferStat label={t('سنوات خبرة')} value="8" />
          </div>
        </Card>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '18px 2px 10px' }}>
          {t('آخر التقييمات')}
        </div>
        {provReviewDefs.map((r) => (
          <Card key={t(r.who)} pad="13px 15px" style={{ borderRadius: 18, marginBottom: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 800, color: color.navy }}>
                {t(r.who)}
              </span>
              <span style={{ ...numeric, fontSize: 11.5, fontWeight: 800, color: color.goldDeep }}>
                ★ {r.stars}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: color.slate, marginTop: 7, lineHeight: 1.8 }}>
              {t(r.text)}
            </div>
          </Card>
        ))}

        <PillButton tone="ghost" full onClick={back} style={{ marginTop: 6, padding: 13, fontSize: 13 }}>
          {t('العودة للطلب')}
        </PillButton>
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
            {t('سيتم تحويل المبلغ إلى')} <b style={{ color: color.navy }}>{t(prov.name)}</b> {t('بعد أن تؤكد اكتمال')}
            {t('المهمة — لن يصله شيء قبل ذلك.')}
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
  const { st, set, go, showToast } = useResident();
  const prov = providerDefs[st.selProvIdx] ?? providerDefs[0];
  const notDone = st.liveStage < liveStepDefs.length - 1;

  // The last step no longer jumps to its own screen: the rating form opens
  // inline underneath the finished timeline.
  const advance = () => {
    if (!notDone) return;
    set({ liveStage: st.liveStage + 1 });
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
            {t(prov.name)[0]}
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <button
              onClick={() => go('provProfile')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'start',
                fontSize: 14.5,
                fontWeight: 800,
                color: color.navy,
                fontFamily: font.sans,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              {t(prov.name)}
            </button>
            <span style={{ fontSize: 11, color: color.slate }}>
              ★ {prov.rating} · {t(st.reqKind)}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: color.greenDeep }}>
              {t('معتمد من إدارة الكمبوند')}
            </span>
          </span>
          <RoundIconButton
            label={t('اتصال')}
            path={icons.call}
            onClick={() => showToast(`${t('جارٍ الاتصال بـ')}${t(prov.name)}…`)}
          />
          <RoundIconButton
            label={t('محادثة مقدم الخدمة')}
            path={icons.chat}
            onClick={() => {
              go('chat');
              showToast(`${t('فُتحت محادثة مع')} ${t(prov.name)}`);
            }}
          />
        </Card>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, marginBottom: 4 }}>
            {t('تفاصيل الطلب')}
          </div>
          <JobRow label={t('رقم الطلب')} value="SRV-2841" mono />
          <JobRow label={t('نوع الخدمة')} value={t(st.reqKind)} />
          <JobRow label={t('الوحدة')} value={t(UNIT)} />
          <JobRow label={t('الوصول المتوقع')} value={t(prov.eta)} />
          <JobRow label={t('المسافة الحالية')} value={`1.2 ${t('كم')}`} mono />
        </Card>

        <Card pad="18px 16px 8px" style={{ borderRadius: 18, marginTop: 12 }}>
          <Timeline
            steps={liveStepDefs.map((s, i) => ({
              label: s.label,
              // Only the step you are on explains itself; the rest stay terse.
              sub: i === st.liveStage ? s.sub + (i === 0 ? ` ${prov.name}` : '') : undefined,
              meta: i <= st.liveStage ? s.time : '',
            }))}
            doneCount={st.liveStage + 1}
            currentIndex={st.liveStage}
            minLine={20}
          />
        </Card>

        {notDone ? (
          <>
            <PillButton full onClick={advance} style={{ marginTop: 12, padding: 13, fontSize: 13.5 }}>
              {t(liveStepDefs[st.liveStage + 1].label)} {t('(محاكاة)')}
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
              {t('واجهت مشكلة؟')} {t('أبلغ الإدارة')}
            </button>
            <button
              onClick={() => {
                set({ screen: 'svcHub', hist: [] });
                showToast(t('أُلغي الطلب — بلا أي رسوم'));
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: color.slateLight,
                fontSize: 11.5,
                fontWeight: 800,
                padding: 6,
                fontFamily: font.sans,
              }}
            >
              {t('إلغاء الطلب')}
            </button>
          </>
        ) : (
          <Card pad={18} style={{ borderRadius: 18, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 99,
                  background: 'rgba(63,166,107,0.13)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon path={icons.check} size={14} stroke={color.green} width={2.4} />
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: color.navy }}>
                {t('اكتمل الطلب — سجّل وقيّم')}
              </span>
            </div>
            <PaymentAndRating />
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * «كم دفعت؟» plus the stars and a note. The amount is recorded against the
 * job so the compound can take its cut from the provider — رفادة never holds
 * the money, which is why this is a declaration rather than a payment.
 */
function PaymentAndRating() {
  const { st, set, showToast } = useResident();
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 700, color: color.navy, marginTop: 16 }}>
        {t('المبلغ الذي دفعته لمقدم الخدمة')}
      </div>
      <div
        dir="ltr"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: color.bg,
          borderRadius: radius.tile,
          padding: '0 14px',
          marginTop: 8,
        }}
      >
        <input
          value={st.provPaidAmount}
          onChange={(e) => set({ provPaidAmount: e.target.value })}
          placeholder="150"
          inputMode="decimal"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            background: 'transparent',
            padding: '12px 0',
            ...numeric,
            fontSize: 16,
            fontWeight: 700,
            color: color.navy,
            outline: 'none',
            textAlign: 'left',
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 700, color: color.slate }}>{t('ر.س')}</span>
      </div>
      <div style={{ fontSize: 10.5, color: color.slateLight, marginTop: 7, lineHeight: 1.7 }}>
        {t('يُسجَّل المبلغ على الطلب لاحتساب نسبة إدارة الكمبوند من مقدم الخدمة')}
      </div>

      <Stars
        value={st.provRating}
        onPick={(n) => set({ provRating: n })}
        size={30}
        style={{ marginTop: 16, justifyContent: 'center' }}
      />
      <textarea
        value={st.rateNotes}
        onChange={(e) => set({ rateNotes: e.target.value })}
        rows={3}
        placeholder={t('اكتب ملاحظاتك عن الخدمة (اختياري)…')}
        style={{
          width: '100%',
          marginTop: 14,
          background: color.bg,
          border: 'none',
          borderRadius: radius.inner,
          padding: '13px 16px',
          fontSize: 12.5,
          color: color.navy,
          resize: 'none',
          boxSizing: 'border-box',
          fontFamily: font.sans,
        }}
      />
      <PillButton
        full
        onClick={() => {
          const amount = st.provPaidAmount.trim();
          if (!amount) {
            showToast(t('اكتب المبلغ الذي دفعته أولًا'));
            return;
          }
          const withNotes = st.rateNotes.trim() ? ` ${t('مع ملاحظاتك')}` : '';
          set({ screen: 'home', hist: [], provPaidAmount: '', rateNotes: '' });
          showToast(
            `${t('سُجّل المبلغ')} ${amount} ${t('ر.س على الطلب')} SRV-2841${withNotes} ${t('— شكرًا لتقييمك')}`,
          );
        }}
        style={{ marginTop: 14, padding: 13, fontSize: 13.5 }}
      >
        {t('تسجيل وإنهاء')}
      </PillButton>
    </>
  );
}

function RoundIconButton({ label, path, onClick }: { label: string; path: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
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
      <Icon path={path} size={17} width={1.6} />
    </button>
  );
}

function JobRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
      <span style={{ fontSize: 11.5, color: color.slate }}>{label}</span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          ...(mono ? numeric : null),
          fontSize: 12,
          fontWeight: 800,
          color: color.navy,
          textAlign: 'end',
        }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * R36 — the standalone rating screen. The live job now opens the same form
 * inline when it finishes, so this is reached only from the gallery.
 */
function Rate() {
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
          {t('قيّم تجربتك مع')} {t(prov.name)}
        </div>
        <Card pad={16} style={{ width: '100%', marginTop: 18, textAlign: 'start' }}>
          <PaymentAndRating />
        </Card>
      </div>
      <div style={{ flex: 1 }} />
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
      <ScreenHeader title={t('الإبلاغ عن مشكلة')} onBack={back} />
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
                  textAlign: 'start',
                }}
              >
                <Radio on={on} tone={color.coral} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: color.navy }}>{t(label)}</span>
              </button>
            );
          })}
        </div>

        <FieldLabel style={{ marginTop: 16 }}>{t('التفاصيل')}</FieldLabel>
        <textarea
          value={st.disputeNotes}
          onChange={(e) => set({ disputeNotes: e.target.value })}
          rows={4}
          placeholder={t('اشرح ما حدث…')}
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
          {t('سيبقى المبلغ')} {prov.price} {t('ر.س محجوزًا حتى تراجع إدارة الكمبوند البلاغ وتقرر الإجراء المناسب.')}
        </div>
      </div>
      <div style={{ padding: '0 20px 34px' }}>
        <PillButton
          tone="coral"
          size="lg"
          full
          onClick={() => {
            set({ screen: 'home', hist: [], disputeNotes: '', disputeReason: null });
            showToast(t('تم إرسال البلاغ — المبلغ مجمّد حتى قرار الإدارة'));
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
        border: `2px solid ${on ? tone : t(color.line)}`,
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

export const Marketplace = {
  Request, Matching, Escrow, LiveJob, Rate, Dispute, ProviderProfile,
};
