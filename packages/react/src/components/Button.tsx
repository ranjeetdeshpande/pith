import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithButton } from '@pith/ui'

/**
 * React wrapper for `<pith-button>`.
 * All props are fully typed from the underlying Web Component.
 *
 * @example
 * import { Button } from '@pith/react'
 *
 * <Button variant="primary" onPithClick={handleClick}>
 *   Save changes
 * </Button>
 */
export const Button = createComponent({
  react: React,
  tagName: 'pith-button',
  elementClass: PithButton,
  events: {
    // Map DOM events to React-style onX props
    onPithClick:  'click'  as EventName<MouseEvent>,
    onPithFocus:  'focus'  as EventName<FocusEvent>,
    onPithBlur:   'blur'   as EventName<FocusEvent>,
  },
})

// Re-export the underlying element type for advanced use
export type { PithButton }
