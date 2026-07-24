import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithTabs } from '@pith/ui'

/**
 * React wrapper for `<pith-tabs>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Tabs = createComponent({
  react: React,
  tagName: 'pith-tabs',
  elementClass: PithTabs,
  events: {
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithTabs }
