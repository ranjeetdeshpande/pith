import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './command.css?raw'
import type { PithCommandItem } from './command-item.js'

/**
 * `pith-command` — Accessible command palette / quick-search overlay.
 *
 * Opens as a full-screen modal. The user types to filter `pith-command-item`
 * children. Keyboard navigation (↑ ↓ Enter Escape) is fully supported.
 *
 * @tag pith-command
 *
 * @slot - `<pith-command-item>` elements (and optional group heading elements)
 *
 * @csspart panel  - The floating command panel
 * @csspart search - The search input wrapper
 * @csspart list   - The scrollable items region
 *
 * @fires pith-select - `{ detail: { value: string } }` — fired when an item is chosen
 * @fires pith-close  - Cancelable. Fired before closing. `preventDefault()` stops the close.
 *
 * @attr {boolean} open        - Shows / hides the palette
 * @attr {string}  placeholder - Search input placeholder (default: "Type a command…")
 *
 * @example
 * <pith-command id="cmd">
 *   <pith-command-item value="new-file">New File</pith-command-item>
 *   <pith-command-item value="open-settings">Settings</pith-command-item>
 * </pith-command>
 *
 * <!-- open with: document.getElementById('cmd').open = true -->
 */
@customElement('pith-command')
export class PithCommand extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ type: Boolean, reflect: true }) open = false
  @property() placeholder = 'Type a command…'

  @query('dialog')       private _dialog!: HTMLDialogElement
  @query('.panel')       private _panel!:  HTMLElement
  @query('.search-input') private _searchInput!: HTMLInputElement

  private _prevFocused: Element | null = null
  private _animCtrl: AbortController | null = null

  // ── Lifecycle ──────────────────────────────────────────
  protected override updated(changed: PropertyValues): void {
    if (!changed.has('open')) return

    if (this.open) {
      this._animCtrl?.abort()
      this._panel?.classList.remove('is-closing')
      this._prevFocused = document.activeElement
      if (!this._dialog.open) this._dialog.showModal()
      this.updateComplete.then(() => {
        this._searchInput?.focus()
        this._clearSearch()
      })
    } else if (this._dialog?.open) {
      this._startCloseAnimation()
    }
  }

  // ── Close animation ────────────────────────────────────
  private _startCloseAnimation(): void {
    const panel = this._panel
    if (!panel) {
      this._dialog.close()
      this._restoreFocus()
      return
    }

    this._animCtrl?.abort()
    this._animCtrl = new AbortController()

    panel.addEventListener(
      'animationend',
      () => {
        this._dialog.close()
        panel.classList.remove('is-closing')
        this._animCtrl = null
        this._restoreFocus()
      },
      { once: true, signal: this._animCtrl.signal },
    )

    panel.classList.add('is-closing')
  }

  private _restoreFocus(): void {
    if (this._prevFocused instanceof HTMLElement) {
      this._prevFocused.focus({ preventScroll: true })
    }
    this._prevFocused = null
  }

  // ── Open / close helpers ───────────────────────────────
  private _requestClose(): void {
    const allowed = this.dispatchEvent(
      new CustomEvent('pith-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    )
    if (allowed) this.open = false
  }

  // ── Search ─────────────────────────────────────────────
  private _clearSearch(): void {
    if (this._searchInput) this._searchInput.value = ''
    this._filterItems('')
  }

  private _onSearchInput(e: Event): void {
    const query = (e.target as HTMLInputElement).value
    this._filterItems(query)
  }

  private _filterItems(query: string): void {
    const items = this._getItems(/* all */ true)
    const q = query.trim().toLowerCase()
    items.forEach(item => {
      const text = item.textContent?.trim().toLowerCase() ?? ''
      const kw   = item.keywords?.toLowerCase() ?? ''
      item.hidden = !!q && !text.includes(q) && !kw.includes(q)
    })
  }

  // ── Items & keyboard nav ───────────────────────────────
  /** Returns visible, non-disabled items. Pass true to include all (for filter reset). */
  private _getItems(all = false): PithCommandItem[] {
    const selector = all
      ? 'pith-command-item'
      : 'pith-command-item:not([disabled]):not([hidden])'
    return Array.from(this.querySelectorAll<PithCommandItem>(selector))
  }

  private _onCancel(e: Event): void {
    e.preventDefault()
    this._requestClose()
  }

  private _onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this._requestClose()
  }

  private _onKeydown(e: KeyboardEvent): void {
    const items = this._getItems()
    const focused = e.composedPath().find(
      (el): el is PithCommandItem =>
        el instanceof Element && el.tagName?.toLowerCase() === 'pith-command-item',
    )
    const idx = focused ? items.indexOf(focused) : -1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (idx < 0 || idx >= items.length - 1) {
          items[0]?.focus()
        } else {
          items[idx + 1]?.focus()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (idx <= 0) {
          this._searchInput?.focus()
        } else {
          items[idx - 1]?.focus()
        }
        break
      case 'Escape':
        e.preventDefault()
        this._requestClose()
        break
      case 'Tab':
        // Trap focus inside
        e.preventDefault()
        break
    }
  }

  private _onSearchKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this._getItems()[0]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      this._requestClose()
    }
  }

  private _onItemSelect(e: CustomEvent<{ value: string }>): void {
    this.dispatchEvent(
      new CustomEvent('pith-select', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      }),
    )
    this.open = false
  }

  // ── Render ─────────────────────────────────────────────
  override render() {
    return html`
      <dialog
        @cancel=${this._onCancel}
        aria-label="Command palette"
      >
        <div class="overlay" @click=${this._onOverlayClick}>
          <div
            class="panel"
            part="panel"
            @keydown=${this._onKeydown}
            @pith-command-select=${this._onItemSelect}
          >
            <!-- Search input -->
            <div class="search" part="search">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/>
                <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <input
                class="search-input"
                type="search"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                autocomplete="off"
                spellcheck="false"
                placeholder=${this.placeholder}
                @input=${this._onSearchInput}
                @keydown=${this._onSearchKeydown}
              />
            </div>

            <!-- Items list -->
            <div
              class="list"
              part="list"
              role="listbox"
            >
              <slot></slot>
              <div class="empty" aria-live="polite">No results</div>
            </div>
          </div>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-command': PithCommand }
}
