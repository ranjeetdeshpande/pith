import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './drawer.css?raw'

/**
 * `pith-drawer` — Accessible edge drawer using the native <dialog> element.
 *
 * Slides in from any of the four viewport edges with a magnetic spring
 * entry animation. Includes a drag handle: drag it past the threshold to
 * dismiss, or release early and watch it spring back.
 *
 * @tag pith-drawer
 *
 * @slot         - Drawer body content
 * @slot header  - Title / header area (shows border separator + close button)
 * @slot footer  - Footer area (e.g. action buttons; sunken bg)
 *
 * @csspart panel        - The drawer panel container
 * @csspart close-button - The ✕ close button
 * @csspart body         - The scrollable body region
 *
 * @fires pith-close - Cancelable. Fired before closing. `preventDefault()` stops the close.
 *
 * @attr {boolean}                          open              - Shows/hides the drawer
 * @attr {'left'|'right'|'top'|'bottom'}    placement         - Edge to slide from (default: right)
 * @attr {'sm'|'md'|'lg'|'full'}            size              - Panel size preset (default: md)
 * @attr {boolean}                          close-on-backdrop - Close on backdrop click (default: true)
 *
 * @example
 * <pith-drawer id="settings" placement="right">
 *   <span slot="header">Settings</span>
 *   <p>Drawer body content.</p>
 *   <div slot="footer">
 *     <pith-button variant="ghost" onclick="this.closest('pith-drawer').open=false">Cancel</pith-button>
 *     <pith-button variant="primary">Save</pith-button>
 *   </div>
 * </pith-drawer>
 */
