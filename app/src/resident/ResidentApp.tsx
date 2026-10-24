import { color, font, radius } from '@/theme/tokens';
import { PhoneFrame } from '@/ui/PhoneFrame';
import { BottomNav, NAV_H, navVisible } from './BottomNav';
import { ResidentProvider, useResident, type ResidentConfig } from './store';
import { ScreenRouter } from './screens';
import type { ScreenKey } from './types';
import type { ScenarioKey } from './data/scenarios';
import { t, useLang } from '@/i18n/lang';

/** Floating toast — the app's single feedback channel. */
function Toast() {
  const { st } = useResident();
  if (!st.toast) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
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
      {t(st.toast)}
    </div>
  );
}

/**
 * Banner shown while previewing the app as a family member — the way back to
 * the owner account. Sits above the bottom bar.
 */
function FamilyPreviewBanner() {
  const { isFam, set, showToast } = useResident();
  if (!isFam) return null;
  return (
    <button
      onClick={() => {
        set({ actingAs: 'owner', screen: 'family', hist: ['home'] });
        showToast(t('عدت لحساب مالك الوحدة'));
      }}
      style={{
        position: 'absolute',
        bottom: 170,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 55,
        border: 'none',
        cursor: 'pointer',
        background: color.purple,
        color: '#fff',
        borderRadius: radius.pill,
        padding: '8px 18px',
        fontSize: 11,
        fontWeight: 800,
        fontFamily: font.sans,
        boxShadow: '0 6px 18px rgba(61,42,92,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      👁 تعاين بعين يوسف — عودة لحساب المالك
    </button>
  );
}

function AppBody() {
  const { dir } = useLang();
  const { screen } = useResident();
  return (
    <div
      dir={dir}
      style={{
        position: 'relative',
        height: '100%',
        background: color.bg,
        fontFamily: font.sans,
        overflow: 'hidden',
      }}
    >
      <FamilyPreviewBanner />
      <Toast />
      {/*
        Screens are `inset: 0` inside this box, so stopping it above the bar
        is what keeps a screen's last button reachable. The prototype lets the
        bar float over the content instead and pads each scroll area by hand —
        30 or 40px against an 83px bar — which leaves the submit button on the
        rating, dispute and «شارك شيئًا» screens half-hidden behind it.
      */}
      <div style={{ position: 'absolute', inset: 0, bottom: navVisible(screen) ? NAV_H : 0 }}>
        <ScreenRouter />
      </div>
      <BottomNav />
    </div>
  );
}

export type ResidentAppProps = {
  config?: Partial<ResidentConfig>;
  initialScreen?: ScreenKey;
  /** Pin to a single screen — used by the screen gallery. */
  fixedScreen?: ScreenKey | null;
  /** Start from a named state — also the gallery's, so one screen can be
   *  shown several times over. */
  scenario?: ScenarioKey | null;
  /** Drop the device bezel, keeping only the status bar. */
  bare?: boolean;
  width?: number;
  height?: number;
  /** Render without any frame at all (for scaled gallery tiles). */
  frameless?: boolean;
};

export const defaultResidentConfig: ResidentConfig = {
  compoundName: 'حدائق الأندلس',
  residentName: 'عبدالله العتيبي',
  paymentModel: 'rent',
  fixedScreen: null,
};

export function ResidentApp({
  config,
  initialScreen,
  fixedScreen = null,
  scenario = null,
  bare = false,
  width,
  height,
  frameless = false,
}: ResidentAppProps) {
  const cfg: ResidentConfig = { ...defaultResidentConfig, ...config, fixedScreen, scenario };
  const body = (
    <ResidentProvider config={cfg} initialScreen={initialScreen}>
      {frameless ? (
        <div
          style={{
            width: width ?? 402,
            height: height ?? 874,
            position: 'relative',
            overflow: 'hidden',
            background: color.bg,
          }}
        >
          <AppBody />
        </div>
      ) : (
        <PhoneFrame width={width} height={height} bare={bare}>
          <AppBody />
        </PhoneFrame>
      )}
    </ResidentProvider>
  );
  return body;
}
