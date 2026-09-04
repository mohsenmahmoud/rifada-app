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
| تطبيق الساكن | `Jiwar Phone Pub.dc.html` / `Rifada Phone EN.dc.html` | 70 registered, 68 in the gallery |
| مقدم الخدمة | `Jiwar Provider.dc.html` | P1–P11, 8 in the gallery |
| لوحة الإدارة | `Jiwar Admin.dc.html` | A1–A39, 29 sections, 30 in the gallery |

The resident and provider apps run in an iOS frame at 402×874. The admin console
is a desktop app at 1360×940, so its gallery uses laptop-shaped tiles.

## Bilingual

Ported from `Rifada App Bilingual.dc.html`. The AR/EN switch sits in the toolbar,
and the resident app has a second switch inside its settings screen (the design
turned that chip from a label into a real button). Switching flips the document
and every app root between `rtl` and `ltr`.

`src/i18n/dict.ts` holds ~1,950 entries in two blocks:

- **`design`** — 796 entries lifted from the product's own English prototype.
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

`t` is a plain function over a module-level language, not a hook; `LangProvider`
keys its subtree on the language, so switching remounts the tree and every call
re-evaluates. That avoids threading a `useT()` line through ~90 components.

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
  three deleted screens and omits events/groups/community/رفادتنا.
  `src/resident/gallery.ts` follows `Jiwar App.dc.html` instead.
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

- ~12 Arabic fragments still render inside resident **gallery thumbnails** at
  0.49 scale. Each already has a dictionary entry; what is missing is the
  wrapper at its render site.
- No backend. Payments, escrow, matching and notifications are all simulated.

## Assets

`public/img/rephoto{0..3}.jpg` are the real-estate photos, extracted from the
base64 blobs embedded in `Jiwar App (offline).html`. `hero-compound.webp` is the
compound hero — 212px tall, matching the design's only image slot.

All of them come from that one bundle, and that matters: the standalone
`project/hero-compound.webp` and `Jiwar Resident App (offline).html` carry an
older hero (a classical villa, 650×400). The current one is the modern villa at
600×375, embedded in `Jiwar App (offline).html` — the same bundle the `rephoto`
files hash-match, which is what identifies it as the live side. Comparing only
the loose files misses this, since the design's newer assets live base64-encoded
inside the HTML.

The hero is shared by three call sites — the home screen, the events header, and
the drone-photo attachment in `data/community.ts` — mirroring the prototype,
where all three read `window.__resources.heroCompound`.
