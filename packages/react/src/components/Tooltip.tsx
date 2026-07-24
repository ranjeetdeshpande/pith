import React from 'react'
import { createComponent } from '@lit/react'
import { PithTooltip } from '@pith/ui'

/**
 * React wrapper for `<pith-tooltip>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Tooltip = createComponent({
  react: React,
  tagName: 'pith-tooltip',
  elementClass: PithTooltip,
})

export type { PithTooltip }
