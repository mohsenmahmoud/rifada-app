# Jiwar (جوار) — Feature Correction: Unified "Shop" Section (Design Consistency Fix)

**This document does two things: (1) broadens the earlier "Food & Pharmacy" feature into one unified "المتجر" (Shop) section covering ANY provider that sells orderable items, and (2) corrects a design-consistency problem — the Shop section as currently built looks visually disconnected from the rest of the app (different icon style, inconsistent components). This is a CORRECTIVE instruction for that section specifically, not a purely additive one.**

---

## 1. What Changes Conceptually: One Unified "Shop" (المتجر), Not Separate Silos

Previously specified as "R46 Food & Pharmacy — Browse" with two fixed category tabs (Restaurants / Pharmacies). **Replace that framing** with a single, unified Shop section that can hold **any number of provider categories**, not just two — any service provider onboarded through the existing Provider Onboarding flow (A20/A29) who sells discrete, orderable items (not a scheduled job like maintenance) plugs into this same Shop experience. Categories are dynamic based on what providers the FM office has actually onboarded, for example:

- 🍽️ مطاعم (Restaurants)
- 💊 صيدليات (Pharmacies)
- 🛒 بقالة وسوبر ماركت (Grocery/Mini-market)
- 💐 ورد وهدايا (Flowers & Gifts)
- 🧴 أي مقدم خدمة آخر يبيع منتجات (any other product-selling provider)

**All of these share the exact same underlying flow** (browse store → menu/catalog → cart → checkout → order tracking) — this is one system with dynamic categories, not five separate features.

### Renamed/Restructured Screens (same screen IDs, updated scope)

| # | Screen | Updated Purpose |
|---|--------|------------------|
| R46 | **Shop Home** (was "Food & Pharmacy — Browse") | Top: horizontal scrollable category tabs, pulled dynamically from onboarded provider categories (not hardcoded to 2). Below: store cards for the selected category — logo, rating, estimated delivery time, open/closed status |
| R47 | **Store Catalog/Menu** (unchanged in function) | Works identically for a restaurant's food menu, a pharmacy's product list, or a grocery store's catalog — same layout, same components |
| R48 | Cart & Checkout | Unchanged |
| R49 | Order Tracking | Unchanged |
| R50 | Order History & Reorder | Unchanged |

On the Provider/Admin side, **A29 (Onboarding)** should include a "نوع مقدم الخدمة" (Provider Type) field with an open-ended category tag, not a fixed dropdown of just "Restaurant" or "Pharmacy" — so the FM office can onboard any future shop-style provider without needing a code change.

---

## 2. Design Consistency Fix (the actual problem to solve)

**The Shop section currently looks visually disconnected from the rest of the app** — inconsistent icon style and design choices compared to Home, Maintenance, Payments, etc. Fix this by strictly re-applying the same design system already established for the whole app. **Do not introduce any new colors, icon style, or component style specific to the Shop section.**

Restating the system explicitly here so there's no ambiguity:

