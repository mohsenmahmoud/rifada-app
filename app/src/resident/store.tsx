import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  BillKey, BillStatus, ChatMsg, ChecklistRoom, Comment, CommunityPost, EventTab,
  Group, GroupKind, LostItem, LostKind, MoveTab, PaymentModel, PermKey, Perms,
  PostAttachment, PostTag, ScreenKey, ShareKind, ShareListing, Ticket,
} from './types';
import { initialChat, initialLost, initialTickets, initialMoveRooms } from './data/seed';
import { t } from '@/i18n/lang';

/**
 * Mirrors the prototype's single `state = {…}` object. Kept as one flat shape
 * on purpose: the screens read from it the same way the prototype's
 * `renderVals()` did, which keeps the port checkable against the original.
 */
export type ResidentState = {
  screen: ScreenKey;
  hist: ScreenKey[];
  toast: string | null;

  invite: string;

  // payments
  payModelOverride: PaymentModel | null;
  rentPaid: boolean;
  instPaid: boolean;
  method: string;
  paidAmount: string;
  paidMethod: string;
  autoPayOn: boolean;
  apStage: number;

  // maintenance
  tickets: Ticket[];
  nextId: number;
  selIdx: number;
  cat: string | null;
  desc: string;
  priority: string;
  ratedIds: Record<number, boolean>;
  starSel: number;
  autoMatch: boolean;

  // amenities
  bookAmen: string | null;
  bookSlot: string | null;
  bookIconPath: string | null;

  // move-in
  moveTab: MoveTab;
  moveRooms: Record<'before' | 'receive', ChecklistRoom[]>;

  // "coming soon" placeholder
  soonTitle: string;
  soonCycle: string;
  soonFromTab: string | null;

  // rewards
  points: number;
  redeemOpen: boolean;
  redeemSel: number;
  redeemTitle: string;

  // chat
  chatInput: string;
  chatMsgs: ChatMsg[];

  // lost & found
  lostKind: LostKind;
  lostTitle: string;
  lostLoc: string;
  lostItems: LostItem[];

  // gate
  visitorName: string;
  passIssued: boolean;
  passName: string;

  // misc
  mdIdx: number;
  surveySel: number;
  surveyChipsSel: Record<number, boolean>;
  consentOn: boolean;
  lockGate: boolean;
  lockDoor: boolean;
  renewSel: number;

  // provider marketplace
  reqKind: string;
  reqNotes: string;
  selProvIdx: number;
  liveStage: number;
  provRating: number;
  disputeReason: string | null;
  disputeNotes: string;

  // family
  actingAs: 'owner' | 'yousef';
  famPerms: Perms;
  famInviteShown: boolean;
  nfName: string;
  nfPhone: string;
  nfRel: string;
  nfPerms: Perms;
  nfDone: { name: string; phone: string; code: string } | null;
  selFamIdx: number;

  // real estate
  reTab: 'sale' | 'rent';
  selReIdx: number;
  crType: 'sale' | 'rent';
  crPrice: string;
  crDesc: string;
  crContact: string;
  myListingsState: Record<number, 'active' | 'paused' | 'done'>;

  // events & groups
  evTab: EventTab;
  evSelIdx: number;
  evFilter: string;
  evRsvp: Record<number, boolean>;
  clubJoined: Record<number, boolean>;
  evKind: string;
  evTitle: string;
  evDesc: string;
  evWhen: string;
  evSeats: string;
  evPlace: string;
  pastRating: Record<number, number>;
  gcKind: GroupKind;
  gcName: string;
  gcAbout: string;
  gcFreq: string;
  gcPrivacy: string;
  myGroups: Group[];
  gdIdx: number;
  gdDraft: string;
  gdExtraPosts: Record<number, { who: string; text: string; time: string }[]>;
  gdMeetJoined: Record<number, boolean>;
  gdMeetWhen: string;
  gdMeetPlace: string;

  // اسأل جيرانك
  cmUserPosts: CommunityPost[];
  cmLiked: Record<number, boolean>;
  cmComLiked: Record<string, boolean>;
  cmExtraComments: Record<number, Comment[]>;
  cmExtraReplies: Record<string, { who: string; unit: string; avBg: string; time: string; text: string; att: PostAttachment }[]>;
  cmSelIdx: number;
  cmComment: string;
  cmReplyTo: number | null;
  cmComAtt: PostAttachment;
  cmComLinkOpen: boolean;
  cmComLinkUrl: string;
  cmDraft: string;
  cmTag: PostTag;
  cmFilter: string;
  cmNewAtt: PostAttachment;
  cmNewLinkOpen: boolean;
  cmNewLinkUrl: string;
  cmMenuOpen: number | null;
  cmEditIdx: number | null;

  // رفادتنا sharing
  shareCat: string;
  shareTab: 'browse' | 'mine';
  shareSelIdx: number;
  shareSlotIdx: number | null;
  shKind: ShareKind;
  shTitle: string;
  shDay: string;
  shHour: string;
  shPrice: string;
  shUnit: string;
  sharePublished: ShareListing | null;

  // فواتيرك
  billsSt: Partial<Record<BillKey, BillStatus>>;
  linkCat: BillKey | null;
  linkProviderIdx: number;
  linkAccountNo: string;
  linkedExtra: Partial<Record<BillKey, BillStatus>>;
  selBillKey: BillKey;
  billAutopay: Partial<Record<BillKey, boolean>>;
  billCap: number;
  bhFilter: string;

  // المتجر
  fdTab: string;
  shopQuery: string;
  shopSearchOpen: boolean;
  shopCatsOpen: boolean;
  shopOpenOnly: boolean;
  shopPromoOnly: boolean;
  selStoreIdx: number;
  cart: Record<number, number>;
  foodNotes: string;
  orderStage: number;
};

