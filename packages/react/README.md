# @pith/react

> Typed React wrappers for [Pith UI](https://www.npmjs.com/package/@pith/ui) Web Components.

Thin (~1 kB) wrappers generated with [`@lit/react`](https://www.npmjs.com/package/@lit/react). They give you proper React props, TypeScript types inferred from the underlying elements, and React-style event props (`onPithClick`, `onPithChange`, …) instead of manual `addEventListener`.

## Install

```bash
npm install @pith/react @pith/ui react lit
```

`@pith/ui` and `lit` are peer dependencies. Importing `@pith/react` automatically registers the underlying custom elements.

## Usage

```tsx
import { Button, Modal } from '@pith/react'

function Example() {
  return (
    <Button variant="primary" onPithClick={() => console.log('clicked')}>
      Save changes
    </Button>
  )
}
```

Load the theme stylesheet once (from `@pith/ui`), and set a theme on any ancestor:

```tsx
import '@pith/ui/dist/styles.css'

<div data-theme="ink">
  {/* theme: glass | brutal | ink */}
</div>
```

## Events

Custom events are exposed as `onX` props. For example `<pith-select>` dispatches `pith-change`, so the wrapper takes `onPithChange`:

```tsx
import { Select, Option } from '@pith/react'

<Select onPithChange={(e) => console.log(e.detail.value)}>
  <Option value="a">Option A</Option>
  <Option value="b">Option B</Option>
</Select>
```

## Components

One wrapper per Pith element — `Button`, `Badge`, `Avatar`, `Card`, `Modal`, `Drawer`, `Dropdown`, `Tabs`, `Command`, `Input`, `Select`, `Switch`, `Slider`, `Checkbox`, `Toaster`, `Tooltip`, `Alert`, `Progress`, `Spinner`, `Skeleton`, `Sidebar`, `Breadcrumb`, `Accordion`, `Counter`, `Magnetic`, `Typewriter`, and more.

See [`@pith/ui`](https://www.npmjs.com/package/@pith/ui) for the full component reference, themes, and styling parts.

## License

MIT © Ranjeet Deshpande
