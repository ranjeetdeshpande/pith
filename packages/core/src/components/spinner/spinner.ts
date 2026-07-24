import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './spinner.css?raw'

/**
 * `pith-spinner` — Loading indicator with theme-native animation.
 *
 * Each theme renders a structurally distinct animation:
 *   ink    → Triangle trace  (brand mark drawing itself via stroke-dashoffset)
 *   glass  → Sonar rings     (three concentric rings expanding and fading)
 *   brutal → Binary odometer (three squares cycling filled ↔ hollow via steps(1))
 *
 * @tag pith-spinner
 * @attr {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @attr {string} label - Accessible label (default: "Loading")
 */
@customElement('pith-spinner')
export class PithSpinner extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ reflect: true })
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'

  @property()
  label = 'Loading'

  override render() {
    return html`
      <span
        class="root"
        role="status"
        aria-label=${this.label}
      >
        <!-- Ink: triangle trace — brand mark drawing itself -->
        <svg class="ink-tri" viewBox="0 0 40 36" fill="none" aria-hidden="true">
          <polygon class="tri-path" points="20,2 38,34 2,34"/>
        </svg>

        <!-- Glass: sonar rings — three concentric expanding circles -->
        <span class="glass-rings" aria-hidden="true">
          <span class="ring ring-1"></span>
          <span class="ring ring-2"></span>
          <span class="ring ring-3"></span>
        </span>

        <!-- Brutal: triangle orbit — one square steps through three vertices -->
        <span class="brutal-bits" aria-hidden="true">
          <span class="bit"></span>
        </span>
      </span>
    `
  }
}
