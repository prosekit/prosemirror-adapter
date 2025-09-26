import { defineESLintConfig } from '@ocavue/eslint-config'

export default defineESLintConfig(
  {
    react: {
      files: ['**/react/**/*.tsx', '**/react/**/*.ts'],
    },
    markdown: false,
  },
  [
    {
      ignores: ['**/.svelte-kit', 'packages/preact', 'e2e/preact'],
    },
  ],
)
