# Jiwar (جوار) — Master Prototype Build Spec (Design System + Full Screen Map, All Cycles + Service Provider Marketplace)

**This is the single, final, authoritative file for building the Jiwar prototype. It merges the visual design system, the complete screen-by-screen map across all 4 build cycles, and the Service Provider Marketplace feature — fully integrated, not as a separate add-on. No other document is needed.**

Do not use the word "Homebody" or any of its brand assets anywhere in the output — this spec reuses interaction *patterns*, not the benchmark's brand.

---

## 1. Brand & Visual Identity

**Product name:** Jiwar (جوار) — Arabic for "being neighbors / close proximity," reflecting the community/neighbor-to-neighbor spirit of the product.

**Wordmark direction:** Lowercase, rounded-geometric sans, bold weight — "jiwar" (جوار) in a custom-feel typeface. Icon accompaniment: a simple mark evoking neighborliness/proximity (e.g. two overlapping abstract "roofs" or an interlocking doorway motif), minimal, one color.

**Color palette (hex):**
| Role | Color | Hex |
|---|---|---|
| Primary (brand/logo/headers) | Deep Navy | `#1F3B57` |
| Accent (CTAs, highlights, active states) | Warm Gold | `#C79A3C` |
| Success / positive sentiment / paid status | Soft Green | `#3FA66B` |
| Warning / negative sentiment / overdue | Soft Coral | `#E4675A` |
| Background (primary) | Warm Off-White | `#F7F4EE` |
| Card fill | Pure White | `#FFFFFF` |
| Secondary text | Slate Gray | `#6B7280` |
| Rewards gradient (points card) | Navy → Deep Purple gradient | `#1F3B57 → #3D2A5C` |

**Typography:**
- Display/headers (Arabic): **Cairo Bold** or **IBM Plex Sans Arabic Bold**
- Body (Arabic): Cairo Regular / IBM Plex Sans Arabic Regular
- Data/numbers (balances, points): IBM Plex Sans, tabular figures
- English (admin dashboard secondary language): Inter

**Component language (applies to every screen):**
- Corner radius: 18-20px on cards, full pill (999px) on primary buttons
- Cards: white fill, soft shadow (`0 2px 12px rgba(0,0,0,0.06)`), no borders
- Primary button: solid navy pill, white text
- Secondary button: outline pill, navy border/text
- Icons: thin line-style (1.5px stroke), monochrome navy/gray
- Status pills: rounded rect, colored fill (green=positive/paid, gold=pending, coral=negative/overdue)

**Three interfaces throughout:**
- 🟦 **Resident App** (mobile, RTL Arabic-first)
- 🟨 **Admin/Operator Dashboard** (web, bilingual AR/EN)
- 🟩 **Service Provider App** (mobile, given to contracted maintenance technicians, event staff, trainers, cleaners, etc. — see Section 4)

**Payment model — important:** Jiwar must support **both** a monthly-rent model **and** a multi-year developer installment-sale model, configurable per unit/compound at setup — the region has both rental tenants and installment-purchase owners, not just one or the other. Every payment screen below must be read with this in mind.

---

## 2. CYCLE 1 — Core Loop (Investor Demo Prototype)

**Build this section only for the first prototype pass.**

