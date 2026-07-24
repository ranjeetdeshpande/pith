import React from 'react'
import { createComponent } from '@lit/react'
import { PithProgress } from '@pith/ui'

/**
 * React wrapper for `<pith-progress>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Progress = createComponent({
  react: React,
  tagName: 'pith-progress',
  elementClass: PithProgress,
})

export type { PithProgress }
