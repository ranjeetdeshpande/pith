import { defineConfig } from 'vite'
import { resolve } from 'path'

// Standalone CDN build: a single self-contained file with Lit inlined, so the
// whole library works from a plain <script> tag with no build step, no import
// map, and no bare-specifier resolution:
//
//   <link rel="stylesheet" href="https://unpkg.com/@pith/ui/dist/pith.min.css">
//   <script src="https://unpkg.com/@pith/ui/dist/pith.min.js" defer></script>
//
// This is deliberately separate from the primary build (vite.config.ts), which
// stays ESM + code-split + lit-external for npm/bundler consumers.
export default defineConfig({
  build: {
    // Don't wipe the ESM build output — this runs after it.
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Pith', // global for the IIFE (side-effects register the elements)
      formats: ['iife'],
      fileName: () => 'pith.min.js',
    },
    // Bundle Lit IN — the whole point of the standalone build.
    rollupOptions: {},
    // CSS is emitted separately by scripts/build-css.mjs (pith.min.css).
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