export const initialState: ResidentState = {
  screen: 'home',
  hist: [],
  toast: null,
  invite: '',

  payModelOverride: null,
  rentPaid: false,
  instPaid: false,
  method: 'card',
  paidAmount: '',
  paidMethod: '',
  autoPayOn: true,
  apStage: -1,

  tickets: initialTickets,
  nextId: 1055,
  selIdx: 0,
  cat: null,
  desc: '',
  priority: 'normal',
  ratedIds: {},
  starSel: 0,
  autoMatch: false,

  bookAmen: null,
  bookSlot: null,
  bookIconPath: null,

  moveTab: 'receive',
  moveRooms: initialMoveRooms,

  soonTitle: '',
  soonCycle: '2',
  soonFromTab: null,

  points: 5724,
  redeemOpen: false,
  redeemSel: 1,
  redeemTitle: 'بطاقة هدايا',

  chatInput: '',
  chatMsgs: initialChat,

  lostKind: 'found',
  lostTitle: '',
  lostLoc: '',
  lostItems: initialLost,

  visitorName: '',
  passIssued: false,
  passName: '',

  mdIdx: 0,
  surveySel: 0,
  surveyChipsSel: {},
  consentOn: false,
  lockGate: true,
  lockDoor: true,
  renewSel: 0,

  reqKind: t('صيانة'),
  reqNotes: '',
  selProvIdx: 0,
  liveStage: 0,
  provRating: 0,
  disputeReason: null,
  disputeNotes: '',

  actingAs: 'owner',
  famPerms: { pay: false, maint: true, amen: true, realestate: false, findocs: false, food: true },
  famInviteShown: false,
  nfName: '',
  nfPhone: '',
  nfRel: 'الزوجة',
  nfPerms: { pay: false, maint: true, amen: true, food: true, realestate: false, findocs: false },
  nfDone: null,
  selFamIdx: 0,

  reTab: 'sale',
  selReIdx: 0,
  crType: 'sale',
  crPrice: '',
  crDesc: '',
  crContact: 'chat',
  myListingsState: { 0: 'active', 1: 'paused' },

  evTab: 'up',
  evSelIdx: 0,
  evFilter: 'all',
  evRsvp: { 0: false, 1: true, 2: false, 3: false, 4: false },
  clubJoined: { 0: true, 1: false, 2: false, 3: false },
  evKind: 'social',
  evTitle: '',
  evDesc: '',
  evWhen: '',
  evSeats: '',
  evPlace: 'النادي الاجتماعي',
  pastRating: {},
  gcKind: 'sport',
  gcName: '',
  gcAbout: '',
  gcFreq: 'أسبوعي',
  gcPrivacy: 'كل السكان',
  myGroups: [],
  gdIdx: 0,
  gdDraft: '',
  gdExtraPosts: {},
  gdMeetJoined: {},
  gdMeetWhen: '',
  gdMeetPlace: '',

  cmUserPosts: [],
  cmLiked: {},
  cmComLiked: {},
  cmExtraComments: {},
  cmExtraReplies: {},
  cmSelIdx: 0,
  cmComment: '',
  cmReplyTo: null,
  cmComAtt: null,
  cmComLinkOpen: false,
  cmComLinkUrl: '',
  cmDraft: '',
  cmTag: 'سؤال',
  cmFilter: 'all',
  cmNewAtt: null,
  cmNewLinkOpen: false,
  cmNewLinkUrl: '',
  cmMenuOpen: null,
  cmEditIdx: null,

  shareCat: 'all',
  shareTab: 'browse',
  shareSelIdx: 0,
  shareSlotIdx: null,
  shKind: 'space',
  shTitle: '',
  shDay: 'الجمعة',
  shHour: '4 م – 8 م',
  shPrice: '',
  shUnit: 'للساعة',
  sharePublished: null,

  billsSt: { elec: 'due', water: 'paid', inet: 'overdue' },
  linkCat: null,
  linkProviderIdx: 0,
  linkAccountNo: '',
  linkedExtra: {},
  selBillKey: 'elec',
  billAutopay: { elec: true, water: false, inet: false },
  billCap: 500,
  bhFilter: 'all',

  fdTab: 'all',
  shopQuery: '',
  shopSearchOpen: false,
  shopCatsOpen: false,
  shopOpenOnly: false,
  shopPromoOnly: false,
  selStoreIdx: 0,
  cart: {},
  foodNotes: '',
  orderStage: -1,
};

