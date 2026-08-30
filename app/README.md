# رفادة / Rifada — interactive prototype

A React + Vite + TypeScript port of the three Claude Design prototypes in
`../project`: the resident app, the service-provider app, and the operator
console. Front-end only — every screen is driven by mock data in `src/*/data*`,
there is no backend.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then bundles to dist/
npm run preview    # serve the production build
```

The UI is Arabic and right-to-left (`<html lang="ar" dir="rtl">`).

## The three interfaces

The toolbar at the top switches between them, and each has two modes: a live
interactive frame, and a gallery where every screen renders in full (tap a tile
to open it in the interactive frame).

| | source prototype | screens |
| --- | --- | --- |
| تطبيق الساكن | `Jiwar Phone Pub.dc.html` | 70 registered, 68 in the gallery |
| مقدم الخدمة | `Jiwar Provider.dc.html` | P1–P11, 8 in the gallery |
| لوحة الإدارة | `Jiwar Admin.dc.html` | A1–A39, 29 sections, 30 in the gallery |

(The galleries omit a few transient states — a success screen only reachable
mid-flow, say — that the interactive frame still reaches.)

The resident and provider apps run inside an iOS device frame at 402×874. The
admin console is a desktop app at 1360×940, so its gallery uses laptop-shaped
tiles rather than phone ones.

## Layout

```
src/
  theme/tokens.ts     palette, type, radii, shadows — lifted from the prototypes
  ui/                 Icon, PhoneFrame, and the shared mobile primitives
  resident/           store.tsx + data/ + screens/  (typed screen registry)
  provider/           data.ts + ProviderApp.tsx     (technician and store faces)
  admin/              store.tsx + data.ts + ui.tsx + sections/ + AdminConsole.tsx
  App.tsx             interface switcher, mode switcher, shared Gallery
```

Each app keeps one flat state object mirroring its prototype's `state = {}`,
exposed through a context (`useResident`, `useAdmin`) so the port stays close
enough to the source that a design change is easy to trace back. Screens are
registered in a `Record<ScreenKey, ComponentType>`, which makes a missing screen
a compile error rather than a blank pane.

Inline styles are used throughout, verbatim from the prototypes, for pixel
fidelity. Only `index.css` holds global rules (hidden scrollbars, keyframes).

## Departures from the prototypes

These are deliberate, and each is commented at the site of the change:

- **The gallery list in `Jiwar App standalone-src.dc.html` is stale** — it still
  lists three deleted screens, omits events/groups/community/رفادتنا, and uses
  the old wording and logo. `src/resident/gallery.ts` follows the current list in
  `Jiwar App.dc.html` instead.
- **`Jiwar Admin.dc.html` declares `rules` twice** in its state (automation
  toggles at line 1326, scoring rules at line 1342), so the second silently
  overwrites the first and the automation switches never toggle. Split here into
  `autoRules` and `scoreRules`.
- **The admin portfolio still listed Egyptian cities** the Gulf conversion pass
  missed. Corrected to Riyadh districts.
- **The unit-360 payment chart** used a percentage bar height inside an
  auto-height column, so the bars collapsed to nothing. The columns now stretch
  to the row's height so the percentages resolve.

## Assets

`public/img/rephoto{0..3}.jpg` are the real-estate photos, extracted from the
base64 blobs embedded in `Jiwar App (offline).html`. `hero-compound.webp` is the
compound hero, reused for the community drone-photo attachment (they are the
same file in the prototype).
