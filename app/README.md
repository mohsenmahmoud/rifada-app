# رفادة / Rifada — interactive prototype

A React + Vite + TypeScript port of the Claude Design prototypes in `../project`:
the resident app, the service-provider app, and the operator console.
Front-end only — every screen is driven by mock data in `src/*/data*`, there is
no backend.

**Live:** https://mohsenmahmoud.github.io/rifada-app/

```bash
npm install
npm run dev        # http://localhost:5173/rifada-app/
npm run build      # type-checks, then bundles to dist/
npm run preview    # serve the production build
```

## The three interfaces

The toolbar switches between them, and each has two modes: a live interactive
frame, and a gallery where every screen renders in full (tap a tile to open it).

| | source prototype | screens |
| --- | --- | --- |
| تطبيق الساكن | `Jiwar Phone Pub.dc.html` / `Rifada Phone EN.dc.html` | 81 registered, 106 tiles in the gallery |
| مقدم الخدمة | `Jiwar Provider.dc.html` | P1–P11, 8 in the gallery |
| لوحة الإدارة | `Jiwar Admin.dc.html` | A1–A39, 29 sections, 30 in the gallery |

The resident and provider apps run in an iOS frame at 402×874. The admin console
is a desktop app at 1360×940, so its gallery uses laptop-shaped tiles.

The resident gallery holds more tiles than there are screens, because a tile can
pin the app to a named starting state — `data/scenarios.ts`, the design's own
`SCEN` table. That is how the ticket appears at each of its three statuses, the
cart full and empty, and the group seen as a stranger, a pending applicant, a
member and its organiser.

## Bilingual

Ported from `Rifada App Bilingual.dc.html`. The AR/EN switch sits in the toolbar,
and the resident app has a second switch inside its settings screen (the design
turned that chip from a label into a real button). Switching flips the document
and every app root between `rtl` and `ltr`.

`src/i18n/dict.ts` holds ~2,490 entries in two blocks:

- **`design`** — 1,471 entries lifted from the product's own English prototype.
  `Rifada Phone EN.dc.html` and `Jiwar Phone Pub.dc.html` are the same file with
  the strings swapped, so aligning them line-by-line recovers the product's
  wording rather than a translation of it.
- **`authored`** — everything else. The provider and admin consoles have no
  English prototype, so that wording is the port's own and **is worth a review
  pass**, particularly the financial and governance terms: escrow release,
  commission split, collections, SLA breach, audit log, trust tiers.

The lookup is keyed on the Arabic string itself rather than on invented message
ids, so a screen still reads `{t('الرئيسية')}` and the data modules never had to
change — a label from `data/services.ts` resolves through the same table as one
written inline. An unknown string falls through to Arabic rather than vanishing.

`t` is a plain function over a module-level language, not a hook — that avoids
threading a `useT()` line through ~90 components. `App` consumes the language
context directly and nothing below it is memoised, so a switch re-renders the
whole tree and every `t()` call re-evaluates.

`LangProvider` deliberately does **not** key its subtree on the language. Doing
so would also re-run every `t()`, but by remounting — which threw away all the
state below it, so switching language bounced you out of the screen gallery and
back to the phone. The flip side is that nothing may cache a translation across
renders: no module constant and no state initialiser calls `t()`, they hold the
raw Arabic and translate at the render site.

Three strings deliberately stay Arabic because they carry logic, not display
text: the `PostTag` union in Community, the availability comparisons in Sharing,
and the `sourcing` keys in the admin store. Each is commented in place.

## Layout

```
src/
  i18n/               dict.ts (the AR→EN table) + lang.tsx (provider, t, dir)
  theme/tokens.ts     palette, type, radii, shadows — lifted from the prototypes
  ui/                 Icon, PhoneFrame, and the shared mobile primitives
  resident/           store.tsx + data/ + screens/  (typed screen registry)
  provider/           data.ts + ProviderApp.tsx     (technician and store faces)
  admin/              store.tsx + data.ts + ui.tsx + sections/ + AdminConsole.tsx
  App.tsx             interface switcher, mode switcher, shared Gallery
```

Each app keeps one flat state object mirroring its prototype's `state = {}`,
exposed through a context (`useResident`, `useAdmin`). Screens are registered in
a `Record<ScreenKey, ComponentType>`, so a missing screen is a compile error
rather than a blank pane.

