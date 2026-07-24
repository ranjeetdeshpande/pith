import React from 'react'
import { createComponent } from '@lit/react'
import { PithAccordion } from '@pith/ui'

/**
 * React wrapper for `<pith-accordion>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Accordion = createComponent({
  react: React,
  tagName: 'pith-accordion',
  elementClass: PithAccordion,
})

export type { PithAccordion }
