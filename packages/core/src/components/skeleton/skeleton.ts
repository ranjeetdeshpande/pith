import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './skeleton.css?raw'

/**
 * `pith-skeleton` — Animated shimmer placeholder for loading states.
 *
 * @tag pith-skeleton
 *
 * @attr {'text'|'rect'|'circle'} variant - Shape variant (default: rect)
 * @attr {string}                 width   - CSS width override (e.g. "200px", "60%")
 * @attr {string}                 height  - CSS height override
 * @attr {number}                 lines   - Lines to render in text variant (default: 1)
 *
 * @example
 * <!-- Rectangular block -->
 * <pith-skeleton height="120px"></pith-skeleton>
 *
 * <!-- Circle avatar placeholder -->
 * <pith-skeleton variant="circle" width="48px" height="48px"></pith-skeleton>
 *
 * <!-- Multi-line text -->
 * <pith-skeleton variant="text" lines="3"></pith-skeleton>
 */
@customElement('pith-skeleton')
export class PithSkeleton extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ reflect: true }) variant: 'text' | 'rect' | 'circle' = 'rect'
  @property() width  = ''
  @property() height = ''
  @property({ type: Number }) lines = 1

  override render() {
    if (this.variant === 'text' && this.lines > 1) {
      return html`${Array.from({ length: this.lines }, (_, i) => html`
        <span
          class="bone text"
          style=${i === this.lines - 1 ? 'width: 70%' : nothing}
          role="presentation"
          aria-hidden="true"
        ></span>
      `)}`
    }

    const inlineStyle = [
      this.width  ? `width: ${this.width}`   : '',
      this.height ? `height: ${this.height}` : '',
    ].filter(Boolean).join('; ')

    return html`
      <span
        class="bone ${this.variant}"
        style=${inlineStyle || nothing}
        role="presentation"
        aria-hidden="true"
      ></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-skeleton': PithSkeleton }
}
