import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './select.css?raw'
import type { PithOption } from './option.js'

interface OptionData {
  value: string
  label: string
  disabled: boolean
}

/**
 * `pith-select` — Accessible, form-associated select / combobox.
 *
 * Place `<pith-option>` elements inside as children.
 * Add `searchable` for a type-to-filter combobox.
 *
 * @tag pith-select
 *
 * @slot - `<pith-option>` elements
 *
 * @csspart trigger - The trigger button / input wrapper
 * @csspart panel   - The floating options panel
 * @csspart listbox - The options list
 *
 * @fires pith-change - `{ detail: { value: string } }` — fires when an option is selected
 * @fires pith-open   - Fired when the panel opens
 * @fires pith-close  - Fired when the panel closes
 *
 * @attr {string}         value       - Currently selected value
 * @attr {string}         placeholder - Placeholder text (default: "Select…")
 * @attr {boolean}        disabled    - Disabled state
 * @attr {boolean}        required    - Required for form validation
 * @attr {string}         name        - Form field name
 * @attr {boolean}        searchable  - Enables type-to-filter combobox mode
 * @attr {'sm'|'md'|'lg'} size        - Size preset (default: md)
 *
 * @example
 * <pith-select name="framework" placeholder="Pick a framework">
 *   <pith-option value="lit">Lit</pith-option>
 *   <pith-option value="react">React</pith-option>
 *   <pith-option value="vue">Vue</pith-option>
 * </pith-select>
 */
