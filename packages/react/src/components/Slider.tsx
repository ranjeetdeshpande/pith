import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithSlider } from '@pith/ui'

/**
 * React wrapper for `<pith-slider>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Slider = createComponent({
  react: React,
  tagName: 'pith-slider',
  elementClass: PithSlider,
  events: {
    onPithInput:     'pith-input' as EventName<CustomEvent>,
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithSlider }
