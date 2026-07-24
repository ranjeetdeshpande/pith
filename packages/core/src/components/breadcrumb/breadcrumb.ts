import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './breadcrumb.css?raw'

/**
 * `pith-breadcrumb` — Navigation landmark wrapping a sequence of
 * `<pith-breadcrumb-item>` elements.
 *
 * Renders as a `<nav aria-label="..."><ol>` for correct screen-reader
 * semantics. In the Brutal theme the nav gets a hard-bordered frame;
 * in Ink and Glass it is invisible — just the items read.
 *
 * @tag pith-breadcrumb
 *
 * @slot - `<pith-breadcrumb-item>` children
 *
 * @attr {string} label - Value of `aria-label` on the nav (default: "Breadcrumb")
 *
 * @example
 * <pith-breadcrumb>
 *   <pith-breadcrumb-item href="/">Home</pith-breadcrumb-item>
 *   <pith-breadcrumb-item href="/components">Components</pith-breadcrumb-item>
 *   <pith-breadcrumb-item current>Breadcrumb</pith-breadcrumb-item>
 * </pith-breadcrumb>
 */
@customElement('pith-breadcrumb')
export class PithBreadcrumb extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Accessible name for the navigation landmark. */
  @property()
  label = 'Breadcrumb'

  override render() {
    return html`
      <nav aria-label=${this.label}>
        <ol class="list" part="list">
          <slot></slot>
        </ol>
      </nav>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-breadcrumb': PithBreadcrumb
  }
}
