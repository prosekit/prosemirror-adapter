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
      ignores: ['**/.svelte-kit'],
    },
    {
      rules: {
        '@eslint-react/naming-convention/context-name': 'off',
      },
    }
  ],
)