@customElement('pith-select')
export class PithSelect extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals
  private static _seq = 0
  private readonly _uid = `pith-select-${PithSelect._seq++}`

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  @property({ reflect: true })            value       = ''
  @property()                             placeholder = 'Select…'
  @property({ type: Boolean, reflect: true }) open    = false
  @property({ type: Boolean, reflect: true }) disabled= false
  @property({ type: Boolean })            required    = false
  @property()                             name        = ''
  @property({ type: Boolean, reflect: true }) searchable = false
  @property({ reflect: true })            size: 'sm' | 'md' | 'lg' = 'md'

  @state() private _options: OptionData[] = []
  @state() private _query        = ''
  @state() private _highlightIdx = -1

  @query('.trigger-btn, .trigger-input') private _triggerEl!: HTMLElement
  @query('.trigger-input')               private _searchInput!: HTMLInputElement
  @query('.panel')                       private _panel!: HTMLElement

  // ── Outside-click ──────────────────────────────────────
  private _outsideHandler = (e: MouseEvent) => {
    if (
      this.open &&
      !this.contains(e.target as Node) &&
      !this.shadowRoot!.contains(e.target as Node)
    ) {
      this._close()
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('mousedown', this._outsideHandler)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('mousedown', this._outsideHandler)
  }

  // ── Lifecycle ──────────────────────────────────────────
  protected override firstUpdated(): void {
    this._readOptions()
    this._internals.setFormValue(this.value || null)
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('value')) {
      this._internals.setFormValue(this.value || null)
    }
    if (changed.has('open') && this.open) {
      // Highlight the current selection, or first item
      const idx = this._filteredOptions.findIndex(o => o.value === this.value)
      this._highlightIdx = idx >= 0 ? idx : 0
      // Focus trigger so keyboard events keep working
      this.updateComplete.then(() => this._triggerEl?.focus())
    }
  }

  // ── Options ────────────────────────────────────────────
  private _readOptions(): void {
    const elements = this.querySelectorAll<PithOption>('pith-option')
    this._options = Array.from(elements).map(el => ({
      value: el.value || el.getAttribute('value') || '',
      label: el.textContent?.trim() ?? el.value,
      disabled: el.disabled,
    }))
  }

  private _onSlotChange(): void {
    this._readOptions()
  }

  private get _filteredOptions(): OptionData[] {
    if (!this.searchable || !this._query) return this._options
    const q = this._query.toLowerCase()
    return this._options.filter(
      o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    )
  }

  private get _selectedLabel(): string {
    return this._options.find(o => o.value === this.value)?.label ?? ''
  }

  private get _activeOptionId(): string {
    const idx = this._highlightIdx
    return idx >= 0 ? `${this._uid}-opt-${idx}` : ''
  }

  // ── Open / close ───────────────────────────────────────
  private _open(): void {
    if (this.disabled) return
    this._query = ''
    this.open = true
    this.dispatchEvent(new CustomEvent('pith-open', { bubbles: true, composed: true }))
  }

  private _close(): void {
    this.open = false
    this._highlightIdx = -1
    this.dispatchEvent(new CustomEvent('pith-close', { bubbles: true, composed: true }))
  }

  private _selectOption(opt: OptionData): void {
    this.value = opt.value
    this._internals.setFormValue(this.value)
    this.dispatchEvent(
      new CustomEvent('pith-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
    this._close()
    this._triggerEl?.focus()
  }

  private _scrollHighlightedIntoView(): void {
    this.updateComplete.then(() => {
      const options = this.shadowRoot?.querySelectorAll<HTMLElement>('.option')
      options?.[this._highlightIdx]?.scrollIntoView({ block: 'nearest' })
    })
  }

  // ── Event handlers ─────────────────────────────────────
  private _onTriggerClick(): void {
    this.open ? this._close() : this._open()
  }

  private _onSearchInput(e: Event): void {
    this._query = (e.target as HTMLInputElement).value
    this._highlightIdx = 0
  }

  private _onTriggerKeydown(e: KeyboardEvent): void {
    const opts = this._filteredOptions

    if (!this.open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        this._open()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        this._highlightIdx = Math.min(this._highlightIdx + 1, opts.length - 1)
        this._scrollHighlightedIntoView()
        break
      case 'ArrowUp':
        e.preventDefault()
        this._highlightIdx = Math.max(this._highlightIdx - 1, 0)
        this._scrollHighlightedIntoView()
        break
      case 'Home':
        e.preventDefault()
        this._highlightIdx = 0
        break
      case 'End':
        e.preventDefault()
        this._highlightIdx = opts.length - 1
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (this._highlightIdx >= 0 && this._highlightIdx < opts.length) {
          const opt = opts[this._highlightIdx]
          if (opt) this._selectOption(opt)
        }
        break
      case 'Escape':
        e.preventDefault()
        this._close()
        break
      case 'Tab':
        this._close()
        break
    }
  }

  // ── Render ─────────────────────────────────────────────
  override render() {
    const opts = this._filteredOptions
    const listboxId = `${this._uid}-listbox`

    const chevron = html`
      <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `

    const trigger = this.searchable
      ? html`
          <div class="trigger-wrapper" part="trigger">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M10 10l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            <input
              class="trigger-input"
              type="text"
              role="combobox"
              autocomplete="off"
              aria-expanded=${this.open ? 'true' : 'false'}
              aria-haspopup="listbox"
              aria-controls=${listboxId}
              aria-activedescendant=${this._activeOptionId || nothing}
              .value=${this.open ? this._query : this._selectedLabel}
              placeholder=${this._selectedLabel || this.placeholder}
              ?disabled=${this.disabled}
              @click=${this._onTriggerClick}
              @input=${this._onSearchInput}
              @keydown=${this._onTriggerKeydown}
            />
            ${chevron}
          </div>
        `
      : html`
          <button
            class="trigger-btn"
            part="trigger"
            type="button"
            role="combobox"
            aria-expanded=${this.open ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-controls=${listboxId}
            aria-activedescendant=${this._activeOptionId || nothing}
            ?disabled=${this.disabled}
            @click=${this._onTriggerClick}
            @keydown=${this._onTriggerKeydown}
          >
            <span class="trigger-value ${!this._selectedLabel ? 'is-placeholder' : ''}">
              ${this._selectedLabel || this.placeholder}
            </span>
            ${chevron}
          </button>
        `

    return html`
      <div class="root">
        ${trigger}

        <!-- Hidden slot — pith-option elements are data containers in light DOM -->
        <slot @slotchange=${this._onSlotChange} style="display:none"></slot>

        <!-- Floating options panel -->
        <div
          id=${listboxId}
          class="panel ${this.open ? 'is-open' : ''}"
          part="panel"
        >
          <div
            class="listbox"
            part="listbox"
            role="listbox"
            aria-label="Options"
          >
            ${opts.length === 0
              ? html`<div class="empty">No results</div>`
              : opts.map((opt, i) => html`
                  <div
                    id=${`${this._uid}-opt-${i}`}
                    class="option
                      ${opt.value === this.value ? 'is-selected' : ''}
                      ${opt.disabled ? 'is-disabled' : ''}
                      ${i === this._highlightIdx ? 'is-highlighted' : ''}"
                    role="option"
                    aria-selected=${opt.value === this.value ? 'true' : 'false'}
                    aria-disabled=${opt.disabled ? 'true' : nothing}
                    @click=${() => !opt.disabled && this._selectOption(opt)}
                    @pointerenter=${() => { if (!opt.disabled) this._highlightIdx = i }}
                  >
                    <span class="option-label">${opt.label}</span>
                    ${opt.value === this.value ? html`
                      <svg class="check" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    ` : nothing}
                  </div>
                `)}
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-select': PithSelect }
}