Inline styles throughout, verbatim from the prototypes, for pixel fidelity.
`textAlign: 'start'` rather than `'right'` so alignment follows the language.

## Deployment

Any push to `main` runs `.github/workflows/deploy.yml`, which type-checks,
builds, and publishes to GitHub Pages. Pages serves from `/rifada-app/`, so
`vite.config.ts` sets `base` to that prefix unconditionally — `vite preview`
reports itself as `serve`, so a command-conditional base would skip preview and
hide subpath breakage until after a deploy.

## Departures from the prototypes

Each is commented at the site of the change:

- **The gallery list in `Jiwar App standalone-src.dc.html` is stale** — it lists
  three deleted screens and omits events/groups/community/استعارة.
  `src/resident/gallery.ts` is generated from `Jiwar App.dc.html` instead.
- **`rewardsModal` is not a real screen.** The prototype gives it a screen key
  and then rewrites it back to `rewards` with the redeem sheet forced open.
  Here it is a scenario, which is the same thing without the phantom key.
- **`paidAmount` is declared twice** in the resident state — once for payments,
  once for the service rating — so paying rent would pre-fill the "what did you
  pay the technician" box, and submitting the rating would wipe the receipt
  amount. Split into `paidAmount` and `provPaidAmount`.
- **`startMatching` contradicts its own screen.** Its timeout jumps straight to
  the live job, skipping the accept card the template defines (`matchSearching`
  / `matchFound` / `matchAccept`). The port shows the card, since that is the
  screen the design actually drew.
- **The bottom bar floats over the content** in the prototype, which pads each
  scroll area by hand — 30 or 40px against an 83px bar — so the submit button
  on the rating, dispute and «شارك شيئًا لديك» screens ends up half-hidden
  behind it. The app shell reserves the bar's height instead (`NAV_H`), so a
  screen cannot put anything underneath it.
- **The design transliterates three names two ways** (Alsharif/Al-Sharif,
  Alharbi/Al-Harbi, Alotaibi/Al-Otaibi) depending on whether the string sits in
  its code or in an embedded JSON blob. The port follows the majority spelling
  for each.
- **`Jiwar Admin.dc.html` declares `rules` twice** in its state (automation
  toggles, then the scoring array), so the second silently overwrites the first
  and the automation switches never toggle. Split into `autoRules` and
  `scoreRules`.
- **The admin portfolio listed Egyptian cities** the Gulf conversion missed.
  Corrected to Riyadh districts.
- **Nine strings were not synced back from the design**, because on those points
  the prototype is the stale side: Egyptian names (كريم/منى vs فهد/نورة), the
  Egyptian ISP "WE" where the product uses STC, and "بجوار" from before the
  rename to رفادة.

## Known gaps

- The resident gallery mounts 106 full app instances, so it takes a few seconds
  to paint and is the slowest thing in the project.
- Lost & found thumbnails are the only remote images (the design's own Unsplash
  URLs). They fall back to a camera placeholder when unreachable.
- No backend. Payments, matching and notifications are all simulated.

## Assets

Every image is extracted from the base64 blobs inside the design's own bundle —
`Rifada Resident App - Figma 2 2.html`, unpacked by reading its
`__bundler/manifest` and `__bundler/ext_resources` script tags. The loose files
beside the HTML are stale; diffing only those is what made an earlier pass
report "no image changed" when the design had in fact replaced all of them.

| file | design id | used by |
| --- | --- | --- |
| `rephoto{0..3}.jpg` | `rephoto0`–`3`, and `heroHome` = `rephoto0` | real-estate listings, and the contract-renewal hero slide |
| `hero-user.webp` | `heroUser` | the dues slide — the resident's own unit |
| `hero-fest.jpg` | `heroFest` | the festival slide |
| `hero-food.jpg` | `heroFood` | the store-offer slide |
| `hero-run.jpg` | `heroRun` | the running-club slide |
| `hero-compound.webp` | `heroCompound` | the events header and the drone photo in `data/community.ts` |

The home hero is no longer one image: it is a five-slide carousel that advances
every four seconds (`data/hero.ts`). It holds still in gallery tiles, which
would otherwise re-render the whole grid on a timer.
