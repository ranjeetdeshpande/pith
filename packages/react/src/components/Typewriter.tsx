import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithTypewriter } from '@pith/ui'

/**
 * React wrapper for `<pith-typewriter>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Typewriter = createComponent({
  react: React,
  tagName: 'pith-typewriter',
  elementClass: PithTypewriter,
  events: {
    onPithTypeDone:  'pith-type-done' as EventName<CustomEvent>,
    onPithEraseDone: 'pith-erase-done' as EventName<CustomEvent>,
  },
})

export type { PithTypewriter }
