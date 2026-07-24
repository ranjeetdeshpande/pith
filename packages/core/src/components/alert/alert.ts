import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './alert.css?raw'

/**
 * `pith-alert` — Inline status / callout message.
 *
 * @tag pith-alert
 *
 * @slot         - Alert body text
 * @slot title   - Bold heading (optional)
 * @slot icon    - Custom icon — replaces default variant icon
 *
 * @csspart container - Outer alert box
 * @csspart icon      - Icon region
 * @csspart body      - Text content area
 * @csspart close     - Dismiss button
 *
 * @fires pith-dismiss - Fired when the alert is dismissed.
 *
 * @attr {'info'|'success'|'warning'|'danger'} variant    - Color/icon variant (default: info)
 * @attr {boolean}                             dismissible - Shows a close button
 *
 * @example
 * <pith-alert variant="success" dismissible>
 *   <span slot="title">Saved!</span>
 *   Your changes have been saved successfully.
 * </pith-alert>
 */
@customElement('pith-alert')
export class PithAlert extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ reflect: true })
  variant: 'info' | 'success' | 'warning' | 'danger' = 'info'

  @property({ type: Boolean, reflect: true })
  dismissible = false

  @state() private _hasTitle   = false
  @state() private _hasIcon    = false
  @state() private _dismissed  = false

  private _onTitleChange(e: Event): void {
    this._hasTitle = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  private _onIconChange(e: Event): void {
    this._hasIcon = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  private _dismiss(): void {
    if (this._dismissed) return
    this._dismissed = true
    this.dispatchEvent(new CustomEvent('pith-dismiss', { bubbles: true, composed: true }))
    this.addEventListener('animationend', () => this.remove(), { once: true })
  }

  private _defaultIcon() {
    switch (this.variant) {
      case 'success':
        return html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      case 'warning':
        return html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2.5L13.5 13H2.5L8 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M8 6.5v3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
        </svg>`
      case 'danger':
        return html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 4.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="10.5" r="0.75" fill="currentColor"/>
        </svg>`
      default: // info
        return html`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 7v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
        </svg>`
    }
  }

  override render() {
    return html`
      <div
        class="container ${this._dismissed ? 'is-dismissed' : ''}"
        part="container"
        role="alert"
        aria-live="polite"
      >
        <span class="icon" part="icon" aria-hidden="true">
          <slot name="icon" @slotchange=${this._onIconChange}></slot>
          ${!this._hasIcon ? this._defaultIcon() : nothing}
        </span>

        <div class="body" part="body">
          <strong class="title ${this._hasTitle ? '' : 'is-empty'}">
            <slot name="title" @slotchange=${this._onTitleChange}></slot>
          </strong>
          <span class="message"><slot></slot></span>
        </div>

        ${this.dismissible ? html`
          <button
            class="close"
            part="close"
            aria-label="Dismiss alert"
            @click=${this._dismiss}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        ` : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-alert': PithAlert }
}
