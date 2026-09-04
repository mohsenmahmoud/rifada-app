import { useEffect, useRef, useState, type ComponentType } from 'react';
import { color, font, numeric, shadow } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { ADMIN_EMAIL, COMPOUNDS, navDefs, sectionTitles, type SectionKey } from './data';
import { AdminProvider, useAdmin } from './store';
import { Home, Unit360 } from './sections/dashboard';
import { TicketDetail, TicketsQueue } from './sections/tickets';
import {
  Amenities,
  Broadcast,
  GateLog,
  LostModeration,
  MessagesInbox,
  Residents,
} from './sections/community';
import {
  BillAggregator,
  Onboarding,
  RealEstateModeration,
  StoresDirectory,
  Vendors,
} from './sections/vendors';
import { Disputes, Revenue, Sourcing, Verification } from './sections/marketplace';
import {
  Automation,
  Collection,
  Iot,
  Portfolio,
  Predictive,
  Reports,
  Scoring,
  Sentiment,
  Sla,
  Team,
} from './sections/ops';
import { t } from '@/i18n/lang';

/**
 * The operator console from `Jiwar Admin.dc.html` — a 1360×940 desktop app, not
 * a phone. A1 login, then a navy sidebar + sticky topbar wrapping 29 sections.
 */

/** A missing section is a compile error, not a blank pane. */
const registry: Record<SectionKey, ComponentType> = {
  home: Home,
  tickets: TicketsQueue,
  ticketDetail: TicketDetail,
  residents: Residents,
  unit360: Unit360,
  broadcast: Broadcast,
  amen: Amenities,
  vendors: Vendors,
  onboard: Onboarding,
  collection: Collection,
  sla: Sla,
  sentiment: Sentiment,
  scoring: Scoring,
  inbox: MessagesInbox,
  lostmod: LostModeration,
  gatelog: GateLog,
  billAgg: BillAggregator,
  reMod: RealEstateModeration,
  storesDir: StoresDirectory,
  sourcing: Sourcing,
  revenue: Revenue,
  verify: Verification,
  disputes: Disputes,
  automation: Automation,
  team: Team,
  reports: Reports,
  portfolio: Portfolio,
  predict: Predictive,
  iot: Iot,
};

export function AdminConsole({
  initialSection,
  startLoggedIn = false,
  /** Gallery tiles render a single section with the chrome, at a fixed size. */
  width,
  height,
  scrollable = true,
}: {
  initialSection?: SectionKey;
  startLoggedIn?: boolean;
  width?: number;
  height?: number;
  scrollable?: boolean;
}) {
  return (
    <AdminProvider initialSection={initialSection} startLoggedIn={startLoggedIn}>
      <ConsoleBody width={width} height={height} scrollable={scrollable} />
    </AdminProvider>
  );
}

function ConsoleBody({
  width,
  height,
  scrollable,
}: {
  width?: number;
  height?: number;
  scrollable: boolean;
}) {
  const { st } = useAdmin();

  return (
    <div
      dir="rtl"
      style={{
        width: width ?? '100%',
        height: height,
        minHeight: height ? undefined : '100vh',
        fontFamily: font.sans,
        background: color.bg,
        position: 'relative',
        overflow: height ? 'hidden' : undefined,
      }}
    >
      {st.toast && <Toast text={st.toast} />}
      {st.logged ? <Shell scrollable={scrollable} /> : <Login />}
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        background: color.navy,
        color: '#fff',
        borderRadius: 999,
        padding: '10px 24px',
        fontSize: 13,
        fontWeight: 700,
        boxShadow: shadow.float,
        whiteSpace: 'nowrap',
        animation: 'toastIn .25s ease',
      }}
    >
      {t(text)}
    </div>
  );
}

/* ================================= A1 — login ================================= */

