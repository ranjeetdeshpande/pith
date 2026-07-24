import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithCheckbox } from '@pith/ui'

/**
 * React wrapper for `<pith-checkbox>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Checkbox = createComponent({
  react: React,
  tagName: 'pith-checkbox',
  elementClass: PithCheckbox,
  events: {
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithCheckbox }
