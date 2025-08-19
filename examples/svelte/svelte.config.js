import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),

    typescript: {
      config: (config) => {
        /** @type {string[]} */
        const include = config.include

        if (!Array.isArray(include)) {
          throw new TypeError('include in tsconfig.json should be an array')
        }

        if (!include.includes('../svelte.config.js')) {
          include.push('../svelte.config.js')
        }
      },
    },
  },
}

export default config
