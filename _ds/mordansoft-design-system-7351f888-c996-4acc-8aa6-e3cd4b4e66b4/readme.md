# MordanSoft Design System

The brand and interface system for **MordanSoft** — an independent mobile
software studio that makes small, focused utilities for iOS and Android.
Apps that do one thing well, work offline-first, and don't ask for the
permissions, accounts, or attention they don't need.

This system covers MordanSoft's **marketing and corporate surfaces** and the
shell of **future products**: marketing site, product landing pages, legal
documents, pitch decks/proposals, README presentation, and in-product
onboarding. It does **not** (yet) cover the internal UI of shipping apps, an
in-app iconography library, or non-Latin script typography.

> **Sources.** This system was built from a written brand brief — there is no
> upstream codebase or Figma file. If you have access to either later, record
> the links here so future work can reference them.

---

## The system in one paragraph

Monochrome-dominant and confident. A committed **warm grey** scale carries
~90% of every surface; typography, form, contrast, and motion do the work that
chroma usually does. There is exactly **one** brand accent — **Ember**, a
molten warm orange — used sparingly as a recognizable mark, never as a fill
color. The look borrows Stripe's energy (abstract geometry, layered planes,
motion-aware) and Cultured Code / Panic craft (warm, restrained, detailed),
while avoiding the purple/magenta gradients and generic-SaaS cleanliness those
comparisons can imply. Light and dark are **first-class peers**.

---

## Content fundamentals — how MordanSoft writes

**Voice: direct, technical, calm.** Lead with what a thing *does*, not how we
feel about doing it. "We build mobile apps that ship" — never "we craft
beautiful experiences."

- **Person.** "We" for the studio, "you" for the reader. Honest about being a
  solo developer working with modern AI tooling — not an agency, and we say so.
- **Casing.** Sentence case for headings and UI. Mono, UPPERCASE, tracked text
  only for eyebrows/overlines and technical metadata.
- **No exclamation marks.** Ever. And avoid: *passionate, amazing, delightful,
  let's, journey, together, revolutionary, seamless.*
- **Eyebrows** often open with a `//` — a quiet nod to the studio's code roots
  (`// What we make`, `// How we work`).
- **Numbers are facts, not decoration.** "1.8 MB · v2.4.0 · iOS 16+" earns its
  place; invented stats do not.
- **Honest empty/again states.** "No catch. No subscription." beats a hype line.
- **No emoji.** The mono `//` eyebrow and the Ember accent carry personality.

Representative lines: *"Small apps that do one thing well." · "Offline-first by
default." · "No accounts, no tracking, no permissions they don't need." · "We
ship what one careful person can maintain — and say so."*

---

## Visual foundations

**Color.** Warm grey ramp (`--grey-0` → `--grey-1000`, oklch hue ~60–75, very
low chroma). One accent, **Ember** (`--ember-500` ≈ `oklch(0.672 0.188 46)`),
brightened slightly in dark mode. Semantic colors (success/warning/danger/info)
are tuned **quiet** so they never compete with Ember; they appear only where
meaning requires them (status dots, badges, validation). Everything components
touch is a **semantic, theme-paired token** (`--surface`, `--surface-elevated`,
`--text-primary`, `--border`, `--accent`, …) defined for light, dark
(`prefers-color-scheme`), and a forced `[data-theme="dark"]` / `["light"]`.

**Type.** IBM Plex Sans for display + body; IBM Plex Mono for eyebrows, tags,
metadata, and code. Plex's engineering heritage suits a studio rooted in
industrial databases and embedded systems. Display is **expressive**: heavy
weight (700), tight tracking (`-0.04em` to `-0.025em`), display line-height
~1.04. Body is comfortable (weight 450 for warmth on screen, line-height 1.5;
1.65 for long-form/legal). Reading measures are capped (`--measure`, 68ch).

**Geometry is the primary visual element.** Abstract shapes, soft radial
gradient washes, and **layered planes** rotated a few degrees suggest depth
without literal illustration. The hero motif: receding grey planes + a single
Ember facet + a low-opacity blurred accent wash. No photography, no 3D renders,
no hand-drawn illustration. The logo mark itself is three offset planes.

