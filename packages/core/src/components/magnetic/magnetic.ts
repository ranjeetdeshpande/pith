import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import styles from './magnetic.css?raw'

/**
 * `pith-magnetic` — Cursor-following magnetic attraction effect.
 *
 * Wraps any element (typically a button) and smoothly translates it toward
 * the cursor as it approaches. The effect is driven by a rAF lerp loop for
 * silky-smooth spring physics without any layout recalculations.
 *
 * Works on desktop (mousemove). No effect on touch devices.
 * Respects `prefers-reduced-motion` — disables translation entirely.
 *
 * @tag pith-magnetic
 *
 * @slot - The element to apply the magnetic effect to
 *
 * @attr {number}  strength - Pull factor 0–1. Higher = more pull (default: 0.4)
 * @attr {number}  distance - Radius in px where effect begins (default: 80)
 * @attr {boolean} disabled - Disables the effect
 *
 * @example
 * <pith-magnetic>
 *   <pith-button variant="primary" size="lg">Hover me</pith-button>
 * </pith-magnetic>
 *
 * <pith-magnetic strength="0.65" distance="120">
 *   <pith-button variant="secondary" size="lg">Strong pull</pith-button>
 * </pith-magnetic>
 */
@customElement('pith-magnetic')
export class PithMagnetic extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Pull strength 0–1. 0 = no effect, 1 = cursor delta fully applied. */
  @property({ type: Number }) strength = 0.4

  /** Radius in pixels from element center where effect activates. */
  @property({ type: Number }) distance = 80

  @property({ type: Boolean, reflect: true }) disabled = false

  @query('.inner') private _inner!: HTMLElement

  // ── Spring state ────────────────────────────────────────
  private _raf: number | undefined
  private _targetX = 0
  private _targetY = 0
  private _currentX = 0
  private _currentY = 0
  private _isTracking = false

  private _prefersReducedMotion = false

  // ── Bound event handlers ─────────────────────────────────
  private _onMouseMove = (e: MouseEvent): void => {
    if (this.disabled || this._prefersReducedMotion) return

    const rect = this.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < this.distance) {
      // Scale pull: stronger when closer (1 at center, 0 at edge), multiplied by strength
      const proximity = 1 - dist / this.distance
      this._targetX = dx * proximity * this.strength
      this._targetY = dy * proximity * this.strength
      this._isTracking = true
    } else {
      // Cursor still inside the element bounds but beyond effect radius — begin return
      this._isTracking = false
      this._targetX = 0
      this._targetY = 0
    }

    // Add tracking class on first activation so CSS disables its own transition
    if (!this.classList.contains('tracking')) {
      this.classList.add('tracking')
    }

    if (this._raf === undefined) {
      this._raf = requestAnimationFrame(() => this._animate())
    }
  }

  private _onMouseLeave = (): void => {
    this._isTracking = false
    this._targetX = 0
    this._targetY = 0
    // Do NOT remove 'tracking' class here — the RAF loop will remove it once
    // the element has fully settled at (0,0). Removing it early would let the
    // CSS transition re-activate while the JS is still moving the element,
    // causing a conflict (especially visible on the Brutal theme).
    if (this._raf === undefined) {
      this._raf = requestAnimationFrame(() => this._animate())
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this._prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.addEventListener('mousemove', this._onMouseMove)
    this.addEventListener('mouseleave', this._onMouseLeave)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('mousemove', this._onMouseMove)
    this.removeEventListener('mouseleave', this._onMouseLeave)
    if (this._raf !== undefined) {
      cancelAnimationFrame(this._raf)
      this._raf = undefined
    }
  }

  private _animate(): void {
    this._raf = undefined

    // Brutal theme: snappier lerp factor matches the theme's direct aesthetic
    const isBrutal = document.documentElement.dataset['theme'] === 'brutal'
    const factor = isBrutal ? 0.22 : 0.1

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    this._currentX = lerp(this._currentX, this._targetX, factor)
    this._currentY = lerp(this._currentY, this._targetY, factor)

    const atRest =
      !this._isTracking &&
      Math.abs(this._currentX) < 0.05 &&
      Math.abs(this._currentY) < 0.05

    if (this._inner) {
      if (atRest) {
        // Fully settled — clear inline style and release the tracking lock
        this._currentX = 0
        this._currentY = 0
        this._inner.style.transform = ''
        this.classList.remove('tracking')
      } else {
        this._inner.style.transform =
          `translate(${this._currentX.toFixed(2)}px, ${this._currentY.toFixed(2)}px)`
        this._raf = requestAnimationFrame(() => this._animate())
      }
    }
  }

  override render() {
    return html`
      <div class="inner">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-magnetic': PithMagnetic
  }
}
