import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './progress.css?raw'

/**
 * `pith-progress` — Linear progress bar.
 *
 * @tag pith-progress
 *
 * @csspart track - Background track
 * @csspart fill  - Filled indicator
 *
 * @attr {number}  value         - Current value (0–max, default: 0)
 * @attr {number}  max           - Maximum value (default: 100)
 * @attr {boolean} indeterminate - Animated indeterminate state (ignores value)
 * @attr {'sm'|'md'|'lg'} size   - Track height preset (default: md)
 * @attr {'default'|'success'|'warning'|'danger'} variant - Fill color (default: default)
 *
 * @example
 * <pith-progress value="65"></pith-progress>
 * <pith-progress indeterminate></pith-progress>
 * <pith-progress variant="success" value="100"></pith-progress>
 */
@customElement('pith-progress')
export class PithProgress extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ type: Number, reflect: true }) value = 0
  @property({ type: Number }) max = 100
  @property({ type: Boolean, reflect: true }) indeterminate = false
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'
  @property({ reflect: true }) variant: 'default' | 'success' | 'warning' | 'danger' = 'default'

  private get _pct(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100))
  }

  override render() {
    return html`
      <div
        class="track"
        part="track"
        role="progressbar"
        aria-valuenow=${this.indeterminate ? nothing : this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-label="Progress"
        aria-busy=${this.indeterminate ? 'true' : nothing}
      >
        <div
          class="fill"
          part="fill"
          style=${this.indeterminate ? nothing : `width: ${this._pct}%`}
        ></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-progress': PithProgress }
}
