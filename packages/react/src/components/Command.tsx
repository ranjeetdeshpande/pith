import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithCommand } from '@pith/ui'

/**
 * React wrapper for `<pith-command>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Command = createComponent({
  react: React,
  tagName: 'pith-command',
  elementClass: PithCommand,
  events: {
    onPithSelect:    'pith-select' as EventName<CustomEvent>,
    onPithClose:     'pith-close' as EventName<CustomEvent>,
  },
})

export type { PithCommand }
