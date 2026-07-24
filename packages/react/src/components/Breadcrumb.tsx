import React from 'react'
import { createComponent } from '@lit/react'
import { PithBreadcrumb } from '@pith/ui'

/**
 * React wrapper for `<pith-breadcrumb>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Breadcrumb = createComponent({
  react: React,
  tagName: 'pith-breadcrumb',
  elementClass: PithBreadcrumb,
})

export type { PithBreadcrumb }
