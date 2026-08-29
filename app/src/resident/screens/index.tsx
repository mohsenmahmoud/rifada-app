import type { ComponentType } from 'react';
import { useResident } from '../store';
import type { ScreenKey } from '../types';

import { Otp, Setup, Splash } from './Onboarding';
import { Home, ServiceHub, ServicesList } from './Home';
import { MaintDetail, MaintList, MaintNew } from './Maintenance';
import { AmenConfirm, AmenDone, Amenities } from './Amenities';
import { Marketplace } from './Marketplace';
import { Payments } from './Payments';
import { Bills } from './Bills';
import { Shop } from './Shop';
import { RealEstate } from './RealEstate';
import { Family } from './Family';
import { Sharing } from './Sharing';
import { Events } from './Events';
import { Community } from './Community';
import { Misc } from './Misc';

/**
 * Screen registry. One entry per `ScreenKey` — the `Record` type makes a
 * missing screen a compile error, which is how the port stays honest about
 * covering all 67 screens the gallery advertises.
 */
const registry: Record<ScreenKey, ComponentType> = {
  // onboarding
  splash: Splash,
  otp: Otp,
  setup: Setup,

  // home & navigation
  home: Home,
  services: ServicesList,
  svcHub: ServiceHub,
  profile: Misc.Profile,
  notifs: Misc.Notifications,
  soon: Misc.ComingSoon,

  // maintenance
  maintNew: MaintNew,
  maintList: MaintList,
  maintDetail: MaintDetail,
  survey: Misc.Survey,

  // amenities
  amen: Amenities,
  amenConfirm: AmenConfirm,
  amenDone: AmenDone,

  // payments
  pay: Payments.Statement,
  payNow: Payments.PayNow,
  paySuccess: Payments.PaySuccess,
  payHistory: Payments.History,
  autopay: Payments.Autopay,
  fin: Payments.Financial,

  // move-in
  movein: Misc.MoveIn,

  // community services
  gate: Misc.GatePass,
  lost: Misc.LostBrowse,
  lostReport: Misc.LostReport,
  market: Misc.MarketBrowse,
  marketDetail: Misc.MarketDetail,
  chat: Misc.Chat,

  // رفادتنا neighbor sharing
  share: Sharing.Browse,
  shareCreate: Sharing.Create,
  shareDetail: Sharing.Detail,

  // rewards & trust
  rewards: Misc.Rewards,
  score: Misc.Score,

  // real estate
  reBrowse: RealEstate.Browse,
  reCreate: RealEstate.Create,
  reDetail: RealEstate.Detail,
  reMine: RealEstate.Mine,

  // family
  family: Family.Members,
  famPerms: Family.Permissions,

  // فواتيرك
  bills: Bills.Home,
  billLink: Bills.Link,
  billDetail: Bills.Detail,
  billHistory: Bills.History,
  billAutopay: Bills.Autopay,

  // المتجر
  food: Shop.Browse,
  foodMenu: Shop.Menu,
  foodCart: Shop.Cart,
  foodTrack: Shop.Track,
  foodHistory: Shop.History,

  // provider marketplace
  reqService: Marketplace.Request,
  matching: Marketplace.Matching,
  escrow: Marketplace.Escrow,
  liveJob: Marketplace.LiveJob,
  rateProvider: Marketplace.Rate,
  dispute: Marketplace.Dispute,

  // events & groups
  feed: Events.Feed,
  eventDetail: Events.Detail,
  eventCreate: Events.Create,
  groupDetail: Events.GroupDetail,
  groupCreate: Events.GroupCreate,

  // اسأل جيرانك
  community: Community.Feed,
  communityPost: Community.Post,
  communityNew: Community.New,

  // expansion
  consent: Misc.Consent,
  pets: Misc.Pets,
  renew: Misc.Renew,
  docs: Misc.Docs,
  contacts: Misc.Contacts,
  links: Misc.Links,
};

export function ScreenRouter() {
  const { screen } = useResident();
  const Component = registry[screen] ?? Home;
  return <Component />;
}

export const screenRegistry = registry;
