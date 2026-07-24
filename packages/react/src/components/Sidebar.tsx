import React from 'react'
import { createComponent } from '@lit/react'
import { PithSidebar } from '@pith/ui'

/**
 * React wrapper for `<pith-sidebar>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Sidebar = createComponent({
  react: React,
  tagName: 'pith-sidebar',
  elementClass: PithSidebar,
})

export type { PithSidebar }
