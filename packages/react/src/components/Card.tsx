import React from 'react'
import { createComponent } from '@lit/react'
import { PithCard } from '@pith/ui'

/**
 * React wrapper for `<pith-card>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Card = createComponent({
  react: React,
  tagName: 'pith-card',
  elementClass: PithCard,
})

export type { PithCard }
