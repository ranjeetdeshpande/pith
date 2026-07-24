import React from 'react'
import { createComponent } from '@lit/react'
import { PithTabPanel } from '@pith/ui'

/**
 * React wrapper for `<pith-tab-panel>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const TabPanel = createComponent({
  react: React,
  tagName: 'pith-tab-panel',
  elementClass: PithTabPanel,
})

export type { PithTabPanel }