### 🟦 Resident App

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R1 | Splash / Invite Code Entry | Jiwar wordmark + icon, tagline, single input field for the invite code given by the FM office (or QR scan option) | → R2 | "أدخل كود الدعوة الخاص بوحدتك" |
| R2 | OTP Verification | Phone number confirmation via SMS OTP | → R3 (first time) / → R4 (returning) | "تم إرسال كود التحقق إلى 01xxxxxxxxx" |
| R3 | Account Setup | Name, profile photo (optional), unit number auto-filled from invite code, password/PIN | → R4 | Unit: "فيلا 214 - حي الياسمين" |
| R4 | **Home Dashboard** — direct adaptation of benchmark's home screen, RTL-mirrored | Top bar: Jiwar wordmark + compound name top-right, profile photo top-left. **Hero card** (full-width, rounded 20px, soft gradient photo background): badge "وحدة 214" top-left, "المستحق" + bold amount bottom-right, gold pill "ادفع الآن" bottom-left. "مركز الخدمات" section header. **2-column icon grid** (RTL order): الصيانة / المرافق, المستندات / الفعاليات, المدفوعات / جهات الاتصال, المركبات / روابط مهمة, الحيوانات الأليفة / المفقودات. Floating navy circular chat button, bottom-left | Hub — links to R5, R8, R10, R13 | "المستحق: 3,200 جنيه — تاريخ الاستحقاق 25 يوليو" |
| R5 | Maintenance — Create Ticket | Category cards (سباكة / كهرباء / تكييف / مناطق مشتركة / أخرى), photo/video attach, description field, priority selector. **After submitting, optional step:** "هل تريد إسناد المهمة تلقائيًا لأقرب مقدم خدمة متاح؟" (Auto-match to nearest available provider?) — if yes → routes to R34 (Provider Matching, Section 4); if no → behaves exactly as before, goes to admin queue A3/A4 | → R6, or → R34 if auto-match chosen | Categories as icon cards |
| R6 | Maintenance — Ticket List | Status pills: تم الاستلام (gray) / جاري التنفيذ (gold) / تم الحل (green) | → R7 | "شكوى #1042 - جاري التنفيذ" |
| R7 | Maintenance — Ticket Detail & Rating | Status timeline, technician notes/photos, 5-star rating + comment once resolved | Back to R6 | "قيّم تجربتك مع الفني" |
| R8 | Amenities — Booking List | Cards: الجيم / المسبح / النادي الاجتماعي / منطقة الأطفال, available slots shown inline. **For amenities involving a bookable person** (e.g. a personal trainer), add an optional "احجز مدرب" button → routes to R33 → R34, same matching flow as maintenance | → R9, or → R33 for personnel bookings | "الجيم - متاح اليوم 6 مساءً، 7 مساءً" |
| R9 | Amenities — Booking Confirmation | Selected slot summary, confirm/cancel | Back to R4 | "تم تأكيد حجزك" |
| R10 | **Payments — Statement/Balance View** | "الرصيد المستحق حتى [تاريخ]" + large bold amount. Itemized line items (رسوم صيانة, رسوم إضافية). **If unit is rent-model:** recurring monthly due date shown. **If installment-model:** remaining installment count + next due date shown (سنة 3 من 8). Secondary link rows: عرض تفاصيل الرصيد / إدارة طرق الدفع / إدارة الدفع التلقائي | → R11 | Line items in EGP/SAR |
| R11 | Payments — Pay Now (mocked in Cycle 1) | Payment method selection (mocked), confirm screen, gold "ادفع الآن" pill | Back to R10 | "تم الدفع بنجاح ✓" (simulated) |
| R12 | Move-in / Move-out Checklist | Segmented control: قبل الانتقال / الاستلام / التسليم. Countdown banner card (dark navy): "متبقي 3 أيام على الاستلام!" + "دليل الترحيب" / "فيديو" pills. Progress card (gold accent): "قبل الاستلام" + "قيد التنفيذ" pill + progress bar + "9% مكتمل". Room-by-room checklist with photo upload per item | Standalone flow, accessible from R4 | "غرفة المعيشة: ✓ لا يوجد عيوب" |
| R13 | Announcements / Community Feed | Scrollable feed of FM office announcements + upcoming events | Back to R4 | "انقطاع مياه مؤقت يوم الخميس من 10-2" |
| R14 | Profile / Settings | Personal info, language toggle (AR/EN), notification preferences, logout | Accessible from all screens via nav bar | — |

**Bottom Navigation (5 items, persistent):** الرئيسية · الخدمات · المكافآت · العروض · الرسائل

### 🟨 Admin Dashboard

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A1 | Admin Login | Email/password, org/compound selection | → A2 | — |
| A2 | Dashboard Home | KPI cards: تذاكر مفتوحة / معدل التحصيل % / متوسط وقت الحل / رضا السكان, recent activity feed | Hub — links to A3, A5, A6, A7 | "12 شكوى مفتوحة - متوسط وقت الحل: 18 ساعة" |
| A3 | Tickets Queue | Filterable/sortable table by status/priority/category | → A4 | Color-coded priority |
| A4 | Ticket Detail & Assignment | Full ticket info, assign to technician/vendor, status update, internal notes | Back to A3 | — |
| A5 | Resident Directory | Searchable list: unit, resident, contact, payment status | → resident profile | "فيلا 214 - أحمد محمد - سداد منتظم" |
| A6 | Broadcast Announcement Composer | Compose + schedule, target all or by zone | Back to A2 | — |
| A7 | Vendor Directory | Registered vendors/contractors, contact & specialty (see A21 for the fuller Provider Directory this evolves into in Cycle 2) | → vendor profile | — |
| A8 | Amenity Slot Management | Set capacity/hours for gym, pool, clubhouse; view bookings | Back to A2 | — |

