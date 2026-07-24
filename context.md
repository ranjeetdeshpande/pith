# Pith (`@pith/ui`) — Development Context

> This document is the canonical reference for developing Pith components.
> Read it before writing any new component. It captures every architectural
> decision, design philosophy, and pattern that has been established across
> all existing work.

---

## 1. What is Pith?

Pith is a **Web Components library** (built on Lit 3) with three deliberately
distinct visual personalities — **Ink**, **Glass**, and **Brutal**. Every
component is:

- **A11y-first**: ARIA roles, keyboard navigation, focus management, and
  `prefers-reduced-motion` support are non-negotiable requirements, not
  afterthoughts.
- **Framework-agnostic**: Standard Custom Elements. Works in React, Vue,
  Svelte, Angular, or plain HTML. A React wrapper package (`@pith/react`)
  provides typed event forwarding.
- **Shadow-DOM isolated**: No style leakage in either direction. Components
  consume theme tokens *only* via CSS custom properties that cascade naturally
  across the Shadow DOM boundary.
- **Token-driven**: Every visual value — color, radius, shadow, border width,
  backdrop — comes from a `--ui-*` semantic token. Hard-coded values are a bug.

---

## 2. Monorepo Structure

```
/
├── packages/
│   ├── core/                   @pith/ui  — the component library
│   │   └── src/
│   │       ├── index.ts        re-exports all components
│   │       ├── styles/
│   │       │   ├── tokens.css  primitive tokens (spacing, type, motion, z)
│   │       │   └── themes.css  semantic --ui-* tokens for all 6 theme states
│   │       └── components/
│   │           └── <name>/
│   │               ├── <name>.ts
│   │               ├── <name>.css
│   │               └── index.ts
│   └── react/                  @pith/react — typed React wrappers
└── apps/
    └── docs/                   Vite dev + showcase app
        ├── index.html          All demos in a single themed page
        └── src/main.ts         Theme switching, dark toggle, demo wiring
```

**Package manager**: pnpm workspaces.  
**Build**: Vite 5.4 in library mode. `vite-plugin-dts` for declarations.  
**TypeScript**: 5.9, `moduleResolution: "bundler"`, `strict: true`,
`exactOptionalPropertyTypes: true`.

---

## 3. Theming Architecture — the most important section

### 3.1 How themes work

Themes are applied with **one attribute on `<html>` (or any ancestor)**:

```html
<html data-theme="ink">      <!-- or "glass" or "brutal" -->
<html data-theme="brutal" data-dark>   <!-- dark mode of brutal -->
```

- **`data-theme`** selects the personality.
- **`data-dark`** is independent — it activates the dark token set of whichever
  theme is active. Adding `data-dark` never overrides the theme, it just flips
  to that theme's dark variant.
- Components **never** look at these attributes directly. They only consume
  `--ui-*` custom properties. The token values change when the attributes
  change, and CSS re-renders automatically.

### 3.2 Two-file token system

| File | Purpose | Rule |
|------|---------|------|
| `tokens.css` | **Primitive** — spacing, typography, motion, z-index | Never referenced by components |
| `themes.css` | **Semantic** `--ui-*` — color, shape, shadow, border | Only file components read |

Components use `--ui-*` tokens. Only the theme system uses `--space-*`,
`--text-*`, etc. directly.

### 3.3 The `--ui-*` semantic token set

Every theme variant (all 6: ink-light, ink-dark, glass-light, glass-dark,
brutal-light, brutal-dark) defines the complete set below.

```
Surfaces
  --ui-surface           page/base background
  --ui-surface-raised    cards, panels, containers
  --ui-surface-overlay   hover state, active tint
  --ui-surface-sunken    inputs, recessed areas

Text
  --ui-text              primary readable text
  --ui-text-muted        secondary / labels / captions
  --ui-text-subtle       placeholder, disabled, metadata
  --ui-text-on-primary   text that sits on --ui-primary background

Borders
  --ui-border            default border (1px or 2px in brutal)
  --ui-border-strong     emphasis border, focused inputs
  --ui-border-width      1px (ink/glass) · 2px (brutal)
  --ui-border-style      solid

Interactive
  --ui-primary           primary action background
  --ui-primary-fg        text/icon on primary bg
  --ui-primary-hover     hover state of primary
  --ui-focus-ring        :focus-visible outline color

Feedback
  --ui-danger / -fg / -subtle
  --ui-success / -fg / -subtle
  --ui-warning / -fg / -subtle

Shape
  --ui-radius-xs / sm / (base) / lg / xl / full
  (All 0px in brutal — it has no curves.)

Shadows
  --ui-shadow-xs / sm / (base) / lg / xl
  (Hard offset, no blur in brutal.)

Blur
  --ui-backdrop          `none` (ink/brutal) · `blur(...)` (glass)

Component-specific
  --ui-tooltip-bg / -fg / -arrow
```

