import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithInput } from '@pith/ui'

/**
 * React wrapper for `<pith-input>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Input = createComponent({
  react: React,
  tagName: 'pith-input',
  elementClass: PithInput,
  events: {
    onPithInput:     'pith-input' as EventName<CustomEvent>,
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithInput }
