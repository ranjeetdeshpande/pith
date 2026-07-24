import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import styles from './button.css?raw'
import { PithSpinner } from '../spinner/spinner.js'
void PithSpinner // ensure pith-spinner is defined before this element renders

/**
 * `pith-button` — Accessible, themeable button.
 *
 * Adapts to container space via CSS container queries.
 * Visual style driven by `[data-theme]` on any ancestor.
 *
 * @tag pith-button
 *
 * @slot            - Button label text
 * @slot icon-start - Icon placed before the label
 * @slot icon-end   - Icon placed after the label
 *
 * @csspart button  - The inner <button> element
 * @csspart label   - The label <span> wrapper
 * @csspart spinner - The loading spinner wrapper
 *
 * @fires click - Native click (suppressed when disabled or loading)
 *
 * @attr {'primary'|'secondary'|'ghost'|'danger'} variant - Visual variant (default: primary)
 * @attr {'sm'|'md'|'lg'} size - Button size (default: md)
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} loading  - Shows loading spinner, prevents interaction
 *
 * @example
 * <pith-button variant="primary">Save</pith-button>
 * <pith-button variant="ghost" loading>Saving…</pith-button>
 * <pith-button variant="primary">
 *   <svg slot="icon-start" aria-hidden="true">…</svg>
 *   Upload
 * </pith-button>
 */
@customElement('pith-button')
export class PithButton extends LitElement {
  static override styles = unsafeCSS(styles)
  @property({ reflect: true })
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary'

  /** Button size */
  @property({ reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md'

  /** Disables the button. Removes from tab order and blocks click. */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /**
   * Loading state. Shows spinner and prevents interaction.
   * Sets aria-busy="true" on the inner button.
   */
  @property({ type: Boolean, reflect: true })
  loading = false

  /** Tracks whether icon-start slot has content */
  @state()
  private _hasIconStart = false

  /** Tracks whether icon-end slot has content */
  @state()
  private _hasIconEnd = false

  /** Tracks whether the default label slot has visible content */
  @state()
  private _hasLabel = true

  /** Reference to the inner <button> for programmatic focus/click */
  @query('button')
  private _button!: HTMLButtonElement

  private _handleIconStartChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIconStart = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _handleIconEndChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIconEnd = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _handleLabelChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasLabel = slot.assignedNodes({ flatten: true }).some(
      n => n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim().length ?? 0) > 0
    )
  }

  private _handleClick(e: MouseEvent): void {
    // Prevent click propagation when disabled or loading.
    // Native `disabled` handles keyboard/form, but programmatic
    // clicks and pointer events need this guard.
    if (this.disabled || this.loading) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  }

  /** Delegates focus to the inner <button> element */
  override focus(options?: FocusOptions): void {
    this._button?.focus(options)
  }

  /** Delegates programmatic click to the inner <button> element */
  override click(): void {
    this._button?.click()
  }

  override render() {
    // Class list built explicitly — no magic string manipulation
    const btnClass = [
      'btn',
      this.variant,
      this.size,
    ].join(' ')

    return html`
      <button
        part="button"
        class=${btnClass}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        @click=${this._handleClick}
      >
        <!-- icon-start slot — hidden via .is-empty when unpopulated -->
        <span
          class=${`icon icon-start${this._hasIconStart ? '' : ' is-empty'}`}
          aria-hidden="true"
        >
          <slot
            name="icon-start"
            @slotchange=${this._handleIconStartChange}
          ></slot>
        </span>

        <!-- Default slot: label text -->
        <span part="label" class=${`label${this._hasLabel ? '' : ' is-empty'}`}>
          <slot @slotchange=${this._handleLabelChange}></slot>
        </span>

        <!-- icon-end slot — hidden via .is-empty when unpopulated -->
        <span
          class=${`icon icon-end${this._hasIconEnd ? '' : ' is-empty'}`}
          aria-hidden="true"
        >
          <slot
            name="icon-end"
            @slotchange=${this._handleIconEndChange}
          ></slot>
        </span>

        <!-- Spinner — conditionally rendered when loading=true -->
        ${this.loading
          ? html`
              <span part="spinner" class="spinner" aria-hidden="true">
                <pith-spinner
                  size=${this.size === 'lg' ? 'sm' : this.size === 'sm' ? 'xs' : 'sm'}
                  label="Loading"
                ></pith-spinner>
              </span>
            `
          : nothing}
      </button>
    `
  }
}

// Extend the global element registry for TypeScript support
// Enables type-safe usage in TSX and lit-html templates
declare global {
  interface HTMLElementTagNameMap {
    'pith-button': PithButton
  }
}