### 3.4 Shadow DOM and token inheritance

CSS custom properties are **inherited**. Any `--ui-*` set on `<html>` cascades
all the way down through:

```
<html data-theme="brutal">
  └─ (light DOM)
     └─ <pith-accordion>           ← inherits all --ui-* tokens
        └─ (shadow root)
           └─ .root                ← uses var(--ui-surface-raised)
              └─ (slot → light DOM)
                 └─ <pith-accordion-item>  ← still inherits --ui-*
                    └─ (shadow root)
                       └─ .trigger ← uses var(--ui-text)
```

**Corollary**: Custom properties set on a component host *also* cascade into
its children's shadow roots. This is how `--pith-ai-*` (accordion item
variant tokens) work — `pith-accordion` sets them on itself, and
`pith-accordion-item`'s shadow CSS reads them.

### 3.5 Theme-specific Shadow DOM overrides

When a component needs theme-specific CSS *inside* Shadow DOM, use
`:host-context()`:

```css
/* Inside a component's shadow CSS: */
:host-context([data-theme="brutal"]) .trigger {
  font-family: var(--font-mono);
  font-weight: var(--weight-bold);
}
```

`:host-context()` traverses *up* the composed tree, so it works from any depth.

---

## 4. The Three Themes — Personalities & Rules

### 4.1 Ink — *"Warm off-white paper. Editorial. Precise."*

**Personality**: A typographer's system. Calm, legible, timeless. For
portfolios, documentation, blogs.

**Key token values (light)**:
- Surface: `#fafaf8` (warm off-white), raised: `#f4f4f0`
- Text: `#1a1a18` (soft black, not pure)
- Border: `#e2e2dc` (warm gray)
- Primary: `#1a1a18` (same as text — type-driven)
- Radius: xs=2px, sm=4px, base=6px, lg=10px, xl=16px (refined, not circular)
- Shadows: soft warm-tinted Gaussian (`rgba(26,26,24, ...)`)
- Backdrop: `none`

**Key token values (dark)**:
- Surface: `#18181a`, raised: `#232328`
- Text: `#f2f2f0`
- Border: `#32322e`
- Focus ring: `#a5b4fc` (indigo glow — the only color accent in ink dark)
- Shadows: stronger (`rgba(0,0,0,0.4)`)

**Component rules for Ink**:
- SVG chevrons, not symbols
- System sans-serif font
- Gentle transitions (250–300ms)
- No strong color accents — monochromatic
- Hover states use `--ui-surface-overlay` tint
- Tooltips: dark chip (`rgba(26,26,24, 0.96)`) on light; light chip on dark

---

### 4.2 Glass — *"Frosted panels over layered color backgrounds."*

**Personality**: Modern, spatial, depth-aware. For dashboards, SaaS products,
anything with a rich background (gradients, photos, blobs).

**Key token values (light)**:
- Surface: `rgba(255,255,255, 0.52)` — semi-transparent frosted white
- Raised: `rgba(255,255,255, 0.68)`
- Overlay: `rgba(255,255,255, 0.84)`
- Border: `rgba(255,255,255, 0.60)` — the glass "edge highlight"
- **Backdrop**: `blur(24px) saturate(200%) brightness(1.06)`
- Radius: xs=6px, sm=10px, base=14px, **lg=20px**, xl=28px (very rounded)
- Shadows include inner ring: `0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.4)`
- Primary: `rgba(99,102,241, 0.92)` (indigo with slight transparency)
- Focus ring: `rgba(99,102,241, 0.8)`

**Key token values (dark)**:
- Surface: `rgba(255,255,255, 0.07)` — barely-there frosted dark
- Raised: `rgba(255,255,255, 0.13)`
- Border: `rgba(255,255,255, 0.18)`
- Backdrop: `blur(24px) saturate(180%) brightness(1.12)` (slightly more brightness to pop)
- Focus ring: `rgba(165,180,252, 0.9)` (brighter indigo)

