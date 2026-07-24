import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './avatar.css?raw'

/**
 * `pith-avatar` — User avatar with image and initials fallback.
 *
 * @tag pith-avatar
 * @attr {string} src - Image URL
 * @attr {string} alt - Alt text for the image
 * @attr {string} name - Display name; used for initials fallback and aria-label
 * @attr {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @attr {boolean} square - Use rounded-square shape instead of circle
 * @attr {boolean} online - Show green online status indicator
 */
@customElement('pith-avatar')
export class PithAvatar extends LitElement {
  static override styles = unsafeCSS(styles)

  @property() src    = ''
  @property() alt    = ''
  @property() name   = ''
  @property({ reflect: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
  @property({ type: Boolean, reflect: true }) square = false
  @property({ type: Boolean, reflect: true }) online = false

  @state() private _imgFailed = false

  private get _initials(): string {
    if (!this.name) return '?'
    return this.name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('')
  }

  /** Deterministic per-name background colour using oklch. */
  private get _bgColor(): string {
    if (!this.name) return ''
    const hue = (this.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 137.508) % 360
    return `oklch(60% 0.11 ${hue}deg)`
  }

  override render() {
    const showImg  = !!this.src && !this._imgFailed
    const label    = this.alt || this.name || 'Avatar'
    const bgStyle  = showImg ? '' : `background-color: ${this._bgColor}; color: oklch(98% 0.01 0deg);`

    return html`
      <div class="avatar ${this.size}"
           role="img"
           aria-label=${label}
           style=${bgStyle}>
        ${showImg ? html`
          <img class="img"
               src=${this.src}
               alt=${label}
               @error=${() => { this._imgFailed = true }} />
        ` : html`
          <span aria-hidden="true">${this._initials}</span>
        `}
      </div>
    `
  }
}
