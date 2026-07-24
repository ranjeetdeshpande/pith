import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './dropdown.css?raw'
import type { PithDropdownItem } from './dropdown-item.js'

/**
 * `pith-dropdown` — Accessible contextual menu anchored to a trigger.
 *
 * Keyboard: Arrow keys navigate, Enter/Space select, Escape/Tab close.
 * Clicking outside automatically closes the menu.
 *
 * @tag pith-dropdown
 *
 * @slot trigger  - The element that toggles the menu (button, icon-button, etc.)
 * @slot          - `<pith-dropdown-item>` elements (the menu contents)
 *
 * @csspart panel - The floating menu panel
 *
 * @fires pith-open  - Fired when the menu opens
 * @fires pith-close - Fired when the menu closes
 *
 * @attr {boolean}                                        open      - Open/close state
 * @attr {'bottom-start'|'bottom-end'|'top-start'|'top-end'} placement - Panel anchor (default: bottom-start)
 *
 * @example
 * <pith-dropdown>
 *   <pith-button slot="trigger" variant="secondary">
 *     Actions
 *     <svg slot="icon-end">…</svg>
 *   </pith-button>
 *   <pith-dropdown-item value="edit">Edit</pith-dropdown-item>
 *   <pith-dropdown-item value="delete" variant="danger" divider>Delete</pith-dropdown-item>
 * </pith-dropdown>
 */
@customElement('pith-dropdown')
export class PithDropdown extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Controls the open/closed state of the panel. */
  @property({ type: Boolean, reflect: true })
  open = false

  /** Where the panel anchors relative to the trigger. */
  @property({ reflect: true })
  placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start'

  @query('.panel')
  private _panel!: HTMLElement

  @query('.trigger-wrapper')
  private _triggerWrapper!: HTMLElement

  // ── Outside-click handler (closed over 'this') ──────────
  private _outsideHandler = (e: MouseEvent) => {
    if (this.open && !this.contains(e.target as Node) && !this.shadowRoot!.contains(e.target as Node)) {
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

  protected override updated(changed: PropertyValues): void {
    if (!changed.has('open')) return
    if (this.open) {
      // Focus the first item after the panel is visible
      this.updateComplete.then(() => {
        this._getItems()[0]?.focus()
      })
      this.dispatchEvent(new CustomEvent('pith-open', { bubbles: true, composed: true }))
    } else {
      this.dispatchEvent(new CustomEvent('pith-close', { bubbles: true, composed: true }))
    }
  }

  // ── Private helpers ────────────────────────────────────

  private _getItems(): PithDropdownItem[] {
    return Array.from(
      this.querySelectorAll<PithDropdownItem>('pith-dropdown-item:not([disabled])'),
    )
  }

  private _open(): void {
    this.open = true
  }

  private _close(): void {
    this.open = false
  }

  private _toggle(): void {
    this.open ? this._close() : this._open()
  }

  // ── Event handlers ─────────────────────────────────────

  private _onTriggerClick(): void {
    this._toggle()
  }

  private _onTriggerKeydown(e: KeyboardEvent): void {
    if (!this.open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      this._open()
    }
  }

  private _onPanelKeydown(e: KeyboardEvent): void {
    const items = this._getItems()
    const active = e.composedPath().find(
      (el): el is PithDropdownItem => el instanceof Element && el.tagName?.toLowerCase() === 'pith-dropdown-item',
    )
    const idx = active ? items.indexOf(active) : -1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        items[(idx + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        items[(idx - 1 + items.length) % items.length]?.focus()
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
      case 'Escape':
        e.preventDefault()
        this._close()
        this._focusTrigger()
        break
      case 'Tab':
        // Tab naturally moves focus out; close the menu
        this._close()
        break
    }
  }

  /** `pith-select` bubbles from items through the slot into the dropdown host */
  private _onSelect(): void {
    this._close()
    this._focusTrigger()
  }

  /** Focus the first focusable element inside the trigger slot. */
  private _focusTrigger(): void {
    const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trigger"]')
    const assigned = slot?.assignedElements()
    const trigger = assigned?.[0]
    if (trigger instanceof HTMLElement) trigger.focus()
  }

  override render() {
    return html`
      <div
        class="trigger-wrapper"
        @click=${this._onTriggerClick}
        @keydown=${this._onTriggerKeydown}
        aria-haspopup="menu"
        aria-expanded=${this.open ? 'true' : 'false'}
      >
        <slot name="trigger"></slot>
      </div>

      <div
        class="panel placement-${this.placement} ${this.open ? 'is-open' : ''}"
        part="panel"
        role="menu"
        aria-hidden=${!this.open ? 'true' : 'false'}
        @keydown=${this._onPanelKeydown}
        @pith-select=${this._onSelect}
      >
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-dropdown': PithDropdown
  }
}
