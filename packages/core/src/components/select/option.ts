import { LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * `pith-option` — Option item for `pith-select`.
 * Place inside a `<pith-select>` element. Text content becomes the displayed label.
 *
 * @tag pith-option
 *
 * @attr {string}  value    - The submitted form value
 * @attr {boolean} disabled - Disabled state
 *
 * @example
 * <pith-select name="color" placeholder="Pick a color">
 *   <pith-option value="red">Red</pith-option>
 *   <pith-option value="green">Green</pith-option>
 *   <pith-option value="blue" disabled>Blue (unavailable)</pith-option>
 * </pith-select>
 */
@customElement('pith-option')
export class PithOption extends LitElement {
  // No shadow DOM — data container only, rendered by pith-select
  protected override createRenderRoot() { return this }

  @property() value = ''
  @property({ type: Boolean, reflect: true }) disabled = false
}

declare global {
  interface HTMLElementTagNameMap { 'pith-option': PithOption }
}
