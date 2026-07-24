import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import styles from './tabs.css?raw'

@customElement('pith-tabs')
export class PithTabs extends LitElement {
  static override styles = unsafeCSS(styles)

  /** Value of the currently active tab. Reflects to attribute. */
  @property({ reflect: true })
  value = ''

  /** Visual style of the tab list. */
  @property({ reflect: true })
  variant: 'line' | 'pills' = 'line'

  /** Optional `aria-label` for the tablist region. */
  @property()
  label = ''

  @query('.tablist') private _tablistEl!: HTMLElement
  @query('.indicator') private _indicatorEl!: HTMLElement

  /** True after the first indicator placement — enables CSS transitions. */
  private _indicatorReady = false

  /** Re-measures the indicator whenever the host is resized (font-size change, viewport, etc). */
  private _ro = new ResizeObserver(() => this._updateIndicator())

  // Bound handler — stable reference so removeEventListener works
  private _handleTabSelect = (e: Event): void => {
    const { value } = (e as CustomEvent<{ value: string }>).detail
    if (value !== this.value) {
      this.value = value
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('pith-tab-select', this._handleTabSelect)
    this._ro.observe(this)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('pith-tab-select', this._handleTabSelect)
    this._ro.disconnect()
  }

  override firstUpdated(): void {
    this._sync()
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('value')) {
      this._sync()
      this.dispatchEvent(new CustomEvent('pith-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }))
    }
    // When variant switches (line ↔ pills) snap the indicator to the new shape
    if (changed.has('variant') && this._indicatorReady) {
      this._indicatorReady = false
      this._indicatorEl?.classList.remove('is-ready')
      requestAnimationFrame(() => this._updateIndicator())
    }
  }

  private _sync(): void {
    const tabs = [...this.querySelectorAll<HTMLElement>('pith-tab')]
    const panels = [...this.querySelectorAll<HTMLElement>('pith-tab-panel')]

    // Default to the first tab when no value is set
    if (!this.value && tabs.length > 0) {
      this.value = tabs[0]?.getAttribute('value') ?? ''
      return // updated() will call _sync() again with the new value
    }

    tabs.forEach(tab => {
      tab.toggleAttribute('active', tab.getAttribute('value') === this.value)
      // Set data-variant so pith-tab can style itself without :host-context()
      // (host-context is not supported in Firefox/Safari)
      tab.setAttribute('data-variant', this.variant)
    })
    panels.forEach(panel => {
      panel.toggleAttribute('active', panel.getAttribute('value') === this.value)
    })

    // Slide the indicator to the newly-active tab
    requestAnimationFrame(() => this._updateIndicator())
  }

  /**
   * Measures the active pith-tab element (light DOM) against the tablist
   * (shadow DOM) and writes --_ind-x/y/w/h so the CSS indicator can follow.
   * On first call the indicator snaps; subsequent calls animate.
   */
  private _updateIndicator(): void {
    const indicator = this._indicatorEl
    const tablist = this._tablistEl
    if (!indicator || !tablist) return

    const activeTab = this.querySelector<HTMLElement>('pith-tab[active]')
    if (!activeTab) return

    const tlRect = tablist.getBoundingClientRect()
    const tRect  = activeTab.getBoundingClientRect()

    tablist.style.setProperty('--_ind-x', `${tRect.left - tlRect.left}px`)
    tablist.style.setProperty('--_ind-y', `${tRect.top  - tlRect.top}px`)
    tablist.style.setProperty('--_ind-w', `${tRect.width}px`)
    tablist.style.setProperty('--_ind-h', `${tRect.height}px`)

    if (!this._indicatorReady) {
      this._indicatorReady = true
      // Enable transitions on the very next frame so the initial snap
      // finishes painting before animated movement is allowed.
      requestAnimationFrame(() => indicator.classList.add('is-ready'))
    }
  }

  /** Arrow key navigation across enabled tabs in the tablist. */
  private _onTablistKeydown(e: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()

    const tabs = [...this.querySelectorAll<HTMLElement>('pith-tab:not([disabled])')]
    if (tabs.length === 0) return

    const idx = tabs.findIndex(t => t.getAttribute('value') === this.value)
    let next = idx

    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1

    if (next !== idx) {
      const newTab = tabs[next]
      if (!newTab) return
      this.value = newTab.getAttribute('value') ?? this.value
      newTab.focus() // delegatesFocus on pith-tab → inner button receives focus
    }
  }

  private _onSlotChange(): void {
    this._sync()
  }

  override render() {
    return html`
      <div class="root">
        <div
          class="tablist"
          role="tablist"
          aria-label="${this.label || nothing}"
          @keydown="${this._onTablistKeydown}">
          <div class="indicator" aria-hidden="true"></div>
          <slot name="tabs" @slotchange="${this._onSlotChange}"></slot>
        </div>
        <div class="panels">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pith-tabs': PithTabs
  }
}
