# Handoff: MordanSoft marketing site

## Overview
The MordanSoft studio marketing site: a single-page site with a hero, About,
What we do, Tech, Our products (SaltCure + AoK + Sloviko), Contact, and a legal
footer, plus two product pages: `/saltcure/` and `/sloviko/`.
Built on the MordanSoft Design System (warm-grey monochrome + one Ember accent).

## About the design files
The file in this bundle is a **design reference created in HTML** — a prototype
showing the intended look and behavior, not production code to copy verbatim.
The task is to **recreate this design in the target codebase's environment**
using its established patterns/components. If no environment exists yet, pick an
appropriate framework and implement there. `index.html` links the bound design
system's CSS token files directly; a real build should consume those tokens
(or their equivalents) rather than the raw HTML.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, components, and reveal
animations are all in place via the MordanSoft Design System tokens/components.
Recreate pixel-accurately using the design-system CSS.

## Screens / Views
Single scrolling page (`index.html`):

- **Topbar** — sticky, translucent (`color-mix` surface + backdrop blur),
  1px bottom hairline. Left: brand mark SVG (three offset planes) + "MordanSoft"
  (Soft in Ember). Right: mono caption "Mobile software studio" (hidden < 560px).
- **Hero** — two radial blurred washes (Ember + plane grey). Left column:
  `// Independent mobile studio` eyebrow, display title "We build mobile apps
  that ship.", lead paragraph, primary CTA "Our products" + link "Get in touch".
  Right: stacked phone mocks + a single Ember facet. 2-col at ≥900px.
- **About** — eyebrow + h2 + lead paragraph (max-width `--measure-narrow`).
- **What we do** — 4 `.ms-card` items in a 1→2 col grid, each with an Ember-tinted
  icon tile (Lucide: smartphone, database, cpu, wrench), title, text.
- **Tech we use** — wrapping row of `.ms-tag` chips; PL-SQL/T-SQL use `--accent`.
- **Our products** — three raised product cards (max-width 760px, stacked with
  `gap: --space-6`), all sharing one template (`.product-layout`: phone shot +
  copy column; `.product-shot` supplies the dark phone bezel, so every image must
  be a bare portrait screen with no device frame baked in):
  - **SaltCure — Meat Cure Calculator** (first): shot `assets/saltcure/screen-01.png`,
    icon `assets/saltcure/icon.png`, success badge, copy from the brief,
    CTA "Read case study" → `/saltcure/`. No metric line yet — a metric is added
    after the first measurement.
  - **AoK — Angle of Knife**: product-shot phone (`assets/shots/03_knife_card.png`),
    app icon `assets/aok-icon.png`, success badge, name, desc, "View product" → `/aok/`.
  - **Sloviko**: product-shot phone (`assets/sloviko-screen-03.png` — a portrait
    screen cropped out of the original wide mockup), app icon
    `assets/sloviko-icon.png`, success badge, name, desc, "View product" → `/sloviko/`.
    Layout is identical to AoK: `.product-shot` supplies the dark phone bezel, so
    the image must be a bare portrait screen (no device frame baked in).
- **Contact** — eyebrow + h2 "Get in touch" + large animated mailto link.
- **Footer** — elevated surface, brand mark + © line, and a Legal column with
  Privacy/Terms links for AoK and Sloviko.

### `/saltcure/` — dual-purpose case study + product page
Serves both the Upwork client (case study) and the Play reviewer / user (product
showcase). Same shell as `/sloviko/` (topbar, detail hero, sections, footer).

1. **Detail hero** — back link "All products" → `/#products`; 68px icon tile
   (`assets/saltcure/icon.png`); h1 "SaltCure"; tagline *"Make bacon, pancetta,
   biltong, jerky and salami at home — without guessing the salt."*; product
   paragraph; tags Android / Flutter / Offline-first / No account; CTA button
   → `https://play.google.com/store/apps/details?id=com.mordansoft.saltcure`;
   mono spec line "Offline-first · no account · USDA/FSIS-checked doses".
   Right column: two stacked phone mocks (screen-03 behind, screen-01 front) +
   the Ember facet.
