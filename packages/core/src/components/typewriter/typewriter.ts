import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './typewriter.css?raw'

type Phase = 'idle' | 'typing' | 'erasing' | 'done'

/**
 * `pith-typewriter` — Character-by-character text reveal with an optional
 * blinking cursor. Supports looping, erase-before-retype cycles, and a
 * configurable start delay.
 *
 * Respects `prefers-reduced-motion` — shows the full text immediately.
 * Theme-aware cursor: Ink/Glass → thin line cursor, Brutal → block █.
 *
 * @tag pith-typewriter
 *
 * @fires pith-type-done   - Fires when the full text has been typed (once per cycle).
 * @fires pith-erase-done  - Fires when erasing is complete (only when looping with erase).
 *
 * @attr {string}  text        - The text to type. Required.
 * @attr {number}  speed       - Milliseconds between characters when typing (default: 55)
 * @attr {number}  erase-speed - ms per erased character. Defaults to speed/2.
 * @attr {number}  delay       - Milliseconds before the first character appears (default: 0)
 * @attr {boolean} cursor      - Show blinking cursor (default: true)
 * @attr {boolean} loop        - Repeat the animation indefinitely (default: false)
 * @attr {boolean} erase       - When looping, erase text before retyping (default: true)
 * @attr {number}  loop-delay  - Wait ms after completing before the next cycle (default: 2000)
 *
 * @example
 * <!-- Static one-shot -->
 * <h1><pith-typewriter text="Building interfaces that feel right."></pith-typewriter></h1>
 *
 * <!-- Looping terminal prompt -->
 * <span style="font-family:monospace">
 *   > <pith-typewriter text="pith install" loop erase speed="80"></pith-typewriter>
 * </span>
 */
@customElement('pith-typewriter')
export class PithTypewriter extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Text to type character by character. */
  @property() text = ''

  /** Milliseconds between typed characters. */
  @property({ type: Number }) speed = 55

  /** Milliseconds per erased character. Defaults to `speed / 2` when ≤ 0. */
  @property({ type: Number, attribute: 'erase-speed' }) eraseSpeed = 0

  /** Delay before the first character appears (ms). */
  @property({ type: Number }) delay = 0

  /** Show a blinking cursor after the text. */
  @property({ type: Boolean, reflect: true }) cursor = true

  /** Loop the animation. After completing, wait `loop-delay` then restart. */
  @property({ type: Boolean }) loop = false

  /** When looping, erase text character by character before retyping. */
  @property({ type: Boolean }) erase = true

  /** Milliseconds to wait after completing before the next loop cycle. */
  @property({ type: Number, attribute: 'loop-delay' }) loopDelay = 2000

  /** Start when entering the viewport (uses IntersectionObserver). Set false to call play() manually. */
  @property({ type: Boolean }) autoplay = true

  @state() private _displayed = ''
  @state() private _phase: Phase = 'idle'

  private _timer: ReturnType<typeof setTimeout> | undefined
  private _observer: IntersectionObserver | undefined
  private _prefersReducedMotion = false

  override connectedCallback(): void {
    super.connectedCallback()
    this._prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (this._prefersReducedMotion) {
      this._displayed = this.text
      this._phase = 'done'
      return
    }

    if (this.autoplay) {
      this._observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting && this._phase === 'idle') {
            this._observer?.disconnect()
            this._scheduleStart()
          }
        },
        { threshold: 0.5 },
      )
      this._observer.observe(this)
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._observer?.disconnect()
    if (this._timer !== undefined) clearTimeout(this._timer)
  }

  /**
   * Manually trigger a fresh typing animation.
   * Safe to call even while an animation is in progress.
   */
  play(): void {
    this._stop()
    this._displayed = ''
    this._phase = 'idle'
    this._scheduleStart()
  }

  /** Immediately show the full text without animating. */
  complete(): void {
    this._stop()
    this._displayed = this.text
    this._phase = 'done'
  }

  private _stop(): void {
    if (this._timer !== undefined) {
      clearTimeout(this._timer)
      this._timer = undefined
    }
  }

  private _scheduleStart(): void {
    if (this._prefersReducedMotion) {
      this._displayed = this.text
      this._phase = 'done'
      return
    }
    this._timer = setTimeout(() => this._startTyping(), this.delay)
  }

  private _startTyping(): void {
    this._phase = 'typing'
    this._typeNext()
  }

  private _typeNext(): void {
    const target = this.text
    if (this._displayed.length < target.length) {
      this._displayed = target.slice(0, this._displayed.length + 1)
      this._timer = setTimeout(() => this._typeNext(), this.speed)
    } else {
      // Typing complete
      this.dispatchEvent(new CustomEvent('pith-type-done', { bubbles: true, composed: true }))

      if (this.loop) {
        this._timer = setTimeout(() => {
          if (this.erase) {
            this._phase = 'erasing'
            this._eraseNext()
          } else {
            // Hard reset and retype
            this._displayed = ''
            this._phase = 'typing'
            this._typeNext()
          }
        }, this.loopDelay)
      } else {
        this._phase = 'done'
      }
    }
  }

  private _eraseNext(): void {
    if (this._displayed.length > 0) {
      this._displayed = this._displayed.slice(0, -1)
      const rate = this.eraseSpeed > 0 ? this.eraseSpeed : Math.max(20, this.speed / 2)
      this._timer = setTimeout(() => this._eraseNext(), rate)
    } else {
      this.dispatchEvent(new CustomEvent('pith-erase-done', { bubbles: true, composed: true }))
      // Brief pause before retyping
      this._phase = 'typing'
      this._timer = setTimeout(() => this._typeNext(), 120)
    }
  }

  override render() {
    const isDone = this._phase === 'done' && !this.loop
    return html`
      <span
        class="text"
        role="status"
        aria-label=${this.text}
        aria-atomic="false"
      >${this._displayed}</span>${this.cursor
        ? html`<span class="cursor ${isDone ? 'done' : ''}" aria-hidden="true"></span>`
        : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-typewriter': PithTypewriter
  }
}
