import React from 'react'
import { createComponent } from '@lit/react'
import { PithToaster } from '@pith/ui'

/**
 * React wrapper for `<pith-toaster>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Toaster = createComponent({
  react: React,
  tagName: 'pith-toaster',
  elementClass: PithToaster,
})

export type { PithToaster }
