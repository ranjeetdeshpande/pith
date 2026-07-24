import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './card.css?raw'

/**
 * `pith-card` — Surface container with optional hover lift.
 *
 * @tag pith-card
 * @slot          - Main body content
 * @slot header   - Card header (rendered with a bottom border separator)
 * @slot footer   - Card footer (rendered with a top border and sunken bg)
 * @attr {boolean} hoverable - Enable lift-on-hover interaction
 * @csspart card   - The root card element
 */
@customElement('pith-card')
export class PithCard extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ type: Boolean, reflect: true })
  hoverable = false

  @state() private _hasHeader = false
  @state() private _hasFooter = false

  private _onHeaderChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _onFooterChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0
  }

  override render() {
    return html`
      <div class="card" part="card">
        <div class="header ${this._hasHeader ? 'has-content' : ''}">
          <slot name="header" @slotchange=${this._onHeaderChange}></slot>
        </div>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer ${this._hasFooter ? 'has-content' : ''}">
          <slot name="footer" @slotchange=${this._onFooterChange}></slot>
        </div>
      </div>
    `
  }
}
