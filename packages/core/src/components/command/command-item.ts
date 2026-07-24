import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './command-item.css?raw'

/**
 * `pith-command-item` — A single item inside `pith-command`.
 *
 * @tag pith-command-item
 *
 * @slot         - Item label text
 * @slot icon    - Leading icon
 * @slot shortcut - Trailing keyboard shortcut hint (e.g. "⌘K")
 *
 * @fires pith-command-select - Bubbles up when the item is activated (click or Enter).
 *
 * @attr {string}  value    - Unique identifier for this command
 * @attr {string}  group    - Group name (for visual grouping headers)
 * @attr {string}  keywords - Space-separated extra search terms
 * @attr {boolean} disabled - Disabled state
 *
 * @example
 * <pith-command-item value="new-file" keywords="create add">
 *   <svg slot="icon">…</svg>
 *   New File
 *   <kbd slot="shortcut">⌘N</kbd>
 * </pith-command-item>
 */
@customElement('pith-command-item')
export class PithCommandItem extends LitElement {
  static override styles = unsafeCSS(styles)

  @property() value    = ''
  @property() group    = ''
  @property() keywords = ''
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private _hasIcon     = false
  @state() private _hasShortcut = false

  private _onIconChange(e: Event): void {
    this._hasIcon = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  private _onShortcutChange(e: Event): void {
    this._hasShortcut = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  private _onActivate(e?: Event): void {
    if (this.disabled) return
    e?.stopPropagation()
    this.dispatchEvent(
      new CustomEvent('pith-command-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private _onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._onActivate()
    }
  }

  override focus(options?: FocusOptions): void {
    this.shadowRoot?.querySelector<HTMLElement>('.item')?.focus(options)
  }

  override render() {
    return html`
      <div
        class="item"
        role="option"
        tabindex=${this.disabled ? '-1' : '0'}
        aria-selected="false"
        aria-disabled=${this.disabled ? 'true' : nothing}
        @click=${this._onActivate}
        @keydown=${this._onKeydown}
      >
        <span class="icon ${this._hasIcon ? '' : 'is-empty'}" aria-hidden="true">
          <slot name="icon" @slotchange=${this._onIconChange}></slot>
        </span>
        <span class="label"><slot></slot></span>
        <span class="shortcut ${this._hasShortcut ? '' : 'is-empty'}" aria-hidden="true">
          <slot name="shortcut" @slotchange=${this._onShortcutChange}></slot>
        </span>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-command-item': PithCommandItem }
}