**Component rules for Glass**:
- `backdrop-filter: var(--ui-backdrop)` on container elements (`.root`, `.panel`, etc.)
- Add `-webkit-backdrop-filter` alongside
- Transitions can be slightly longer (300–340ms) — more "floaty"
- The shadow already includes a `1px rgba(white, ...)` inner ring — don't add double borders
- Focus rings glow via color; no hard outlines
- For glass dark: element glows (text-shadow, drop-shadow) are acceptable for interactive states
- Tooltips: dark chip on light glass; near-white chip on dark glass

---

### 4.3 Brutal — *"Hard edges. Thick borders. Offset shadows. No mercy."*

**Personality**: Anti-design. Maximally direct. For bold portfolios,
editorial platforms, striking brand sites. Every interaction is emphatic.

**Key token values (light)**:
- Surface: `#ffffff`, raised: `#f5f5f5`
- Text: `#0a0a0a` (near-black)
- Border: `#0a0a0a` — hard black **everywhere**
- `--ui-border-width: 2px` (not 1px — this is the defining rule)
- **Radius: all 0px — no curves anywhere**
- Shadows: hard offset, zero blur — `4px 4px 0px #3d3d3d` (dark gray, not pure black)
- Primary: `#0a0a0a` (same as border — uniform brutality)
- Backdrop: `none`

**Key token values (dark)**:
- Surface: `#0a0a0a`, raised: `#141414`
- Border: `#ffffff` (hard white in dark mode — inverted, same weight)
- Shadows: `4px 4px 0px #c8c8c8` (light gray offset — same hard feel, inverted)
- Primary: `#ffffff`, fg: `#000000` (inverted primary)
- Shadow offset colors are `#c8c8c8` (not pure white — softer)

