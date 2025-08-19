import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      name: 'prosemirror-adapter_solid',
      formats: ['es'],
      fileName: 'index',
    },
    minify: false,
    rollupOptions: {
      external: [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.peerDependencies || {})],
    },
  },
  plugins: [solid()],
})
