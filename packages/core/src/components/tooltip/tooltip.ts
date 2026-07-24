import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './tooltip.css?raw'

/**
 * `pith-tooltip` — Accessible tooltip shown on hover and keyboard focus.
 *
 * The default slot is the trigger element. The tooltip text is set via
 * the `content` property. Override the show delay via CSS:
 *   `pith-tooltip { --pith-tooltip-delay: 0ms; }`
 *
 * @tag pith-tooltip
 * @slot - Trigger element (button, link, icon, etc.)
 * @attr {string} content - Tooltip text
 * @attr {'top'|'bottom'|'left'|'right'} placement - Default: top
 * @csspart tooltip - The tooltip pane element
 */
@customElement('pith-tooltip')
export class PithTooltip extends LitElement {
  static override styles = unsafeCSS(styles)

  @property()
  content = ''

  @property({ reflect: true })
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top'

  override render() {
    return html`
      <slot></slot>
      <div class="pane" role="tooltip" part="tooltip">${this.content}</div>
    `
  }
}
