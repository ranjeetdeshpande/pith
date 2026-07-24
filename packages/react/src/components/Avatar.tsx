import React from 'react'
import { createComponent } from '@lit/react'
import { PithAvatar } from '@pith/ui'

/**
 * React wrapper for `<pith-avatar>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const Avatar = createComponent({
  react: React,
  tagName: 'pith-avatar',
  elementClass: PithAvatar,
})

export type { PithAvatar }
