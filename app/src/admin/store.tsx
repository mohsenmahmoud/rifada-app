import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  initialBroadcasts,
  initialLostMod,
  initialScoreRules,
  initialThreadMsgs,
  initialTickets,
  type AdminTicket,
  type SectionKey,
  type TicketStatus,
} from './data';

export type VendorTab = 'maint' | 'market' | 'providers';
export type ModState = 'pending' | 'approved' | 'rejected';
export type DisputeState = 'open' | 'refund' | 'partial' | 'release' | 'resolved';
export type VettingState = 'pending' | 'active';
export type LostState = 'pending' | 'approved' | 'removed';

export type LostItem = {
  title: string;
  loc: string;
  by: string;
  date: string;
  kind: string;
  state: string;
};

export type Broadcast = { title: string; target: string; reach: number; time: string };

/**
 * One flat state object, exactly as the prototype's `state = {}`.
 *
 * Two deliberate departures from `Jiwar Admin.dc.html`:
 *  - the prototype declares `rules` twice (automation toggles at line 1326, the
 *    scoring rule array at line 1342) so the second silently overwrites the
 *    first and the automation switches never actually toggle. Split here into
 *    `autoRules` and `scoreRules`.
 *  - `sec2` was dead state and is dropped.
 */
export type AdminState = {
  logged: boolean;
  compoundIdx: number;
  sec: SectionKey;
  toast: string | null;

  tickets: AdminTicket[];
  selId: number;
  filter: string;
  noteDraft: string;
  bulkTixSel: Record<number, boolean>;

  resQuery: string;
  openFamRow: number | null;
  u360Unit: string;

  bcTitle: string;
  bcBody: string;
  bcTarget: number;
  bcSent: Broadcast[];

  vendorTab: VendorTab;
  obName: string;
  obPhone: string;
  obCommission: string;
  obCat: number | null;
  obDone: boolean;

  sourcing: Record<string, 'in' | 'out'>;
  reModState: Record<number, ModState>;
  vettingState: Record<number, VettingState>;
  disputesState: Record<number, DisputeState>;
  billAggOn: Record<number, boolean>;
  storeAddedShown: boolean;

  cmdQuery: string;
  inboxDone: Record<string, 'ok' | 'no'>;

  bulkSel: Record<number, boolean>;
  autoRules: Record<number, boolean>;
  scoreRules: { label: string; val: number }[];

  teamRole: number;
  repPeriod: string;

  caps: Record<string, number>;
  lostMod: LostItem[];

  threadIdx: number;
  inboxDraft: string;
  threadMsgs: Record<number, { me: boolean; text: string }[]>;
};

export const initialAdminState: AdminState = {
  logged: false,
  compoundIdx: 0,
  sec: 'home',
  toast: null,

  tickets: initialTickets,
  selId: 1042,
  filter: 'all',
  noteDraft: '',
  bulkTixSel: {},

  resQuery: '',
  openFamRow: null,
  u360Unit: 'فيلا 214',

  bcTitle: '',
  bcBody: '',
  bcTarget: 0,
  bcSent: initialBroadcasts,

  vendorTab: 'maint',
  obName: '',
  obPhone: '',
  obCommission: '',
  obCat: null,
  obDone: false,

  sourcing: {
    'صيانة تكييف': 'out',
    تنظيف: 'out',
    كهرباء: 'in',
    سباكة: 'in',
    'تدريب رياضي': 'out',
  },
  reModState: { 0: 'pending', 1: 'pending', 2: 'approved' },
  vettingState: { 0: 'pending', 1: 'active', 2: 'pending' },
  disputesState: { 0: 'open', 1: 'open', 2: 'resolved' },
  billAggOn: { 0: true, 1: true, 2: true, 3: true, 4: false },
  storeAddedShown: false,

  cmdQuery: '',
  inboxDone: {},

  bulkSel: {},
  autoRules: { 0: true, 1: true, 2: false, 3: true },
  scoreRules: initialScoreRules,

  teamRole: 0,
  repPeriod: 'يوليو 2026',

  caps: { gym: 12, pool: 20, club: 40, kids: 15 },
  lostMod: initialLostMod,

  threadIdx: 0,
  inboxDraft: '',
  threadMsgs: initialThreadMsgs,
};

type Ctx = {
  st: AdminState;
  set: (patch: Partial<AdminState> | ((s: AdminState) => Partial<AdminState>)) => void;
  go: (sec: SectionKey) => void;
  showToast: (msg: string) => void;
  /** The ticket the detail screen is currently showing. */
  ticket: AdminTicket;
  /** Open tickets, the badge on the queue nav item. */
  openCount: number;
  patchTicket: (id: number, patch: Partial<AdminTicket>) => void;
  setStatus: (id: number, status: TicketStatus) => void;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminProvider({
  children,
  initialSection,
  startLoggedIn = false,
}: {
  children: ReactNode;
  initialSection?: SectionKey;
  startLoggedIn?: boolean;
}) {
  const [st, setSt] = useState<AdminState>(() => ({
    ...initialAdminState,
    logged: startLoggedIn || !!initialSection,
    sec: initialSection ?? initialAdminState.sec,
  }));
  const toastTimer = useRef<number | null>(null);

  const set = useCallback<Ctx['set']>((patch) => {
    setSt((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const go = useCallback((sec: SectionKey) => set({ sec }), [set]);

  const showToast = useCallback(
    (msg: string) => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      set({ toast: msg });
      toastTimer.current = window.setTimeout(() => set({ toast: null }), 2800);
    },
    [set],
  );

  const patchTicket = useCallback(
    (id: number, patch: Partial<AdminTicket>) =>
      set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    [set],
  );

  const setStatus = useCallback(
    (id: number, status: TicketStatus) => patchTicket(id, { status }),
    [patchTicket],
  );

  const value = useMemo<Ctx>(() => {
    const ticket = st.tickets.find((t) => t.id === st.selId) ?? st.tickets[0];
    return {
      st,
      set,
      go,
      showToast,
      ticket,
      openCount: st.tickets.filter((t) => t.status !== 'resolved').length,
      patchTicket,
      setStatus,
    };
  }, [st, set, go, showToast, patchTicket, setStatus]);

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