**Component rules for Brutal**:
- **2px borders everywhere** — the `--ui-border-width: 2px` token handles most of it.
  For hardcoded overrides, use `2px solid var(--ui-border)` explicitly (don't guess 1px).
- **Monospace font** for interactive text (triggers, labels, badges):
  `font-family: var(--font-mono)`, `font-weight: var(--weight-bold, 700)`
- **Letter spacing**: `-0.02em` tightens the mono type to feel dense
- **Zero radius** on all elements — `border-radius: 0` or rely on `var(--ui-radius-*)` = 0px
- **Box-shadow offset on containers** using `var(--ui-shadow)` — gives the "sticker" effect
- **Snappy transitions**: 160ms with `var(--ease-snappy)` = `cubic-bezier(0.2, 0, 0, 1)`
- **Open/active state** = inverted: `background: var(--ui-primary)` + `color: var(--ui-primary-fg)`.
  This is the signature brutal "selected" state — black bg, white text (light) or vice versa (dark).
- **Indicators**: Use `+`/`−` text (monospace) instead of SVG chevrons
- **No backdrop-filter** — brutalism has no frosted surfaces
- Tooltips: hard black chip (light) or hard white chip (dark)

---

## 5. Component Architecture

### 5.1 File structure — every component is identical

```
packages/core/src/components/<name>/
├── <name>.ts       LitElement class — behavior, state, render
├── <name>.css      Shadow DOM styles — tokens, theme overrides
└── index.ts        re-export: `export * from './<name>.js'`
```

For compound components (accordion, dropdown):
```
├── accordion.ts + accordion.css
├── accordion-item.ts + accordion-item.css
└── index.ts        re-exports both
```

### 5.2 Component template (TypeScript)

```ts
import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './<name>.css?raw'     // Vite ?raw import

@customElement('pith-<name>')
export class Pith<Name> extends LitElement {
  static override styles = unsafeCSS(styles)  // unsafeCSS + ?raw is the pattern

  @property({ type: Boolean, reflect: true })
  open = false

  override render() {
    return html`...`
  }
}

// Always declare the tag in the global map
declare global {
  interface HTMLElementTagNameMap {
    'pith-<name>': Pith<Name>
  }
}
```

### 5.3 TypeScript strictness rules

`exactOptionalPropertyTypes: true` is enabled. This means:
- `@property({ type: Number }) count = 0` is fine
- But `count?: number` is NOT the same as `count: number | undefined`
- Use `count: number | undefined = undefined` for optional number properties
- `@state() private _raf: number | undefined = undefined` — not `_raf?: number`

### 5.4 CSS pattern — `?raw` + `unsafeCSS`

```ts
// This is the only way to load component CSS in this project
import styles from './my-component.css?raw'
static override styles = unsafeCSS(styles)
```

Never use `css` tagged template for component styles. It bypasses Vite's CSS
processing for `?raw` files.

### 5.5 `:host` rules

- `:host { display: block }` — default for block components
- `:host { display: inline-block; vertical-align: middle }` — for inline (button, badge)
- **Never set `border` in `:host` if you need `::slotted()` parent to add dividers.**
  `::slotted()` has lower specificity than shadow `:host`, so a `:host { border: ... }`
  would block the parent from setting dividers.
- Use `isolation: isolate` on interactive components to create stacking contexts.

### 5.6 `::slotted()` — constraints and correct usage

`::slotted()` selects slotted elements from the *shadow DOM of the parent*.
Rules:
- Accepts compound selectors: `::slotted(pith-accordion-item:not(:first-child))` ✓
- Does **NOT** accept combinators: `::slotted(a + b)` ✗
- Has **lower specificity** than any rule in the slotted element's own shadow root
- Can freely set `border-top`, `margin`, `background` on the host element of the
  slotted component *only if* that component's shadow CSS doesn't also set those
  properties on `:host`
- Use `::slotted()` for layout/divider concerns; use CSS custom properties for
  style concerns that need to cascade deeper

### 5.7 Inter-component communication pattern

**Parent → Child**: CSS custom properties (cascade naturally into shadow DOM).
Set on the parent host, read by child's shadow CSS via `var(--pith-*)`.

```css
/* Parent accordion sets: */
:host([variant="separated"]) {
  --pith-ai-bg:     var(--ui-surface-raised);
  --pith-ai-border: var(--ui-border-width, 1px) solid var(--ui-border);
  --pith-ai-radius: var(--ui-radius-lg);
  --pith-ai-shadow: var(--ui-shadow-xs);
}

/* Child accordion-item reads: */
.shell {
  background:    var(--pith-ai-bg, transparent);
  border:        var(--pith-ai-border, none);
  border-radius: var(--pith-ai-radius, 0px);
  box-shadow:    var(--pith-ai-shadow, none);
}
```

**Child → Parent**: Custom events (cancelable, bubbles: true, composed: true).

```ts
this.dispatchEvent(new CustomEvent('pith-item-toggle', {
  detail: { open: willOpen },
  bubbles: true,
  composed: true,   // crosses shadow boundaries
  cancelable: true, // parent can preventDefault()
}))
```

Parent adds `addEventListener('pith-item-toggle', handler)` in `connectedCallback`
and removes it in `disconnectedCallback`. Always use bound arrow functions
(`this._handler = (e) => { ... }`) so removal works correctly.

---

## 6. CSS Techniques Inventory

### 6.1 Panel height animation — the grid trick

Used in: accordion. **No JS height measurement needed.**

```css
.panel {
  display: grid;
  grid-template-rows: 0fr;    /* collapsed: row has zero height */
  transition: grid-template-rows 280ms var(--ease-out);
}
:host([open]) .panel {
  grid-template-rows: 1fr;    /* expanded: row takes natural height */
}
.panel-inner {
  overflow: hidden;           /* required: clips at 0 when row = 0fr */
  min-height: 0;              /* required: allows collapse to zero */
}
```

Browser support: Chrome 107+, Firefox 110+, Safari 16+.

### 6.2 Backdrop blur (Glass only)

```css
.root {
  backdrop-filter: var(--ui-backdrop);           /* blur(24px) saturate(200%)... */
  -webkit-backdrop-filter: var(--ui-backdrop);   /* always pair these */
}
```

**Rule**: Only apply `backdrop-filter` to containers, not to every element. In
`separated` variant, accordion uses CSS custom properties to pass the backdrop
down to individual item shells.

### 6.3 Focus visible — never outline: none without replacement

```css
.trigger:focus-visible {
  outline: 2px solid var(--ui-focus-ring);
  outline-offset: -2px;  /* inset ring for contained elements */
  /* OR: outline-offset: 2px for standalone elements */
}
```

Always use `:focus-visible`, never `:focus` (avoid showing outlines on click).

### 6.4 `all: unset` reset for interactive elements

Used in buttons, triggers, menu items — any native element inside Shadow DOM
that needs custom styling:

```css
.trigger {
  all: unset;
  box-sizing: border-box;   /* always re-add after all: unset */
  display: flex;
  /* ... */
}
```

### 6.5 Hard offset shadow (Brutal)

```css
/* Brutal component shadows */
.root {
  box-shadow: var(--ui-shadow);     /* 4px 4px 0px #3d3d3d in light */
}
/* On hover: increase offset */
.btn:hover {
  box-shadow: var(--ui-shadow-lg);  /* 6px 6px 0px #3d3d3d */
  transform: translate(-1px, -1px); /* compensate so visual moves */
}
```

The shadow offset + transform trick makes brutalist buttons feel "lifted" on
hover and "pressed" on active (reverse the translate).

### 6.6 Reduced motion

Every animation component includes:

```css
@media (prefers-reduced-motion: reduce) {
  .panel, .chevron, .inner {
    transition: none !important;
  }
}
```

For RAF-driven animations (counter, magnetic, typewriter), check the
media query programmatically:

```ts
this._prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

### 6.7 `:host-context()` for theme variants

Use this inside component shadow CSS for theme-specific overrides:

```css
/* Simple theme rule */
:host-context([data-theme="brutal"]) .trigger {
  font-family: var(--font-mono);
}

/* Theme + dark combo */
:host-context([data-theme="glass"][data-dark])[open] .chevron {
  text-shadow: 0 0 12px rgba(163, 180, 252, 0.5);
}

/* Theme + component state combo */
:host-context([data-theme="brutal"])[open] .trigger {
  background: var(--ui-primary);
  color: var(--ui-primary-fg);
}
```

### 6.8 Dividers between slotted items

For components where a parent adds borders between children:

```css
/* In parent's shadow CSS */
/* Works because child's :host has no conflicting `border` rule */
::slotted(pith-accordion-item:not(:first-child)) {
  border-top: var(--ui-border-width, 1px) solid var(--ui-border);
}
```

Since `--ui-border-width` is `1px` for ink/glass and `2px` for brutal, this
single rule gives correct weight in all themes automatically.

---

## 7. Accessibility Standards

Every component must meet WCAG 2.1 AA. The established patterns:

### Interactive elements
- Use native HTML elements inside Shadow DOM: `<button>`, `<dialog>`, `<input>`
- `<button>` gets keyboard focus, `Enter`/`Space` activation for free
- `all: unset` reset followed by full re-implementation of visual styles

### ARIA
- `aria-expanded` on disclosure triggers (accordion, dropdown)
- `aria-controls="panel-id"` → panel has matching `id`
- Panel has `role="region"` + `aria-labelledby="trigger-id"`
- `aria-haspopup` on dropdown triggers
- `role="menu"` / `role="menuitem"` for dropdown menus
- `aria-label` or `aria-labelledby` on icon-only buttons
- `aria-live` regions for toast notifications

### Focus management
- Modals: native `<dialog>` + `showModal()` provide browser-native focus trap
- Dropdowns: arrow key navigation implemented in `keydown` handler
- `tabindex="-1"` on panel regions (focus enters naturally when open)
- Focus ring: `2px solid var(--ui-focus-ring)` via `:focus-visible`

### Disabled state
- `?disabled` attribute binding to native `disabled`
- Host-level `pointer-events: none` to block ghost-clicks at shadow boundary
- `opacity: 0.45` as the standard disabled visual

### Keyboard shortcuts
- `Escape` closes modal and dropdown
- Arrow keys navigate dropdown items
- `Tab` / `Shift+Tab` cycle through accordion triggers naturally

---

## 8. Animation Philosophy

### Motion principles
1. **Purposeful** — animation must communicate state change, not decorate
2. **Respectful** — always honor `prefers-reduced-motion: reduce`
3. **Short** — most transitions are 150–320ms. Longer feels slow.
4. **Physics-informed** — use easing curves that mimic real deceleration

### Easing tokens (from `tokens.css`)
```
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1)      smooth deceleration (default)
--ease-in:     cubic-bezier(0.4, 0, 1, 1)          smooth acceleration
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  slight overshoot (use sparingly)
--ease-snappy: cubic-bezier(0.2, 0, 0, 1)          fast + precise (Brutal)
--ease-linear: linear
```

### Per-theme timing guidelines
| Theme | Default duration | Easing | Feel |
|-------|-----------------|--------|------|
| Ink | 250–280ms | `--ease-out` | Editorial, calm |
| Glass | 300–340ms | `--ease-out` | Floaty, graceful |
| Brutal | 160–200ms | `--ease-snappy` | Direct, no-nonsense |

### RAF lerp pattern (used in magnetic)

```ts
private _animate = (): void => {
  const factor = 0.18  // lerp speed (brutal: 0.22 for snappier)
  this._currentX += (this._targetX - this._currentX) * factor
  this._currentY += (this._targetY - this._currentY) * factor

  this._inner.style.transform =
    `translate(${this._currentX}px, ${this._currentY}px)`

  const settled =
    Math.abs(this._targetX - this._currentX) < 0.08 &&
    Math.abs(this._targetY - this._currentY) < 0.08

  if (settled && !this._isTracking) {
    // Only remove tracking class when BOTH settled AND not tracking
    this._inner.style.transform = 'translate(0px, 0px)'
    this.classList.remove('tracking')
    return
  }
  this._raf = requestAnimationFrame(this._animate)
}
```

**Critical**: Don't remove the `tracking` class in `mouseleave`. Remove it only
inside `_animate()` when the position has settled to near-zero AND the mouse is
no longer tracking. This prevents CSS transitions fighting the RAF loop.

---

## 9. Current Component Inventory

### Phase 1 — Core primitives
| Component | Tag | Key attributes | Events |
|-----------|-----|---------------|--------|
| Button | `pith-button` | `variant`, `size`, `disabled`, `loading`, `href` | — |
| Badge | `pith-badge` | `variant`, `size`, `dot` | — |
| Avatar | `pith-avatar` | `src`, `name`, `size`, `shape` | — |
| Card | `pith-card` | `variant`, `href`, `padding` | — |
| Switch | `pith-switch` | `checked`, `disabled`, `size` | `pith-change` |
| Tabs | `pith-tabs` | `value`, `variant`, `label` | `pith-change` |
| Tab | `pith-tab` | `value`, `active`, `disabled` | `pith-tab-select` |
| Tab Panel | `pith-tab-panel` | `value`, `active` | — |
| Tooltip | `pith-tooltip` | `text`, `placement`, `delay` | — |
| Toaster | `pith-toaster` | — | listen for toast events |

### Phase 2 — Overlays
| Component | Tag | Key attributes | Events |
|-----------|-----|---------------|--------|
| Modal | `pith-modal` | `open`, `size`, `close-on-backdrop` | `pith-close` |
| Dropdown | `pith-dropdown` | `open`, `placement` | — |
| Dropdown Item | `pith-dropdown-item` | `disabled`, `href` | `pith-select` |

### Phase 3 — Animation
| Component | Tag | Key attributes | Events |
|-----------|-----|---------------|--------|
| Counter | `pith-counter` | `from`, `to`, `duration`, `easing`, `autoplay`, `prefix`, `suffix` | `pith-count-done` |
| Magnetic | `pith-magnetic` | `strength`, `distance`, `disabled` | — |
| Typewriter | `pith-typewriter` | `text`, `speed`, `erase-speed`, `delay`, `loop`, `erase`, `loop-delay`, `cursor` | `pith-type-done`, `pith-erase-done` |

### Phase 4 — Structural
| Component | Tag | Key attributes | Events |
|-----------|-----|---------------|--------|
| Accordion | `pith-accordion` | `multiple`, `variant` | — |
| Accordion Item | `pith-accordion-item` | `open`, `disabled` | `pith-item-toggle` |
| Breadcrumb | `pith-breadcrumb` | `label` | — |
| Breadcrumb Item | `pith-breadcrumb-item` | `href`, `current`, `disabled` | — |
| Sidebar | `pith-sidebar` | `label`, `collapsed` | — |
| Sidebar Item | `pith-sidebar-item` | `href`, `active`, `disabled` | — |
| Sidebar Section | `pith-sidebar-section` | `label` | — |

### Accordion variants
| Variant | Visual | Use case |
|---------|--------|----------|
| `default` | Single bordered card, internal dividers | FAQ, settings panels |
| `flush` | No outer border, ruled lines only | Full-bleed sections |
| `separated` | Each item is its own card with gap | Feature lists, dashboards |

### Breadcrumb notes
- `pith-breadcrumb-item` sets `role="listitem"` on itself in `connectedCallback` to give the `<ol>` correct semantics across the shadow boundary.
- `current` item renders as `<span aria-current="page">` (not an `<a>`). Use `disabled` for non-navigable intermediate steps.
- The separator (chevron SVG for Ink/Glass, `/` text for Brutal) is inside the item's shadow DOM. `:host(:first-child) .sep { display: none }` removes it on the first crumb — no parent JS needed.
- Brutal: the `<nav>` gets a 2px border + `var(--ui-shadow-sm)` offset shadow for the framed-strip look.
- Glass: `current` item gets a frosted pill — `background: var(--ui-surface-raised)`, `border: 1px solid var(--ui-border)`, `backdrop-filter: var(--ui-backdrop)`.

### Sidebar notes
- `collapsed` is a reflected boolean attribute — toggle with `el.toggleAttribute('collapsed')` or set via property `el.collapsed = true`.
- Collapsed/expanded widths are CSS custom properties: `--pith-sidebar-width: 240px`, `--pith-sidebar-collapsed-width: 52px`. Override on the host element or `:root`.
- Children detect collapsed state entirely via CSS: `:host-context(pith-sidebar[collapsed])` works for items inside sections because `pith-sidebar[collapsed]` is an ancestor in the composed (flat) tree regardless of nesting depth.
- When collapsed: `pith-sidebar-item` hides `.label` + `.badge-slot`, centers the icon. `pith-sidebar-section` hides `.section-label`. No JS coordination needed.
- The sidebar's `.root` container has `overflow: hidden` — the header brand name clips gracefully during the width transition.
- Sidebar height is controlled by its container; `:host { height: 100% }` fills the parent. Wrap in a `display: flex` container.
- Glass: `backdrop-filter: var(--ui-backdrop)` on `.root` for the frosted panel effect.
- Brutal: 2px `border-right`, monospace font on items, 160ms snappy collapse transition (instead of 250ms).
- Slots: default (nav sections/items), `header` (brand/logo area above scroll region), `footer` (user profile below scroll region).
- `pith-sidebar-item` sets `role="listitem"` on itself in `connectedCallback` (same pattern as breadcrumb).
- Item renders as `<a>` when `href` is set, `<button>` otherwise — full link semantics, right-click to open in new tab.

---

## 10. Theme-by-theme Component Behavior Matrix

The same component behaves visually and behaviourally differently per theme.
When adding a new component, design for **all three themes** from the start.

| Aspect | Ink | Glass | Brutal |
|--------|-----|-------|--------|
| Border radius | Gentle (6–10px) | Generous (14–20px) | Zero |
| Border weight | 1px | 1px | 2px |
| Border color | Warm gray | White (edge highlight) | Hard black / white |
| Shadow | Soft Gaussian | Gaussian + inner ring | Hard offset (no blur) |
| Backdrop | None | `blur(24px) saturate(200%)` | None |
| Primary action | Near-black bg | Indigo semi-transparent | Solid black/white |
| Hover feedback | `--ui-surface-overlay` tint | `--ui-surface-overlay` tint | `--ui-surface-overlay` tint |
| Selected/open state | Overlay tint | Overlay tint | **Inverted** (primary bg) |
| Font on triggers | System sans | System sans | Monospace, bold, -0.02em |
| Chevron indicator | SVG chevron rotates | SVG chevron rotates | `+`/`−` text |
| Transition speed | 280ms | 320–340ms | 160–200ms |
| Transition easing | `ease-out` | `ease-out` | `ease-snappy` |
| Focus ring | `#1a1a18` (light) / indigo (dark) | Indigo | `#0a0a0a` / `#ffffff` |

