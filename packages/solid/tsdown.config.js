import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: 'esm',
  dts: true,
  platform: 'browser',
  tsconfig: 'tsconfig.json',
})
