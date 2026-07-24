import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: true,
  external: ['react', 'react/jsx-runtime', 'lit', /^lit\//, '@pith/ui'],
})