---

## 11. Docs App Patterns

### Demo section structure (in `index.html`)

```html
<hr />
<section class="section">
  <p class="section-label">pith-component-name</p>
  <h2 class="section-title">Component Name</h2>
  <p class="section-desc">One-paragraph description of API surface.</p>

  <!-- Two-column demo for variants -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start">
    <div>
      <p class="variant-label">Variant name</p>
      <!-- component usage -->
    </div>
    <div>...</div>
  </div>

  <!-- Full-width demo -->
  <div style="margin-top:2rem">
    <p class="variant-label">Full-width variant</p>
    <!-- component usage -->
  </div>
</section>
```

For the inline variant label:
```html
<p style="font-size:var(--text-xs,0.75rem);font-weight:var(--weight-semibold,600);
          text-transform:uppercase;letter-spacing:0.08em;color:var(--ui-text-subtle);
          margin:0 0 0.75rem">Label text</p>
```

### main.ts wiring — when needed

Components that need JavaScript wiring in `main.ts`:
- **Toast**: button click → dispatch toast event
- **Modal**: button click → `modal.open = true`
- **Counter**: replay button → `counter.play()`
- **Typewriter**: replay button → `typewriter.reset(); typewriter.start()`
- **Theme switcher**: `document.documentElement.dataset.theme = value`
- **Dark toggle**: `document.documentElement.toggleAttribute('data-dark')`

