import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithSelect } from '@pith/ui'

/**
 * React wrapper for `<pith-select>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Select = createComponent({
  react: React,
  tagName: 'pith-select',
  elementClass: PithSelect,
  events: {
    onPithChange:    'pith-change' as EventName<CustomEvent>,
    onPithOpen:      'pith-open' as EventName<CustomEvent>,
    onPithClose:     'pith-close' as EventName<CustomEvent>,
  },
})

export type { PithSelect }
