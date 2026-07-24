import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import styles from './counter.css?raw'

type EasingFn = (t: number) => number

const EASINGS: Record<string, EasingFn> = {
  linear:        t => t,
  'ease-out':    t => 1 - Math.pow(1 - t, 3),
  'ease-in':     t => t * t * t,
  'ease-in-out': t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  /**
   * Elastic overshoot — great for "wow" stats.
   * Settles past the target briefly before landing exactly on `to`.
   */
  spring:        t => {
    if (t === 0) return 0
    if (t === 1) return 1
    const c4 = (2 * Math.PI) / 3
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

/**
 * `pith-counter` — Animated number ticker that counts from `from` to `to`.
 *
 * Starts automatically when scrolled into view (via IntersectionObserver).
 * Respects `prefers-reduced-motion` — shows the final value immediately.
 *
 * @tag pith-counter
 *
 * @fires pith-complete - Fired once when the animation reaches its final value.
 *
 * @attr {number}                                              from     - Start value (default: 0)
 * @attr {number}                                              to       - End value (default: 100)
 * @attr {number}                                              duration - Animation duration ms (default: 1500)
 * @attr {'linear'|'ease-out'|'ease-in'|'ease-in-out'|'spring'} easing - Easing function (default: ease-out)
 * @attr {number}                                              decimals - Decimal places (default: 0)
 * @attr {string}                                              prefix   - Text before number (e.g. "$")
 * @attr {string}                                              suffix   - Text after number (e.g. "k", "%")
 * @attr {boolean}                                             autoplay - Start when entering viewport
 *
 * @example
 * <pith-counter to="2847" suffix=" users" style="font-size:2rem;font-weight:700"></pith-counter>
 * <pith-counter to="99.9" decimals="1" suffix="%" easing="spring"></pith-counter>
 */
@customElement('pith-counter')
export class PithCounter extends LitElement {
  static override styles = unsafeCSS(styles)

  @property({ type: Number }) from = 0
  @property({ type: Number }) to = 100
  @property({ type: Number }) duration = 1500
  @property({ reflect: true }) easing: 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out' | 'spring' = 'ease-out'
  @property({ type: Number }) decimals = 0
  @property() prefix = ''
  @property() suffix = ''

  /** Start counting when the element scrolls into view. Set false to call play() manually. */
  @property({ type: Boolean }) autoplay = true

  @state() private _current = 0

  private _raf: number | undefined
  private _startTime: number | undefined
  private _observer: IntersectionObserver | undefined
  private _hasPlayed = false

  override connectedCallback(): void {
    super.connectedCallback()
    this._current = this.from

    if (this.autoplay) {
      this._observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting && !this._hasPlayed) {
            this._hasPlayed = true
            this._observer?.disconnect()
            this._start()
          }
        },
        { threshold: 0.3 },
      )
      this._observer.observe(this)
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._observer?.disconnect()
    if (this._raf !== undefined) cancelAnimationFrame(this._raf)
  }

  protected override updated(changed: PropertyValues): void {
    // If `to` or `from` change after initial render, restart the animation
    if ((changed.has('to') || changed.has('from')) && this._hasPlayed) {
      this._hasPlayed = false
      this._start()
    }
  }

  /** Manually trigger the count animation. */
  play(): void {
    this._start()
  }

  /** Reset to `from` without animating. */
  reset(): void {
    if (this._raf !== undefined) {
      cancelAnimationFrame(this._raf)
      this._raf = undefined
    }
    this._startTime = undefined
    this._hasPlayed = false
    this._current = this.from
    this.requestUpdate()
  }

  private _start(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._current = this.to
      return
    }

    if (this._raf !== undefined) cancelAnimationFrame(this._raf)
    this._startTime = undefined
    this._raf = requestAnimationFrame(ts => this._tick(ts))
  }

  private _tick(timestamp: number): void {
    if (this._startTime === undefined) this._startTime = timestamp

    const elapsed  = timestamp - this._startTime
    const progress = Math.min(elapsed / this.duration, 1)
    const ease     = EASINGS[this.easing] ?? EASINGS['ease-out']!

    this._current = this.from + (this.to - this.from) * ease(progress)

    if (progress < 1) {
      this._raf = requestAnimationFrame(ts => this._tick(ts))
    } else {
      this._current = this.to
      this._raf = undefined
      this.dispatchEvent(new CustomEvent('pith-complete', { bubbles: true, composed: true }))
    }
  }

  private _format(value: number): string {
    const fixed = value.toFixed(this.decimals)
    // Add thousands separators
    const [int, dec] = fixed.split('.')
    const grouped = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return dec !== undefined ? `${grouped}.${dec}` : grouped
  }

  override render() {
    return html`
      <span class="counter" aria-atomic="true">
        ${this.prefix ? html`<span class="prefix" aria-hidden="true">${this.prefix}</span>` : ''}
        <span class="number">${this._format(this._current)}</span>
        ${this.suffix ? html`<span class="suffix" aria-hidden="true">${this.suffix}</span>` : ''}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-counter': PithCounter
  }
}
