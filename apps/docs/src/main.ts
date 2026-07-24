import '../../../packages/core/src/styles/tokens.css'
import '../../../packages/core/src/styles/themes.css'
import { PithToaster } from '@pith/ui'

// Suppress "unused import" — importing @pith/ui registers all custom elements.
void PithToaster

const root = document.documentElement

// ── Persisted preferences (theme / dark / font-size) ──────
// localStorage is the baseline; URL params (handoff from the welcome page)
// win when present so shared/deep links still work.
const STORE = { theme: 'pith-docs-theme', dark: 'pith-docs-dark', font: 'pith-docs-fontsize' }
const store = {
  get: (k: string) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } },
}

;(function initPreferences() {
  const params = new URLSearchParams(location.search)

  const theme = params.get('theme') ?? store.get(STORE.theme)
  const dark  = params.get('dark') === '1' ? true
              : params.get('dark') === '0' ? false
              : store.get(STORE.dark) === '1'
  const font  = store.get(STORE.font)

  if (theme) {
    root.setAttribute('data-theme', theme)
    store.set(STORE.theme, theme)
    // Sync the tab switcher so its first pith-change fires with the right
    // value (pith-tabs fires pith-change on first render via updated()).
    const switcher = document.getElementById('theme-switcher')
    if (switcher) switcher.setAttribute('value', theme)
  }

  root.toggleAttribute('data-dark', dark)
  store.set(STORE.dark, dark ? '1' : '0')
  const darkToggle = document.getElementById('dark-toggle')
  if (darkToggle) darkToggle.toggleAttribute('checked', dark)

  if (font) {
    root.style.fontSize = font + 'px'
    const slider = document.getElementById('fontsize-slider')
    const label  = document.getElementById('fontsize-label')
    if (slider) slider.setAttribute('value', font)
    if (label)  label.textContent = font + 'px'
  }
})()

// ── Mobile: collapse sidebar by default on narrow viewports ──
const docsNav = document.getElementById('docs-nav')
if (window.innerWidth < 768 && docsNav) {
  docsNav.setAttribute('collapsed', '')
}

// Hamburger button toggles sidebar collapsed state
document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
  docsNav?.toggleAttribute('collapsed')
})

// ── Font-size scale slider ────────────────────────────
const fontsizeSlider = document.getElementById('fontsize-slider')!
const fontsizeLabel  = document.getElementById('fontsize-label')!
// Label tracks drag live; font-size commits only on pointer-up
fontsizeSlider.addEventListener('pith-input', (e) => {
  fontsizeLabel.textContent = (e as CustomEvent<{ value: number }>).detail.value + 'px'
})
fontsizeSlider.addEventListener('pith-change', (e) => {
  const { value } = (e as CustomEvent<{ value: number }>).detail
  root.style.fontSize = value + 'px'
  fontsizeLabel.textContent = value + 'px'
  store.set(STORE.font, String(value))
})

// ── Theme switching via pith-tabs ─────────────────────────
document.getElementById('theme-switcher')!
  .addEventListener('pith-change', (e) => {
    const { value } = (e as CustomEvent<{ value: string }>).detail
    root.setAttribute('data-theme', value)
    store.set(STORE.theme, value)
  })

// ── Dark mode via pith-switch ─────────────────────────────
document.getElementById('dark-toggle')!
  .addEventListener('pith-change', (e) => {
    const { checked } = (e as CustomEvent<{ checked: boolean }>).detail
    root.toggleAttribute('data-dark', checked)
    store.set(STORE.dark, checked ? '1' : '0')
  })

// ── Loading button demo ──────────────────────────────────
document.querySelectorAll<HTMLElement>('pith-button[demo-loading]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.setAttribute('loading', '')
    setTimeout(() => btn.removeAttribute('loading'), 2000)
  })
})

// ── Toast demo ───────────────────────────────────────────
document.querySelectorAll<HTMLButtonElement>('[data-toast]').forEach(btn => {
  btn.addEventListener('click', () => {
    PithToaster.toast({
      message: btn.dataset.toastMessage ?? 'Notification',
      variant: (btn.dataset.toast as any) ?? 'default',
    })
  })
})

