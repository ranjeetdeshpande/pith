# @pith/ui

> Web Components with three visual personalities. A11y-first, container-query-driven, zero framework lock-in.

**Pith** is a Web Components library built on [Lit](https://lit.dev). It ships three distinct visual themes — **Glass**, **Brutal**, and **Ink** — swappable via a single `data-theme` attribute with zero runtime cost.

- Works in **React, Vue, Svelte, Angular, and plain HTML** from one package
- Loadable via a plain `<script>` tag — no build step required
- A11y-first: ARIA semantics, keyboard nav, reduced motion, forced colors
- Container-query-driven — components adapt to available space, not viewport
- Modern CSS: native nesting, `:has()`, custom properties, `@container`

## Install

```bash
npm install @pith/ui lit
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

## Usage

Load the stylesheet once (tokens + themes), set a theme, and use the elements:

```html
<link rel="stylesheet" href="node_modules/@pith/ui/dist/styles.css" />

<body data-theme="ink">
  <!-- theme: glass | brutal | ink -->
  <pith-button variant="primary">Save changes</pith-button>
  <pith-button variant="ghost" loading>Saving…</pith-button>
</body>
```

Switch themes at runtime:

```js
document.documentElement.setAttribute('data-theme', 'brutal')
```

### Import just what you need

Every component is a tree-shakeable subpath export:

```js
import '@pith/ui/components/button'
import '@pith/ui/components/modal'
```

Or import everything (registers all elements):

```js
import '@pith/ui'
```

## Themes

| Theme    | Aesthetic                                       | Use case                           |
| -------- | ----------------------------------------------- | ---------------------------------- |
| `ink`    | Warm off-white, editorial, tight radius         | Blogs, portfolios, documentation   |
| `glass`  | Frosted glass, dark-first, blur, soft glows     | Dashboards, dark UI, landing pages |
| `brutal` | Hard edges, offset shadows, thick borders, mono | Portfolio standouts, bold brands   |

## Styling escape hatch

Every component exposes CSS `::part()` selectors:

```css
pith-button::part(button) {
  letter-spacing: 0.1em;
}
```

## React

Prefer typed wrappers with proper event mapping? Use [`@pith/react`](https://www.npmjs.com/package/@pith/react).

## License

MIT © Ranjeet Deshpande
