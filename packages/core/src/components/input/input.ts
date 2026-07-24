import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './input.css?raw'

/**
 * `pith-input` — Accessible, themeable text input.
 *
 * Form-associated custom element — participates in native `<form>` submission
 * and constraint validation via `ElementInternals`.
 *
 * @tag pith-input
 *
 * @fires pith-input  - On every keystroke. `detail.value` is the current string.
 * @fires pith-change - On commit (blur / Enter). `detail.value` is the committed string.
 *
 * @attr {string}  label       - Visible label above the input.
 * @attr {string}  placeholder - Placeholder hint text.
 * @attr {string}  value       - Current value (reflects to attribute).
 * @attr {string}  name        - Form field name.
 * @attr {'text'|'email'|'password'|'number'|'search'|'tel'|'url'} type - Input type (default: 'text').
 * @attr {boolean} required    - Marks field as required; shows asterisk on label.
 * @attr {boolean} disabled    - Dims and blocks interaction.
 * @attr {string}  error       - Error message shown below (also sets aria-invalid).
 * @attr {string}  hint        - Helper text shown below (hidden when error is set).
 * @attr {'sm'|'md'|'lg'} size - Input size (default: 'md').
 *
 * @csspart label       - The `<label>` element.
 * @csspart control     - The border+focus wrapper div.
 * @csspart input       - The raw `<input>` element.
 * @csspart message     - The hint/error `<p>` element.
 *
 * @example
 * <pith-input label="Email" type="email" placeholder="you@example.com" required></pith-input>
 * <pith-input label="Username" hint="Letters and numbers only" value="alice"></pith-input>
 * <pith-input label="Password" type="password" error="Must be 8+ characters" required></pith-input>
 */
@customElement('pith-input')
export class PithInput extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals

  private static _seq = 0
  private readonly _n = PithInput._seq++
  private get _uid() { return `pith-input-${this._n}` }

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  /** Visible label text. */
  @property() label = ''

  /** Placeholder hint. */
  @property() placeholder = ''

  /** Current value. */
  @property({ reflect: true }) value = ''

  /** Form field name. */
  @property() name = ''

  /** Input type. */
  @property({ reflect: true }) type:
    | 'text' | 'email' | 'password' | 'number'
    | 'search' | 'tel' | 'url' = 'text'

  /** Required — shows asterisk and wires aria-required. */
  @property({ type: Boolean, reflect: true }) required = false

  /** Disables interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Error message. Shown below; sets aria-invalid="true". */
  @property() error = ''

  /** Helper text. Hidden when error is set. */
  @property() hint = ''

  /** Visual size. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  private _onInput(e: Event): void {
    const target = e.target as HTMLInputElement
    this.value = target.value
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new CustomEvent('pith-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onChange(e: Event): void {
    const target = e.target as HTMLInputElement
    this.value = target.value
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new CustomEvent('pith-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  override render() {
    const hasError = this.error.length > 0
    const hasHint = !hasError && this.hint.length > 0
    const msgId = hasError || hasHint ? `${this._uid}-msg` : ''

    return html`
      <div class="root">

        ${this.label ? html`
          <label class="label" part="label" for=${this._uid}>
            ${this.label}
            ${this.required
              ? html`<span class="req" aria-hidden="true">*</span>`
              : nothing}
          </label>
        ` : nothing}

        <div class="control ${hasError ? 'is-error' : ''}" part="control">
          <input
            class="input"
            part="input"
            id=${this._uid}
            type=${this.type}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            name=${this.name || nothing}
            aria-describedby=${msgId || nothing}
            aria-invalid=${hasError ? 'true' : nothing}
            @input=${this._onInput}
            @change=${this._onChange}
          />
        </div>

        ${hasError
          ? html`<p class="message is-error" part="message" id=${`${this._uid}-msg`} role="alert">${this.error}</p>`
          : nothing}
        ${hasHint
          ? html`<p class="message is-hint" part="message" id=${`${this._uid}-msg`}>${this.hint}</p>`
          : nothing}

      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-input': PithInput
  }
}