**Cycle 1 Gate:** This is exactly what gets demoed to Pilot #1 and investors — build ONLY this set first.

---

## 3. CYCLE 2 — Real Pilot, Payments Live & Service Provider Marketplace

### 🟦 Resident App — Payments & Core Additions

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R15 | Payments — Real Gateway Flow | Redirect/embed to Paymob/Fawry Business (Egypt) or Geidea/Mada (KSA), OTP bank confirmation | Replaces mock R11 | — |
| R16 | Payment History & Receipts | Downloadable receipts, filter by date/type | From R10 | — |
| R17 | Vehicle & Visitor / Gate Pass | Register vehicle plates, generate QR pass for expected visitors | Accessible from R4 | "زيارة متوقعة: صديق - غدًا 5 مساءً - QR مرفق" |
| R18 | Lost & Found — Browse *(differentiator)* | Grid of reported items with photos, filter by compound/category | → R19 | "مفاتيح سيارة - وجدت بجوار البوابة الرئيسية" |
| R19 | Lost & Found — Report Item | Photo, description, location, contact preference | Back to R18 | — |
| R22 | Notification Inbox | Centralized push history (payment due, ticket update, new item found, provider match found) | Accessible from nav bar | — |

### 🟦 Resident App — Service Provider Marketplace (the Uber-style matching feature)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R20 | Internal Marketplace — Browse Services *(differentiator, upgraded)* | Cards: تنظيف / صيانة تكييف / مكافحة حشرات, plus "من الجيران" peer-to-peer section. **Upgrade:** the "book" action now optionally triggers real matching (R34) instead of a static single-vendor booking, whenever more than one qualified provider is available. If only one provider offers that service, it behaves exactly as the original static booking flow | → R21, or → R34 when multiple providers available | Pricing shown per service |
| R21 | Marketplace — Service Detail & Book | Vendor/neighbor details, reviews, book & pay in-app | Back to R20, or → R34 | — |
| R33 | **Request a Service** (generalized entry point — works for maintenance, event staffing, gym trainer booking, cleaning, or any provider-fulfilled service) | Service type selector (reuses categories already defined), request details field, photo attach if relevant, unit auto-filled | → R34 | "احجز مدرب شخصي للجيم" |
| R34 | **Matching / Provider Options** (the core Uber-style screen) | Short ranked list (3-5 cards) of matched, available providers: photo/avatar, name, star rating, distance/ETA (e.g. "10 دقائق"), price estimate, "قبول" button per card. Ranked by a mix of proximity/ETA, rating, and price (exact weighting is a later business decision — for the prototype, show a plausible mock ranked list) | → R35 on selection | "أحمد للصيانة - ⭐4.8 - يصل خلال 10 دقائق - 150 جنيه" |
| R35 | Provider Confirmed / Live Status | Selected provider's info, live status timeline (تم التأكيد → في الطريق → وصل → جاري التنفيذ → تم الانتهاء), chat/call button | Back to R4 when complete | — |
| R36 | Rate Service Provider | Post-completion 5-star rating + comment, specific to marketplace jobs (separate from the general maintenance-ticket rating in R7) | Triggered after provider marks complete (P4) | "قيّم تجربتك مع مقدم الخدمة" |

### 🟩 Service Provider App (entirely new interface)

Given to each contracted service provider (technician, cleaning staff, event vendor, gym trainer, etc.) after the FM company onboards them (see A20).

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| P1 | Provider Login | Credentials issued by the FM office during onboarding; phone + PIN or email + password | → P2 |
| P2 | Provider Home | Toggle: "متاح لاستقبال الطلبات" (Available for Requests) on/off. Today's job summary cards (upcoming/in-progress). Earnings snapshot for the day/week | → P3, P5, P6 |
| P3 | **Incoming Job Request** (Uber-style) | Full-screen request card on match: service type icon, general area (not exact unit, for privacy, until accepted), resident's notes/photo, estimated payout, **countdown timer** (~20 sec) to respond, "قبول" / "رفض" buttons | → P4 on accept |
| P4 | Job Detail & Execution | Exact unit/location shown, chat button to resident, "بدء التنفيذ" → "تم الانتهاء" buttons, photo upload for proof-of-work; marking complete triggers resident-side R36 rating | Back to P2 |
| P5 | Job History & Earnings | Past completed jobs, earnings per job, weekly/monthly payout summary, payout status | From P2 |
| P6 | Provider Profile / Settings | Provider info, service categories offered, certifications/documents from onboarding, contact FM office | From P2 |

