import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithDropdown } from '@pith/ui'

/**
 * React wrapper for `<pith-dropdown>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Dropdown = createComponent({
  react: React,
  tagName: 'pith-dropdown',
  elementClass: PithDropdown,
  events: {
    onPithOpen:      'pith-open' as EventName<CustomEvent>,
    onPithClose:     'pith-close' as EventName<CustomEvent>,
  },
})

export type { PithDropdown }
