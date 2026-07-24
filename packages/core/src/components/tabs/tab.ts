import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './tab.css?raw'

@customElement('pith-tab')
export class PithTab extends LitElement {
  /**
   * Focus is delegated to the inner <button> so calling
   * pithTabElement.focus() works for keyboard nav in pith-tabs.
   */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override styles = unsafeCSS(styles)

  /** Must match the `value` of a sibling `pith-tab-panel`. */
  @property({ reflect: true })
  value = ''

  /** Set by the parent `pith-tabs` container — do not set manually. */
  @property({ type: Boolean, reflect: true })
  active = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  private _onClick(): void {
    if (this.disabled) return
    this.dispatchEvent(new CustomEvent('pith-tab-select', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  override render() {
    return html`
      <button
        class="item"
        role="tab"
        type="button"
        aria-selected="${this.active ? 'true' : 'false'}"
        tabindex="${this.active ? '0' : '-1'}"
        ?disabled="${this.disabled}"
        @click="${this._onClick}">
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-tab': PithTab
  }
}
