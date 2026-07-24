import React from 'react'
import { createComponent } from '@lit/react'
import { PithSkeleton } from '@pith/ui'

/**
 * React wrapper for `<pith-skeleton>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Skeleton = createComponent({
  react: React,
  tagName: 'pith-skeleton',
  elementClass: PithSkeleton,
})

export type { PithSkeleton }
