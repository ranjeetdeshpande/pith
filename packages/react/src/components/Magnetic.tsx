import React from 'react'
import { createComponent } from '@lit/react'
import { PithMagnetic } from '@pith/ui'

/**
 * React wrapper for `<pith-magnetic>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Magnetic = createComponent({
  react: React,
  tagName: 'pith-magnetic',
  elementClass: PithMagnetic,
})

export type { PithMagnetic }
