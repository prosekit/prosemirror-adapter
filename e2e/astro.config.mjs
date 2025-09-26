// @ts-check
import preact from '@astrojs/preact'
import react from '@astrojs/react'
import solidJs from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import astrobook from 'astrobook'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 7001,
  },
  redirects: {
    '/preact': '/stories/preact/app/preact',
    '/lit': '/stories/lit/app/lit',
    '/react': '/stories/react/app/react',
    '/solid': '/stories/solid/app/solid',
    '/svelte': '/stories/svelte/app/svelte',
    '/vue': '/stories/vue/app/vue',
  },
  integrations: [
    preact({ include: ['src/preact/**/*.tsx'] }),
    react({ include: ['src/react/**/*.tsx'] }),
    solidJs({ include: ['src/solid/**/*.tsx'] }),
    svelte(),
    vue(),
    astrobook({ directory: 'src' }),
  ],
})