export type ResidentConfig = {
  compoundName: string;
  residentName: string;
  paymentModel: PaymentModel;
  /** Pins the app to one screen — used by the gallery previews. */
  fixedScreen?: ScreenKey | null;
};

type Patch = Partial<ResidentState>;

export type ResidentStore = {
  st: ResidentState;
  cfg: ResidentConfig;
  /** Merge a patch into state, exactly like the prototype's `setState`. */
  set: (patch: Patch | ((s: ResidentState) => Patch)) => void;
  /** Navigate forward, pushing the current screen onto history. */
  go: (screen: ScreenKey, extra?: Patch) => void;
  /** Pop history. Falls back to home. */
  back: () => void;
  showToast: (msg: string) => void;

  // ---- derived, needed almost everywhere ----
  /** The screen actually rendered (respects `fixedScreen`). */
  screen: ScreenKey;
  /** True when previewing as a family member with limited permissions. */
  isFam: boolean;
  /** Permission check — `null` key means "always allowed". */
  can: (key: PermKey | null) => boolean;
  /** Standard toast shown when a locked feature is tapped. */
  lockToast: () => void;
  model: PaymentModel;
  isRent: boolean;
  paid: boolean;
  firstName: string;
  initials: string;
};

const Ctx = createContext<ResidentStore | null>(null);

export function useResident(): ResidentStore {
  const s = useContext(Ctx);
  if (!s) throw new Error('useResident must be used inside <ResidentProvider>');
  return s;
}

export function ResidentProvider({
  children,
  config,
  initialScreen,
}: {
  children: ReactNode;
  config: ResidentConfig;
  initialScreen?: ScreenKey;
}) {
  const [st, setSt] = useState<ResidentState>(() => ({
    ...initialState,
    screen: initialScreen ?? initialState.screen,
    hist: initialScreen && initialScreen !== 'home' ? ['home'] : [],
  }));
  const toastTimer = useRef<number | undefined>(undefined);

  const set = useCallback((patch: Patch | ((s: ResidentState) => Patch)) => {
    setSt((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const go = useCallback((screen: ScreenKey, extra?: Patch) => {
    setSt((s) => ({ ...s, screen, hist: [...s.hist, s.screen], ...(extra ?? {}) }));
  }, []);

  const back = useCallback(() => {
    setSt((s) => {
      const h = [...s.hist];
      const prev = h.pop() ?? 'home';
      return { ...s, screen: prev, hist: h };
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setSt((s) => ({ ...s, toast: msg }));
    toastTimer.current = window.setTimeout(
      () => setSt((s) => ({ ...s, toast: null })),
      2800,
    );
  }, []);

  const value = useMemo<ResidentStore>(() => {
    const fixed = config.fixedScreen ?? null;
    const screen = fixed ?? st.screen;
    const isFam = st.actingAs !== 'owner';
    const can = (key: PermKey | null) => !isFam || key == null || st.famPerms[key];
    const lockToast = () =>
      showToast(t('🔒 هذه الميزة تحتاج إذن مالك الوحدة — اطلبها من والدك'));
    const model = st.payModelOverride ?? config.paymentModel;
    const isRent = model === 'rent';
    // Split the translated name, so the initials read as Latin in English
    // rather than showing the Arabic first letter beside an English name.
    const parts = t(config.residentName).split(' ');
    return {
      st, cfg: config, set, go, back, showToast,
      screen,
      isFam, can, lockToast,
      model, isRent,
      paid: isRent ? st.rentPaid : st.instPaid,
      firstName: parts[0] ?? '',
      initials: (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? ''),
    };
  }, [st, config, set, go, back, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