2. **What's inside** — 4 `.ms-card` features in a 1→2 col grid: dry & wet
   calculator (equilibrium %, g/oz, °C/°F); nitrite standard picker
   (Cure #1/#2, peklosol, NPS, custom %) with USDA/FSIS dose check — the
   differentiator vs US calculators; batch log (days, reminders, weight loss vs
   target band, photos, rating); starter recipes.
3. **Screens** — 3-up strip of bezelled phone shots (screen-01/02/03),
   2-up ≤900px, 1-up ≤560px (max-width 300px, centered).
4. **Case study** — 4 `.ms-card` blocks with mono uppercase labels:
   Context / What we did / Numbers ("Measurement in progress") / Stack (tag row:
   Flutter, Firebase Analytics, Crashlytics, Offline-first, No accounts).
5. **Closing** — "No catch. No subscription." + primary CTA to Play.

## Interactions & Behavior
- **Reveal on scroll**: `.js-reveal` elements fade+rise into view via
  IntersectionObserver; `data-delay="1..4"` staggers by 80ms steps. Collapses to
  no-motion under `prefers-reduced-motion: reduce`.
- **Hero reveal**: `[data-reveal]` + `data-reveal-delay` (90/180/270ms).
- **Buttons**: primary deepens + Ember glow on hover, ~0.99 press scale.
- **Cards**: lift 2px + larger shadow on hover.
- **Contact link**: underline grows 0%→100% width on hover (220ms ease-out).
- Smooth in-page anchor nav (`#products`, `#contact`).

## Design Tokens
All values come from the bound design system CSS (do not hardcode):
`tokens/colors.css`, `typography.css`, `spacing.css`, `elevation.css`,
`fonts.css`, `base.css`, `components/core/core.css`. Key semantics used:
`--surface`, `--surface-elevated`, `--text-primary/secondary/muted`,
`--border`, `--border-faint`, `--accent`, `--accent-text`, `--accent-subtle`,
`--ember-400/500/600`, `--glow-accent`, `--shadow-sm..xl`, `--radius-md..xl`,
`--space-*`, `--section-y`, `--text-*`, `--tracking-*`, `--ease-out`,
`--font-mono`. Fonts: IBM Plex Sans (display/body), IBM Plex Mono (eyebrows/meta).

## Assets
- `assets/saltcure/icon.png` — SaltCure app icon (512px light variant).
- `assets/saltcure/screen-01..05.png` — five app screens, cropped out of the
  Play store graphics (caption headers and device frame removed; source crop
  box x 155–1134, y 549–2679 on the 1290×2796 originals, scaled 0.45 → 441×959).
  01 dry calculator · 02 nitrite safety · 03 batch tracker · 04 recipes ·
  05 dry-or-brine.
- `assets/saltcure/source/` — the untouched uploads: both icon sizes in light
  and dark, the 1024×500 feature graphic, and all five store screenshots.
- `assets/aok-icon.png`, `assets/shots/03_knife_card.png` — AoK.
- `assets/sloviko-icon.png` — Sloviko app icon (from Play Store, 512px).
- `assets/sloviko-screen-03.png` — Sloviko word screen, cropped to portrait.
- `assets/sloviko-02.png / -03.png` — original wide mockups (reference).
- Brand mark SVG is inlined in the topbar/footer.
- Icons: Lucide 0.460.0 via CDN.

## Responsive behavior
Mobile-first. Breakpoints in use:
- **≥640px** — "What we do" goes 2-col; product cards go `200px 1fr` (shot + copy).
- **≥720px** — Sloviko feature grid goes 2-col.
- **≥900px** — hero / detail-hero become 2-col (`1.05fr 0.95fr`) with taller section padding.
- **≤860px** — decorative hero planes, facet, and the second phone are hidden; the
  Ember wash drops to ~0.25 opacity.
- **≤720px** (mobile tuning) — container padding `--space-5`; display type via
  `clamp()` (hero `clamp(2.25rem, 11vw, 3.25rem)`, section titles
  `clamp(1.5rem, 6.5vw, 2rem)`); section padding `--space-12`; phone mocks capped
  at `min(200px, 58vw)` and product shots at `min(190px, 52vw)` so they never
  stretch to the full column; buttons `min-height: 46px`; footer legal links get
  `--space-2` vertical padding for tap area.
- **≤560px** — topbar tagline hidden; footer stacks.
- **≤420px** — secondary wash hidden; CTA buttons go full-width and centered.

## Files
- `index.html` — the home page (all markup + CSS + reveal JS).
- `saltcure/index.html` — the SaltCure dual-purpose page (see above).
- `sloviko/index.html` — the Sloviko product landing page (same shell: topbar,
  detail hero with icon tile + tags + CTAs + phone stack, feature grid, closing
  section, footer). CTA links to Google Play are still `#` placeholders.

## Open items for the developer
1. **Official Google Play badge.** The brief asks for the official
   "Get it on Google Play" badge. The prototype currently uses a plain
   design-system primary button as a stand-in — a hand-drawn approximation of
   the badge would be a trademark risk. Drop the official asset from Google's
   brand page into `assets/` and swap the button for it (hero CTA and the
   closing CTA), keeping the same href.
2. **Legal pages.** `legal/saltcure/privacy.html` and `terms.html` (brief part 3,
   sourced from `boris/saltcure/legal/*`) are **not** in this package — the
   source documents were not supplied. The footer legal links for SaltCure and
   Sloviko are therefore held back to avoid 404s; add them back once the pages
   exist, matching the `/legal/aok/` styling.
3. **Metrics.** The home card and the case study's "Numbers" block are
   deliberately number-free until the first measurement (rating, installs/DAU,
   share of users reaching a first batch).
4. **Play Console legal URLs.** Switching SaltCure's listing to the new legal
   URLs is a separate task — the listing commit may trigger re-moderation.
- Design-system CSS is referenced from `_ds/mordansoft-design-system-…/` in the
  project root; carry those tokens/components into the target codebase.
