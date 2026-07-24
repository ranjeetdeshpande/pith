# Pith — Build Plan

> Web Components with three visual personalities. A11y-first. Container-query-driven. Microscopic bundle.

---

## Stack

| Concern        | Choice                          | Reason                                              |
| -------------- | ------------------------------- | --------------------------------------------------- |
| Components     | Web Components via **Lit 3**    | Framework-agnostic, 5kb runtime, Shadow DOM native  |
| Language       | TypeScript 5+                   | Full type safety, decorator support                 |
| Build          | **tsup** (esbuild)              | Fastest library build tool, handles CSS-as-text     |
| Styling        | Vanilla CSS — vars + nesting    | Zero runtime cost, pierces Shadow DOM via CSS vars  |
| Animations     | Web Animations API + CSS        | Native browser, no deps, off-main-thread capable    |
| React wrappers | `@lit/react`                    | Auto-generated, thin (~1kb), proper event mapping   |
| Monorepo       | pnpm workspaces                 | Fast, disk-efficient                                |
| Docs           | Custom Vite app (apps/docs)     | More portfolio-worthy than Storybook                |

---

## CSS Architecture

- **Tokens** (`tokens.css`): Primitive values — spacing scale, type scale, motion curves, z-index
- **Themes** (`themes.css`): Three sets of semantic `--ui-*` vars scoped to `[data-theme="x"]`
  - `glass` — frosted glass, dark-first, blur backdrop, rounded
  - `brutal` — hard edges, thick borders, offset shadows, monochrome
  - `ink` — warm off-white, subtle shadows, tight radius, editorial
- **Component CSS**: Shadow DOM scoped. Uses only `--ui-*` vars. Never touches global namespace.
- **CSS features in use**: native nesting, `@container`, `:has()`, `@media (prefers-reduced-motion)`, `@media (forced-colors)`, CSS custom properties

---

## Package Structure

```
pith/
├── packages/
│   ├── core/          @pith/ui         Web Components (Lit)
│   └── react/         @pith/react      React wrappers via @lit/react
├── apps/
│   └── docs/                           Demo site (Vite)
├── tsconfig.base.json
├── pnpm-workspace.yaml
├── plan.md
└── README.md
```

---

## Component Roadmap

### Phase 1 — Foundation ✅
- [x] Monorepo scaffold (pnpm workspaces)
- [x] tsconfig.base.json, tsup.config.ts, package.json for @pith/ui
- [x] Token system (spacing, type scale, motion curves, z-index)
- [x] Three themes: glass, brutal, ink (CSS custom properties, no runtime cost)
- [x] `@pith/react` package scaffold (tsup, @lit/react wrapper)
- [x] Build verified: ESM + CJS + DTS + styles.css all emit cleanly

### Phase 2 — Core Components (v0.1)
- [x] `pith-button` — variants (primary/secondary/ghost/danger), sizes (sm/md/lg), loading, icon slots, full a11y
- [ ] `pith-badge` — variants, dot mode, removable
- [ ] `pith-avatar` — image, initials fallback, size variants, group
- [ ] `pith-card` — surface, hover lift, slot-driven layout
- [ ] `pith-tooltip` — positioning, delay, keyboard trigger
- [ ] `pith-toast` — auto-dismiss, stacking, ARIA live region

### Phase 3 — Interactive Components (v0.2)
- [ ] `pith-modal` — focus trap, scroll lock, keyboard dismiss
- [ ] `pith-dropdown` — positioning, keyboard navigation, ARIA listbox

### Phase 4 — Signature Animation Components (v0.3)
- [ ] `pith-counter` — animated number ticker, easing options
- [ ] `pith-reveal` — scroll-triggered Intersection Observer reveal
- [ ] `pith-magnetic` — cursor-following magnetic button
- [ ] `pith-typewriter` — character-by-character text reveal

### Phase 5 — Docs Site (apps/docs)
- [ ] Theme switcher (live toggle between glass / brutal / ink)
- [ ] Interactive component playground
- [ ] Copy-paste code examples
- [ ] Deploy to Vercel

### Phase 6 — Publishing
- [ ] Finalise exports map in package.json
- [ ] Write complete README with CDN + npm install examples
- [ ] npm publish @pith/ui
- [ ] npm publish @pith/react
- [ ] CDN verification via esm.sh

### Phase 7 — Portfolio Integration
- [ ] Use `pith-button`, `pith-card` etc. on portfolio site itself
- [ ] Link to npm + live docs from portfolio

---

## Guiding Principles

1. **A11y drives markup** — ARIA attributes determine state, CSS derives from them
2. **Container-first** — `@container` over `@media` always. Components adapt to given space.
3. **Tokens pierce Shadow DOM** — CSS vars are the only theming mechanism
4. **No global CSS pollution** — component selectors never escape Shadow DOM
5. **Reduced motion respected** — every animation has a `prefers-reduced-motion` override
6. **Forced colors supported** — every interactive element has an `@media (forced-colors)` block
