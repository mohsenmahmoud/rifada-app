# Jiwar (جوار) — Addendum Build Spec: Gate Access + Local Marketplace + On-Demand Services

**This is an ADDENDUM, not a replacement.** It builds on top of the existing `Jiwar_Prototype_Build_Spec.md` (the master file with the visual design system, Cycle 1–4 screen maps R1–R32 for Resident App and A1–A19 for Admin Dashboard). Read that file first for brand identity, colors, typography, and navigation patterns — this file reuses all of it and only adds new screens and one new app track.

Do not renumber or touch any existing screen (R1–R32, A1–A19). All new screens use fresh IDs starting at R33 and A20, plus a brand-new track: **🟩 Service Provider App** (P1+), since two of the three new features require a vendor-facing side that didn't exist before.

---

## 0. What's being added and why

Based on a teardown of a live competitor (TMG Life — the in-house app of Egypt's largest private real estate developer, used across Madinaty/Al Rehab/Privado), three gaps were identified in Jiwar's current scope:

1. **Gate Access & Guest Invitations** — QR/Bluetooth entry + guest passes with expiry. This is the single highest-frequency-use feature in the category: it's the reason someone opens the app on a random Tuesday, not just when something breaks or a bill is due. **Move this into Cycle 1**, it should not wait for Cycle 4's IoT-premium tier — that's a different, heavier feature (actual smart lock hardware integration for GCC). This is software-only (dynamic QR + time-boxed access codes handed to the existing gate security guard's scanner or logged manually), so it's buildable now.
2. **Local Marketplace / Discover** — a directory of nearby external merchants (cafés, groceries, banks, clinics, restaurants) with promos/discount codes. Converts the app from "complaint tool" into "daily life tool," and opens a listing-fee/commission revenue line.
3. **On-Demand Home Services Marketplace** — instant-book, fixed-price services (AC servicing, car wash, home cleaning, electrician) fulfilled by third-party vendors — distinct from the existing Maintenance ticket flow (R5–R7), which is a complaint/repair ticket against the FM office, not a paid consumer booking. This needs a vendor-facing app to receive and fulfill jobs, hence the new **Service Provider** track.