@customElement('pith-drawer')
export class PithDrawer extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Shows / hides the drawer. Reflects to attribute. */
  @property({ type: Boolean, reflect: true })
  open = false

  /** Which edge the drawer slides from. */
  @property({ reflect: true })
  placement: 'left' | 'right' | 'top' | 'bottom' = 'right'

  /** Panel size preset. */
  @property({ reflect: true })
  size: 'sm' | 'md' | 'lg' | 'full' = 'md'

  /** Close when clicking the backdrop. */
  @property({ type: Boolean, attribute: 'close-on-backdrop' })
  closeOnBackdrop = true

  @query('dialog')   private _dialog!: HTMLDialogElement
  @query('.panel')   private _panel!: HTMLElement

  @state() private _hasHeader = false
  @state() private _hasFooter = false

  /** Element to restore focus to on close. */
  private _prevFocused: Element | null = null

  /** Abort controller for in-flight close animation listeners. */
  private _animCtrl: AbortController | null = null

  // ── Drag-to-close state ──────────────────────────────────
  private _dragStart   = 0
  private _dragOffset  = 0
  private _isDragging  = false
  private _hasMoved    = false

  private readonly _titleId = `pith-drawer-title-${PithDrawer._seq++}`
  private static _seq = 0

  // ──────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────

  protected override updated(changed: PropertyValues): void {
    if (!changed.has('open')) return

    if (this.open) {
      this._animCtrl?.abort()
      this._panel?.classList.remove('closing')
      this._prevFocused = document.activeElement
      if (!this._dialog.open) this._dialog.showModal()
    } else if (this._dialog?.open) {
      this._startCloseAnimation()
    }
  }

  // ──────────────────────────────────────────────────────────
  // Open / close helpers
  // ──────────────────────────────────────────────────────────

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

  // ──────────────────────────────────────────────────────────
  // Native dialog event handlers
  // ──────────────────────────────────────────────────────────

  private _onCancel(e: Event): void {
    e.preventDefault()
    this._requestClose()
  }

  private _onOverlayClick(e: MouseEvent): void {
    if (this.closeOnBackdrop && e.target === e.currentTarget) {
      this._requestClose()
    }
  }

  private _onHeaderChange(e: Event): void {
    this._hasHeader = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  private _onFooterChange(e: Event): void {
    this._hasFooter = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0
  }

  // ──────────────────────────────────────────────────────────
  // Magnetic drag-to-close
  //
  // pointerdown on the handle → pointer capture on panel →
  // pointermove / pointerup route to panel via capture.
  // Drag in close direction with rubber-band resistance.
  // Release past threshold → commit close with flick.
  // Release before threshold → spring back.
  // ──────────────────────────────────────────────────────────

  private _onHandlePointerDown(e: PointerEvent): void {
    this._isDragging = true
    this._hasMoved   = false
    this._dragOffset = 0
    this._dragStart  = this._isHorizontal ? e.clientX : e.clientY
    // Capture so move/up events reach the panel even if pointer leaves
    this._panel.setPointerCapture(e.pointerId)
  }

  private _onPanelPointerMove(e: PointerEvent): void {
    if (!this._isDragging) return

    const current = this._isHorizontal ? e.clientX : e.clientY
    let delta = current - this._dragStart

    // Clamp: only allow dragging toward the exit edge
    if (this.placement === 'right'  && delta < 0) return
    if (this.placement === 'left'   && delta > 0) return
    if (this.placement === 'bottom' && delta < 0) return
    if (this.placement === 'top'    && delta > 0) return

    this._hasMoved   = true
    this._dragOffset = delta

    // Rubber-band: free drag up to 80px, resistance after that
    const abs   = Math.abs(delta)
    const sign  = Math.sign(delta)
    const applied = abs <= 80 ? delta : sign * (80 + (abs - 80) * 0.28)

    const axis = this._isHorizontal ? 'X' : 'Y'
    this._panel.style.transform  = `translate${axis}(${applied}px)`
    this._panel.style.transition = 'none'
    this._panel.style.willChange = 'transform'
  }

  private _onPanelPointerUp(_e: PointerEvent): void {
    if (!this._isDragging) return
    this._isDragging = false
    this._panel.style.willChange = ''

    if (!this._hasMoved) {
      // Tap on handle — reset without animation flicker
      this._panel.style.transform  = ''
      this._panel.style.transition = ''
      this._dragOffset = 0
      return
    }

    const axis  = this._isHorizontal ? 'X' : 'Y'
    const sign  = (this.placement === 'right' || this.placement === 'bottom') ? 1 : -1

    if (Math.abs(this._dragOffset) > 88) {
      // ── Commit close: flick out with velocity ─────────────
      this._panel.style.transform  = `translate${axis}(${sign * 110}%)`
      this._panel.style.transition = 'transform 220ms cubic-bezier(0.4, 0, 1, 1)'
      this._panel.addEventListener(
        'transitionend',
        () => {
          this._panel.style.transform  = ''
          this._panel.style.transition = ''
          this._requestClose()
        },
        { once: true },
      )
    } else {
      // ── Spring back: magnetic snap with overshoot ──────────
      this._panel.style.transform  = `translate${axis}(0)`
      this._panel.style.transition = 'transform 440ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      this._panel.addEventListener(
        'transitionend',
        () => {
          this._panel.style.transform  = ''
          this._panel.style.transition = ''
        },
        { once: true },
      )
    }

    this._dragOffset = 0
  }

  private get _isHorizontal(): boolean {
    return this.placement === 'left' || this.placement === 'right'
  }

  // ──────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────

  override render() {
    return html`
      <dialog
        @cancel=${this._onCancel}
        aria-labelledby=${this._hasHeader ? this._titleId : nothing}
      >
        <!-- Overlay: fills dialog, aligns panel to the placement edge -->
        <div
          class="overlay placement-${this.placement}"
          @click=${this._onOverlayClick}
        >
          <div
            class="panel size-${this.size}"
            part="panel"
            @pointermove=${this._onPanelPointerMove}
            @pointerup=${this._onPanelPointerUp}
          >

            <!-- Magnetic drag handle -->
            <div
              class="handle"
              aria-hidden="true"
              @pointerdown=${this._onHandlePointerDown}
            >
              <div class="handle-pill"></div>
            </div>

            <!-- Header (always rendered; border + title only when slotted) -->
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
                aria-label="Close drawer"
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

            <!-- Footer (hidden when empty) -->
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
    'pith-drawer': PithDrawer
  }
}
