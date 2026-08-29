# Jiwar (جوار) — Feature Addendum #3: Resident Marketplace, Family Accounts & Food/Pharmacy Ordering

**This is an ADDITIVE document.** Hand it alongside `Jiwar_Master_Build_Spec.md` and `Jiwar_ServiceProvider_BusinessModel_Full.md`. Nothing here changes any screen already built. It adds three new capabilities: (1) a peer-to-peer real estate marketplace within the compound, (2) family sub-accounts with owner-controlled permissions, and (3) a full restaurant/pharmacy ordering cycle built on the same Service Provider infrastructure already defined.

Use the same design system as the other documents (Deep Navy `#1F3B57`, Warm Gold `#C79A3C`, same components/typography).

---

## 1. Feature: Resident-to-Resident Real Estate Marketplace (Buy / Sell / Rent Units)

**What it does:** lets residents list their own unit for sale or rent, and browse listings from other residents in the same compound — a trusted, verified-neighbors-only classifieds board for real estate, instead of relying on external listing sites or word-of-mouth.

**Important scope boundary:** Jiwar facilitates **discovery and contact only** — browsing, listing, and messaging. The actual legal sale/rental transaction (contracts, ownership transfer, deposits) happens outside the app through normal legal channels, same as any real estate transaction. Do not design this as a payment/escrow flow like the Service Provider Marketplace — it's a listings board, not a transaction processor.

