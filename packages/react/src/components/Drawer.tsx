import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithDrawer } from '@pith/ui'

/**
 * React wrapper for `<pith-drawer>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Drawer = createComponent({
  react: React,
  tagName: 'pith-drawer',
  elementClass: PithDrawer,
  events: {
    onPithClose:     'pith-close' as EventName<CustomEvent>,
  },
})

export type { PithDrawer }
