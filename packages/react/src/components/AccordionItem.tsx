import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithAccordionItem } from '@pith/ui'

/**
 * React wrapper for `<pith-accordion-item>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const AccordionItem = createComponent({
  react: React,
  tagName: 'pith-accordion-item',
  elementClass: PithAccordionItem,
  events: {
    onPithItemToggle: 'pith-item-toggle' as EventName<CustomEvent>,
  },
})

export type { PithAccordionItem }
