import { LitElement, html, unsafeCSS, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './sidebar.css?raw'

/**
 * `pith-sidebar` — A collapsible navigation sidebar.
 *
 * Provides a vertically-stacked navigation panel with three slot regions
 * (header, content, footer) and a `collapsed` mode that shrinks the panel
 * to an icon-only rail. The collapsed state is mirrored onto child
 * `pith-sidebar-section` / `pith-sidebar-item` elements as a `collapsed`
 * attribute, so they style themselves with `:host([collapsed])` — this works
 * in every browser (unlike `:host-context()`, which Safari/Firefox ignore).
 *
 * @tag pith-sidebar
 *
 * @slot          - `<pith-sidebar-section>` and `<pith-sidebar-item>` elements
 * @slot header   - Brand logo / app name area (sits above the scrollable content)
 * @slot footer   - User profile / bottom actions (sits below scrollable content)
 *
 * @csspart root  - The inner nav container (set width via `--pith-sidebar-width`)
 *
 * @attr {string}  label     - `aria-label` for the nav landmark (default: "Navigation")
 * @attr {boolean} collapsed - Collapses to icon-only rail
 *
 * @cssprop --pith-sidebar-width           - Expanded width  (default: 240px)
 * @cssprop --pith-sidebar-collapsed-width - Collapsed width (default: 52px)
 *
 * @example
 * <pith-sidebar>
 *   <div slot="header">…brand…</div>
 *   <pith-sidebar-section label="Main">
 *     <pith-sidebar-item active>
 *       <svg slot="icon">…</svg>
 *       Dashboard
 *     </pith-sidebar-item>
 *   </pith-sidebar-section>
 * </pith-sidebar>
 */
@customElement('pith-sidebar')
export class PithSidebar extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Accessible name for the `<nav>` landmark. */
  @property()
  label = 'Navigation'

  /** Collapse to icon-only rail. Reflects as attribute. */
  @property({ type: Boolean, reflect: true })
  collapsed = false

  override firstUpdated() {
    this.#syncCollapsed()
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has('collapsed')) this.#syncCollapsed()
  }

  /**
   * Mirror `collapsed` onto every descendant section/item. `querySelectorAll`
   * walks the light DOM, so it catches items nested inside sections too.
   */
  #syncCollapsed() {
    this.querySelectorAll('pith-sidebar-section, pith-sidebar-item').forEach((el) =>
      el.toggleAttribute('collapsed', this.collapsed),
    )
  }

  override render() {
    return html`
      <nav class="root" part="root" aria-label=${this.label}>
        <div class="header-slot"><slot name="header"></slot></div>
        <div class="content"><slot @slotchange=${() => this.#syncCollapsed()}></slot></div>
        <div class="footer-slot"><slot name="footer"></slot></div>
      </nav>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-sidebar': PithSidebar
  }
}
