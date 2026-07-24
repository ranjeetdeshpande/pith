import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import styles from './dropdown-item.css?raw'

/**
 * `pith-dropdown-item` — An individual item inside a `<pith-dropdown>`.
 *
 * @tag pith-dropdown-item
 *
 * @slot         - Item label text
 * @slot icon    - Optional leading icon
 *
 * @fires pith-select - Bubbles. `detail.value` holds the item's `value` attr.
 *
 * @attr {string}            value   - Identifies this item in `pith-select` events
 * @attr {boolean}           disabled - Greys out and prevents interaction
 * @attr {'default'|'danger'} variant - Visual emphasis (default: default)
 * @attr {boolean}           divider  - Adds a thin separator above this item
 */
@customElement('pith-dropdown-item')
export class PithDropdownItem extends LitElement {
  static override styles = unsafeCSS(styles)

  @property()
  value = ''

  @property({ type: Boolean, reflect: true })
  disabled = false

  @property({ reflect: true })
  variant: 'default' | 'danger' = 'default'

  /** Render a top separator line above this item. */
  @property({ type: Boolean, reflect: true })
  divider = false

  @state() private _hasIcon = false

  @query('button')
  private _button!: HTMLButtonElement

  /** Forward focus to the inner button (enables programmatic focus from the parent dropdown). */
  override focus(options?: FocusOptions): void {
    this._button?.focus(options)
  }

  private _onIconChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _onClick(): void {
    if (this.disabled) return
    this.dispatchEvent(
      new CustomEvent('pith-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  override render() {
    return html`
      <button
        class="item ${this.variant}"
        role="menuitem"
        ?disabled=${this.disabled}
        tabindex="-1"
        @click=${this._onClick}
      >
        <span class="icon ${this._hasIcon ? '' : 'is-empty'}">
          <slot name="icon" @slotchange=${this._onIconChange}></slot>
        </span>
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-dropdown-item': PithDropdownItem
  }
}
