import { defineESLintConfig } from '@ocavue/eslint-config'

export default defineESLintConfig(
  {
    react: {
      files: ['**/react/**/*.tsx', '**/react/**/*.ts'],
    },
    preact: {
      files: ['packages/preact/**/*.tsx', 'packages/preact/**/*.ts'],
    },
    markdown: false,
  },
  [
    {
      ignores: ['**/.svelte-kit'],
    },
  ],
)
