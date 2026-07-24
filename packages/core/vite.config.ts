import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import dts from 'vite-plugin-dts'

// Auto-discover every component barrel so each ships as its own tree-shakeable
// chunk with matching .d.ts — keeps the build in lock-step with the exports map.
const componentsDir = resolve(__dirname, 'src/components')
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => [`components/${d.name}/index`, resolve(componentsDir, d.name, 'index.ts')]),
)

export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', /^lit\//],
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
