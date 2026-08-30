import { useEffect, useRef, useState } from 'react';
import { color, font, numeric, radius, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { PhoneFrame } from '@/ui/PhoneFrame';
import { BackButton, Card, PillButton, StatusPill } from '@/ui/primitives';
import { icons } from '@/resident/data/icons';
import { Timeline } from '@/resident/screens/parts';
import {
  advanceToasts,
  BANK_ACCOUNT,
  COURIER,
  disputeReasonDefs,
  incomingJob,
  JOB_COMMISSION_PCT,
  JOB_PAYOUT_NET,
  nextAction,
  orderDefs,
  orderFlow,
  orderMeta,
  pastJobs,
  RESPONSE_SECONDS,
  STORE_COMMISSION_PCT,
  storeIdentity,
  storeMenuDefs,
  TECHNICIAN,
  upcomingJobs,
  WALLET_AVAILABLE,
  WALLET_HELD,
  withdrawSteps,
} from './data';
import type {
  JobStage,
  Order,
  OrderStage,
  PayoutMode,
  ProviderScreen,
  StoreKind,
  WithdrawStage,
} from './types';

type State = {
  logged: boolean;
  screen: ProviderScreen;
  available: boolean;
  incomingShown: boolean;
  countdown: number;
  jobStage: JobStage;
  toast: string | null;
  disputeReason: string | null;
  payoutMode: PayoutMode;
  wdStage: WithdrawStage;
  storeOpen: boolean;
  storeKind: StoreKind;
  menuAvail: Record<number, boolean>;
  ordersSt: Record<StoreKind, Record<number, OrderStage>>;
  ordTab: 'active' | 'log';
};

const initial: State = {
  logged: false,
  screen: 'home',
  available: true,
  incomingShown: true,
  countdown: RESPONSE_SECONDS,
  jobStage: 'accepted',
  toast: null,
  disputeReason: null,
  payoutMode: 'auto',
  wdStage: 0,
  storeOpen: true,
  storeKind: 'rest',
  menuAvail: { 0: true, 1: true, 2: false, 3: true },
  ordersSt: {
    rest: { 0: 'new', 1: 'preparing', 2: 'delivered' },
    pharm: { 0: 'new', 1: 'out', 2: 'delivered' },
  },
  ordTab: 'active',
};

export type ProviderAppProps = {
  /** Pins the app to one screen (skipping login) — used by the gallery. */
  fixedScreen?: ProviderScreen | null;
  /** Opens on a screen but stays fully interactive from there. */
  initialScreen?: ProviderScreen | null;
  bare?: boolean;
  width?: number;
  height?: number;
};

export function ProviderApp({
  fixedScreen = null,
  initialScreen = null,
  bare = false,
  width,
  height,
}: ProviderAppProps) {
  const entry = fixedScreen ?? initialScreen;
  const [st, setSt] = useState<State>(() =>
    entry
      ? {
          ...initial,
          logged: entry !== 'login',
          screen: entry === 'login' ? 'home' : entry,
          // A pinned preview shouldn't be covered by the incoming-request sheet
          // unless that's the screen being previewed.
          incomingShown: false,
        }
      : initial,
  );
  const toastTimer = useRef<number | undefined>(undefined);

  const set = (patch: Partial<State> | ((s: State) => Partial<State>)) =>
    setSt((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  const showToast = (msg: string) => {
    window.clearTimeout(toastTimer.current);
    setSt((s) => ({ ...s, toast: msg }));
    toastTimer.current = window.setTimeout(() => setSt((s) => ({ ...s, toast: null })), 2600);
  };

  // The response countdown only runs once logged in and available — it used to
  // start at page load, which blanked the screen when it hit zero.
  useEffect(() => {
    const iv = window.setInterval(() => {
      setSt((s) => {
        if (!s.logged || !s.incomingShown || !s.available) return s;
        return { ...s, countdown: s.countdown <= 1 ? RESPONSE_SECONDS : s.countdown - 1 };
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, []);

  const showIncoming =
    fixedScreen === 'login'
      ? false
      : st.logged && st.screen === 'home' && st.incomingShown && st.available;

  const body = (
    <div
      dir="rtl"
      style={{
        position: 'relative',
        height: '100%',
        background: color.bg,
        fontFamily: font.sans,
        overflow: 'hidden',
      }}
    >
      {st.toast && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            background: color.navy,
            color: '#fff',
            borderRadius: radius.pill,
            padding: '9px 20px',
            fontSize: 12.5,
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(31,59,87,0.35)',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 32px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {st.toast}
        </div>
      )}

      {!st.logged && <Login onLogin={() => { set({ logged: true }); showToast('حياك الله — أكوا فيكس'); }} />}
      {st.logged && st.screen === 'home' && <Home st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'job' && <Job st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'disputeP' && <Dispute st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'wallet' && <Wallet st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'storeHome' && <StoreHome st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'storeOrders' && <StoreOrders st={st} set={set} showToast={showToast} />}
      {st.logged && st.screen === 'storePayout' && <StorePayout set={set} />}

      {showIncoming && <IncomingRequest st={st} set={set} showToast={showToast} />}
    </div>
  );

  return (
    <PhoneFrame width={width} height={height} bare={bare}>
      {body}
    </PhoneFrame>
  );
}

type Ctx = {
  st: State;
  set: (p: Partial<State> | ((s: State) => Partial<State>)) => void;
  showToast: (m: string) => void;
};

/* ------------------------------------------------------------------ *
 * P1 — Login
 * ------------------------------------------------------------------ */

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(170deg,${color.navy} 0%,${color.navyDeep} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '130px 26px 46px',
        boxSizing: 'border-box',
      }}
    >
      {/* Provider mark: the upper roof turns green to mark the provider face. */}
      <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
        <path
          d="M8 27L21 14l13 13"
          stroke={color.green}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 36L30 23l13 13"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginTop: 14 }}>
        تطبيق مقدمي الخدمة
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
        بيانات الدخول من مكتب إدارة الكمبوند
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
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6 }}>رقم الجوال</div>
        <input
          dir="ltr"
          defaultValue={TECHNICIAN.phone}
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.tile,
            padding: '12px 14px',
            ...numeric,
            fontSize: 14,
            fontWeight: 600,
            color: color.navy,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '12px 0 6px' }}>
          رمز PIN
        </div>
        <input
          type="password"
          defaultValue={TECHNICIAN.pin}
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: radius.tile,
            padding: '12px 14px',
            fontSize: 15,
            letterSpacing: 6,
            color: color.navy,
            boxSizing: 'border-box',
            fontFamily: font.sans,
          }}
        />
        <PillButton tone="green" size="lg" full onClick={onLogin} style={{ marginTop: 14 }}>
          تسجيل الدخول
        </PillButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P2 — Technician home
 * ------------------------------------------------------------------ */

