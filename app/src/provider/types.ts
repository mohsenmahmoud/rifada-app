/** Every screen in the provider app, keyed as the prototype keys them. */
export type ProviderScreen =
  | 'login'
  // technician side
  | 'home'
  | 'job'
  | 'disputeP'
  | 'wallet'
  // store side (restaurant / pharmacy)
  | 'storeHome'
  | 'storeOrders'
  | 'storePayout';

/** accepted → started → done → paid. Payout only releases at `paid`. */
export type JobStage = 'accepted' | 'started' | 'done' | 'paid';

/** The store type a single account can operate as. */
export type StoreKind = 'rest' | 'pharm';

/** استلام → تسجيل → تحضير → جاهز → خروج → تسليم */
export type OrderStage = 'new' | 'preparing' | 'ready' | 'out' | 'delivered';

export type OrderLine = { name: string; price: number };

export type Order = {
  id: string;
  who: string;
  time: string;
  /** Pharmacy orders carry a prescription that must be reviewed before accepting. */
  rx?: boolean;
  lines: OrderLine[];
  total: number;
  /** Net to the store after the platform commission. */
  net: string;
};

/** 0 idle · 1 requested · 2 processing · 3 landed */
export type WithdrawStage = 0 | 1 | 2 | 3;
export type PayoutMode = 'auto' | 'manual';
