import React from 'react'
import { createComponent } from '@lit/react'
import { PithBreadcrumbItem } from '@pith/ui'

/**
 * React wrapper for `<pith-breadcrumb-item>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const BreadcrumbItem = createComponent({
  react: React,
  tagName: 'pith-breadcrumb-item',
  elementClass: PithBreadcrumbItem,
})

export type { PithBreadcrumbItem }
