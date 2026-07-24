import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './sidebar-section.css?raw'

/**
 * `pith-sidebar-section` — A labeled group of `<pith-sidebar-item>` elements
 * inside a `<pith-sidebar>`.
 *
 * Renders an optional uppercase heading above its slotted items and adds a
 * divider between sections. When the parent sidebar is collapsed, the heading
 * is hidden via `:host-context()` CSS — no JavaScript needed.
 *
 * @tag pith-sidebar-section
 *
 * @slot - `<pith-sidebar-item>` elements for this group
 *
 * @csspart label - The section heading element
 *
 * @attr {string} label - Section heading text. Omit for an unlabeled divider group.
 *
 * @example
 * <pith-sidebar-section label="Settings">
 *   <pith-sidebar-item href="/settings/profile">Profile</pith-sidebar-item>
 *   <pith-sidebar-item href="/settings/billing">Billing</pith-sidebar-item>
 * </pith-sidebar-section>
 */
@customElement('pith-sidebar-section')
export class PithSidebarSection extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Section heading text. Omit to render a bare divider group. */
  @property()
  label = ''

  override render() {
    return html`
      ${this.label
        ? html`<div class="section-label" part="label">${this.label}</div>`
        : nothing}
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-sidebar-section': PithSidebarSection
  }
}
