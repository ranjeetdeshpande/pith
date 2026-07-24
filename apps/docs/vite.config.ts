import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@pith/ui': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        welcome: resolve(__dirname, 'index.html'),
        docs:    resolve(__dirname, 'docs.html'),
      },
    },
  },
})
