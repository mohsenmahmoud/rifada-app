# Jiwar (جوار) — Feature Addendum: فواتيري (My Bills) — Utility & Recurring Bill Payment Hub

**This is an ADDITIVE document.** Hand it alongside the other Jiwar spec files. Nothing here changes any screen already built. It adds one new capability: a bill-payment hub where the resident links and pays personal recurring bills (electricity, gas, water, internet, and others) directly inside the app — separate from the compound's own service-charge/installment payments already covered by R10 (Payments).

**Important distinction from R10:** R10/R11 (existing Payments screens) handle what the resident owes **to the FM office/developer** — service charges, installments, or rent. This new **فواتيري (Fawateery)** feature handles what the resident owes to **external utility and service companies** — their electricity meter, water meter, gas subscription, internet/mobile provider, etc. These are two conceptually different money flows and should stay visually/functionally separate, even though both live under the same app.

**Business value (why this matters beyond convenience):** this is the single strongest feature for turning Jiwar into a daily-use app rather than one residents only open when something's wrong. People check and pay utility bills monthly at minimum, often more — this drives repeat engagement far more than maintenance tickets do. It also opens a **new revenue stream**: a small convenience/transaction fee per bill payment (the same model Fawry and similar bill-aggregator services already use in Egypt), on top of the four monetization streams already identified in the original BRD.

---

## 1. Resident App — New Screens

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| R51 | **فواتيري — Home** [NEW] | Grid/list of bill categories: ⚡ كهرباء (Electricity) / 🔥 غاز (Gas) / 💧 مياه (Water) / 🌐 إنترنت واتصالات (Internet & Telecom) / 🧾 أخرى (Other). Each linked bill shows as a card: provider logo/name, current amount due (if known), due date, status pill (مستحق / مدفوع / متأخر). Unlinked categories show a "+ ربط فاتورة" (Link a Bill) prompt instead | → R52 (to link new) or → R53 (existing linked bill) |
| R52 | **Link a New Bill** [NEW] | Category already selected from R51, then: provider/company selector (e.g. لشركة الكهرباء: الشركة القابضة لكهرباء مصر; لشركة الإنترنت: WE / Orange / Vodafone / Etisalat, etc. — list varies by country/category), then a field for the account/meter/subscriber number, "ربط" (Link) confirm button | Back to R51 on success |
| R53 | **Bill Detail & Pay** [NEW] | For a linked bill: itemized current bill (consumption breakdown if the provider supplies it, e.g. kWh used for electricity), amount due, due date, gold "ادفع الآن" pill button — reuses the same Pay Now / payment-method components already built for R11 | → R11-style payment confirmation |
| R54 | **Bill Payment History** [NEW] | Past payments across all linked bills, filterable by category, downloadable receipts | Accessible from R51 |
| R55 | **Bill Autopay Settings** [NEW] | Per linked bill, toggle recurring autopay on/off, set a spending cap/alert threshold (e.g. "نبهني إذا تجاوزت الفاتورة 500 جنيه") | From R53 |

**Where this lives in navigation:** add "فواتيري" as a new item in the Home Dashboard's icon grid (R4). Since the grid is already fairly full (10 items across 5 rows), either (a) add an 11th item and let the grid scroll, or (b) promote فواتيري to a more prominent position given its expected daily-use frequency — recommend option (b): place it as the second item in row 1, next to الصيانة, since bill-checking will likely become one of the most frequent actions in the app.

---

## 2. Admin Dashboard — New Screen

| # | Screen | Purpose & Key Elements | Navigation |
|---|--------|------------------------|------------|
| A31 | **Bill Aggregator Settings** [NEW] | FM office configures which bill categories and specific providers are available for residents to link, per compound/country (e.g. Egypt: كهرباء مصر, مياه, غاز مصر, WE/Orange/Vodafone/Etisalat; KSA: SEC, National Water Company, STC/Mobily/Zain). Also shows aggregate transaction-fee revenue from bill payments, similar in spirit to A25's commission analytics | From A2 |

---

## 3. Technical/Partnership Note (for context, not a screen)

This feature requires integrating with a bill-aggregation payment partner rather than each utility company individually — the same approach Fawry, Meeza, or Paymob's bill-payment products already use in Egypt, or similar aggregators in the Gulf (e.g. SADAD in Saudi Arabia). Jiwar should plug into one of these existing aggregators rather than building direct integrations with every electricity/water/gas/telecom company — this is a partnership decision for the real build, not something the prototype needs to solve, but worth noting so the UI correctly implies "connected via a payment partner" rather than a direct utility-company API.

---

## 4. Design Consistency Note

Follow the exact same design system already established (Deep Navy `#1F3B57`, Warm Gold `#C79A3C`, thin line-style monochrome icons, white cards with 18-20px radius and soft shadow, same pill buttons). Bill category icons (⚡🔥💧🌐) should be simple thin-line icons in navy, consistent with every other icon in the app — same rule already given for the Shop section's icons.

---

## 5. One-Line Instruction to Paste Into Claude Design

*"Add a new 'فواتيري' (My Bills) section on top of the existing Jiwar prototype, without changing any screen already built: a hub where residents link and pay personal utility/recurring bills (electricity, gas, water, internet, other) — separate from the existing compound Payments section (R10), which only handles service charges/installments owed to the FM office. New screens: R51 (Bills Home), R52 (Link a New Bill), R53 (Bill Detail & Pay, reusing existing payment components from R11), R54 (Payment History), R55 (Autopay Settings), plus A31 (admin bill-provider configuration). Add 'فواتيري' as a new icon in the Home Dashboard's grid (R4), positioned prominently given its expected daily-use frequency. Use the exact same design system as the rest of the app — no new colors or icon styles."*
