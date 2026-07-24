import React from 'react'
import { createComponent } from '@lit/react'
import { PithSidebarItem } from '@pith/ui'

/**
 * React wrapper for `<pith-sidebar-item>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const SidebarItem = createComponent({
  react: React,
  tagName: 'pith-sidebar-item',
  elementClass: PithSidebarItem,
})

export type { PithSidebarItem }
