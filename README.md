# Pith

> The essential substance. Three visual personalities. Zero framework lock-in.

**Pith** is a Web Components library built on [Lit](https://lit.dev). It ships with three distinct visual themes — **Glass**, **Brutal**, and **Ink** — swappable via a single `data-theme` attribute with zero runtime cost.

- Works in **React, Vue, Svelte, Angular, and plain HTML** from one package
- Loadable via `<script>` tag — no build step required
- A11y-first: ARIA semantics, keyboard nav, reduced motion, forced colors
- Container-query-driven — components adapt to available space, not viewport
- Modern CSS: native nesting, `:has()`, custom properties, `@container`
- ~20kb total (gzipped) including Lit runtime

---

## Install

```bash
npm install @pith/ui lit
# or
pnpm add @pith/ui lit
```

For React:

```bash
npm install @pith/react @pith/ui lit
```

## CDN (no install)

Plain `<script>` tag — no build step, works anywhere:

```html
<link rel="stylesheet" href="https://unpkg.com/@pith/ui/dist/pith.min.css" />
<script src="https://unpkg.com/@pith/ui/dist/pith.min.js" defer></script>
```

ES modules (tree-shakeable) via esm.sh:

```html
<link rel="stylesheet" href="https://esm.sh/@pith/ui/styles.css" />
<script type="module" src="https://esm.sh/@pith/ui"></script>
```

---

## Usage

### Load styles once (tokens + themes)

```html
<link rel="stylesheet" href="node_modules/@pith/ui/dist/styles.css" />
```

### Set a theme

```html
<body data-theme="ink">
  <!-- or: glass | brutal | ink -->
</body>
```

### Use components

```html
<pith-button variant="primary">Save changes</pith-button>
<pith-button variant="ghost" loading>Saving…</pith-button>

<pith-button variant="primary">
  <svg slot="icon-start">…</svg>
  Upload file
</pith-button>
```

### React

```tsx
import { Button } from '@pith/react'

<Button variant="primary" onPithClick={handleClick}>
  Save changes
</Button>
```

---

## Themes

| Theme    | Aesthetic                                       | Use case                          |
| -------- | ----------------------------------------------- | --------------------------------- |
| `ink`    | Warm off-white, editorial, tight radius         | Blogs, portfolios, documentation  |
| `glass`  | Frosted glass, dark-first, blur, soft glows     | Dashboards, dark UI, landing pages|
| `brutal` | Hard edges, offset shadows, thick borders, mono | Portfolio standouts, bold brands  |

Switch at runtime:

```js
document.documentElement.setAttribute('data-theme', 'brutal')
```

---

## Component Slots & Parts

Every component exposes CSS `::part()` selectors for escape-hatch styling:

```css
pith-button::part(button) {
  letter-spacing: 0.1em;
}
```

---

## Packages

| Package        | Description                          |
| -------------- | ------------------------------------ |
| `@pith/ui`     | Web Components — works everywhere    |
| `@pith/react`  | React wrappers via `@lit/react`      |

---

## License

MIT