### 🟨 Admin Dashboard — Cycle 2 Additions

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A9 | Collection Dashboard | Real-time collection rate, overdue accounts, days-late tracking | From A2 | "معدل التحصيل: 87% - 14 حساب متأخر" |
| A10 | SLA Tracking View | Resolution time vs. SLA target, flagged breaches | From A2 | — |
| A11 | Lost & Found Moderation | Approve/remove items, resolve matches | From A2 | — |
| A13 | Gate Pass / Visitor Log | Issued QR passes, entry/exit log | From A2 | — |
| A20 | **Provider Onboarding** | Register a new service provider: name, service category/categories, contact info, contract terms, commission rate %, upload certifications/documents. On save, auto-generates the provider's P1 login credentials and shows a "share app access" step (QR code or SMS invite link to install the Provider App) | From A21 |
| A21 | **Provider Directory** (this is what A7/A12 evolve into — same directory, now fuller) | List of all onboarded providers: status (active/inactive/pending approval), service category, performance rating, jobs completed, assigned zone/compound. Click into a provider for full profile + contract details | From A2, links to A20, A22 |
| A22 | Provider Contract & Commission Settings | Per-provider commission rate, payment terms, payout schedule, contract renewal date | From A21 |
| A23 | Live Requests Monitor | Real-time view of all in-progress matching requests (request sent → providers notified → accepted → in progress → complete) — helps the FM office spot stuck/unmatched requests | From A2 |

