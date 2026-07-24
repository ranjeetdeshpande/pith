import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithCommandItem } from '@pith/ui'

/**
 * React wrapper for `<pith-command-item>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const CommandItem = createComponent({
  react: React,
  tagName: 'pith-command-item',
  elementClass: PithCommandItem,
  events: {
    onPithCommandSelect: 'pith-command-select' as EventName<CustomEvent>,
  },
})

export type { PithCommandItem }
