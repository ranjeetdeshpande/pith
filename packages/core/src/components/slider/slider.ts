import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './slider.css?raw'

/**
 * `pith-slider` — Accessible range slider with optional step buttons.
 *
 * Form-associated custom element — participates in native `<form>` submission.
 * The `show-buttons` attribute adds `−` and `+` controls at each end for
 * precise keyboard-free adjustment (mouse/touch).
 *
 * @tag pith-slider
 *
 * @fires pith-input  - While dragging. `detail.value` is the current number.
 * @fires pith-change - On commit (drag end / button click). `detail.value` is the number.
 *
 * @attr {string}  label        - Visible label and aria-label for the range.
 * @attr {number}  min          - Minimum value (default: 0).
 * @attr {number}  max          - Maximum value (default: 100).
 * @attr {number}  step         - Step increment (default: 1).
 * @attr {number}  value        - Current value (reflects to attribute).
 * @attr {boolean} disabled     - Dims and blocks interaction.
 * @attr {boolean} show-buttons - Shows −/+ step buttons at each end.
 * @attr {string}  name         - Form field name.
 *
 * @example
 * <!-- Basic -->
 * <pith-slider label="Volume" value="40"></pith-slider>
 *
 * <!-- With step buttons -->
 * <pith-slider label="Quantity" min="1" max="10" step="1" value="5" show-buttons></pith-slider>
 */
@customElement('pith-slider')
export class PithSlider extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals

  private static _seq = 0
  private readonly _n = PithSlider._seq++
  private get _uid() { return `pith-slider-${this._n}` }

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  /** Visible label and accessible name. */
  @property() label = ''

  /** Minimum value. */
  @property({ type: Number }) min = 0

  /** Maximum value. */
  @property({ type: Number }) max = 100

  /** Step increment. */
  @property({ type: Number }) step = 1

  /** Current value. */
  @property({ type: Number, reflect: true }) value = 50

  /** Disables interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Shows −/+ step buttons at each end. */
  @property({ type: Boolean, reflect: true, attribute: 'show-buttons' })
  showButtons = false

  /** Form field name. */
  @property() name = ''

  private get _pct(): number {
    const range = this.max - this.min
    if (range === 0) return 0
    return Math.min(100, Math.max(0, ((this.value - this.min) / range) * 100))
  }

  private _fire(eventName: string): void {
    this._internals.setFormValue(String(this.value))
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onInput(e: Event): void {
    this.value = Number((e.target as HTMLInputElement).value)
    this._fire('pith-input')
  }

  private _onChange(e: Event): void {
    this.value = Number((e.target as HTMLInputElement).value)
    this._fire('pith-change')
  }

  /** Round to the same number of decimal places as `step` to avoid float drift. */
  private _round(n: number): number {
    const dec = (String(this.step).split('.')[1] ?? '').length
    return dec > 0 ? parseFloat(n.toFixed(dec)) : Math.round(n)
  }

  private _decrement(): void {
    if (this.disabled) return
    const next = Math.max(this.min, this._round(this.value - this.step))
    if (next !== this.value) { this.value = next; this._fire('pith-change') }
  }

  private _increment(): void {
    if (this.disabled) return
    const next = Math.min(this.max, this._round(this.value + this.step))
    if (next !== this.value) { this.value = next; this._fire('pith-change') }
  }

  override render() {
    const pct = this._pct

    return html`
      <div class="root">

        ${this.label ? html`
          <div class="header">
            <label class="label" for=${this._uid}>${this.label}</label>
            <output class="value-out" for=${this._uid} aria-live="polite">${this.value}</output>
          </div>
        ` : nothing}

        <div class="track-row">

          ${this.showButtons ? html`
            <button
              class="step-btn"
              type="button"
              aria-label="Decrease ${this.label}"
              ?disabled=${this.disabled || this.value <= this.min}
              @click=${this._decrement}
            >−</button>
          ` : nothing}

          <div class="track-wrap">
            <input
              class="range"
              id=${this._uid}
              type="range"
              min=${this.min}
              max=${this.max}
              step=${this.step}
              .value=${String(this.value)}
              ?disabled=${this.disabled}
              name=${this.name || nothing}
              aria-label=${this.label || nothing}
              style="--_pct: ${pct}%"
              @input=${this._onInput}
              @change=${this._onChange}
            />
          </div>

          ${this.showButtons ? html`
            <button
              class="step-btn"
              type="button"
              aria-label="Increase ${this.label}"
              ?disabled=${this.disabled || this.value >= this.max}
              @click=${this._increment}
            >+</button>
          ` : nothing}

        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-slider': PithSlider
  }
}
