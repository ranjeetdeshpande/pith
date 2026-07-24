import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './switch.css?raw'

@customElement('pith-switch')
export class PithSwitch extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Whether the switch is on. Reflects to the `checked` attribute. */
  @property({ type: Boolean, reflect: true })
  checked = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  /** Visual size of the switch track. */
  @property({ reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md'

  @state() private _hasLabel = false

  private _onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasLabel = slot.assignedNodes({ flatten: true }).some(
      n => n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim().length ?? 0) > 0
    )
  }

  private _toggle(): void {
    if (this.disabled) return
    this.checked = !this.checked
    this.dispatchEvent(new CustomEvent('pith-change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }))
  }

  override render() {
    return html`
      <button
        class="root"
        role="switch"
        type="button"
        aria-checked="${this.checked ? 'true' : 'false'}"
        ?disabled="${this.disabled}"
        @click="${this._toggle}">
        <span class="track">
          <span class="thumb"></span>
        </span>
        <span class="label ${this._hasLabel ? '' : 'is-empty'}">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-switch': PithSwitch
  }
}
