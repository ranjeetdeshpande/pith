import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './tab-panel.css?raw'

@customElement('pith-tab-panel')
export class PithTabPanel extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Must match the `value` of a sibling `pith-tab`. */
  @property({ reflect: true })
  value = ''

  /** Set by the parent `pith-tabs` container — do not set manually. */
  @property({ type: Boolean, reflect: true })
  active = false

  override render() {
    return html`
      <div
        role="tabpanel"
        ?hidden="${!this.active}"
        tabindex="${this.active ? '0' : '-1'}">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-tab-panel': PithTabPanel
  }
}
