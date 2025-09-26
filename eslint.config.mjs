import { defineESLintConfig } from '@ocavue/eslint-config'

export default defineESLintConfig(
  {
    react: {
      files: ['**/react/**/*.tsx', '**/react/**/*.ts'],
    },
    preact: {
      files: [
        'packages/preact/**/*.tsx',
        'packages/preact/**/*.ts',
        'e2e/preact/**/*.tsx',
        'e2e/preact/**/*.ts',
        'e2e/src/preact/**/*.tsx',
        'e2e/src/preact/**/*.ts',
      ],
    },
    markdown: false,
  },
  [
    {
      ignores: ['**/.svelte-kit'],
    },
  ],
)