// ── Modal triggers ───────────────────────────────────────
document.querySelectorAll<HTMLButtonElement>('[data-modal-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.modalTarget!) as any
    if (modal) modal.open = true
  })
})

// ── Drawer triggers ──────────────────────────────────────
document.querySelectorAll<HTMLButtonElement>('[data-drawer]').forEach(btn => {
  btn.addEventListener('click', () => {
    const drawer = document.getElementById(btn.dataset.drawer!) as any
    if (drawer) drawer.open = true
  })
})

// ── Command palette ───────────────────────────────────────
document.getElementById('cmd-open-btn')?.addEventListener('click', () => {
  const cmd = document.getElementById('main-cmd') as any
  if (cmd) cmd.open = true
})

// ⌘K / Ctrl+K global shortcut
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const cmd = document.getElementById('main-cmd') as any
    if (cmd) cmd.open = !cmd.open
  }
})

// ── Counter replay ───────────────────────────────────────
document.getElementById('counter-replay')?.addEventListener('click', () => {
  document.querySelectorAll<any>('#cnt-1, #cnt-2, #cnt-3, #cnt-4').forEach(c => c.reset())
  // Let the DOM repaint the reset state before animating
  requestAnimationFrame(() => {
    document.querySelectorAll<any>('#cnt-1, #cnt-2, #cnt-3, #cnt-4').forEach(c => c.play())
  })
})

// ── Typewriter replay ────────────────────────────────────
document.getElementById('tw-replay')?.addEventListener('click', () => {
  document.querySelectorAll<any>('#tw-1, #tw-2, #tw-3').forEach(tw => tw.play())
})

// ── Sidebar nav: active item tracking ────────────────────
// Maps button sub-section IDs back to the "button" nav item
function navIdFor(sectionId: string): string {
  return sectionId.startsWith('button') ? 'button' : sectionId
}

const navItems = document.querySelectorAll<HTMLElement>('[data-section]')
const contentEl = document.getElementById('main-content')

function setActiveNav(id: string) {
  const target = navIdFor(id)
  navItems.forEach(item => {
    const el = item as any
    if (item.dataset.section === target) {
      el.setAttribute('active', '')
    } else {
      el.removeAttribute('active')
    }
  })
}

// Set initial active state from URL hash (for shared links)
const initialId = location.hash.slice(1)
setActiveNav(initialId || 'button')

// Observe sections and update active nav item on scroll
const sections = document.querySelectorAll<HTMLElement>('section[id]')
const sectionObserver = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id)
        // Update the URL hash silently so the link is shareable
        history.replaceState(null, '', `#${entry.target.id}`)
      }
    }
  },
  {
    root: contentEl,
    // Trigger when section enters the top 10–35% of the scrollable area
    rootMargin: '-10% 0px -65% 0px',
    threshold: 0,
  }
)
sections.forEach(s => sectionObserver.observe(s))

// Scroll to hash on initial load (handles shared links when body overflows hidden)
if (initialId && contentEl) {
  const target = document.getElementById(initialId)
  if (target) {
    // Wait one frame for custom elements to upgrade and paint.
    // Use contentEl.scrollTop instead of scrollIntoView to avoid touching the root.
    requestAnimationFrame(() => {
      const offset = target.getBoundingClientRect().top
        - contentEl!.getBoundingClientRect().top
        + contentEl!.scrollTop
      contentEl!.scrollTo({ top: offset, behavior: 'instant' })
    })
  }
}

// ── Copy-paste code snippets under every demo ─────────────
// Serializes each .demo-card's live markup into a tidy, copyable snippet.
// Layout wrapper <div>s are unwrapped so only the component markup shows.
// Opt a card out with `data-no-code`.
const ATTR_SKIP = new Set(['demo-loading'])

