import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithSwitch } from '@pith/ui'

/**
 * React wrapper for `<pith-switch>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Switch = createComponent({
  react: React,
  tagName: 'pith-switch',
  elementClass: PithSwitch,
  events: {
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithSwitch }
