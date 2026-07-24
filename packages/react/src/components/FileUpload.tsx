import React from 'react'
import { createComponent, type EventName } from '@lit/react'
import { PithFileUpload } from '@pith/ui'

/**
 * React wrapper for `<pith-file-upload>`.
 * Props are typed from the underlying Web Component; `pith-*` events are
 * forwarded as `onPith*` props.
 */
export const FileUpload = createComponent({
  react: React,
  tagName: 'pith-file-upload',
  elementClass: PithFileUpload,
  events: {
    onPithChange:    'pith-change' as EventName<CustomEvent>,
  },
})

export type { PithFileUpload }