Self-contained components (no `main.ts` needed):
- Accordion (fully self-contained, event handling internal)
- Dropdown (self-contained open/close)
- Tooltip (hover-driven)
- Magnetic (mousemove-driven)

---

## 12. Adding a New Component — Checklist

1. **Create directory**: `packages/core/src/components/<name>/`
2. **Create `<name>.css`**:
   - `:host { display: block }` (or `inline-block` + `vertical-align: middle`)
   - All visuals via `--ui-*` tokens
   - Theme overrides via `:host-context([data-theme="brutal"])` etc.
   - `@media (prefers-reduced-motion: reduce)` block
   - Brutal: 0 radius, 2px borders, monospace font, inverted open state
   - Glass: `backdrop-filter: var(--ui-backdrop)` on containers
3. **Create `<name>.ts`**:
   - `import styles from './<name>.css?raw'`
   - `static override styles = unsafeCSS(styles)`
   - `@customElement('pith-<name>')`
   - All optional number properties: `count: number | undefined = undefined`
   - `declare global { interface HTMLElementTagNameMap { ... } }`
4. **Create `index.ts`**: `export * from './<name>.js'`
5. **Export from `packages/core/src/index.ts`**: add `export * from './components/<name>/index.js'`
6. **Add demo to `apps/docs/index.html`**: follow section template above
7. **Wire main.ts** if the component needs imperative control
8. **Verify all three themes** look correct in the docs app — ink light, ink dark, glass light, glass dark, brutal light, brutal dark

