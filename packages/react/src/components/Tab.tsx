import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithTab } from '@pith/ui'

/**
 * React wrapper for `<pith-tab>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Tab = createComponent({
  react: React,
  tagName: 'pith-tab',
  elementClass: PithTab,
  events: {
    onPithTabSelect: 'pith-tab-select' as EventName<CustomEvent>,
  },
})

export type { PithTab }
