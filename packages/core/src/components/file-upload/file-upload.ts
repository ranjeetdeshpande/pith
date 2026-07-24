import { LitElement, html, unsafeCSS, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import styles from './file-upload.css?raw'

/**
 * `pith-file-upload` — Accessible, form-associated file drop-zone.
 *
 * @tag pith-file-upload
 *
 * @fires pith-change - When the file selection changes. `detail.files` is `File[]`.
 *
 * @attr {string}         accept    - Accepted MIME types or extensions (e.g. "image/*,.pdf").
 * @attr {boolean}        multiple  - Allow multiple files.
 * @attr {boolean}        disabled  - Disables interaction.
 * @attr {boolean}        required  - Marks field required.
 * @attr {string}         name      - Form field name.
 * @attr {string}         label     - Drop zone primary label.
 * @attr {string}         hint      - Helper text below the zone.
 * @attr {string}         error     - Error message; also sets aria-invalid.
 * @attr {number}         max-size  - Per-file size limit in bytes (0 = unlimited).
 * @attr {'sm'|'md'|'lg'} size      - Visual size (default: 'md').
 *
 * @example
 * <pith-file-upload name="avatar" accept="image/*" label="Upload avatar"></pith-file-upload>
 * <pith-file-upload name="docs" accept=".pdf,.docx" multiple max-size="5242880"></pith-file-upload>
 */
@customElement('pith-file-upload')
export class PithFileUpload extends LitElement {
  static override styles = unsafeCSS(styles)
  static formAssociated = true

  private _internals: ElementInternals
  private static _seq = 0
  private readonly _uid = `pith-file-upload-${PithFileUpload._seq++}`
  /** Tracks drag depth to avoid false dragleave on child elements. */
  private _dragDepth = 0

  @query('input[type="file"]') private _input!: HTMLInputElement

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  /** Accepted MIME types / extensions passed to the native input. */
  @property() accept = ''

  /** Allow multiple file selection. */
  @property({ type: Boolean, reflect: true }) multiple = false

  /** Disables interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Required for form validation. */
  @property({ type: Boolean }) required = false

  /** Form field name. */
  @property() name = ''

  /** Drop zone primary label. */
  @property() label = 'Drop files here or click to browse'

  /** Helper text. Hidden when error is set. */
  @property() hint = ''

  /** Error message. Shown below; sets aria-invalid="true". */
  @property({ reflect: true }) error = ''

  /** Per-file max size in bytes. 0 = unlimited. */
  @property({ type: Number, attribute: 'max-size' }) maxSize = 0

  /** Visual size. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  @state() private _files: File[] = []
  @state() private _dragging = false

  // ── Internals ────────────────────────────────────────────

  private _addFiles(incoming: File[]): void {
    let accepted = this.accept
      ? incoming.filter(f => this._matchesAccept(f))
      : incoming

    if (this.maxSize > 0) {
      accepted = accepted.filter(f => f.size <= this.maxSize)
    }

    this._files = this.multiple
      ? [...this._files, ...accepted]
      : accepted.slice(0, 1)

    this._syncFormValue()
    this._dispatch()
  }

  private _removeFile(index: number): void {
    this._files = this._files.filter((_, i) => i !== index)
    this._syncFormValue()
    this._dispatch()
  }

  private _syncFormValue(): void {
    if (this._files.length === 0) {
      this._internals.setFormValue(null)
      return
    }
    if (!this.multiple || this._files.length === 1) {
      this._internals.setFormValue(this._files[0] ?? null)
    } else {
      const fd = new FormData()
      const key = this.name || 'file'
      this._files.forEach(f => fd.append(key, f))
      this._internals.setFormValue(fd)
    }
  }

  private _dispatch(): void {
    this.dispatchEvent(new CustomEvent('pith-change', {
      detail: { files: [...this._files] },
      bubbles: true,
      composed: true,
    }))
  }

  private _matchesAccept(file: File): boolean {
    return this.accept.split(',').map(s => s.trim()).some(pattern => {
      if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())
      if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1))
      return file.type === pattern
    })
  }

  private static _formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // ── Event handlers ───────────────────────────────────────

  private _onClick(): void {
    if (this.disabled) return
    this._input.click()
  }

  private _onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._input.click()
    }
  }

  private _onInputChange(): void {
    const files = Array.from(this._input.files ?? [])
    if (files.length) this._addFiles(files)
    // Reset so re-selecting the same file fires change again
    this._input.value = ''
  }

  private _onDragEnter(e: DragEvent): void {
    e.preventDefault()
    this._dragDepth++
    this._dragging = true
  }

  private _onDragOver(e: DragEvent): void {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
  }

  private _onDragLeave(): void {
    this._dragDepth--
    if (this._dragDepth <= 0) {
      this._dragDepth = 0
      this._dragging = false
    }
  }

  private _onDrop(e: DragEvent): void {
    e.preventDefault()
    this._dragDepth = 0
    this._dragging = false
    const files = Array.from(e.dataTransfer?.files ?? [])
    if (files.length) this._addFiles(files)
  }

  // ── Render ───────────────────────────────────────────────

  override render() {
    const hasError = Boolean(this.error)
    const hasFiles = this._files.length > 0

    return html`
      <div class="root">

        <!-- Hidden native input -->
        <input
          id=${this._uid}
          type="file"
          class="sr-only"
          accept=${this.accept || nothing}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name || nothing}
          @change=${this._onInputChange}
        />

        <!-- Drop zone -->
        <div
          class="zone ${this._dragging ? 'is-dragging' : ''} ${hasError ? 'is-error' : ''}"
          role="button"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-label=${this.label}
          aria-disabled=${this.disabled ? 'true' : nothing}
          aria-invalid=${hasError ? 'true' : nothing}
          aria-describedby=${hasError ? `${this._uid}-msg` : (this.hint ? `${this._uid}-hint` : nothing)}
          @click=${this._onClick}
          @keydown=${this._onKeydown}
          @dragenter=${this._onDragEnter}
          @dragover=${this._onDragOver}
          @dragleave=${this._onDragLeave}
          @drop=${this._onDrop}
        >
          <!-- Upload icon -->
          <svg class="zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          <span class="zone-label">${this.label}</span>
          ${this.accept || this.maxSize
            ? html`<span class="zone-sub">
                ${[
                  this.accept ? `Accepts: ${this.accept}` : '',
                  this.maxSize ? `Max ${PithFileUpload._formatSize(this.maxSize)} per file` : '',
                ].filter(Boolean).join(' · ')}
              </span>`
            : nothing}
        </div>

        <!-- File list -->
        ${hasFiles ? html`
          <ul class="file-list" role="list">
            ${this._files.map((file, i) => html`
              <li class="file-item">
                <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <div class="file-info">
                  <span class="file-name">${file.name}</span>
                  <span class="file-size">${PithFileUpload._formatSize(file.size)}</span>
                </div>
                <button
                  class="file-remove"
                  type="button"
                  aria-label="Remove ${file.name}"
                  @click=${(e: Event) => { e.stopPropagation(); this._removeFile(i) }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </li>
            `)}
          </ul>
        ` : nothing}

        <!-- Messages -->
        ${hasError
          ? html`<p id="${this._uid}-msg" class="message is-error">${this.error}</p>`
          : this.hint
          ? html`<p id="${this._uid}-hint" class="message">${this.hint}</p>`
          : nothing}

      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap { 'pith-file-upload': PithFileUpload }
}