function serialize(node: Node, indent: number): string {
  const pad = '  '.repeat(indent)
  if (node.nodeType === Node.TEXT_NODE) {
    const t = (node.textContent ?? '').trim()
    return t ? pad + t : ''
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const el = node as Element
  const tag = el.tagName.toLowerCase()

  // Unwrap plain layout containers — show only the component markup.
  if (tag === 'div' || tag === 'span') {
    return Array.from(el.childNodes).map((c) => serialize(c, indent)).filter(Boolean).join('\n')
  }

  const attrs = Array.from(el.attributes)
    .filter((a) => !ATTR_SKIP.has(a.name) && !a.name.startsWith('data-'))
    .map((a) => (a.value === '' ? a.name : `${a.name}="${a.value}"`))
    .join(' ')
  const open = attrs ? `<${tag} ${attrs}>` : `<${tag}>`

  const kids = Array.from(el.childNodes).filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE ||
      (n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== ''),
  )
  if (kids.length === 0) return `${pad}${open}</${tag}>`
  const first = kids[0]
  if (kids.length === 1 && first && first.nodeType === Node.TEXT_NODE) {
    return `${pad}${open}${(first.textContent ?? '').trim()}</${tag}>`
  }
  const inner = kids.map((c) => serialize(c, indent + 1)).filter(Boolean).join('\n')
  return `${pad}${open}\n${inner}\n${pad}</${tag}>`
}

document.querySelectorAll<HTMLElement>('.demo-card').forEach((card) => {
  if (card.hasAttribute('data-no-code')) return
  const code = Array.from(card.childNodes)
    .map((n) => serialize(n, 0))
    .filter(Boolean)
    .join('\n')
  if (!code.trim()) return

  const panel = document.createElement('details')
  panel.className = 'code-panel'

  const summary = document.createElement('summary')
  const copyBtn = document.createElement('button')
  copyBtn.className = 'code-copy'
  copyBtn.type = 'button'
  copyBtn.textContent = 'Copy'
  summary.appendChild(copyBtn)

  const pre = document.createElement('pre')
  const codeEl = document.createElement('code')
  codeEl.textContent = code
  pre.appendChild(codeEl)

  panel.append(summary, pre)
  card.insertAdjacentElement('afterend', panel)

  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault() // don't toggle the <details>
    try {
      await navigator.clipboard.writeText(code)
      copyBtn.textContent = 'Copied!'
      copyBtn.setAttribute('data-copied', '')
    } catch {
      copyBtn.textContent = 'Press ⌘C'
    }
    setTimeout(() => {
      copyBtn.textContent = 'Copy'
      copyBtn.removeAttribute('data-copied')
    }, 1600)
  })
})

// ── Interactive playground ────────────────────────────────
type PgControl =
  | { attr: string; type: 'enum'; options: string[]; value: string }
  | { attr: string; type: 'bool'; value: boolean }
  | { attr: string; type: 'text'; value: string }

interface PgComponent {
  tag: string
  slot?: string  // plain-text default slot
  inner?: string // raw child markup (for slotted components)
  controls: PgControl[]
}

const PG: Record<string, PgComponent> = {
  button: {
    tag: 'pith-button',
    slot: 'Save changes',
    controls: [
      { attr: 'variant', type: 'enum', options: ['primary', 'secondary', 'ghost', 'danger'], value: 'primary' },
      { attr: 'size', type: 'enum', options: ['sm', 'md', 'lg'], value: 'md' },
      { attr: 'disabled', type: 'bool', value: false },
      { attr: 'loading', type: 'bool', value: false },
    ],
  },
  badge: {
    tag: 'pith-badge',
    slot: 'New',
    controls: [
      { attr: 'variant', type: 'enum', options: ['default', 'primary', 'success', 'warning', 'danger'], value: 'default' },
      { attr: 'dot', type: 'bool', value: false },
      { attr: 'removable', type: 'bool', value: false },
    ],
  },
  card: {
    tag: 'pith-card',
    inner: '<span slot="body">A card with slotted content.</span>',
    controls: [
      { attr: 'hoverable', type: 'bool', value: true },
    ],
  },
  input: {
    tag: 'pith-input',
    controls: [
      { attr: 'label', type: 'text', value: 'Email' },
      { attr: 'placeholder', type: 'text', value: 'you@example.com' },
      { attr: 'size', type: 'enum', options: ['sm', 'md', 'lg'], value: 'md' },
      { attr: 'required', type: 'bool', value: false },
      { attr: 'disabled', type: 'bool', value: false },
    ],
  },
}

