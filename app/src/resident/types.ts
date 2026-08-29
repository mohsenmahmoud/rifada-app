/** Every screen in the resident app, keyed exactly as the prototype keys them. */
export type ScreenKey =
  // onboarding
  | 'splash' | 'otp' | 'setup'
  // home & navigation
  | 'home' | 'services' | 'svcHub' | 'profile' | 'notifs' | 'soon'
  // maintenance
  | 'maintNew' | 'maintList' | 'maintDetail' | 'survey'
  // amenities
  | 'amen' | 'amenConfirm' | 'amenDone'
  // payments
  | 'pay' | 'payNow' | 'paySuccess' | 'payHistory' | 'autopay' | 'fin'
  // move-in
  | 'movein'
  // community & services
  | 'gate' | 'lost' | 'lostReport' | 'market' | 'marketDetail' | 'chat'
  // رفادتنا neighbor sharing
  | 'share' | 'shareCreate' | 'shareDetail'
  // rewards & trust
  | 'rewards' | 'score'
  // real estate
  | 'reBrowse' | 'reCreate' | 'reDetail' | 'reMine'
  // family
  | 'family' | 'famPerms'
  // فواتيرك external bills
  | 'bills' | 'billLink' | 'billDetail' | 'billHistory' | 'billAutopay'
  // المتجر store
  | 'food' | 'foodMenu' | 'foodCart' | 'foodTrack' | 'foodHistory'
  // provider marketplace
  | 'reqService' | 'matching' | 'escrow' | 'liveJob' | 'rateProvider' | 'dispute'
  // events & groups
  | 'feed' | 'eventDetail' | 'eventCreate' | 'groupDetail' | 'groupCreate'
  // اسأل جيرانك
  | 'community' | 'communityPost' | 'communityNew'
  // expansion
  | 'consent' | 'pets' | 'renew' | 'docs' | 'contacts' | 'links';

export type TicketStatus = 'received' | 'inprogress' | 'resolved';

export type Ticket = {
  id: number;
  title: string;
  cat: string;
  status: TicketStatus;
  date: string;
  note: string | null;
};

export type ChecklistItem = { label: string; done: boolean };
export type ChecklistRoom = { name: string; items: ChecklistItem[] };
export type MoveTab = 'before' | 'receive' | 'handover';

export type ChatMsg = { me: boolean; text: string; time: string };

export type LostKind = 'found' | 'lost';
export type LostItem = { title: string; loc: string; date: string; kind: LostKind };

/** The six family permissions the unit owner grants per member. */
export type PermKey = 'pay' | 'maint' | 'amen' | 'realestate' | 'findocs' | 'food';
export type Perms = Record<PermKey, boolean>;

export type PaymentModel = 'rent' | 'installment';
export type BillKey = 'elec' | 'gas' | 'water' | 'inet' | 'other';
export type BillStatus = 'due' | 'paid' | 'overdue';

export type ShareKind = 'space' | 'gear' | 'sport' | 'kids' | 'park' | 'skill';
/** [day, time, status] — status is 'متاح' or 'محجوز'. */
export type ShareSlot = [string, string, string];
export type ShareListing = {
  kind: ShareKind;
  title: string;
  owner: string;
  rating: string;
  price: number;
  unit: string;
  desc: string;
  slots: ShareSlot[];
};

export type PostTag = 'سؤال' | 'توصية' | 'عام';
export type PostAttachment =
  | { type: 'image'; name: string; bg: string }
  | { type: 'file'; name: string; size: string }
  | { type: 'link'; title: string; url: string }
  | null;

export type CommunityPost = {
  who: string;
  unit: string;
  avBg: string;
  time: string;
  tag: PostTag;
  text: string;
  likes: number;
  att: PostAttachment;
  mine?: boolean;
};

export type Comment = {
  who: string;
  unit: string;
  avBg: string;
  time: string;
  text: string;
  likes: number;
  att: PostAttachment;
  replies: Reply[];
};

export type Reply = {
  who: string;
  unit: string;
  avBg: string;
  time: string;
  text: string;
  att: PostAttachment;
};

export type GroupKind = 'sport' | 'book' | 'kids' | 'volunteer';
export type Group = {
  kind: GroupKind;
  name: string;
  about: string;
  members: number;
  meets: string;
  organizer: string;
  mine?: boolean;
};

export type EventTab = 'up' | 'mine' | 'groups';
