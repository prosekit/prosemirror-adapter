import solidPlugin from 'vite-plugin-solid'

import { viteConfigFactory } from '../../vite.config'

export default viteConfigFactory(import.meta.url, {
  plugins: [solidPlugin()],
})
