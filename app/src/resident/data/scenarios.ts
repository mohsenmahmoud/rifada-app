import type { ResidentState } from '../store';
import type { ShareListing } from '../types';

/**
 * Named starting states for the screen gallery — the design's own `SCEN`
 * table, which is what lets one screen appear several times over: the ticket
 * at each of its three statuses, the cart full and empty, the group seen as
 * a stranger, a pending applicant, a member and its organiser.
 *
 * Each entry is a patch over `initialState`, applied once when the app mounts.
 */

/** The published listing the owner-side scenarios are built around. */
const paddockListing: ShareListing = {
  kind: 'space',
  title: 'ملعب بادل خاص — حديقة الفيلا',
  owner: 'عبدالله العتيبي — فيلا 214',
  unit: 'للساعة',
  desc: 'ملعب بادل مجهّز بالإضاءة الليلية في حديقة الفيلا — متاح لجيران الحي بالحجز المسبق.',
  slots: [
    ['الجمعة', '4 م – 8 م', 'متاح'],
    ['السبت', '5 م – 9 م', 'متاح'],
  ],
  rating: '4.9',
  price: 100,
};

export const scenarios = {
  'home-noalert': { alertOn: false },
  'fam-view': { actingAs: 'yousef' },
  'md-received': { selIdx: 1 },
  'md-resolved': { selIdx: 2 },
  'pay-inst': { payModelOverride: 'installment' },
  'ap-run': { apStage: 2 },
  'gate-form': { visitorFormOpen: true },
  'gate-issued': { passIssued: true, passName: 'محمد الشناوي' },
  'lost-mine': { lostKind: 'lost' },
  'bill-paid': { selBillKey: 'water' },
  'bill-overdue': { selBillKey: 'inet' },
  'store-pharm': { selStoreIdx: 3 },
  'cart-full': { cart: { 0: 2, 3: 1 } },
  'order-out': { orderStage: 2 },
  'order-done': { orderStage: 3 },
  'match-found': { matchFound: true },
  'live-otw': { liveStage: 1 },
  // Past the last step on purpose, as the design has it: every step reads
  // as done and none as current, so no step explains itself.
  'live-done': { liveStage: 9 },
  'shb-mid': { shbStage: 1 },
  'shb-done': { shbStage: 2 },
  'grp-nonmember': { gdIdx: 1 },
  'grp-pending': { gdIdx: 1, clubPending: { 1: true } },
  're-rent': { reTab: 'rent' },
  'fam-sel2': { selFamIdx: 1 },
  'ev-going': { evSelIdx: 1 },
  'grp-organizer': {
    gdIdx: 4,
    myGroups: [{
      kind: 'sport',
      name: 'نادي البادل — مساء الخميس',
      members: 12,
      meets: 'أسبوعي',
      organizer: 'أنت',
      mine: true,
      about: 'مجموعة أنشأتها لتنظيم مباريات البادل بين الجيران.',
    }],
  },
  'pub-listing': { sharePublished: paddockListing },
  'req-sel': { sharePublished: paddockListing, shReqSelIdx: 0 },
  'dm-open': { dmWith: 'منى الشريف — فيلا 88' },
  /**
   * R25. The prototype fakes this one with a `rewardsModal` screen key that
   * `renderVals` immediately rewrites back to `rewards` with the sheet
   * forced open — the same thing a scenario does, without the phantom screen.
   */
  'rewards-modal': { redeemOpen: true },
} as const satisfies Record<string, Partial<ResidentState>>;

export type ScenarioKey = keyof typeof scenarios;
