import '../../../packages/core/src/styles/tokens.css'
import '../../../packages/core/src/styles/themes.css'
import { PithToaster } from '@pith/ui'

// Suppress "unused import" — registers all custom elements.
void PithToaster

const root = document.documentElement

// ── Dark mode toggle ──────────────────────────────────────────────
// Sets data-dark on <html> AND each .card so their data-theme dark
// variants trigger correctly (theme dark selectors target same element).
document.getElementById('dark-toggle')!
  .addEventListener('pith-change', (e) => {
    const { checked } = (e as CustomEvent<{ checked: boolean }>).detail
    root.toggleAttribute('data-dark', checked)
    document.querySelectorAll<HTMLElement>('.card').forEach(card => {
      card.toggleAttribute('data-dark', checked)
    })
  })

// ── Enter buttons — navigate to docs.html with chosen theme ──────
// Uses composedPath() to find the pith-button host element even when
// the click originates from inside its shadow DOM.
document.addEventListener('click', (e) => {
  const host = e.composedPath().find(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el.classList.contains('enter-btn')
  )
  if (!host) return

  const theme = host.dataset.enterTheme ?? 'ink'
  const dark  = root.hasAttribute('data-dark') ? '&dark=1' : ''
  const href  = `docs.html?theme=${theme}${dark}`

  const navigate = () => { window.location.href = href }

  if ('startViewTransition' in document) {
    root.setAttribute('data-theme', theme)
    ;(document as any).startViewTransition(navigate)
  } else {
    navigate()
  }
})
