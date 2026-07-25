// Concatenate token + theme CSS into the published dist/styles.css, and emit a
// minified dist/pith.min.css for the standalone <script>-tag CDN usage.
// Cross-platform replacement for `cat a b > c` (works on Windows/CI).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformWithEsbuild } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sources = ['src/styles/tokens.css', 'src/styles/themes.css']
const out = resolve(root, 'dist/styles.css')
const outMin = resolve(root, 'dist/pith.min.css')

const css = sources.map((rel) => readFileSync(resolve(root, rel), 'utf8')).join('\n')

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, css)
console.log(`build:css → dist/styles.css (${css.length} bytes from ${sources.length} files)`)

const { code: min } = await transformWithEsbuild(css, 'styles.css', { loader: 'css', minify: true })
writeFileSync(outMin, min)
console.log(`build:css → dist/pith.min.css (${min.length} bytes, minified)`)
