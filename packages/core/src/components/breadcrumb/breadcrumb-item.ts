import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './breadcrumb-item.css?raw'

/**
 * `pith-breadcrumb-item` — A single step in a breadcrumb trail.
 *
 * Renders either a navigable `<a>` link or a static `<span>` (when
 * `current` or no `href`). The separator between items is rendered
 * inside the Shadow DOM so the host element stays layout-transparent,
 * and `:host(:first-child)` CSS hides it on the leading item — no
 * JavaScript coordination with the parent is needed.
 *
 * @tag pith-breadcrumb-item
 *
 * @slot - Item label (text, icon, or mixed content)
 *
 * @csspart link   - The anchor or span wrapping the label
 * @csspart sep    - The separator element preceding this item
 *
 * @attr {string}  href     - Link destination. Omit for a non-interactive crumb.
 * @attr {boolean} current  - Marks this as the active/current page.
 *                            Renders as `<span aria-current="page">`.
 * @attr {boolean} disabled - Dims the item and prevents interaction.
 *
 * @example
 * <pith-breadcrumb-item href="/settings">Settings</pith-breadcrumb-item>
 * <pith-breadcrumb-item current>Profile</pith-breadcrumb-item>
 */
@customElement('pith-breadcrumb-item')
export class PithBreadcrumbItem extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Link destination. Renders as `<a>` when provided and not current. */
  @property()
  href = ''

  /** Marks this crumb as the current page. Renders as `<span aria-current="page">`. */
  @property({ type: Boolean, reflect: true })
  current = false

  /** Disables the item — dims it and removes interactivity. */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** Expose as a list item for screen readers consuming the `<ol>`. */
  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.getAttribute('role')) {
      this.setAttribute('role', 'listitem')
    }
  }

  override render() {
    /* Chevron separator — shown for Ink + Glass */
    const sep = html`
      <span class="sep" part="sep" aria-hidden="true">
        <svg
          class="sep-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4.5 2.5l3 3.5-3 3.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <!-- Slash separator for Brutal — shown via CSS -->
        <span class="sep-text">/</span>
      </span>
    `

    /* Decide what wraps the slot content */
    const inner = html`<slot></slot>`

    let linkEl
    if (this.current) {
      linkEl = html`
        <span class="link current" part="link" aria-current="page">${inner}</span>
      `
    } else if (this.href && !this.disabled) {
      linkEl = html`
        <a class="link" part="link" href=${this.href}>${inner}</a>
      `
    } else {
      linkEl = html`
        <span
          class="link"
          part="link"
          aria-disabled=${this.disabled ? 'true' : nothing}
        >${inner}</span>
      `
    }

    return html`${sep}${linkEl}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-breadcrumb-item': PithBreadcrumbItem
  }
}
