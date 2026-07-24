import { LitElement, html, svg, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import styles from './toaster.css?raw'

export interface ToastOptions {
  /** The message to display */
  message: string
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  /** Auto-dismiss delay in ms. Set to 0 to disable. Default: 4000 */
  duration?: number
}

interface ToastItem extends Required<ToastOptions> {
  id: string
  removing: boolean
}

/**
 * `pith-toaster` — Fixed-position notification container.
 *
 * Place once near the end of `<body>`. Use the static `PithToaster.toast()`
 * method or instance `push()` for imperative notifications.
 *
 * @tag pith-toaster
 *
 * @example
 * // In HTML:
 * <pith-toaster></pith-toaster>
 *
 * // Anywhere in JS:
 * PithToaster.toast({ message: 'Saved!', variant: 'success' })
 */
@customElement('pith-toaster')
export class PithToaster extends LitElement {
  static override styles = unsafeCSS(styles)

  @state() private _toasts: ToastItem[] = []

  /**
   * Global imperative API.
   * Finds the first `<pith-toaster>` on the page and pushes a notification.
   */
  static toast(options: ToastOptions) {
    const el = document.querySelector<PithToaster>('pith-toaster')
    if (el) el.push(options)
    else console.warn('[pith] No <pith-toaster> found in the document.')
  }

  /** Instance API — push a toast onto this toaster. */
  push(options: ToastOptions) {
    const id       = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const variant  = options.variant  ?? 'default'
    const duration = options.duration ?? 4000
    this._toasts   = [...this._toasts, { ...options, id, variant, duration, removing: false }]
    if (duration > 0) setTimeout(() => this._dismiss(id), duration)
  }

  private _dismiss(id: string) {
    this._toasts = this._toasts.map(t => t.id === id ? { ...t, removing: true } : t)
    setTimeout(() => {
      this._toasts = this._toasts.filter(t => t.id !== id)
    }, 180)
  }

  private _variantIcon(variant: string) {
    switch (variant) {
      case 'success': return svg`
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.5 8l2 2 3-3" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>`
      case 'warning': return svg`
        <path d="M8 2.5L1.5 13.5h13L8 2.5Z" stroke="currentColor"
              stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M8 7v2.5M8 11.5v.25" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round"/>`
      case 'danger': return svg`
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round"/>`
      case 'info': return svg`
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7.5v3.5M8 5.25v.5" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round"/>`
      default: return svg`
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7.5v3.5M8 5.25v.5" stroke="currentColor"
              stroke-width="1.75" stroke-linecap="round"/>`
    }
  }

  override render() {
    return html`
      <div class="stack"
           role="log"
           aria-live="polite"
           aria-label="Notifications"
           aria-atomic="false">
        ${this._toasts.map(t => html`
          <div class="toast ${t.variant}${t.removing ? ' removing' : ''}"
               style="--_duration: ${t.duration}ms"
               role="status">
            <span class="icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                ${this._variantIcon(t.variant)}
              </svg>
            </span>
            <span class="message">${t.message}</span>
            <button class="close"
                    aria-label="Dismiss notification"
                    @click=${() => this._dismiss(t.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2L2 10"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"/>
              </svg>
            </button>
            ${t.duration > 0
              ? html`<span class="progress" aria-hidden="true"></span>`
              : ''}
          </div>
        `)}
      </div>
    `
  }
}