function Home({ st, set, showToast }: Ctx) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 42,
            height: 42,
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
          {TECHNICIAN.initials}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>
            {TECHNICIAN.name}
          </span>
          <span style={{ fontSize: 11, color: color.slate }}>{TECHNICIAN.company}</span>
        </div>
      </div>

      <div style={{ padding: '6px 20px 0' }}>
        <ToggleCard
          on={st.available}
          onLabel="متاح لاستقبال الطلبات"
          offLabel="غير متاح حاليًا"
          onClick={() => set((s) => ({ available: !s.available }))}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <MetricCard label="مهام اليوم" value="3" />
          <MetricCard label="أرباح اليوم" value="410" unit="ر.س" />
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: color.navy, margin: '18px 2px 8px' }}>
          مهامك القادمة
        </div>
        {upcomingJobs.map((j) => (
          <Card
            key={j.title}
            pad="13px 15px"
            style={{ borderRadius: radius.inner, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                background: color.tile,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon path="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" size={17} width={1.6} />
            </span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{j.title}</span>
              <span style={{ fontSize: 10.5, color: color.slate }}>
                {j.area} · {j.time}
              </span>
            </span>
            <span style={{ ...numeric, fontSize: 12, fontWeight: 700, color: color.goldDeep }}>
              {j.pay} ر.س
            </span>
          </Card>
        ))}

        <PillButton
          tone="outline"
          full
          onClick={() => set({ screen: 'wallet' })}
          style={{ marginTop: 14, padding: 11, fontSize: 12.5 }}
        >
          المحفظة والأرباح
        </PillButton>
        <button
          onClick={() => {
            set({ screen: 'storeHome' });
            showToast('واجهة المتجر — نفس الحساب، نوع «متجر» بدل «فني»');
          }}
          style={{
            width: '100%',
            marginTop: 8,
            border: '1.5px dashed rgba(199,154,60,0.5)',
            background: 'rgba(199,154,60,0.06)',
            borderRadius: radius.inner,
            padding: 12,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 800,
            color: color.goldDeep,
            fontFamily: font.sans,
          }}
        >
          جرّب واجهة حساب «متجر» — مطعم بيت الجيران
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P3 — Incoming request sheet
 * ------------------------------------------------------------------ */

function IncomingRequest({ st, set, showToast }: Ctx) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(21,42,63,0.55)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(3px)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '26px 26px 0 0',
          padding: '22px 22px 34px',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: color.coral }} />
          <span style={{ fontSize: 12.5, fontWeight: 800, color: color.coral }}>
            طلب جديد — {st.countdown} ثانية للرد
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <span
            style={{
              width: 46,
              height: 46,
              borderRadius: radius.tile,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" size={22} width={1.6} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: color.navy }}>
              {incomingJob.title}
            </span>
            <span style={{ fontSize: 11.5, color: color.slate }}>{incomingJob.area}</span>
          </span>
        </div>

        <div
          style={{
            background: color.bg,
            borderRadius: radius.tile,
            padding: '12px 14px',
            marginTop: 12,
            fontSize: 12,
            color: color.slateDark,
            lineHeight: 1.8,
          }}
        >
          {incomingJob.note}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
          <span style={{ fontSize: 12, color: color.slate }}>العائد المتوقع</span>
          <span style={{ flex: 1 }} />
          <span style={{ ...numeric, fontSize: 18, fontWeight: 700, color: color.greenDeep }}>
            {incomingJob.pay} ر.س
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button
            onClick={() => {
              set({ incomingShown: false, countdown: RESPONSE_SECONDS });
              showToast('تم رفض الطلب — أُرسل لأقرب مقدم آخر');
            }}
            style={{
              flex: 1,
              cursor: 'pointer',
              background: 'transparent',
              color: color.coral,
              border: `1.5px solid ${color.coral}`,
              borderRadius: radius.pill,
              padding: 13,
              fontSize: 14,
              fontWeight: 800,
              fontFamily: font.sans,
            }}
          >
            رفض
          </button>
          <PillButton
            tone="green"
            onClick={() => {
              set({ incomingShown: false, screen: 'job', jobStage: 'accepted' });
              showToast('تم قبول الطلب — تظهر الآن التفاصيل الكاملة');
            }}
            style={{ flex: 1.4, padding: 13, fontSize: 14.5 }}
          >
            قبول الطلب
          </PillButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P4 / P7 — Job execution and payout
 * ------------------------------------------------------------------ */

function Job({ st, set, showToast }: Ctx) {
  const stageLabel = {
    accepted: 'بانتظار بدء التنفيذ',
    started: 'جاري التنفيذ الآن',
    done: 'تم الانتهاء ✓',
    paid: 'تم التحويل ✓',
  }[st.jobStage];

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <Header title="تفاصيل المهمة" onBack={() => set({ screen: 'home' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <Card pad={16} style={{ borderRadius: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: color.navy }}>{incomingJob.title}</div>
          <div style={{ fontSize: 12, color: color.slate, marginTop: 4 }}>{incomingJob.unit}</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 12, color: color.slate }}>العائد</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontSize: 15, fontWeight: 700, color: color.greenDeep }}>
              {incomingJob.pay} ر.س
            </span>
          </div>
        </Card>

        <button
          onClick={() => showToast('فتح محادثة مع الساكن')}
          style={{
            width: '100%',
            marginTop: 12,
            border: 'none',
            cursor: 'pointer',
            background: color.navy,
            color: '#fff',
            borderRadius: radius.inner,
            padding: 12,
            fontSize: 13,
            fontWeight: 800,
            fontFamily: font.sans,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Icon path={icons.chat} size={16} stroke="#fff" width={1.6} />
          تواصل مع الساكن
        </button>

        <Card pad={16} style={{ borderRadius: 18, marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>حالة المهمة</div>
          <div style={{ fontSize: 12.5, color: color.goldDeep, fontWeight: 800, marginTop: 8 }}>
            {stageLabel}
          </div>

          {st.jobStage === 'accepted' && (
            <PillButton
              tone="gold"
              full
              onClick={() => set({ jobStage: 'started' })}
              style={{ marginTop: 12, padding: 13, fontSize: 14 }}
            >
              بدء التنفيذ
            </PillButton>
          )}

          {st.jobStage === 'started' && (
            <>
              <button
                style={{
                  width: '100%',
                  marginTop: 12,
                  border: '1.5px dashed rgba(31,59,87,0.3)',
                  background: 'transparent',
                  borderRadius: radius.inner,
                  padding: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon path={icons.camera} size={16} stroke={color.slate} width={1.5} />
                <span style={{ fontSize: 12, fontWeight: 700, color: color.slate }}>
                  إثبات إنجاز العمل (صورة)
                </span>
              </button>
              <PillButton
                tone="green"
                full
                onClick={() => {
                  set({ jobStage: 'done' });
                  showToast('تم تسجيل إنجاز المهمة — المبلغ محجوز حتى تأكيد الساكن');
                }}
                style={{ marginTop: 10, padding: 13, fontSize: 14 }}
              >
                تم الانتهاء
              </PillButton>
            </>
          )}

          {st.jobStage === 'done' && (
            <>
              <div
                style={{
                  background: 'rgba(199,154,60,0.1)',
                  borderRadius: radius.tile,
                  padding: 12,
                  marginTop: 12,
                  textAlign: 'center',
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: color.goldDeep,
                }}
              >
                بانتظار تأكيد الساكن
              </div>
              <PillButton
                full
                onClick={() => {
                  set({ jobStage: 'paid' });
                  showToast('أكّد الساكن الاكتمال — تم تحويل المبلغ لك');
                }}
                style={{ marginTop: 10, padding: 12, fontSize: 12.5 }}
              >
                محاكاة تأكيد الساكن
              </PillButton>
            </>
          )}

          {st.jobStage === 'paid' && (
            <div
              style={{
                background: 'rgba(63,166,107,0.1)',
                borderRadius: radius.tile,
                padding: 14,
                marginTop: 12,
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: color.greenDeep, textAlign: 'center' }}>
                تم التحويل — {JOB_PAYOUT_NET} ر.س
              </div>
              <div style={{ fontSize: 10.5, color: color.slate, textAlign: 'center', marginTop: 4 }}>
                بعد خصم عمولة رفادة {JOB_COMMISSION_PCT}% من أصل {incomingJob.pay} ر.س
              </div>
            </div>
          )}

          <button
            onClick={() => set({ screen: 'disputeP' })}
            style={{
              width: '100%',
              marginTop: 10,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: color.coral,
              fontSize: 11.5,
              fontWeight: 800,
              padding: 6,
              fontFamily: font.sans,
            }}
          >
            الإبلاغ عن مشكلة في هذه المهمة
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P8 — Provider-side dispute
 * ------------------------------------------------------------------ */

function Dispute({ st, set, showToast }: Ctx) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <Header title="الإبلاغ عن مشكلة" onBack={() => set({ screen: 'job' })} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: color.navy, marginBottom: 8 }}>
          نوع المشكلة
        </div>
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
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 99,
                    border: `2px solid ${on ? color.coral : color.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 99,
                      background: on ? color.coral : 'transparent',
                    }}
                  />
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: color.navy }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '0 20px 30px' }}>
        <PillButton
          tone="coral"
          full
          onClick={() => {
            set({ screen: 'job', disputeReason: null });
            showToast('تم إرسال البلاغ — تم تجميد المبلغ لحين مراجعة الإدارة');
          }}
          style={{ padding: 13, fontSize: 14 }}
        >
          إرسال لمكتب الإدارة
        </PillButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P5 — Wallet and the withdrawal cycle
 * ------------------------------------------------------------------ */

function Wallet({ st, set, showToast }: Ctx) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <Header title="المحفظة والأرباح" onBack={() => set({ screen: 'home' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        <div
          style={{
            background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
            borderRadius: 18,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>الرصيد المتاح للسحب</div>
          <div style={{ ...numeric, fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 4 }}>
            {WALLET_AVAILABLE}{' '}
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>ر.س</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Icon
              path="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z"
              size={12}
              stroke={color.gold}
              width={1.6}
            />
            <span style={{ fontSize: 10.5, color: color.gold, fontWeight: 700 }}>
              {WALLET_HELD} ر.س محجوزة في الإسكرو حتى تأكيد السكان
            </span>
          </div>
        </div>

        <Card
          pad="14px 15px"
          style={{ borderRadius: radius.inner, marginTop: 10, display: 'flex', alignItems: 'center', gap: 11 }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: color.tile,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon path="M3 21h18M5 21V9l7-5 7 5v12M9 21v-5h6v5" size={17} width={1.6} />
          </span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{BANK_ACCOUNT}</span>
            <span style={{ fontSize: 10.5, color: color.slate }}>حساب الصرف المعتمد</span>
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: color.gold }}>تغيير</span>
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
            { k: 'auto' as PayoutMode, l: 'تحويل تلقائي أسبوعي' },
            { k: 'manual' as PayoutMode, l: 'سحب يدوي' },
          ].map((m) => {
            const on = st.payoutMode === m.k;
            return (
              <button
                key={m.k}
                onClick={() => set(m.k === 'auto' ? { payoutMode: 'auto', wdStage: 0 } : { payoutMode: 'manual' })}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: 9,
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: on ? color.navy : 'transparent',
                  color: on ? '#fff' : color.slate,
                }}
              >
                {m.l}
              </button>
            );
          })}
        </div>

        {st.payoutMode === 'auto' && (
          <div
            style={{
              background: 'rgba(63,166,107,0.08)',
              borderRadius: radius.tile,
              padding: '11px 14px',
              marginTop: 8,
              fontSize: 11,
              color: color.greenDeep,
              fontWeight: 700,
              lineHeight: 1.8,
            }}
          >
            يُحوَّل رصيدك تلقائيًا كل خميس إلى حسابك البنكي — التحويل القادم: الخميس 16 يوليو
          </div>
        )}

        {st.payoutMode === 'manual' && st.wdStage === 0 && (
          <PillButton
            tone="gold"
            full
            onClick={() => {
              set({ wdStage: 1 });
              showToast(`تم إنشاء طلب السحب — ${WALLET_AVAILABLE} ر.س`);
            }}
            style={{ marginTop: 10, padding: 13, fontSize: 14, boxShadow: '0 6px 18px rgba(199,154,60,0.35)' }}
          >
            اسحب {WALLET_AVAILABLE} ر.س الآن
          </PillButton>
        )}

        {st.payoutMode === 'manual' && st.wdStage > 0 && (
          <>
            <Card pad="16px 16px 6px" style={{ borderRadius: 18, marginTop: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, marginBottom: 10 }}>
                حالة طلب السحب — {WALLET_AVAILABLE} ر.س
              </div>
              <Timeline
                steps={withdrawSteps}
                doneCount={st.wdStage}
                currentIndex={st.wdStage < 3 ? st.wdStage - 1 : -1}
                minLine={18}
              />
            </Card>
            {st.wdStage < 3 ? (
              <PillButton
                full
                onClick={() => {
                  const next = Math.min(st.wdStage + 1, 3) as WithdrawStage;
                  set({ wdStage: next });
                  if (next === 3) showToast('وصل الرصيد إلى حسابك البنكي ✓');
                }}
                style={{ marginTop: 10, padding: 12, fontSize: 12.5 }}
              >
                الخطوة التالية (محاكاة)
              </PillButton>
            ) : (
              <div
                style={{
                  background: 'rgba(63,166,107,0.12)',
                  borderRadius: radius.inner,
                  padding: 14,
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Icon path={icons.check} size={20} stroke={color.green} width={2.4} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 800, color: color.greenDeep }}>
                  وصل {WALLET_AVAILABLE} ر.س إلى حسابك •••• 8842
                </span>
                <button
                  onClick={() => set({ wdStage: 0 })}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: color.greenDeep,
                    fontSize: 10.5,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    fontFamily: font.sans,
                  }}
                >
                  إعادة
                </button>
              </div>
            )}
          </>
        )}

        <div style={{ fontSize: 12.5, fontWeight: 800, color: color.navy, margin: '16px 2px 0' }}>
          مهام مكتملة — تفاصيل الأرباح
        </div>
        {pastJobs.map((pj) => (
          <Card
            key={pj.title}
            pad="13px 15px"
            style={{ borderRadius: radius.inner, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{pj.title}</span>
              <span style={{ fontSize: 10.5, color: color.slate }}>{pj.date}</span>
            </span>
            <span style={{ ...numeric, fontSize: 12.5, fontWeight: 700, color: color.greenDeep }}>
              {pj.pay} ر.س
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P9 — Store home and menu management
 * ------------------------------------------------------------------ */

function StoreHome({ st, set, showToast }: Ctx) {
  const identity = storeIdentity[st.storeKind];
  const menu = storeMenuDefs[st.storeKind];
  const newCount = Object.values(st.ordersSt[st.storeKind]).filter((s) => s === 'new').length;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
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
          <Icon path={identity.icon} size={20} width={1.5} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14.5, fontWeight: 800, color: color.navy }}>{identity.name}</span>
          <span style={{ fontSize: 11, color: color.slate }}>حساب متجر · حدائق الأندلس</span>
        </div>
        <button
          onClick={() => set({ screen: 'home' })}
          style={{
            border: 'none',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: radius.pill,
            padding: '7px 13px',
            fontSize: 10.5,
            fontWeight: 800,
            color: color.navy,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: font.sans,
            whiteSpace: 'nowrap',
          }}
        >
          واجهة الفني
        </button>
      </div>

      {/* One interface serves both store types. */}
      <div style={{ padding: '6px 20px 0', display: 'flex', gap: 8 }}>
        {(
          [
            { k: 'rest' as StoreKind, l: 'مطعم' },
            { k: 'pharm' as StoreKind, l: 'صيدلية' },
          ]
        ).map((t) => {
          const on = st.storeKind === t.k;
          return (
            <button
              key={t.k}
              onClick={() => set({ storeKind: t.k })}
              style={{
                flex: 1,
                border: 'none',
                cursor: 'pointer',
                borderRadius: radius.pill,
                padding: 8,
                fontSize: 12,
                fontWeight: 800,
                fontFamily: font.sans,
                background: on ? color.navy : '#fff',
                color: on ? '#fff' : color.slate,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              {t.l}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <ToggleCard
          on={st.storeOpen}
          onLabel="المتجر مفتوح — يستقبل الطلبات"
          offLabel="المتجر مغلق الآن"
          onClick={() => set((s) => ({ storeOpen: !s.storeOpen }))}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: color.navy }}>إدارة المنيو</span>
          <span style={{ flex: 1 }} />
          <button
            onClick={() => set({ screen: 'storeOrders' })}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: color.navy,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '7px 16px',
              fontSize: 11,
              fontWeight: 800,
              position: 'relative',
              fontFamily: font.sans,
              whiteSpace: 'nowrap',
            }}
          >
            الطلبات الواردة
            {newCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  background: color.coral,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {newCount}
              </span>
            )}
          </button>
        </div>

        {menu.map((m, i) => {
          const av = st.menuAvail[i];
          return (
            <Card
              key={m.name}
              pad="13px 15px"
              style={{
                borderRadius: radius.inner,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                opacity: av ? 1 : 0.55,
              }}
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
                <Icon path={identity.icon} size={17} stroke={color.slate} width={1.5} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: color.navy }}>{m.name}</span>
                <span style={{ ...numeric, fontSize: 11.5, fontWeight: 700, color: color.goldDeep }}>
                  {m.price} ر.س
                </span>
              </span>
              <button
                onClick={() => {
                  set((s) => ({ menuAvail: { ...s.menuAvail, [i]: !s.menuAvail[i] } }));
                  showToast(av ? `${m.name} — غير متاح الآن` : `${m.name} — متاح للطلب`);
                }}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: radius.pill,
                  padding: '6px 13px',
                  fontSize: 10.5,
                  fontWeight: 800,
                  fontFamily: font.sans,
                  background: av ? 'rgba(63,166,107,0.13)' : 'rgba(107,114,128,0.13)',
                  color: av ? color.greenDeep : color.slate,
                  whiteSpace: 'nowrap',
                }}
              >
                {av ? 'متاح' : 'غير متاح'}
              </button>
            </Card>
          );
        })}

        <button
          style={{
            width: '100%',
            marginTop: 6,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'transparent',
            borderRadius: radius.tile,
            padding: 12,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            color: color.slate,
            fontFamily: font.sans,
          }}
        >
          + إضافة صنف جديد
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * P10 — Incoming order queue, the full store lifecycle
 * ------------------------------------------------------------------ */

function StoreOrders({ st, set, showToast }: Ctx) {
  const identity = storeIdentity[st.storeKind];
  const stages = st.ordersSt[st.storeKind];

  const setStage = (i: number, stage: OrderStage) =>
    set((s) => ({
      ordersSt: { ...s.ordersSt, [s.storeKind]: { ...s.ordersSt[s.storeKind], [i]: stage } },
    }));

  const all = orderDefs[st.storeKind].map((o, i) => ({ ...o, i, stage: stages[i] ?? 'new' }));
  const list = all.filter((o) =>
    st.ordTab === 'active' ? o.stage !== 'delivered' : o.stage === 'delivered',
  );
  const activeCount = all.filter((o) => o.stage !== 'delivered').length;
  const logCount = all.length - activeCount;

  return (
    <div style={{ position: 'absolute', inset: 0, background: color.bg, display: 'flex', flexDirection: 'column' }}>
      <Header title={`طلبات ${identity.name}`} onBack={() => set({ screen: 'storeHome' })} />

      <div style={{ padding: '6px 20px 4px', display: 'flex', gap: 8 }}>
        {[
          { k: 'active' as const, l: `نشطة (${activeCount})` },
          { k: 'log' as const, l: `سجل اليوم (${logCount})` },
        ].map((t) => {
          const on = st.ordTab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => set({ ordTab: t.k })}
              style={{
                flex: 1,
                border: 'none',
                cursor: 'pointer',
                borderRadius: radius.pill,
                padding: 9,
                fontSize: 12,
                fontWeight: 800,
                fontFamily: font.sans,
                background: on ? color.navy : '#fff',
                color: on ? '#fff' : color.slate,
              }}
            >
              {t.l}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 30px' }}>
        {list.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            stage={o.stage}
            kind={st.storeKind}
            onAdvance={() => {
              const next = orderFlow[orderFlow.indexOf(o.stage) + 1];
              setStage(o.i, next);
              const t = advanceToasts[next];
              if (t) showToast(t);
            }}
            onReject={() => {
              setStage(o.i, 'delivered');
              showToast('تم رفض الطلب — يُسترد مبلغ الساكن فورًا من الإسكرو');
            }}
            onViewRx={() =>
              showToast('روشتة د. أيمن الشهري — باراسيتامول + فيتامين سي — سليمة')
            }
            onPayout={() => set({ screen: 'storePayout' })}
          />
        ))}
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', fontSize: 12.5, color: color.slateLight }}>
            لا توجد طلبات في هذا التبويب
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  stage,
  kind,
  onAdvance,
  onReject,
  onViewRx,
  onPayout,
}: {
  order: Order;
  stage: OrderStage;
  kind: StoreKind;
  onAdvance: () => void;
  onReject: () => void;
  onViewRx: () => void;
  onPayout: () => void;
}) {
  const meta = orderMeta[stage];
  const next = nextAction(stage, kind);

  return (
    <Card pad="16px 18px" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: color.navy }}>طلب {order.id}</span>
        <span style={{ fontSize: 10, color: color.slateLight }}>{order.time}</span>
        <span style={{ flex: 1 }} />
        <StatusPill bg={meta.bg} c={meta.c} style={{ fontSize: 10.5, padding: '4px 13px', fontWeight: 800 }}>
          {meta.label}
        </StatusPill>
      </div>
      <div style={{ fontSize: 11.5, color: color.slate, marginTop: 4 }}>{order.who}</div>

      {/* Pharmacy: the prescription must be reviewed before accepting. */}
      {order.rx && stage === 'new' && (
        <button
          onClick={onViewRx}
          style={{
            width: '100%',
            marginTop: 10,
            border: '1.5px dashed rgba(31,59,87,0.3)',
            background: 'rgba(31,59,87,0.04)',
            borderRadius: 12,
            padding: 9,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          <Icon path={icons.file} size={14} width={1.6} />
          <span style={{ fontSize: 11, fontWeight: 800, color: color.navy }}>
            روشتة مرفقة — اضغط للمراجعة قبل القبول
          </span>
        </button>
      )}

      <div style={{ background: color.bg, borderRadius: radius.tile, padding: '11px 14px', marginTop: 10 }}>
        {order.lines.map((ln) => (
          <div
            key={ln.name}
            style={{ display: 'flex', fontSize: 12, color: color.slateDark, padding: '3px 0' }}
          >
            <span>{ln.name}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...numeric, fontWeight: 700 }}>{ln.price}</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            fontSize: 12.5,
            color: color.navy,
            fontWeight: 800,
            padding: '6px 0 0',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            marginTop: 5,
          }}
        >
          <span>الإجمالي + التوصيل</span>
          <span style={{ flex: 1 }} />
          <span style={numeric}>{order.total} ر.س</span>
        </div>
      </div>

      {stage === 'out' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: 'rgba(31,59,87,0.05)',
            borderRadius: 12,
            padding: '10px 13px',
            marginTop: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 99,
              background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
              flex: 'none',
            }}
          >
            {COURIER[0]}
          </span>
          <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: color.navy }}>
            المندوب: {COURIER} · خرج من المتجر منذ دقائق
          </span>
          <Icon path={icons.chat} size={15} width={1.6} style={{ flex: 'none' }} />
        </div>
      )}

      {stage === 'new' && next && (
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={onReject}
            style={{
              flex: 1,
              cursor: 'pointer',
              background: 'transparent',
              color: color.coral,
              border: `1.5px solid ${color.coral}`,
              borderRadius: radius.pill,
              padding: 11,
              fontSize: 12.5,
              fontWeight: 800,
              fontFamily: font.sans,
            }}
          >
            رفض
          </button>
          <button
            onClick={onAdvance}
            style={{
              flex: 1.6,
              border: 'none',
              cursor: 'pointer',
              background: next.tone,
              color: '#fff',
              borderRadius: radius.pill,
              padding: 11,
              fontSize: 12.5,
              fontWeight: 800,
              fontFamily: font.sans,
            }}
          >
            {next.label}
          </button>
        </div>
      )}

      {stage !== 'new' && stage !== 'delivered' && next && (
        <button
          onClick={onAdvance}
          style={{
            width: '100%',
            marginTop: 12,
            border: 'none',
            cursor: 'pointer',
            background: next.tone,
            color: '#fff',
            borderRadius: radius.pill,
            padding: 11,
            fontSize: 12.5,
            fontWeight: 800,
            fontFamily: font.sans,
          }}
        >
          {next.label}
        </button>
      )}

      {stage === 'delivered' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span
            style={{
              flex: 1,
              background: 'rgba(63,166,107,0.1)',
              borderRadius: radius.pill,
              padding: 8,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 800,
              color: color.greenDeep,
            }}
          >
            مُسلَّم ✓ · صافي {order.net} ر.س بعد العمولة
          </span>
          <button
            onClick={onPayout}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: color.gold,
              color: '#fff',
              borderRadius: radius.pill,
              padding: '8px 15px',
              fontSize: 10.5,
              fontWeight: 800,
              fontFamily: font.sans,
              whiteSpace: 'nowrap',
            }}
          >
            التفاصيل
          </button>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * P11 — Store payout breakdown
 * ------------------------------------------------------------------ */

function StorePayout({ set }: { set: Ctx['set'] }) {
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
            width: 70,
            height: 70,
            borderRadius: 99,
            background: 'rgba(63,166,107,0.13)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon path={icons.check} size={30} stroke={color.green} width={2.4} />
        </span>
        <div style={{ fontSize: 18, fontWeight: 900, color: color.navy, marginTop: 14 }}>
          تم توصيل الطلب #2841
        </div>

        <Card pad="6px 18px" style={{ marginTop: 18, width: '100%' }}>
          <PayoutRow label="قيمة الطلب" value="255.00 ر.س" />
          <PayoutRow
            label={`عمولة رفادة (${STORE_COMMISSION_PCT}%)`}
            value="− 30.60 ر.س"
            tone={color.coral}
          />
          <PayoutRow label="صافي أرباحك" value="224.40 ر.س" tone={color.greenDeep} strong last />
        </Card>

        <div
          style={{
            fontSize: 11,
            color: color.slate,
            marginTop: 12,
            textAlign: 'center',
            lineHeight: 1.8,
          }}
        >
          يُضاف الصافي لمحفظتك ويُحوّل مع دورة الصرف — التوصيل (15 ر.س) لمندوبك مباشرة.
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <PillButton size="lg" full onClick={() => set({ screen: 'storeHome' })}>
        العودة للمتجر
      </PillButton>
    </div>
  );
}

function PayoutRow({
  label,
  value,
  tone = color.navy,
  strong = false,
  last = false,
}: {
  label: string;
  value: string;
  tone?: string;
  strong?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: last ? undefined : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <span
        style={{
          fontSize: strong ? 13 : 12.5,
          fontWeight: strong ? 900 : 400,
          color: strong ? color.navy : color.slate,
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ ...numeric, fontSize: strong ? 16 : 13, fontWeight: 700, color: tone }}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * shared bits
 * ------------------------------------------------------------------ */

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ padding: '60px 20px 8px', display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
      <BackButton onClick={onBack} />
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: color.navy,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>
    </div>
  );
}

/** The availability / open-for-orders switch, shared by both faces. */
function ToggleCard({
  on,
  onLabel,
  offLabel,
  onClick,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: 'none',
        cursor: 'pointer',
        background: on ? 'rgba(63,166,107,0.1)' : '#fff',
        borderRadius: 18,
        padding: '15px 16px',
        boxShadow: shadow.card,
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
            left: on ? 23 : 2.5,
            width: 19,
            height: 19,
            borderRadius: 99,
            background: '#fff',
            transition: 'left .18s ease',
          }}
        />
      </span>
      <span
        style={{
          flex: 1,
          textAlign: 'right',
          fontSize: 13.5,
          fontWeight: 800,
          color: on ? color.greenDeep : color.slate,
        }}
      >
        {on ? onLabel : offLabel}
      </span>
    </button>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <Card pad={14} style={{ borderRadius: radius.inner }}>
      <div style={{ fontSize: 11, color: color.slate }}>{label}</div>
      <div style={{ ...numeric, fontSize: 22, fontWeight: 700, color: color.navy, marginTop: 4 }}>
        {value} {unit && <span style={{ fontSize: 11, color: color.slate }}>{unit}</span>}
      </div>
    </Card>
  );
}
