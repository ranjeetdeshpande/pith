import React from 'react'
import { createComponent } from '@lit/react'
import { PithSidebarSection } from '@pith/ui'

/**
 * React wrapper for `<pith-sidebar-section>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const SidebarSection = createComponent({
  react: React,
  tagName: 'pith-sidebar-section',
  elementClass: PithSidebarSection,
})

export type { PithSidebarSection }
