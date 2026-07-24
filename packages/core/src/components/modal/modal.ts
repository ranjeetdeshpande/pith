import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './modal.css?raw'

/**
 * `pith-modal` — Accessible dialog modal using the native <dialog> element.
 *
 * The native <dialog> provides:
 *   - Top-layer promotion (above everything)
 *   - Browser-native focus trap
 *   - Escape key → `cancel` event
 *   - `::backdrop` pseudo-element
 *
 * @tag pith-modal
 *
 * @slot         - Modal body content
 * @slot header  - Title / header area (shows border separator + close button)
 * @slot footer  - Footer area (e.g. action buttons; sunken bg)
 *
 * @csspart panel        - The modal panel container
 * @csspart close-button - The ✕ close button
 * @csspart body         - The scrollable body region
 *
 * @fires pith-close - Cancelable. Fired before closing. `preventDefault()` stops the close.
 *
 * @attr {boolean}                        open             - Shows/hides the modal
 * @attr {'sm'|'md'|'lg'|'fullscreen'}    size             - Panel width preset (default: md)
 * @attr {boolean}                        close-on-backdrop - Close when clicking outside panel (default: true)
 *
 * @example
 * <pith-modal id="my-modal">
 *   <span slot="header">Confirm delete</span>
 *   Are you sure you want to delete this item?
 *   <div slot="footer">
 *     <pith-button variant="ghost" onclick="this.closest('pith-modal').open=false">Cancel</pith-button>
 *     <pith-button variant="danger">Delete</pith-button>
 *   </div>
 * </pith-modal>
 */
@customElement('pith-modal')
export class PithModal extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Shows / hides the modal. Reflects to attribute. */
  @property({ type: Boolean, reflect: true })
  open = false

  /** Panel width preset. */
  @property({ reflect: true })
  size: 'sm' | 'md' | 'lg' | 'fullscreen' = 'md'

  /** Close when clicking the backdrop (overlay outside the panel). */
  @property({ type: Boolean, attribute: 'close-on-backdrop' })
  closeOnBackdrop = true

  @query('dialog')
  private _dialog!: HTMLDialogElement

  @query('.panel')
  private _panel!: HTMLElement

  @state() private _hasHeader = false
  @state() private _hasFooter = false

  /** Focus target to restore when the modal closes. */
  private _prevFocused: Element | null = null

  /** AbortController to cancel any in-progress close animation. */
  private _animCtrl: AbortController | null = null

  /** Unique ID for aria-labelledby scoping within this shadow root. */
  private readonly _titleId = `pith-modal-title-${PithModal._seq++}`
  private static _seq = 0

  protected override updated(changed: PropertyValues): void {
    if (!changed.has('open')) return

    if (this.open) {
      // Cancel any close animation that may still be running
      this._animCtrl?.abort()
      this._panel?.classList.remove('closing')
      this._prevFocused = document.activeElement
      if (!this._dialog.open) {
        this._dialog.showModal()
      }
    } else if (this._dialog?.open) {
      this._startCloseAnimation()
    }
  }

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
        panel.classList.remove('closing')
        this._animCtrl = null
        this._restoreFocus()
      },
      { once: true, signal: this._animCtrl.signal },
    )

    panel.classList.add('closing')
  }

  private _restoreFocus(): void {
    if (this._prevFocused instanceof HTMLElement) {
      this._prevFocused.focus({ preventScroll: true })
    }
    this._prevFocused = null
  }

  /** Dispatches `pith-close` (cancelable). Closes unless `preventDefault()` was called. */
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

  /** Native dialog `cancel` event fires on Escape key. */
  private _onCancel(e: Event): void {
    e.preventDefault() // Prevent browser's default immediate close
    this._requestClose()
  }

  /** Click on the overlay (backdrop area). Only close if the click target IS the overlay. */
  private _onOverlayClick(e: MouseEvent): void {
    if (this.closeOnBackdrop && e.target === e.currentTarget) {
      this._requestClose()
    }
  }

  private _onHeaderChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _onFooterChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0
  }

  override render() {
    return html`
      <dialog
        @cancel=${this._onCancel}
        aria-labelledby=${this._hasHeader ? this._titleId : nothing}
      >
        <!-- Transparent flex layer: fills dialog, centers panel, captures backdrop clicks -->
        <div class="overlay" @click=${this._onOverlayClick}>
          <div class="panel size-${this.size}" part="panel">

            <!-- Header — always rendered (contains close button); border only when slotted -->
            <div class="header ${this._hasHeader ? 'has-content' : ''}">
              <span
                id=${this._titleId}
                class="header-title ${this._hasHeader ? '' : 'is-empty'}"
              >
                <slot name="header" @slotchange=${this._onHeaderChange}></slot>
              </span>
              <button
                class="close-btn"
                part="close-button"
                aria-label="Close dialog"
                @click=${this._requestClose}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="body" part="body">
              <slot></slot>
            </div>

            <!-- Footer — hidden when empty -->
            <div class="footer ${this._hasFooter ? 'has-content' : ''}">
              <slot name="footer" @slotchange=${this._onFooterChange}></slot>
            </div>

          </div>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-modal': PithModal
  }
}
