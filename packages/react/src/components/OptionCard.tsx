import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithOptionCard } from '@pith/ui'

/**
 * React wrapper for `<pith-option-card>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const OptionCard = createComponent({
  react: React,
  tagName: 'pith-option-card',
  elementClass: PithOptionCard,
  events: {
    onPithActivate:  'pith-activate' as EventName<CustomEvent>,
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithOptionCard }
