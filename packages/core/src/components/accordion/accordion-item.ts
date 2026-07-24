import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './accordion-item.css?raw'

/**
 * `pith-accordion-item` — A single expandable item inside a `<pith-accordion>`.
 *
 * Uses the CSS `grid-template-rows: 0fr → 1fr` animation technique for
 * smooth height transitions without JavaScript measurement.
 *
 * @tag pith-accordion-item
 *
 * @slot         - Expanded panel content
 * @slot header  - Trigger label text
 * @slot icon    - Optional leading icon in the trigger
 *
 * @csspart trigger     - The header button
 * @csspart panel-body  - The expanded content wrapper
 *
 * @fires pith-item-toggle - Cancelable. Fired before open state changes.
 *                           `detail.open` is the intended new state.
 *                           `preventDefault()` blocks the change.
 *
 * @attr {boolean} open     - Whether this item is expanded
 * @attr {boolean} disabled - Prevents interaction
 *
 * @example
 * <pith-accordion-item>
 *   <span slot="header">What is Pith?</span>
 *   Pith is a themeable web component library built on Lit 3.
 * </pith-accordion-item>
 */
@customElement('pith-accordion-item')
export class PithAccordionItem extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ type: Boolean, reflect: true })
  open = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  @state() private _hasIcon = false

  /** Unique IDs for ARIA wiring */
  private static _seq = 0
  private readonly _n = PithAccordionItem._seq++
  private get _triggerId() { return `pith-ai-trigger-${this._n}` }
  private get _panelId()   { return `pith-ai-panel-${this._n}` }

  private _onIconChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _toggle(): void {
    if (this.disabled) return

    const willOpen = !this.open
    const allowed = this.dispatchEvent(
      new CustomEvent('pith-item-toggle', {
        detail: { open: willOpen },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    )
    if (allowed) this.open = willOpen
  }

  override render() {
    return html`
      <div class="shell">

        <!-- ── Trigger ───────────────────────────────────── -->
        <button
          class="trigger"
          part="trigger"
          id=${this._triggerId}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this._panelId}
          ?disabled=${this.disabled}
          @click=${this._toggle}
        >
          <span class="trigger-icon ${this._hasIcon ? '' : 'is-empty'}">
            <slot name="icon" @slotchange=${this._onIconChange}></slot>
          </span>

          <span class="trigger-label">
            <slot name="header"></slot>
          </span>

          <!-- Chevron: Ink + Glass -->
          <span class="chevron" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 6l5 5 5-5"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <!-- Plus / Minus: Brutal -->
          <span class="plus-minus" aria-hidden="true">${this.open ? '−' : '+'}</span>
        </button>

        <!-- ── Expandable panel ───────────────────────────── -->
        <div
          class="panel"
          id=${this._panelId}
          role="region"
          aria-labelledby=${this._triggerId}
        >
          <div class="panel-inner">
            <div class="panel-body" part="panel-body">
              <slot></slot>
            </div>
          </div>
        </div>

      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-accordion-item': PithAccordionItem
  }
}
