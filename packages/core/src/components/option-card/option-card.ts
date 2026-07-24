import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './option-card.css?raw'

/**
 * `pith-option-card` — Clickable selection card with heading, description, and optional icon.
 *
 * Behaves as a **radio button** by default: cards sharing the same `name` attribute
 * form a group — selecting one deselects the others automatically, no wrapper needed.
 * Add `multiple` to switch to **checkbox** behaviour: each card toggles independently.
 *
 * Form-associated — reports its `value` when selected, nothing when not.
 *
 * @tag pith-option-card
 *
 * @slot icon - Optional leading icon (16×16 SVG recommended).
 *
 * @fires pith-change   - `detail.{ value: string, selected: boolean }` — select/checkbox mode.
 * @fires pith-activate - `detail.{ value: string }` — action mode only, fired on every click.
 *
 * @attr {'select'|'action'} variant - Behaviour mode. Default 'select'.
 * @attr {string}  heading     - Card title text.
 * @attr {string}  description - Supporting description below the heading.
 * @attr {string}  value       - Form value (select) or identifier (action).
 * @attr {string}  name        - Group name. Cards sharing a name form a radio group (select mode).
 * @attr {boolean} selected    - Whether this card is selected (select mode; reflects to attribute).
 * @attr {boolean} multiple    - Checkbox mode — toggle independently, ignore siblings.
 * @attr {boolean} disabled    - Dims and blocks interaction.
 *
 * @example
 * <!-- Radio group — single select -->
 * <pith-option-card name="filter" value="none" heading="None" description="Original colours"></pith-option-card>
 * <pith-option-card name="filter" value="bw"   heading="Black & White" description="Removes all colour" selected></pith-option-card>
 *
 * <!-- Checkbox mode — multi-select -->
 * <pith-option-card multiple name="features" value="a11y" heading="Accessibility" description="ARIA + keyboard"></pith-option-card>
 * <pith-option-card multiple name="features" value="dark" heading="Dark mode"     description="Automatic dark tokens"></pith-option-card>
 */
@customElement('pith-option-card')
export class PithOptionCard extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  /**
   * Behaviour variant.
   * - `'select'` (default) — radio/checkbox selection card.
   * - `'action'` — CTA button tile; fires `pith-activate`, ignores selection state.
   */
  @property({ reflect: true }) variant: 'select' | 'action' = 'select'

  /** Card heading / title. */
  @property() heading = ''

  /** Supporting description text. */
  @property() description = ''

  /** Form value submitted when selected. */
  @property() value = ''

  /** Group name — cards sharing a name form a radio group. */
  @property() name = ''

  /** Whether this card is currently selected. */
  @property({ type: Boolean, reflect: true }) selected = false

  /** Checkbox mode — each card toggles independently. */
  @property({ type: Boolean }) multiple = false

  /** Disables interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private _hasIcon = false

  // Stable references so addEventListener/removeEventListener pair correctly
  private readonly _boundClick   = () => { this._handleSelect() }
  private readonly _boundKeydown = (e: KeyboardEvent) => { this._handleKeydown(e) }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click',   this._boundClick)
    this.addEventListener('keydown', this._boundKeydown)
    this._syncAria()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click',   this._boundClick)
    this.removeEventListener('keydown', this._boundKeydown)
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed)
    this._syncAria()
    if (changed.has('selected')) {
      this._internals.setFormValue(this.selected ? this.value : null)
    }
  }

  private _syncAria(): void {
    if (this.variant === 'action') {
      this.setAttribute('role', 'button')
      this.removeAttribute('aria-checked')
    } else {
      this.setAttribute('role',         this.multiple ? 'checkbox' : 'radio')
      this.setAttribute('aria-checked', String(this.selected))
    }
    this.setAttribute('tabindex', this.disabled ? '-1' : '0')
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.removeAttribute('aria-disabled')
    }
  }

  private _getSiblings(): NodeListOf<PithOptionCard> {
    if (!this.name) {
      // Empty NodeList — no siblings to deselect
      return document.querySelectorAll<PithOptionCard>('__none__')
    }
    const sel  = `pith-option-card[name="${CSS.escape(this.name)}"]`
    const form = this.closest('form')
    const root = form ?? (this.getRootNode() as Document | ShadowRoot)
    return (root as Document).querySelectorAll<PithOptionCard>(sel)
  }

  private _handleSelect(): void {
    if (this.disabled) return

    if (this.variant === 'action') {
      this.dispatchEvent(new CustomEvent('pith-activate', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }))
      return
    }

    if (this.multiple) {
      this.selected = !this.selected
    } else {
      if (this.selected) return // radio — clicking selected card is a no-op
      this._getSiblings().forEach(card => {
        if (card !== this) card.selected = false
      })
      this.selected = true
    }

    this.dispatchEvent(new CustomEvent('pith-change', {
      detail: { value: this.value, selected: this.selected },
      bubbles: true,
      composed: true,
    }))
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this._handleSelect()
    }
  }

  private _onIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0
  }

  override render() {
    return html`
      <div class="card">

        <span class="icon-wrap ${this._hasIcon ? '' : 'is-empty'}">
          <slot name="icon" @slotchange=${this._onIconSlotChange}></slot>
        </span>

        <span class="text">
          ${this.heading
            ? html`<span class="heading">${this.heading}</span>`
            : nothing}
          ${this.description
            ? html`<span class="desc">${this.description}</span>`
            : nothing}
        </span>

        ${this.variant === 'action'
          ? html`
            <span class="arrow" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                  stroke="currentColor" stroke-width="1.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>`
          : html`
            <span class="check" aria-hidden="true">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor"
                  stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>`}

      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-option-card': PithOptionCard
  }
}
