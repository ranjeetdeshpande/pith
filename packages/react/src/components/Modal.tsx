import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithModal } from '@pith/ui'

/**
 * React wrapper for `<pith-modal>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Modal = createComponent({
  react: React,
  tagName: 'pith-modal',
  elementClass: PithModal,
  events: {
    onPithClose:     'pith-close' as EventName<CustomEvent>,
  },
})

export type { PithModal }
