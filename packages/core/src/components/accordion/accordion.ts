import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './accordion.css?raw'
import type { PithAccordionItem } from './accordion-item.js'

/**
 * `pith-accordion` — Container that manages a group of expandable items.
 *
 * Coordinates single-open ("accordion") vs. multi-open ("disclosure") behavior.
 * Passes variant context to children via cascading CSS custom properties.
 *
 * @tag pith-accordion
 *
 * @slot - `<pith-accordion-item>` elements
 *
 * @attr {boolean}                          multiple - Allow multiple items open at once
 * @attr {'default'|'flush'|'separated'}    variant  - Visual layout variant (default: default)
 *
 * @example
 * <!-- Single-open accordion -->
 * <pith-accordion>
 *   <pith-accordion-item open>
 *     <span slot="header">What is Pith?</span>
 *     Pith is a themeable, a11y-first web component library.
 *   </pith-accordion-item>
 *   <pith-accordion-item>
 *     <span slot="header">How do I install it?</span>
 *     <code>npm install @pith/ui</code>
 *   </pith-accordion-item>
 * </pith-accordion>
 *
 * <!-- Multi-open, flush style -->
 * <pith-accordion variant="flush" multiple>
 *   …
 * </pith-accordion>
 *
 * <!-- Separated card style -->
 * <pith-accordion variant="separated">
 *   …
 * </pith-accordion>
 */
@customElement('pith-accordion')
export class PithAccordion extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Allow multiple items to be open simultaneously. */
  @property({ type: Boolean })
  multiple = false

  /** Visual layout variant. */
  @property({ reflect: true })
  variant: 'default' | 'flush' | 'separated' = 'default'

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('pith-item-toggle', this._onItemToggle as EventListener)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('pith-item-toggle', this._onItemToggle as EventListener)
  }

  private _onItemToggle = (e: CustomEvent<{ open: boolean }>): void => {
    // Only intercept open requests — closes can always proceed freely
    if (!e.detail.open || this.multiple) return

    const activating = e.target as PithAccordionItem

    // Close all sibling items before the activating item opens
    this.querySelectorAll<PithAccordionItem>('pith-accordion-item').forEach(item => {
      if (item !== activating) item.open = false
    })
  }

  override render() {
    return html`
      <div class="root" part="root">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-accordion': PithAccordion
  }
}