const pgStage = document.getElementById('pg-stage')
if (pgStage) {
  const pgControls = document.getElementById('pg-controls')!
  const pgCode = document.getElementById('pg-code')!
  const pgCopy = document.getElementById('pg-copy')!

  // Per-component live state, seeded from the config defaults.
  const pgState: Record<string, Record<string, string | boolean>> = {}
  for (const key of Object.keys(PG)) {
    const seed: Record<string, string | boolean> = {}
    for (const c of PG[key]!.controls) seed[c.attr] = c.value
    pgState[key] = seed
  }

  let pgCurrent = 'button'

  function pgRenderStage() {
    const cfg = PG[pgCurrent]!
    const el = document.createElement(cfg.tag)
    for (const c of cfg.controls) {
      const v = pgState[pgCurrent]![c.attr]
      if (c.type === 'bool') {
        if (v) el.setAttribute(c.attr, '')
      } else if (v !== '' && v != null) {
        el.setAttribute(c.attr, String(v))
      }
    }
    if (cfg.inner) el.innerHTML = cfg.inner
    else if (cfg.slot) el.textContent = cfg.slot
    pgStage!.replaceChildren(el)
    pgCode.textContent = serialize(el, 0)
  }

  function pgBuildControls() {
    const cfg = PG[pgCurrent]!
    pgControls.replaceChildren()
    for (const c of cfg.controls) {
      const field = document.createElement('div')
      field.className = c.type === 'bool' ? 'pg-field pg-field-row' : 'pg-field'

      const label = document.createElement('span')
      label.className = 'pg-field-label'
      label.textContent = c.attr

      let control: HTMLElement
      if (c.type === 'enum') {
        control = document.createElement('pith-select')
        control.setAttribute('value', String(pgState[pgCurrent]![c.attr]))
        for (const opt of c.options) {
          const o = document.createElement('pith-option')
          o.setAttribute('value', opt)
          o.textContent = opt
          control.appendChild(o)
        }
        control.addEventListener('pith-change', (e) => {
          pgState[pgCurrent]![c.attr] = (e as CustomEvent<{ value: string }>).detail.value
          pgRenderStage()
        })
      } else if (c.type === 'bool') {
        control = document.createElement('pith-switch')
        control.setAttribute('size', 'sm')
        if (pgState[pgCurrent]![c.attr]) control.setAttribute('checked', '')
        control.addEventListener('pith-change', (e) => {
          pgState[pgCurrent]![c.attr] = (e as CustomEvent<{ checked: boolean }>).detail.checked
          pgRenderStage()
        })
      } else {
        control = document.createElement('pith-input')
        control.setAttribute('size', 'sm')
        control.setAttribute('value', String(pgState[pgCurrent]![c.attr]))
        control.addEventListener('pith-input', (e) => {
          pgState[pgCurrent]![c.attr] = (e as CustomEvent<{ value: string }>).detail.value
          pgRenderStage()
        })
      }

      field.append(label, control)
      pgControls.appendChild(field)
    }
  }

  document.getElementById('pg-component')?.addEventListener('pith-change', (e) => {
    pgCurrent = (e as CustomEvent<{ value: string }>).detail.value
    pgBuildControls()
    pgRenderStage()
  })

  pgCopy.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(pgCode.textContent ?? '')
      pgCopy.textContent = 'Copied!'
      pgCopy.setAttribute('data-copied', '')
    } catch {
      pgCopy.textContent = 'Press ⌘C'
    }
    setTimeout(() => {
      pgCopy.textContent = 'Copy'
      pgCopy.removeAttribute('data-copied')
    }, 1600)
  })

  pgBuildControls()
  pgRenderStage()
}
