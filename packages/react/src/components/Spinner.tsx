import React from 'react'
import { createComponent } from '@lit/react'
import { PithSpinner } from '@pith/ui'

/**
 * React wrapper for `<pith-spinner>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Spinner = createComponent({
  react: React,
  tagName: 'pith-spinner',
  elementClass: PithSpinner,
})

export type { PithSpinner }
