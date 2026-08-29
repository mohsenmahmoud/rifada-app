# Jiwar (جوار) — Service Provider Marketplace: Full Feature Spec (Business Model + Trust Layer + Screens)

**Purpose:** this document expands the Service Provider Marketplace feature (already summarized in `Jiwar_Master_Build_Spec.md`, Cycle 2) into its full business-model logic: how it reduces the FM company's operational workload, how Jiwar earns money as the trusted middleman (the "Uber model"), the trust/safety mechanics that make residents feel safe using a stranger for maintenance/services, and every screen needed to support it.

**How to use this with the existing prototype:** this is an ADDITIVE deepening of the same feature already introduced — it does not change anything already built. Where a screen already exists (R33-R36, P1-P6, A20-A23), this document adds detail to it; where a screen is new, it's marked **[NEW]**.

---

## 1. The Business Logic — Why This Feature Matters (Not Just UI)

Jiwar's role here is the same as Uber's: **a trusted, insured, rated middleman between someone who needs a service and someone who provides it** — never doing the work itself, but making the transaction safe enough that a resident is comfortable letting a stranger into their home, and profitable enough that Jiwar earns a cut of every job without employing a single technician.

This delivers two distinct wins to the two different customers:

**For the FM company / developer (the paying B2B customer):**
- Every service category routed through the marketplace (maintenance execution, cleaning, event staffing, personal training, etc.) is **one less thing their own staff has to schedule, supervise, or field complaints about**. The FM office's job shifts from "do the work" to "oversee the quality dashboard" (A25/A26) — a large operational cost reduction, especially valuable for categories they currently have to hire and manage in-house.
- The FM company can **choose, category by category**, what stays in-house vs. what gets outsourced to the marketplace (A27) — so adoption can be gradual and low-risk, starting with 1-2 categories (e.g. AC servicing, cleaning) before expanding.
- The FM company can optionally receive a **revenue share of the commission** on jobs happening in their compound (configurable in A22) — turning what used to be a pure cost center (maintenance coordination) into a small new revenue line for them too, which is a strong incentive to adopt the feature.

**For Jiwar/BonTech (the platform):**
- A **commission (take-rate) on every completed job** — this was already identified in the original BRD as one of the five monetization streams, and this feature is what actually generates it.
- Because Jiwar holds the resident's payment until the job is confirmed complete (the escrow model, Section 3), Jiwar effectively controls the money flow for every transaction on the platform — a much stronger monetization position than just charging a flat SaaS fee.

---

## 2. Money Flow (Escrow Model — the Uber Mechanic)

This is the core trust mechanic and must be reflected visually in the screens, not just explained in a document:

1. Resident selects a provider (R34) and the estimated price is shown upfront
2. When the resident confirms, **the payment is captured immediately but held by Jiwar, not released to the provider yet** — shown to the resident as "المبلغ محجوز حتى اكتمال الخدمة" (Amount held until service is complete)
3. Provider completes the job and marks it done (P4)
4. Resident confirms completion and rates the provider (R36)
5. **Only after resident confirmation does Jiwar release the payment to the provider, minus Jiwar's commission** (e.g. 15-20%, configurable per category in A22)
6. If the resident disputes the job instead of confirming (R38), the payment stays frozen until an admin resolves it (A26) — refund to resident, partial release, or full release to provider

This escrow mechanic is exactly why residents can trust a stranger showing up at their door: **the provider only gets paid if the resident is satisfied**, and Jiwar — not the provider directly — is the one holding and controlling the money the whole time.

---

## 3. Trust & Safety Layer (What Makes a Resident Comfortable Using This)

