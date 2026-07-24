import React from 'react'
import { createComponent } from '@lit/react'
import { PithOption } from '@pith/ui'

/**
 * React wrapper for `<pith-option>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Option = createComponent({
  react: React,
  tagName: 'pith-option',
  elementClass: PithOption,
})

export type { PithOption }
