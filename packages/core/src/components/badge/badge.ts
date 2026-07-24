import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './badge.css?raw'

/**
 * `pith-badge` — Small status indicator or label.
 *
 * @tag pith-badge
 * @slot - Badge text content
 * @attr {'default'|'primary'|'success'|'warning'|'danger'} variant
 * @attr {boolean} dot - Render as a status dot (hides text)
 * @attr {boolean} removable - Show a remove/close button
 * @fires pith-remove - Fired (and element removed) when close button is clicked
 */
@customElement('pith-badge')
export class PithBadge extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ reflect: true })
  variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default'

  @property({ type: Boolean, reflect: true })
  dot = false

  @property({ type: Boolean, reflect: true })
  removable = false

  private _handleRemove(e: MouseEvent) {
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('pith-remove', { bubbles: true, composed: true }))
    this.remove()
  }

  override render() {
    return html`
      <span class="badge ${this.variant}" role=${this.dot ? 'presentation' : 'status'}>
        ${!this.dot ? html`<span class="label"><slot></slot></span>` : nothing}
        ${this.removable && !this.dot ? html`
          <button class="remove" aria-label="Remove" @click=${this._handleRemove}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        ` : nothing}
      </span>
    `
  }
}