**Space & layout.** 4px base grid. Generous but composed section rhythm
(`--section-y`). Containers: 1200 default, 760 narrow (reading), 1360 wide.
Whitespace is composed, not stretched.

**Corners & borders.** Soft, crafted radii (sm 6 → 2xl 28, pill). Hairline 1px
borders in `--border`; cards combine a hairline with a soft shadow.

**Elevation.** Warm-tinted, layered, low-opacity shadows (xs → xl). Elevation
is *felt*, not announced. A single reserved **`--glow-accent`** Ember glow is
used only on the brand mark and primary-CTA hover.

**Motion.** Part of the design, not decoration. Easing tokens: `standard`
(UI), `out` (entrances), `in-out`, `spring` (subtle overshoot on toggles).
Durations 80–640ms. Entrance reveal is a **transform-only rise** (never an
opacity fade that could strand content hidden), and **all** motion collapses to
zero under `prefers-reduced-motion: reduce`. Parallax depth on the hero
geometry is gated the same way.

**Interaction states.** Hover: primary buttons deepen + gain the Ember glow;
secondary/ghost shift surface; cards lift 2px with a larger shadow; links
underline. Press: subtle scale-down (~0.99) and a darker accent step. Focus:
a 3px `--ring` (translucent Ember) — visible and on-brand.

**Transparency & blur.** Sparingly: the sticky header uses a `color-mix`
translucent surface + backdrop blur; the accent wash uses heavy blur. Imagery,
when present, leans warm and neutral — but the system is geometry-first, not
photo-first.

---

## Iconography

**Lucide** (`lucide@0.460.0`, ~1.75–2px stroke, geometric, rounded joins) is
the chosen icon set — it matches the calm/technical/geometric character.
Loaded from CDN and rendered via `<i data-lucide="name">` + `lucide.createIcons()`.

> **Substitution flag.** There was no source codebase, so no in-house icon set
> existed to copy. Lucide is a deliberate stand-in. If MordanSoft adopts a
> different icon family, swap the CDN link and the `data-lucide` names; nothing
> else depends on it.

Icons are **monochrome line** and inherit `currentColor`. They are paired with
the Ember accent only on small accent chips (e.g. principle/feature icon tiles
use an Ember-tinted background). **No emoji**; no unicode glyphs used as icons.
The brand mark is provided as real SVG assets — see `assets/`.

---

## Index / manifest

**Foundations (root):**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `elevation.css` ·
  `fonts.css` · `base.css` — design tokens, font loading, light resets +
  brand utilities (`.ms-eyebrow`, `.ms-container`, `[data-reveal]`, `.ms-geo`).
- `components/core/core.css` — component styling, built on the tokens.

**Brand assets** (`assets/`): `logo-mark.svg` (inline, themeable),
`logo-mark-mono.svg`, `logo-tile.svg` (self-contained app-icon tile),
`brand-logo.card.html`.

**Components** (`components/core/`) — React primitives, namespace
`window.MordanSoftDesignSystem_*`:
`Button`, `IconButton`, `Tag`, `Badge`, `StatusDot`, `Card`, `Input`,
`Switch`, `Tabs`, `Eyebrow`. Each has a `.d.ts`, `.prompt.md`, and the group
card `core.card.html`.

**Foundation specimen cards** (`guidelines/`) — populate the Design System tab:
color (accent, neutrals, semantic, surfaces), type (display, headings, mono),
spacing (scale, radii, elevation, motion), brand (geometry).

**UI kit** (`ui_kits/site/`) — the marketing system as one click-through:
home (hero, apps grid, principles, studio), a **product landing page** (app
detail with a phone mock), and a **Privacy Policy** legal document — all in
light and dark. Built from the component CSS + tokens. Entry: `index.html`.

**Skill:** `SKILL.md` makes this folder usable as a downloadable Agent Skill.

---

## Using the system

1. Link `styles.css`. Set `data-theme` to force a theme, or leave it to follow
   the OS.
2. Use semantic tokens, never raw ramp values, in new work.
3. Compose the component primitives; don't re-implement them.
4. Keep Ember rare. One accent moment per view. Let grey, type, and motion lead.
