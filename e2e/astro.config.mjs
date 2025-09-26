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
    '/lit': '/stories/lit/app/lit',
    '/react': '/stories/react/app/react',
    '/solid': '/stories/solid/app/solid',
    '/svelte': '/stories/svelte/app/svelte',
    '/vue': '/stories/vue/app/vue',
  },
  integrations: [
    react({ include: ['src/react/**/*'] }),
    preact({ include: ['src/preact/**/*'] }),
    solidJs({ include: ['src/solid/**/*'] }),
    svelte(),
    vue(),
    astrobook({ directory: 'src' }),
  ],
})