---

## 13. Known Gotchas & Lessons Learned

### `::slotted()` specificity
`::slotted()` cannot override shadow `:host` rules. If you need a parent to
style a child component, use CSS custom property cascading instead.

### `::slotted()` and combinators
`::slotted(a + b)` doesn't work. Use `:not(:first-child)` inside the selector:
`::slotted(pith-item:not(:first-child))`.

### Magnetic + brutal — the "tracking class" bug
Never remove the `tracking` CSS class in `mouseleave`. Only remove it inside
the RAF `_animate()` loop after the element has settled to near-zero AND
`_isTracking === false`. Removing it in `mouseleave` causes the CSS transition
to restart and fight the RAF loop, breaking the animation in Brutal where
`steps()` easing was previously used.

### `exactOptionalPropertyTypes`
`@property({ type: Number }) count?: number` will cause TypeScript errors.
Use `count: number | undefined = undefined` for optional properties.

### Hard-coded 2px in Brutal CSS
`--ui-border-width: 2px` is set in the brutal theme token, so
`var(--ui-border-width, 1px) solid var(--ui-border)` resolves to `2px` automatically.
Only write explicit `2px` in CSS when you specifically need to override a
non-token path (e.g. explicit `:host-context` rules).

### CSS `backdrop-filter` on separated accordion items
For glass `separated` variant, the accordion passes `--pith-ai-backdrop: var(--ui-backdrop)`
as a custom property. Accordion-item's shadow CSS reads this with:
```css
backdrop-filter: var(--pith-ai-backdrop, none);
```
The fallback `none` means non-separated variants don't blur (the container
handles blur at the `.root` level instead).

