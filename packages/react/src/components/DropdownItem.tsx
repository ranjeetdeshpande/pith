import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithDropdownItem } from '@pith/ui'

/**
 * React wrapper for `<pith-dropdown-item>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const DropdownItem = createComponent({
  react: React,
  tagName: 'pith-dropdown-item',
  elementClass: PithDropdownItem,
  events: {
    onPithSelect:    'pith-select' as EventName<CustomEvent>,
  },
})

export type { PithDropdownItem }
