import { defineESLintConfig } from '@ocavue/eslint-config'

export default defineESLintConfig(
  {
    react: {
      files: ['**/react/**/*.tsx', '**/react/**/*.ts', '**/preact/**/*.tsx', '**/preact/**/*.ts'],
    },
    markdown: false,
  },
  [
    {
      ignores: ['**/.svelte-kit'],
    },
  ],
)
