import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithAlert } from '@pith/ui'

/**
 * React wrapper for `<pith-alert>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Alert = createComponent({
  react: React,
  tagName: 'pith-alert',
  elementClass: PithAlert,
  events: {
    onPithDismiss:   'pith-dismiss' as EventName<CustomEvent>,
  },
})

export type { PithAlert }
