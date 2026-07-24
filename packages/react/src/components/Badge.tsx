import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithBadge } from '@pith/ui'

/**
 * React wrapper for `<pith-badge>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Badge = createComponent({
  react: React,
  tagName: 'pith-badge',
  elementClass: PithBadge,
  events: {
    onPithRemove:    'pith-remove' as EventName<CustomEvent>,
  },
})

export type { PithBadge }