- **Provider verification before activation:** every provider must be vetted before their account goes live (A24) — ID verification, certifications/licenses (for skilled trades), and optionally a background check for categories that involve entering a home unsupervised
- **Visible trust signals on every provider card** (R34): star rating, number of completed jobs, verification badge ("موثّق ✓")
- **In-app tracking & chat only** — resident and provider never need to exchange personal phone numbers; all communication happens inside the app (R35's chat, same pattern as ride-hailing apps), which protects resident privacy and keeps a record in case of disputes
- **Rating is two-way** — providers also rate residents (e.g. for access/property condition), which over time helps flag consistently problematic residents or providers, tied into the broader Resident/Provider Scoring concept already in Cycle 3 (R26)
- **Dispute resolution safety net** (R38 resident-side, P8 provider-side, A26 admin-side) — either party can flag a problem, which freezes the escrowed payment until the FM office resolves it

---

## 4. Admin Workload & Revenue Control Tools **[NEW screens]**

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A24 | **Provider Verification & Vetting** [NEW] | Checklist per pending provider: ID verified ✓/✗, certifications uploaded & reviewed, optional background-check status, "تفعيل الحساب" (Activate Account) button only enabled once all required checks pass | From A21 |
| A25 | **Commission & Revenue Analytics Dashboard** [NEW] | Total commission earned this month, breakdown by service category and by provider, trend chart over time, average job value — this is the screen that proves the marketplace is a real revenue line, useful for investor updates too | From A2 |
| A26 | **Dispute Resolution Center** [NEW] | Queue of open disputes (resident-reported or provider-reported), full job details + photos + chat log, resolution actions: "استرداد كامل للساكن" (Full Refund) / "دفع جزئي" (Partial Release) / "دفع كامل لمقدم الخدمة" (Full Release), plus ability to suspend a provider's account from here | From A2, or from a flagged item in A23 |
| A27 | **Service Category Sourcing Settings** [NEW] | Per service category (صيانة تكييف، تنظيف، فعاليات، تدريب...), a toggle: "تدار داخليًا بواسطة فريق المجمع" (Handled In-House) vs. "متاحة عبر سوق مقدمي الخدمة" (Outsourced to Marketplace) — this is the exact control that lets the FM company gradually shift workload off their own staff, category by category, at their own pace | From A2 |

---

## 5. Resident App — Trust & Escrow Screens **[NEW, extend R33-R36]**

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R37 | **Payment Hold / Escrow Status** [NEW] | Shown right after confirming a provider in R34: "تم حجز 150 جنيه - سيتم تحويلها لمقدم الخدمة بعد تأكيدك اكتمال المهمة" (150 EGP held — will transfer to the provider once you confirm completion). Builds the core trust message explicitly, not just implicitly | Sits between R34 and R35 |
| R38 | **Report an Issue / Dispute** [NEW] | Triggered from R35 or R36 instead of confirming/rating normally: reason selector (لم يكتمل العمل / جودة رديئة / لم يحضر مقدم الخدمة / أخرى), photo upload, description, submit → freezes payment, routes to A26 | From R35/R36 |

---

## 6. Provider App — Payout Visibility **[NEW, extend P1-P6]**

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| P7 | **Payout Status per Job** [NEW] | After marking a job complete (P4): "بانتظار تأكيد الساكن" (Awaiting Resident Confirmation) status, then updates to "تم التحويل - 127.50 جنيه (بعد خصم عمولة 15%)" (Transferred — 127.50 EGP after 15% commission) once released | From P4, feeds into P5 |
| P8 | **Report an Issue** [NEW] | Provider-side dispute flag (e.g. resident not present, unsafe conditions, non-payment concern) — routes to A26 same as R38 | From P4 |

---

## 7. Updated Priority Order for This Feature

Building on top of the Phase B order already in the master spec:

1. R34 (Matching) → **R37 (Escrow hold message)** → R35 (live status) — get the trust messaging visually right here, it's the single most important UX moment for resident confidence
2. P3 → P4 → **P7 (Payout status)** — proves the two-sided platform to a provider
3. R36 (rating) — with a visible branch to **R38 (dispute)** as the alternative path
4. **A27 (Sourcing Settings)** — this is genuinely a strong screen to show investors: it's the literal control that proves "the FM company can offload work to us, category by category"
5. **A25 (Revenue Analytics)** — the second-strongest investor screen: shows the commission model is real and measurable
6. A24 (Verification) and A26 (Dispute Resolution) — build these last; they matter operationally but aren't needed for a first investor-facing demo

---

## 8. One-Line Instruction to Paste Into Claude Design

*"This document deepens the Service Provider Marketplace feature already in Jiwar_Master_Build_Spec.md — add the escrow/trust screens (R37, R38, P7, P8) and the admin control screens (A24-A27) on top of what's already built (R33-R36, P1-P6, A20-A23). Do not change any existing screen's design; only add these new ones and the payment-hold messaging described in Section 5. Follow the priority order in Section 7."*
