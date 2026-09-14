import javascript from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import refresh from 'eslint-plugin-react-refresh'
import sort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import typescript from 'typescript-eslint'

const prettierNoFix = {
  ...prettier.rules.prettier,
  meta: {
    ...prettier.rules.prettier.meta,
    fixable: undefined,
  },
}

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  javascript.configs.recommended,
  ...typescript.configs.recommended,
  react.configs.flat.recommended,
  refresh.configs.recommended,
  prettierNoFix,
  {
    plugins: {
      'simple-import-sort': sort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-empty-pattern': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Side effects
            ['^\\u0000'],
            // Core libraries
            ['^react$', '^react-dom$', '^react-router$'],
            // Node built-ins
            [
              '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
            ],
            // Node modules
            ['^@?\\w'],
            // Source code imports
            ['^src/'],
            // Aliased imports
            ['^'],
            // Relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'prettier/prettier': 'warn',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'warn',
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            'meta',
            'links',
            'headers',
            'loader',
            'clientLoader',
            'action',
            'clientAction',
            'metadata',
          ],
          allowConstantExport: true,
        },
      ],
    },
  },
]

export default config
