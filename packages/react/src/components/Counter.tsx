import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithCounter } from '@pith/ui'

/**
 * React wrapper for `<pith-counter>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Counter = createComponent({
  react: React,
  tagName: 'pith-counter',
  elementClass: PithCounter,
  events: {
    onPithComplete:  'pith-complete' as EventName<CustomEvent>,
  },
})

export type { PithCounter }