### 🟦 Resident App — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R39 | **Real Estate Marketplace — Browse** [NEW] | List/grid of units listed for sale or rent within the compound. Filter tabs: للبيع (For Sale) / للإيجار (For Rent). Filters: عدد الغرف، المساحة، نطاق السعر. Each card: photo, price, unit type, "فيلا / شقة"، عدد الغرف | → R41 |
| R40 | **Create Listing** [NEW] | Owner lists their own unit: sale or rent toggle, price, photos upload, description, preferred contact method (chat only, or show phone) | → R42 on save |
| R41 | **Listing Detail** [NEW] | Photo gallery, full description, price, "تواصل مع المالك" (Contact Owner) button opening an in-app chat thread, "أنا مهتم" (I'm Interested) quick-interest button | Back to R39 |
| R42 | **My Listings** [NEW] | Owner's own listings: status (نشط / متوقف / تم البيع / تم التأجير), edit/pause/remove actions | Accessible from R14 (Profile) |

### 🟨 Admin Dashboard — New Screen

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A28 | **Real Estate Marketplace Moderation** [NEW] | Queue of all listings compound-wide, approve/reject/flag inappropriate content, remove stale listings | From A2 |

---

## 2. Feature: Family Sub-Accounts with Owner-Controlled Permissions

**What it does:** the unit owner (primary account holder) can create linked accounts for family members (spouse, children, other household members), and control exactly what each linked account can see and do in the app — some family members might only view announcements and book the gym, while others can also pay bills or create maintenance tickets.

**Design principle — applies retroactively to every existing screen:** every screen and action in the app must check the logged-in user's permission level. If a family member's account lacks permission for a given feature, that icon/action should appear **locked/grayed with a small lock icon**, not simply hidden — so it's clear to them that a feature exists but requires the owner's permission, rather than looking broken or missing.

### 🟦 Resident App — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R43 | **Family Members Management** [NEW] (owner-only screen) | List of linked family members under the unit (name, relationship, avatar), "دعوة فرد جديد" (Invite New Member) button generating an invite code/link, per-member row shows a summary of their current permission level | Accessible from R14 (Profile), owner-only |
| R44 | **Set Permissions for Family Member** [NEW] (owner-only) | Per family member, a toggle list: الدفع ودفع الفواتير (Payments) / إنشاء طلبات صيانة (Maintenance Tickets) / حجز المرافق (Amenities Booking) / الوصول لسوق العقارات (Real Estate Marketplace) / عرض المستندات المالية (Financial Documents) / طلب من المطاعم والصيدليات (Food/Pharmacy Ordering) — each a simple on/off switch | From R43 |
| R45 | **Family Member Onboarding** [NEW] | A family member redeeming their invite code sees a lighter version of R1-R3 (Splash/OTP/Setup), landing on a Home Dashboard where locked features show the small lock-icon treatment described above | Parallel to R1-R3, for non-owner users |

### 🟨 Admin Dashboard — Note (no new screen required)

The existing **A5 Resident Directory** should show linked family members grouped under their unit (e.g. "فيلا 214 — أحمد محمود (المالك)، سارة أحمد (الزوجة)، يوسف أحمد (الابن)") rather than as separate unrelated entries — this is a data-model note, not a new screen.

---

## 3. Feature: Restaurants & Pharmacies — Full Ordering Cycle (Talabat/Uber-Eats Style)

**What it does:** extends the Service Provider concept (from the earlier addendum) specifically for restaurants and pharmacies contracted by the FM office — but because ordering food/medicine needs a menu-and-cart flow, not a single-job-request flow, this gets its own dedicated cycle, built on the same provider-onboarding and payment infrastructure already defined.

### 🟦 Resident App — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R46 | **Food & Pharmacy — Browse** [NEW] | Category tabs: مطاعم (Restaurants) / صيدليات (Pharmacies). List of registered stores with logo, rating, estimated delivery time, open/closed status | → R47 |
| R47 | **Store Menu** [NEW] | Item list with photos, prices, quantity selector, "إضافة للسلة" (Add to Cart) per item | → R48 |
| R48 | **Cart & Checkout** [NEW] | Cart review, unit number auto-filled as delivery address, delivery notes field, payment method selection, "تأكيد الطلب" (Confirm Order) button — same payment-hold/escrow messaging as R37 applies here too ("المبلغ محجوز حتى تأكيد الاستلام") | → R49 |
| R49 | **Order Tracking** [NEW] | Status timeline: تم الاستلام → قيد التحضير → في الطريق → تم التوصيل — same visual pattern as R35's live status | Back to R4 when delivered |
| R50 | **Order History & Reorder** [NEW] | Past orders list, "اطلب نفس الطلب مرة أخرى" (Reorder) quick-action button | Accessible from R14 (Profile) |

### 🟩 Service Provider App — Restaurant/Pharmacy Variant [NEW screens, extend P1-P8]

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| P9 | **Menu Management** [NEW] | Store owner manages menu items: add/edit/remove items, set prices, toggle item availability, store-wide open/closed toggle | From P2 (Provider Home), for provider accounts flagged as "store" type |
| P10 | **Incoming Orders Queue** [NEW] | Similar pattern to P3, but order-based: incoming order ticket, items list, accept/reject, then update status (قيد التحضير → جاهز للتوصيل → تم التوصيل) | → feeds R49 |
| P11 | **Order Payout & Earnings** [NEW] | Same pattern as P7, per order, showing amount after Jiwar's commission | From P10 |

### 🟨 Admin Dashboard — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A29 | **Restaurant/Pharmacy Onboarding** [NEW] | Same pattern as A20 (Provider Onboarding), but captures store-specific info: store type, menu template upload, delivery zone within compound, commission rate | From A30 |
| A30 | **Food & Pharmacy Directory** [NEW] | List of registered stores, status, order volume, average rating | From A2, links to A29 |

---

## 4. Updated Priority Note

These three features are **Cycle 2-3 additions**, layered on top of the Service Provider Marketplace already prioritized in the master spec's Phase B. Suggested build order if time allows, after Phase B is solid:

1. Family Sub-Accounts (R43-R45) — architecturally important since it affects permission-checking logic across the whole app; better to establish this pattern early
2. Food & Pharmacy Ordering (R46-R50, P9-P11, A29-A30) — highest daily-engagement potential of the three, good demo material
3. Real Estate Marketplace (R39-R42, A28) — lowest build complexity (no escrow/payment needed), can be added last

---

## 5. One-Line Instruction to Paste Into Claude Design

*"Add three new capabilities on top of the existing Jiwar prototype, without changing any screen already built: (1) a peer-to-peer real estate marketplace for residents to list/browse units for sale or rent (R39-R42, A28) — discovery and contact only, no in-app transaction; (2) family sub-accounts where the unit owner controls per-member permissions, with locked/grayed icons for restricted features (R43-R45); and (3) a full restaurant/pharmacy ordering cycle with menu, cart, and order tracking, built on the existing Service Provider infrastructure (R46-R50, P9-P11, A29-A30). Follow the build order in Section 4."*