function Login() {
  const { set } = useAdmin();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [pw, setPw] = useState('12345678');
  const [compound, setCompound] = useState(0);

  const label = { fontSize: 12.5, fontWeight: 700, color: color.navy } as const;
  const input = {
    width: '100%',
    background: color.bg,
    border: 'none',
    borderRadius: 14,
    padding: '13px 16px',
    color: color.navy,
    boxSizing: 'border-box',
  } as const;

  return (
    <div
      style={{
        minHeight: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(170deg,${color.navyLight} 0%,${color.navy} 50%,${color.navyDeep} 100%)`,
      }}
    >
      <div
        style={{
          width: 420,
          background: '#fff',
          borderRadius: 24,
          padding: '38px 36px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Mark size={38} secondary={color.navy} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: color.navy }}>
              {t('رفادة — لوحة الإدارة')}
            </div>
            <div
              style={{
                fontFamily: font.mono,
                fontSize: 10,
                fontWeight: 600,
                color: color.gold,
                letterSpacing: 2,
              }}
            >
              JIWAR OPERATOR
            </div>
          </div>
        </div>

        <div style={{ ...label, margin: '26px 0 6px' }}>{t('البريد الإلكتروني')}</div>
        <input
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...input, fontFamily: font.mono, fontSize: 13.5, fontWeight: 500 }}
        />

        <div style={{ ...label, margin: '14px 0 6px' }}>{t('كلمة المرور')}</div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{ ...input, fontSize: 14, letterSpacing: 4 }}
        />

        <div style={{ ...label, margin: '14px 0 6px' }}>{t('الكمبوند')}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {COMPOUNDS.map((c, i) => {
            const on = compound === i;
            return (
              <button
                key={c}
                onClick={() => setCompound(i)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  padding: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: font.sans,
                  background: on ? color.navy : '#fff',
                  color: on ? '#fff' : color.slate,
                  border: `1.5px solid ${on ? color.navy : 'rgba(31,59,87,0.15)'}`,
                }}
              >
                {t(c)}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => set({ logged: true, compoundIdx: compound, sec: 'home' })}
          style={{
            width: '100%',
            marginTop: 22,
            border: 'none',
            cursor: 'pointer',
            background: color.navy,
            color: '#fff',
            borderRadius: 999,
            padding: 14,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: font.sans,
          }}
        >
          {t('تسجيل الدخول')}
        </button>
      </div>
    </div>
  );
}

/** The Rifada chevron mark. */
function Mark({ size = 28, secondary = '#fff' }: { size?: number; secondary?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M8 27L21 14l13 13"
        stroke={color.gold}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 36L30 23l13 13"
        stroke={secondary}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ================================= the shell ================================= */

function Shell({ scrollable }: { scrollable: boolean }) {
  const { st, go, openCount } = useAdmin();
  const Section = registry[st.sec] ?? Home;
  const pane = useRef<HTMLDivElement>(null);

  // Every section starts at the top, as a page navigation would.
  useEffect(() => {
    pane.current?.scrollTo({ top: 0 });
  }, [st.sec]);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '100%' }}>
      {/* sidebar */}
      <div
        style={{
          width: 232,
          flex: 'none',
          background: color.navy,
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 0 18px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          alignSelf: 'stretch',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px 18px' }}>
          <Mark />
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{t('رفادة')}</div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)' }}>{t('لوحة الإدارة')}</div>
          </div>
        </div>

        {navDefs.map((n, i) => {
          if ('header' in n) {
            return (
              <div
                key={`h${i}`}
                style={{
                  padding: '14px 20px 6px',
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 1,
                }}
              >
                {t(n.header)}
              </div>
            );
          }
          const on = st.sec === n.key;
          const badge = n.badge === 'openTickets' ? String(openCount) : n.badge;
          return (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'right',
                background: on ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '10px 20px',
                borderRight: `3px solid ${on ? color.gold : 'transparent'}`,
                fontFamily: font.sans,
              }}
            >
              <Icon
                path={n.icon}
                size={17}
                stroke={on ? color.gold : 'rgba(255,255,255,0.6)'}
                width={1.6}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: on ? '#fff' : 'rgba(255,255,255,0.72)',
                }}
              >
                {t(n.label)}
              </span>
              {badge && (
                <span
                  style={{
                    background: color.gold,
                    color: '#fff',
                    borderRadius: 999,
                    padding: '1px 8px',
                    fontSize: 10,
                    fontWeight: 800,
                    fontFamily: font.mono,
                  }}
                >
                  {t(badge)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div
          ref={pane}
          style={{
            flex: 1,
            padding: '24px 28px 50px',
            maxWidth: 1180,
            boxSizing: 'border-box',
            overflowY: scrollable ? 'auto' : 'visible',
          }}
        >
          <Section />
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  const { st, go, showToast } = useAdmin();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 28px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        flex: 'none',
        zIndex: 20,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 900, color: color.navy }}>
        {t(sectionTitles[st.sec])}
      </div>
      <span style={{ flex: 1 }} />

      <div style={{ display: 'flex', background: color.tile, borderRadius: 999, padding: 3 }}>
        <span
          style={{
            background: color.navy,
            color: '#fff',
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {t('عربي')}
        </span>
        <button
          onClick={() => showToast('الواجهة الإنجليزية قيد الإعداد — النموذج بالعربية أولًا')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: color.slate,
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: 11,
            fontWeight: 800,
            fontFamily: font.mono,
          }}
        >
          EN
        </button>
      </div>

      <button
        onClick={() => go('portfolio')}
        title={t('تبديل الكمبوند')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '1.5px solid rgba(31,59,87,0.2)',
          background: '#fff',
          borderRadius: 999,
          padding: '7px 16px',
          cursor: 'pointer',
          fontFamily: font.sans,
        }}
      >
        <Icon
          path="M3 21h18M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3"
          size={14}
          stroke={color.navy}
          width={1.6}
        />
        <span style={{ fontSize: 12, fontWeight: 800, color: color.navy }}>
          {t(COMPOUNDS[st.compoundIdx])}
        </span>
        <Icon path="M6 9l6 6 6-6" size={11} stroke={color.slate} width={2} />
      </button>

      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 99,
          background: `linear-gradient(160deg,${color.navyLight},${color.navy})`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 800,
          ...numeric,
          fontFamily: font.sans,
        }}
      >
        {t('م س')}
      </div>
    </div>
  );
}