**How matching works (for the builder's understanding, not a literal screen):**
1. Resident submits a request (R33, or routed from R5/R8/R20/R21)
2. System identifies active, available, contracted providers offering that service category within the compound's service zone
3. Resident sees a ranked list (R34) of 3-5 providers
4. Selected provider gets the request (P3) with a response countdown
5. If declined/no response, conceptually re-offers to the next provider — for the **prototype**, only the first-accept path needs to be shown; re-offer logic is a business-logic note for the real build, not something to visually prototype

**Cycle 2 Gate:** Live in ≥1 real pilot compound with real payments AND at least a mock provider-matching flow working end-to-end, before building Cycle 3.

---

## 4. CYCLE 3 — Engagement & Trust Layer

### 🟦 Resident App

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R23 | Messages / Chat with FM Office | Full two-way thread (WhatsApp replacement), read receipts | Accessible from nav bar | — |
| R24 | **Rewards Home** — direct adaptation of benchmark's Rewards screen | Full-width navy→purple gradient card, gem icon, "نقاط المكافآت" + bold number. "استبدال" section: 2×2 dark navy tiles — 🎁 بطاقة هدايا / 💳 بطاقة مسبقة الدفع / 🏠 خصم على رسوم الوحدة / ⭐ قسائم شركاء | → R25 | "5,724 نقطة" |
| R25 | Rewards — Redemption Modal | Frosted glass card, radio-button list pairing cash value + points cost | Back to R24 | "100 ج.م — 2,500 نقطة" |
| R26 | Resident Score Dashboard *(differentiator)* | Trust/score badge or progress ring, breakdown of what earned/lost points (can factor in ratings given to/from Service Provider Marketplace jobs) | Accessible from R4 | "نقاطك: 850 - مستوى: ذهبي" |
| R27 | Financial Services — Cards Stack | Fanned overlapping cards: 🟠 حماية من السرقة / 🟢 تقييم السداد (سجل سداد إيجابي يفيد عند التقدم لعقود إيجار أو تقسيط مستقبلية) / 🔵 تأمين الوحدة | Accessible from R4 or R10 | Policy numbers shown |
| R28 | Post-Ticket Satisfaction Survey | Short pulse survey triggered after ticket resolution | Auto-triggered from R7 | "كيف كانت تجربتك بشكل عام هذا الشهر؟" |

### 🟨 Admin Dashboard

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A14 | **Resident Sentiment Dashboard** — direct adaptation of benchmark's AI sentiment screen, the strongest ROI-proof screen | Top score card: large bold "4.2 / 5", subtitle "من الاستبيان العام - يوليو 2026", green trend "↑ 0.3 عن الشهر الماضي". Category breakdown cards below: category name + response count + sentiment pill (green=إيجابي / coral=سلبي) | From A2 | "الصيانة - 45 ردًا - إيجابي" / "التواصل - 38 ردًا - سلبي" |
| A15 | Resident Scoring Admin View | View/adjust scoring rules, score distribution | From A2 | — |
| A16 | Messages Admin Inbox | Manage resident chat threads, assign to staff, canned responses | From A2 | — |

**Cycle 3 Gate:** Only build once Cycle 2 shows 40%+ monthly active resident usage.

---

## 5. CYCLE 4 — Scale, Data & GCC Expansion

### 🟦 Resident App

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R29 | Cross-Compound Data Sharing Consent | Opt-in screen explaining data shared if resident moves between Jiwar-powered compounds | Standalone, triggered on move-out | Full consent language, per-country legal review required |
| R30 | Pet / Animal Management | Register pets, vaccination records, compound pet policy | Accessible from R14 (Profile) | — |
| R31 | Smart Access / IoT Control (GCC premium tier) | Smart lock/gate control, smart meter usage view | Accessible from R4 (if enabled) | — |
| R32 | Service Contract Renewal | Card per renewal option (e.g. annual FM service contract), checkbox offers (شهر مجاني من رسوم الصيانة / خصم 10% / ترقية باقة الأمن), "اختر العرض" / "التفاصيل" | Accessible from R4 → Documents | — |

### 🟨 Admin Dashboard

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A17 | Multi-Property Portfolio View | Switch between/aggregate multiple compounds under one FM company | From A2 | For FM companies managing several developments |
| A18 | Advanced Analytics / Predictive Maintenance | AI-flagged assets likely to need maintenance, portfolio benchmarking | From A2 | — |
| A19 | IoT / Smart Meter Monitoring | Utility usage dashboards per unit/compound | From A2 | — |

**Cycle 4 Gate:** Only pursue GCC expansion once Egypt has 2+ profitable reference pilots.

---

## 6. Sample Content Bank (use throughout, no English/Lorem placeholders)

- Compound name: **"حدائق الأندلس"** or **"مدينتي الجديدة"**
- Resident: **"أحمد محمود"**, unit **"فيلا 214"**
- Balance due: **"3,200 جنيه"** (Egypt) or **"1,150 ريال"** (KSA variant)
- Maintenance categories: سباكة / كهرباء / تكييف / نجارة / مناطق مشتركة
- Sample ticket: **"تسريب مياه في الحمام الرئيسي - شكوى #1042 - جاري التنفيذ"**
- Sample announcement: **"انقطاع مياه مؤقت يوم الخميس من 10 صباحًا حتى 2 ظهرًا لأعمال صيانة"**
- Rewards points balance: **"5,724 نقطة"**
- Lost & found sample: **"مفتاح سيارة - وُجد بجوار البوابة الرئيسية - أمس"**
- Sample provider: **"أحمد للصيانة - ⭐4.8 - يصل خلال 10 دقائق - 150 جنيه"**

---

## 7. Build Priority Order

**Phase A — Core loop (Cycle 1):**
1. Home Dashboard (R4) — first impression, get it pixel-polished
2. Maintenance flow (R5-R7) — core daily-use loop
3. Payments screens (R10-R11) — including the dual rent/installment logic, the key localization proof point
4. Move-in/Move-out Checklist (R12) — strong visual "wow" screen for demos
5. Admin Dashboard Home + Tickets Queue (A2-A4) — proves the ops side works

**Phase B — Service Provider Marketplace (after Phase A is solid):**
6. Resident-side request & matching flow (R33 → R34 → R35) — impressive, demo-able
7. Provider accepting and completing a job (P3 → P4) — shows the platform is genuinely two-sided
8. Admin onboarding a provider (A20/A21) — completes the story of how providers get into the system
9. Skip P5, P6, A22, A23 for the first prototype pass — mention them only so the navigation leaves room

**Do not build in the first pass:** anything under Cycles 3-4 (Rewards, Sentiment Dashboard, Scoring, Pets, IoT, etc.) — they're documented here so the navigation/architecture leaves room for them, not for this prototype round.

---

## 8. One-Line Instruction to Paste Into Claude Design

*"Build a clickable high-fidelity mobile prototype for a resident-experience app called Jiwar (جوار), including its Service Provider Marketplace (Uber-style matching) and a separate Service Provider App, using the design system and screen list in this document. RTL Arabic layout throughout. Follow the priority order in Section 7 — start with the Home Dashboard (R4), then the core Cycle 1 loop, then the Provider Marketplace flow (R33-R36, P3-P4, A20-A21). Cycles 3-4 are for context only, not to be built now."*