### RAF cleanup
Always cancel RAF in `disconnectedCallback` or when the animation completes:
```ts
if (this._raf !== undefined) {
  cancelAnimationFrame(this._raf)
  this._raf = undefined
}
```

### `unsafeCSS` is required
`css` tagged template literals don't work with `?raw` CSS imports. Always use:
```ts
import styles from './file.css?raw'
static override styles = unsafeCSS(styles)
```

### Event `composed: true` for cross-shadow communication
Custom events dispatched from inside Shadow DOM do NOT cross shadow boundaries
by default. Always add `composed: true` for events that parent light-DOM
elements (or other components) need to receive.

### Separator-in-shadow-DOM pattern (breadcrumb)
When a child component needs to hide something on the first sibling, render the
thing (separator, divider) *inside* the child's Shadow DOM and use
`:host(:first-child) .sep { display: none }`. The `:first-child` pseudo-class
inside `:host()` correctly checks if the custom element itself is the first
child among its siblings in the light DOM. No parent coordination or `index`
prop needed. This is cleaner than trying to use `::slotted()` combinators
(which don't support adjacent-sibling selectors).

---

## 14. Tech Stack Versions

| Package | Version | Notes |
|---------|---------|-------|
| Lit | 3.2 | `experimentalDecorators: true`, `useDefineForClassFields: false` |
| Vite | 5.4 | Library mode, `vite-plugin-dts` |
| TypeScript | 5.9 | `moduleResolution: "bundler"`, `strict: true`, `exactOptionalPropertyTypes: true` |
| pnpm | — | Workspace manager |

**`tsconfig.json` must include:**
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "moduleResolution": "bundler",
    "strict": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

*Last updated: Session 6 — after tabs component implementation.*
*All 18 components built and verified: button, badge, avatar, card, switch, tabs,*
*tooltip, toast, modal, dropdown, counter, magnetic, typewriter, accordion,*
*breadcrumb, breadcrumb-item, sidebar, sidebar-item, sidebar-section.*
