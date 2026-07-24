import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './checkbox.css?raw'

/**
 * `pith-checkbox` — Accessible, form-associated checkbox with indeterminate support.
 *
 * @tag pith-checkbox
 *
 * @slot - Label text
 *
 * @fires pith-change - `{ detail: { checked: boolean, indeterminate: boolean } }`
 *
 * @attr {boolean}        checked       - Checked state
 * @attr {boolean}        indeterminate - Indeterminate (mixed) state — overrides checked visually
 * @attr {boolean}        disabled      - Disabled
 * @attr {boolean}        required      - Required for form validation
 * @attr {string}         name          - Form field name
 * @attr {string}         value         - Submitted value (default: 'on')
 * @attr {'sm'|'md'|'lg'} size          - Size variant (default: md)
 *
 * @example
 * <pith-checkbox name="agree" required>I agree to the terms</pith-checkbox>
 */
@customElement('pith-checkbox')
export class PithCheckbox extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals
  private static _seq = 0
  private readonly _uid = `pith-checkbox-${PithCheckbox._seq++}`

  @query('input') private _input!: HTMLInputElement

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  @property({ type: Boolean, reflect: true }) checked       = false
  @property({ type: Boolean, reflect: true }) indeterminate = false
  @property({ type: Boolean, reflect: true }) disabled      = false
  @property({ type: Boolean })                required      = false
  @property()                                 name          = ''
  @property()                                 value         = 'on'
  @property({ reflect: true })                size: 'sm' | 'md' | 'lg' = 'md'

  @state() private _hasLabel = false

  protected override updated(changed: PropertyValues): void {
    if ((changed.has('indeterminate') || changed.has('checked')) && this._input) {
      this._input.indeterminate = this.indeterminate
    }
    if (changed.has('checked') || changed.has('indeterminate')) {
      this._internals.setFormValue(
        this.checked && !this.indeterminate ? this.value : null
      )
    }
  }

  private _onLabelChange(e: Event): void {
    this._hasLabel = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).some(
      n => n.nodeType !== Node.TEXT_NODE || (n.textContent?.trim().length ?? 0) > 0,
    )
  }

  private _onChange(): void {
    if (this.disabled) return
    this.checked = this._input.checked
    this.indeterminate = false
    this._internals.setFormValue(this.checked ? this.value : null)
    this.dispatchEvent(
      new CustomEvent('pith-change', {
        detail: { checked: this.checked, indeterminate: false },
        bubbles: true,
        composed: true,
      }),
    )
  }

  override render() {
    return html`
      <label class="root" for=${this._uid}>
        <input
          id=${this._uid}
          type="checkbox"
          class="sr-only"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          value=${this.value}
          @change=${this._onChange}
        />
        <span class="box" aria-hidden="true">
          ${this.indeterminate
            ? html`<svg class="icon" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>`
            : this.checked
            ? html`<svg class="icon" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`
            : nothing}
        </span>
        <span class="label ${this._hasLabel ? '' : 'is-empty'}">
          <slot @slotchange=${this._onLabelChange}></slot>
        </span>
      </label>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-checkbox': PithCheckbox }
}
