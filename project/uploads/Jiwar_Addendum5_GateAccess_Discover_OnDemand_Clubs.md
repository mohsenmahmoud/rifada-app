# Jiwar (جوار) — Feature Addendum #5: Gate Access, Discover, On-Demand Services & Clubs

**This is an ADDITIVE document, based on a competitive teardown of TMG Life.** Hand it alongside the other Jiwar spec files. Nothing here changes any screen already built — except one explicit **priority re-assignment**: Gate Access moves from Cycle 4 into Cycle 1, because it's a daily-use driver, not a premium/GCC-only feature. This is called out clearly below.

---

## 0. Priority Re-Assignment (Important)

The master spec originally placed basic access control under **R31 "Smart Access / IoT Control"** in Cycle 4, framed as a GCC-premium/IoT feature. **That framing was too narrow.** Split it into two separate things going forward:

- **Gate Access + Guest Invitations (this document, Section 1)** — a lightweight, software-only QR/Bluetooth pass and guest-invite system. This is **promoted to Cycle 1**, alongside the core loop, because it's the single strongest reason a resident opens the app every single day (every visitor, delivery, or guest becomes an app moment) — not a luxury feature.
- **R31 Smart Access / IoT Control** stays in Cycle 4 as originally scoped — that one specifically means integrating with **physical smart-lock/turnstile hardware** at the gate itself, which is a genuine hardware-partnership dependency and correctly stays a later-phase, GCC-premium item. Gate Access in this document does **not** require new hardware — it works with whatever QR-scanner/security-guard process the compound already uses at the gate, same as how visitor lists work today, just digitized.

---

## 1. Feature: Gate Access & Guest Invitations — **Cycle 1 Priority**

### 🟦 Resident App — New Screens (fully separate from R17, nothing shared)

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R56 | **My Gate Pass** [NEW] | The resident's own personal QR code (and Bluetooth pairing if the compound's gate hardware supports it) for entering — large QR code display, refreshes periodically for security, "أضف للمحفظة" (Add to Wallet-style shortcut) option | Accessible from R4 via a **new** icon — do not reuse or relabel any existing icon |
| R57 | **Invite a Guest** [NEW] | Guest name/phone (optional), visit date/time, purpose (زيارة / دليفري / عامل صيانة خارجي). Shows remaining quota clearly: **"3 من 10 دعوات هذا الشهر"**. On submit, generates a shareable QR/link that **expires automatically after 24 hours** | → R58 |
| R58 | **My Active Invites** [NEW] | List of pending/active/expired/used invites, status pill per invite, "إلغاء" (Revoke) action on active ones | Accessible from R4 or R56 |

**Explicit instruction regarding R17:** R17 (Vehicle & Visitor / Gate Pass) is an existing screen in the current prototype. **Do not touch, edit, merge, rename, or remove R17 in any way.** R56-R58 above are entirely new, separate screens with their own new entry point(s) from the Home Dashboard. If in the future someone wants to unify R17 with this system, that is a distinct follow-up task requiring an explicit look at R17's current build first — not part of this addendum.

### 🟨 Admin Dashboard — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A32 | **Gate Access Logs** [NEW] | Real-time entry/exit log: resident passes used, guest invites redeemed, flagged anomalies (e.g. invite used after expiry attempt, unusual frequency) | From A2 |
| A33 | **Gate Access Settings** [NEW] | Configure per-unit guest invite quota (default e.g. 10/month), invite expiry duration (default 24 hours), enable/disable Bluetooth vs. QR-only per compound based on installed hardware | From A2 |

**Technical note (not a screen):** the QR/expiry logic itself is pure software and belongs in Cycle 1. Actual gate hardware (turnstiles, Bluetooth readers, scanner integration) is a separate hardware-partnership track that can run in parallel with software development — the app should work today with a security guard simply viewing/scanning the QR code on a phone or handheld scanner, no special hardware required to launch.

---

## 2. Feature: Discover — Local Directory, News & Promo Codes — **Cycle 2**

**Where this lives in navigation:** **do not modify, relabel, or add content under the existing "العروض" (Offers) bottom-nav tab** — its current build is unknown and must not be touched. Instead, add Discover as a **new, separate entry point**: a new card/icon from the Home Dashboard (R4) (e.g. an icon labeled "استكشف" / Discover). If later confirmed that the Offers tab is empty or a good fit, merging them can be a separate, deliberate follow-up task — not assumed here.

### 🟦 Resident App — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R59 | **Discover Home** [NEW] (opens from its own new Home icon, not from "العروض") | Category row: ☕ قهاوي / 🛒 بقالة / 🏦 بنوك / 🏥 عيادات / 🍽️ مطاعم. Below: nearby business cards with distance/address. A secondary section: "أخبار وفعاليات" (News & Events) | → R60, R62 |
| R60 | **Business/Service Directory Detail** [NEW] | Business info, address (map pin), contact/call button, any active promo tied to this business | Back to R59 |
| R61 | **Promo & Discount Codes** [NEW] | List of active codes redeemable at partner businesses (e.g. "خصم 10% في مطعم X بالمول") — copy-code button, terms/expiry shown per code | Accessible from R59 or R4 |
| R62 | **News & Events Feed** [NEW] | Community/city-wide news and events — broader lifestyle content than the existing R13 (which stays FM-office announcements only); this feed can include curated local news, partner-business events, city happenings | Back to R59 |