**Cycle placement:**
- Gate Access → **Cycle 1** (core loop, ship with the investor demo)
- Local Marketplace/Discover → **Cycle 2** (expansion, once Cycle 1 shows usage)
- On-Demand Services Marketplace (+ Service Provider app) → **Cycle 2**, gated on securing 3–5 vendor partners per category before launch (don't launch an empty marketplace)

---

## 1. 🟦 Resident App — New Screens

### 1.1 Gate Access & Guest Invitations (Cycle 1)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R33 | Gate Access Home | My personal QR code (auto-refreshing every 60s for security), "Enable Bluetooth Entry" toggle, shortcut to invite a guest | Accessible from R4 (add new icon to quick-access grid) | "كود الدخول الخاص بك" with live QR |
| R34 | Invite Guest — Create | Guest name/phone (optional), select which gate/entrance, visit date + time window, single-use vs. recurring (e.g. weekly cleaner) | → R35 | "دعوة لأحمد سالم - بوابة 3 - اليوم 5-8 مساءً" |
| R35 | Invite Guest — Share & Track | Generated guest QR/link to share via WhatsApp/SMS, countdown to expiry (default 24h, adjustable for recurring), status (لم يُستخدم بعد / تم الدخول الساعة 6:15) | Back to R33 | "دعوتك صالحة حتى الساعة 8:00 مساءً" |
| R36 | Invitation Quota & History | Monthly invitation limit per unit (e.g. 10/month, FM-configurable), used/remaining count, full history log with entry timestamps | Accessible from R33 | "الدعوات المتبقية هذا الشهر: 7/10" |

**Security/legal note for Claude Design to flag in UI copy:** entries should log guest name + timestamp + gate for the resident's own review; actual gate hardware integration (turnstile/camera) is a separate Cycle 4 IoT item — for Cycle 1, assume a guard scans the QR with the existing manual/basic scanner or the FM office monitors entries via the Admin dashboard (see A20).

### 1.2 Local Marketplace / Discover (Cycle 2)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R37 | Discover — Home | Category grid (قهاوي / بقالة / مطاعم / بنوك / عيادات / صيدليات), "قريب مني" distance sort, featured promo banner carousel | New tab in bottom nav (Discover) | "عرض خاص: خصم 10% في مقهى XYZ" |
| R38 | Discover — Category List | List/map toggle of merchants in category, rating, distance, open/closed status | → R39 | "مقهى الجيران - 350م - مفتوح حتى 12 منتصف الليل" |
| R39 | Merchant Detail | Photos, description, offers/discount codes specific to Jiwar residents, contact/directions, "احصل على الكود" button | Back to R38 | "كود الخصم: JIWAR10 - صالح حتى 30 يوليو" |
| R40 | Community Announcements Feed — Promos Sub-tab | Merges merchant promos into the existing announcements feed (R13) as a filterable sub-tab so residents see FM notices and local deals in one place | Extends R13 | — |

### 1.3 On-Demand Home Services Marketplace (Cycle 2)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| R41 | Services Marketplace — Home | Distinct from Maintenance (R5): categories are paid instant-book services (تكييف / غسيل سيارات / تنظيف منزلي / كهربائي / سباك), fixed price shown upfront, "احجز الآن" | New icon on R4 quick-access grid, separate from "صيانة" | "تنظيف منزلي شامل - يبدأ من 350 جنيه" |
| R42 | Service Detail & Slot Selection | Vendor name/rating (pulled from Service Provider ratings, see P13), price breakdown, available time slots, add-ons | → R43 | "غسيل سيارة خارجي وداخلي - 45 دقيقة - 150 جنيه" |
| R43 | Booking Confirmation & Payment | Order summary, payment method (wallet/card, reuse R11 payment flow), confirm | → R44 | "تم تأكيد حجزك، الفني في الطريق" |
| R44 | Booking Status & Rating | Live status (تم القبول / الفني في الطريق / جاري التنفيذ / مكتمل), post-completion 5-star rating + tip option, receipt | Accessible from R4 "My Bookings" | "قيّم تجربتك مع الفني - أحمد" |

---

## 2. 🟩 Service Provider App — New Track (Cycle 2)

A lightweight mobile app (or responsive web app for MVP) for the vendors fulfilling On-Demand Services jobs. Visually: reuse Jiwar's design system but treat it like the Admin dashboard — functional/utilitarian, navy + white, minimal ornamentation.

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| P1 | Vendor Onboarding — Registration | Business name, service category, phone/email, national ID upload, service area (which compounds they cover) | → P2 | "اسم النشاط: الفنون لخدمات التكييف" |
| P2 | Vendor Onboarding — Verification (Admin-approved) | Pending review status screen; documents submitted (تراخيص/سجل تجاري إن وجد), can't go live until Admin approves (see A24) | → P3 once approved | "طلبك قيد المراجعة من إدارة جوار" |
| P3 | Pricing & Availability Setup | Set fixed prices per service type, working hours, blackout dates | → P4 | "تنظيف منزلي - 350 جنيه - ساعتين" |
| P4 | Job Queue — Incoming Requests | New booking requests with accept/decline, countdown timer to respond (e.g. 5 min) | → P5 on accept | "طلب جديد: تنظيف منزلي - فيلا 214 - اليوم 4 عصرًا" |
| P5 | Job Detail — In Progress | Resident contact (masked number via app), unit/gate access note (auto-generated guest pass, links to R34 logic so the vendor gets a time-boxed gate QR automatically), navigation, "بدء الخدمة" / "إنهاء الخدمة" buttons | → P6 | Auto-generated entry pass shown here for the vendor to present at the gate |
| P6 | Job Completion — Proof & Payout Trigger | Before/after photo upload (optional per category), resident e-signature or one-tap confirmation, triggers payout | → P7 | "أرفق صورة بعد الانتهاء" |
| P7 | Earnings Dashboard | Daily/weekly/monthly earnings, pending vs. paid-out, commission deducted (Jiwar's cut, e.g. 15-20%) shown transparently | Accessible from bottom nav | "إجمالي هذا الأسبوع: 4,200 جنيه (بعد خصم عمولة جوار 15%)" |
| P8 | Payout / Bank Details | Bank account or mobile wallet for payout, payout schedule (weekly), transaction history | Accessible from P7 | — |
| P9 | Ratings & Reviews | List of resident ratings/comments per completed job, average score, flagged low ratings for improvement | Accessible from bottom nav | "4.8 ⭐ (32 تقييم)" |

---

## 3. 🟨 Admin Dashboard — New Screens

### 3.1 Gate Access Management (Cycle 1)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A20 | Gate Access Overview | Live feed of today's entries/guest passes across all units, filter by gate/unit/status | From A2 | "فيلا 214 - دعوة أحمد سالم - دخل الساعة 6:15" |
| A21 | Guest Pass Config | Set per-unit monthly invitation quota (default + overrides), pass expiry duration rules | From A20 | "الحد الافتراضي: 10 دعوات/شهر" |
| A22 | Security Log & Export | Full historical entry log, exportable (CSV) for compound security office, flagged anomalies (e.g. same guest QR scanned twice) | From A20 | — |

### 3.2 Local Marketplace Management (Cycle 2)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A23 | Merchant Directory Admin | Add/edit/remove local merchants, category assignment, approve submitted promo codes | From A2 | — |
| A24 | Merchant Performance | Views, code redemptions, resident engagement per merchant — used to justify/negotiate listing fees | From A23 | "مقهى الجيران - 240 مشاهدة - 38 استخدام كود هذا الشهر" |

### 3.3 On-Demand Services & Vendor Management (Cycle 2)

| # | Screen | Purpose & Key Elements | Navigation | Sample Content |
|---|--------|------------------------|------------|-----------------|
| A25 | Vendor Applications Queue | Review pending Service Provider registrations (P2), approve/reject with document check | From A2 | "طلب جديد: الفنون لخدمات التكييف - قيد المراجعة" |
| A26 | Active Vendor Roster | All approved vendors per category/compound, status (نشط/موقوف), performance snapshot (rating, completed jobs) | From A25 | — |
| A27 | Services Marketplace Analytics | Booking volume by category, revenue/commission earned, category gaps (e.g. no vendor for "سباكة" in this compound yet) | From A2 | — |
| A28 | Commission & Payout Ledger | Reconciliation view of all vendor payouts vs. commission retained, dispute flags | From A27 | — |

---

## 4. Updated Sample Content Bank (additions only)

- Guest names: **"أحمد سالم"**, **"سارة عبد الله"** (cleaner, recurring weekly pass)
- Gate names: **"بوابة 1 - الرئيسية"**, **"بوابة 3 - الخدمات"**
- Merchant names: **"مقهى الجيران"**, **"سوبر ماركت الأندلس"**, **"صيدلية النور"**
- Promo code format: **"JIWAR10"**, **"JIWAR-CAFE20"**
- Vendor business names: **"الفنون لخدمات التكييف"**, **"لمعة لتنظيف السيارات"**, **"سريع لخدمات الكهرباء"**
- Commission rate: **15%** (adjust per your actual pricing model before investor deck)
- Sample job: **"تنظيف منزلي شامل - فيلا 214 - 350 جنيه - الفني: محمد رضا"**

---

## 5. Build Priority Order (for this addendum)

1. **R33–R36 (Gate Access, Resident)** — highest daily-engagement payoff, ship in Cycle 1 alongside the existing core loop
2. **A20–A22 (Gate Access, Admin)** — needed in parallel so FM offices can actually operate the feature
3. **R41–R44 + P1–P9 (On-Demand Services + Service Provider app)** — Cycle 2, but *only after* 3-5 vendors per category are lined up per compound (don't launch an empty marketplace — same validation-gate philosophy as the rest of the master spec)
4. **A25–A28 (Vendor management, Admin)** — build alongside #3, it's the operational backbone for it
5. **R37–R40 + A23–A24 (Local Marketplace/Discover)** — lowest urgency of the three; nice engagement layer but no hard dependency on other systems, can slot in whenever

---

## 6. Note for whoever opens this in Claude Design

Attach this file **together with** the existing `Jiwar_Prototype_Build_Spec.md` in the same message. This file assumes the design system, color palette, and screen patterns from that master file are already established — it does not redefine them. If starting a brand-new Claude Design session, paste both files and say: *"ده امتداد للمنتج الموجود، ضيف الشاشات دي فوق اللي اتبني قبل كده من غير ما تغيّر في التصميم الأساسي أو نظام الألوان."*
