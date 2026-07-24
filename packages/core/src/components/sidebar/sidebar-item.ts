import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './sidebar-item.css?raw'

/**
 * `pith-sidebar-item` — A single navigation item inside a `<pith-sidebar>`.
 *
 * Renders as an `<a>` when `href` is provided (full link semantics, right-click
 * to open in new tab), or a `<button>` for in-page actions. When the parent
 * sidebar collapses it mirrors a `collapsed` attribute onto this element, so
 * `:host([collapsed])` hides labels/badges and centers the icon — this works
 * in every browser, unlike `:host-context()`.
 *
 * @tag pith-sidebar-item
 *
 * @slot        - Item label text
 * @slot icon   - Leading icon (16×16 SVG recommended)
 * @slot badge  - Trailing badge or count indicator
 *
 * @csspart item - The inner anchor or button element
 *
 * @attr {string}  href     - Navigation destination. Renders as `<a>` when set.
 * @attr {boolean} active   - Marks this as the current/active route.
 * @attr {boolean} disabled - Dims and blocks interaction.
 *
 * @example
 * <pith-sidebar-item href="/analytics" active>
 *   <svg slot="icon" width="16" height="16">…</svg>
 *   Analytics
 *   <pith-badge slot="badge" size="sm">4</pith-badge>
 * </pith-sidebar-item>
 */
@customElement('pith-sidebar-item')
export class PithSidebarItem extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Navigation destination. Renders as `<a>` when set. */
  @property()
  href = ''

  /** Marks this as the active/current route. */
  @property({ type: Boolean, reflect: true })
  active = false

  /** Disables the item — dims and blocks interaction. */
  @property({ type: Boolean, reflect: true })
  disabled = false

  @state() private _hasIcon = false
  @state() private _hasBadge = false

  override connectedCallback(): void {
    super.connectedCallback()
    // Expose as list item for screen readers consuming the sidebar <nav>
    if (!this.getAttribute('role')) {
      this.setAttribute('role', 'listitem')
    }
  }

  private _onIconChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasIcon = slot.assignedNodes({ flatten: true }).length > 0
  }

  private _onBadgeChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this._hasBadge = slot.assignedNodes({ flatten: true }).length > 0
  }

  /**
   * For in-page hash links (#section-id) the browser's native anchor scroll
   * targets document.documentElement instead of the real overflow container
   * when the <a> lives inside shadow DOM — and scrollIntoView() has the same
   * problem (it scrolls *every* ancestor, including the root).
   *
   * Fix: walk up from the target to find the actual overflow-y container,
   * then scroll that container directly. Nothing else gets touched.
   */
  private _onAnchorClick(e: MouseEvent): void {
    if (!this.href.startsWith('#')) return
    e.preventDefault()

    const target = document.getElementById(this.href.slice(1))
    if (!target) return

    // Walk up to find the nearest scrollable ancestor
    let scroller: Element | null = target.parentElement
    while (scroller) {
      const ov = getComputedStyle(scroller).overflowY
      if (ov === 'auto' || ov === 'scroll') break
      scroller = scroller.parentElement
    }

    if (scroller) {
      const scrollerRect = scroller.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const top = targetRect.top - scrollerRect.top + scroller.scrollTop
      scroller.scrollTo({ top, behavior: 'smooth' })
    }

    history.pushState(null, '', this.href)
  }

  override render() {
    const content = html`
      <span class="icon ${this._hasIcon ? '' : 'is-empty'}">
        <slot name="icon" @slotchange=${this._onIconChange}></slot>
      </span>
      <span class="label"><slot></slot></span>
      <span class="badge-slot ${this._hasBadge ? '' : 'is-empty'}">
        <slot name="badge" @slotchange=${this._onBadgeChange}></slot>
      </span>
    `

    if (this.href && !this.disabled) {
      return html`
        <a
          class="item"
          part="item"
          href=${this.href}
          aria-current=${this.active ? 'page' : nothing}
          @click=${this._onAnchorClick}
        >${content}</a>
      `
    }

    return html`
      <button
        class="item"
        part="item"
        ?disabled=${this.disabled}
        aria-current=${this.active ? 'page' : nothing}
      >${content}</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-sidebar-item': PithSidebarItem
  }
}