### 🟨 Admin Dashboard — New Screen

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A34 | **Local Partner Directory Management** [NEW] | Onboard local partner businesses (cafes, clinics, banks, etc.) for the Discover directory, set listing tier (free vs. paid featured placement), create/manage promo codes and track redemptions | From A2 |

**Revenue note:** local businesses can pay a listing fee for featured placement, or a small commission per promo-code redemption — this is a genuinely new monetization stream beyond the five already identified in the original BRD, worth flagging to investors as a low-effort, high-margin addition once the resident base is large enough to be attractive to local merchants.

---

## 3. Feature: On-Demand Home Services — **Cycle 2, reuses existing Marketplace infrastructure**

**Important — this is not a new system.** This is a new **entry point and framing** on top of the Service Provider Marketplace already fully specified (R33→R34→R35→R36 for residents, P1-P8 for providers, A20-A27 for admin). The distinction from existing R5 (Maintenance — Create Ticket) is purely conceptual:

- **R5 (Maintenance)** = something is broken/needs repair, often covered under warranty or the compound's service charge, typically ticket-based and not always instantly priced
- **On-Demand Home Services (this feature)** = proactive, routine, fixed-price bookings the resident chooses to pay for directly (AC servicing, car wash, home cleaning, electrician for non-emergency work) — priced upfront, booked instantly, same escrow/payment-hold trust mechanic already built (R37)

### 🟦 Resident App — New Screen (routes into existing infrastructure)

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R63 | **On-Demand Home Services — Browse** [NEW] | Grid of fixed-price service categories: 🧹 تنظيف منزلي / 🚗 غسيل سيارات / ❄️ صيانة تكييف دورية / 🔌 كهربائي — each card shows a starting fixed price (e.g. "يبدأ من 150 جنيه"). "احجز الآن" button routes directly into the **existing** R34 Matching screen — do not build a new booking/matching engine | → R34 (existing, reused) |

**Where this lives in navigation:** add as a new, standalone card/shortcut from R4 (Home) only. **Do not add anything inside R8 (Amenities) or R20 (Internal Marketplace) themselves** — keep those screens exactly as they are; R63 is a new, separate front door that happens to route into the same backend matching engine, not a modification of R8/R20.

---

## 4. Feature: Clubs & Membership Management — **Cycle 3**

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R64 | **Clubs Home** [NEW] | Membership status card: "عضويتك نشطة حتى [تاريخ]", gold "جدد العضوية" (Renew Membership) button when nearing expiry | Accessible from R4 or R8 (Amenities) |
| R65 | **Explore Club Activities** [NEW] | Browse categories: رياضة / أكاديميات / مرافق / أنشطة اجتماعية, each with schedule and per-activity or package pricing | → R66 |
| R66 | **Membership/Activity Payment** [NEW] | Reuses existing payment components (same pattern as R11/R15) | Back to R64 |

### 🟨 Admin Dashboard — New Screen

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A35 | **Club & Membership Management** [NEW] | Manage membership tiers/pricing, activity schedules, capacity, renewal reminders sent to residents nearing expiry | From A2 |

---

## 5. Updated Build Priority Order (Supersedes the Phase A/B Order in the Master Spec)

**Phase A — Core loop (Cycle 1), now including Gate Access:**
1. Home Dashboard (R4)
2. Maintenance flow (R5-R7)
3. Payments (R10-R11), including dual rent/installment logic
4. **Gate Access & Guest Invitations (R56-R58, A32-A33)** — promoted here, build alongside the above, not after
5. Move-in/Move-out Checklist (R12)
6. Admin Dashboard Home + Tickets Queue (A2-A4)

**Phase B — Marketplace & daily-engagement features (Cycle 2):**
7. Service Provider Marketplace core (R33-R36, P1-P8, A20-A23) — as already prioritized
8. On-Demand Home Services entry point (R63) — reuses Phase B infrastructure directly, low additional effort
9. Discover directory & promo codes (R59-R62, A34)
10. Fawateery bills hub (R51-R55, A31) — from the prior addendum

**Phase C — Trust & lifestyle layer (Cycle 3):**
11. Everything already in Cycle 3 (Rewards, Sentiment Dashboard, Scoring)
12. Clubs & Membership (R64-R66, A35)

**Cycle 4 unchanged** — Cross-compound data sharing, Pets, true Smart Access/IoT hardware integration, GCC expansion.

---

## 6. One-Line Instruction to Paste Into Claude Design

*"Add four things on top of the existing Jiwar prototype — IMPORTANT: do not change, edit, rename, or remove any screen already built, including R17 (Vehicle & Visitor/Gate Pass) and the existing 'العروض' (Offers) tab; only add new screens with new entry points. (1) Gate Access, Cycle 1 priority — build R56 (My Gate Pass), R57 (Invite a Guest, with quota and 24-hour expiry), R58 (My Active Invites), and admin screens A32-A33, all software-only, no new hardware needed, accessible via a new Home-screen icon, fully separate from R17; (2) a Discover section (R59-R62, A34) accessible via a new dedicated Home-screen icon (e.g. 'استكشف'), NOT inside the existing Offers tab, covering a local business directory, news/events, and promo codes; (3) an On-Demand Home Services entry point (R63) that routes directly into the already-built Marketplace matching flow (R34) — do not build a new matching engine, just a new front door to the existing one; (4) Clubs & Membership management (R64-R66, A35) for Cycle 3. Follow the updated priority order in Section 5."*