| Element | Rule (apply exactly, no exceptions for Shop) |
|---|---|
| Icons | Thin line-style, 1.5px stroke, monochrome navy (`#1F3B57`) or slate gray (`#6B7280`) — **never** filled, colorful, or illustrative icons, even for food/product categories. A restaurant icon should be the same thin-line style as the maintenance wrench icon elsewhere in the app |
| Cards | White fill, 18-20px corner radius, soft shadow `0 2px 12px rgba(0,0,0,0.06)`, no borders — store cards and menu-item cards must match this exactly, same as every other card in the app (ticket cards, amenity cards, etc.) |
| Primary buttons | Solid navy pill, white text — "أضف للسلة" / "تأكيد الطلب" buttons must be the same pill shape and navy fill as "ادفع الآن" elsewhere, not a different color (e.g. not orange/red just because food apps conventionally use warm colors) |
| Category tabs | Same tab/segmented-control style already used in R12 (Move Checklist's "Before Your Move / Move-In / Move-Out" tabs) — reuse that exact component, don't invent a new tab style |
| Typography | Cairo/IBM Plex Sans Arabic, same weights and sizes as the rest of the app — store names and menu items are not an excuse for a different, more "food-app-like" font |
| Background | Warm Off-White `#F7F4EE`, same as every other screen — not white, not a different shade |
| Status pills (order tracking) | Same pill style as maintenance ticket status (R6): gray/gold/green fill logic, reused exactly for تم الاستلام / قيد التحضير / في الطريق / تم التوصيل |

**On the Talabat reference specifically:** that reference should only ever have informed the **interaction pattern** — the idea of browsing a store, adding items to a cart, checking out, tracking delivery. It should never have influenced **visual style** (colors, icon treatment, card design). Talabat's own bold red/orange branding, food-photography-heavy layout, and icon style must not carry over — the Shop section needs to look like it was designed by the same team, in the same sitting, as the Home screen and every other screen in Jiwar.

**Action required:** review every screen in the current Shop section (R46-R50) and the provider-side menu management screen (P9), and rebuild the visual layer to match the table above — the underlying data/flow logic (categories, cart, checkout, order status) can stay as already built; only the visual design needs correcting.

## 2.5 Layout Reference for R46 (Shop Home) — Analyzed from Your Reference Image

The reference screenshot you shared (a food/deals app) is useful for its **layout structure**, not its colors or branding — apply the structure below, but entirely in Jiwar's own navy/gold/off-white system, not the reference's orange/peach palette.

**What to take from the reference (structure only):**
- **Top search/location bar:** a search field plus a location/address selector next to it — for Jiwar, this becomes: search field + "التوصيل إلى: وحدة 214" (Delivery to: Unit 214), since the delivery address is always the resident's own unit, not a manually-picked address
- **Circular category icon row** right below the search bar — a horizontal row of small circular icons (each a category: burgers, drinks, groceries, etc. in the reference). For Jiwar: same circular-icon-row layout, but icons must follow Jiwar's thin-line monochrome style (Section 2's rules), not the reference's colorful filled icons — e.g. 🍽️ مطاعم / 💊 صيدليات / 🛒 بقالة / 💐 هدايا, each in a simple navy-outlined circle, not a colorful illustrated icon
- **"Nearest to you" style section header** above a vertical list of store cards — for Jiwar: "الأقرب لك" or simply the category name once a tab is selected
- **Store card anatomy** (this part translates well): store photo/logo on one side, store name, a rating or delivery-time indicator, and an optional discount/offer badge — keep this same card anatomy, but styled with Jiwar's white card + soft shadow + 18-20px radius (Section 2's table), not the reference's colorful discount-badge treatment. A discount badge, if used, should be a small gold (`#C79A3C`) pill, not a bright red/orange starburst shape

**What NOT to take from the reference:** the orange/peach brand color, the bold condensed display typography used in its marketing screen, the colorful filled category icons, and the star-shaped/high-contrast discount badges. None of this should appear in Jiwar — it's a layout-structure reference only, same principle as the Talabat reference in Section 2.



*"Two changes to the Shop section you already built: (1) broaden it conceptually from just 'Food & Pharmacy' into one unified Shop (المتجر) with dynamic categories — any product-selling provider plugs into the same flow, not just restaurants and pharmacies; (2) the Shop section's visual design currently looks inconsistent with the rest of the app — redesign it to strictly match the existing design system (Deep Navy #1F3B57, Warm Gold #C79A3C, thin line-style monochrome icons, white cards with 18-20px radius and soft shadow, same pill buttons and tab component used elsewhere in the app). Two references were given for interaction/layout patterns only, never for visual style: Talabat (browse → cart → checkout → tracking flow) and a food-deals app screenshot (search+location bar, circular category icon row, store card anatomy with a discount badge) — see Section 2.5 for exactly what layout structure to keep and what colors/icon styles to discard. Keep the underlying cart/order logic as already built; only fix the visual layer."*
