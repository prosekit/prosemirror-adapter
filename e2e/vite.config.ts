import { resolve } from 'node:path'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  root: 'src',
  server: {
    port: 7001,
  },
  preview: {
    port: 7001,
  },
  plugins: [
    vue(),
    svelte(),
    react({
      include: ['src/react/**/*'],
    }),
    solid({
      include: ['src/solid/**/*'],
    }),
  ],
  optimizeDeps: {
    exclude: ['svelte'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        react: resolve(__dirname, 'src/react/index.html'),
        vue: resolve(__dirname, 'src/vue/index.html'),
        svelte: resolve(__dirname, 'src/svelte/index.html'),
        lit: resolve(__dirname, 'src/lit/index.html'),
        solid: resolve(__dirname, 'src/solid/index.html'),
      },
    },
  },
})
