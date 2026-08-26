import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import stylistic from '@stylistic/eslint-plugin';
import pluginQuery from '@tanstack/eslint-plugin-query';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import muiPathImports from 'eslint-plugin-mui-path-imports';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

export default defineConfig([
  globalIgnores([
    'build/**',
    'dist/**',
    'public/**',
    '**/out/**',
    '**/.next/**',
    'next.config.js',
    'app/generated/**',
    'components/ui-pre-19/**',
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...pluginQuery.configs['flat/recommended'],
  prettier,
  {
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
      unicorn,
      'mui-path-imports': muiPathImports,
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      // eslint-plugin-react's version auto-detect still calls the removed
      // context.getFilename() API under ESLint 10, so pin the version instead
      react: {
        version: '19.2',
      },
      'better-tailwindcss': {
        entryPoint: 'app/(base)/tailwind-config.css',
      },
    },
    rules: {
      // The following rules are newly introduced by eslint-config-next 16
      // (typescript-eslint recommended + react-hooks v7 compiler rules) and
      // error on existing code. Downgraded to warnings so the upgrade is not
      // disruptive — delete these overrides to adopt the recommended 'error'
      // severities once the code is cleaned up.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'prefer-const': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/static-components': 'warn',

      '@next/next/no-img-element': 1,
      '@tanstack/query/no-rest-destructuring': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@stylistic/computed-property-spacing': [1, 'never'],
      'import/no-cycle': 1,
      'import/no-duplicates': 'off',
      'import/no-empty-named-blocks': 2,
      '@stylistic/jsx-quotes': [1, 'prefer-double'],
      'mui-path-imports/mui-path-imports': 'error',
      '@stylistic/no-confusing-arrow': ['error'],
      'no-console': [
        'warn',
        {
          allow: ['error'],
        },
      ],
      'no-const-assign': [2],
      'no-empty': 'warn',
      'no-empty-function': 'off',
      '@stylistic/no-extra-semi': 1,
      '@stylistic/no-multi-spaces': 1,
      'no-param-reassign': 'warn',
      'no-use-before-define': [
        0,
        {
          functions: false,
        },
      ],
      'perfectionist/sort-exports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-imports': [
        1,
        {
          customGroups: [
            {
              groupName: 'custom-mui',
              elementNamePattern: '^@mui/.+',
            },
            {
              groupName: 'custom-components',
              elementNamePattern: '^src/components/.+',
            },
            {
              groupName: 'custom-hooks',
              elementNamePattern: '^src/hooks/.+',
            },
            {
              groupName: 'custom-routes',
              elementNamePattern: '^src/routes/.+',
            },
            {
              groupName: 'custom-sections',
              elementNamePattern: '^src/sections/.+',
            },
            {
              groupName: 'custom-types',
              elementNamePattern: '^src/types/.+',
            },
            {
              groupName: 'custom-utils',
              elementNamePattern: '^src/utils/.+',
            },
          ],
          groups: [
            'custom-mui',
            ['builtin'],
            'external',
            ['custom-routes', 'custom-hooks', 'custom-utils', 'internal', 'custom-components', 'custom-sections', 'custom-types'],
            'type',
            ['parent', 'sibling', 'index'],
            'unknown',
          ],
          internalPattern: ['^@/.+'],
          newlinesBetween: 1,
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-named-exports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      // perfectionist
      // https://perfectionist.dev/
      'perfectionist/sort-named-imports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'prefer-destructuring': [
        1,
        {
          array: false,
          object: true,
        },
      ],
      '@stylistic/quote-props': [1, 'as-needed'],
      'react/destructuring-assignment': [1, 'always'],
      '@stylistic/jsx-child-element-spacing': 1,
      '@stylistic/jsx-curly-spacing': [
        1,
        {
          children: true,
          when: 'always',
        },
        {
          spacing: {
            objectLiterals: 'never',
          },
        },
      ],
      '@stylistic/jsx-equals-spacing': [1, 'never'],
      'react/jsx-no-leaked-render': 1,
      'react/jsx-no-script-url': 1,
      'react/jsx-no-useless-fragment': 0,
      'react/jsx-pascal-case': 1,
      '@stylistic/jsx-tag-spacing': [
        1,
        {
          afterOpening: 'never',
          beforeSelfClosing: 'always',
          closingSlash: 'never',
        },
      ],
      'react/no-array-index-key': 1,
      'react/no-children-prop': 1,
      'react/react-in-jsx-scope': 'off',
      '@stylistic/semi': [1, 'always'],
      '@stylistic/semi-spacing': [
        1,
        {
          after: true,
          before: false,
        },
      ],
      '@stylistic/space-in-parens': [1, 'never'],
      'unicorn/explicit-length-check': 1,
      'unicorn/no-useless-spread': 1,
      'unicorn/no-useless-undefined': 1,
      'unicorn/prefer-date-now': 1,
      'unicorn/prefer-number-properties': 1,
      'unicorn/no-for-each': 1,
      'unicorn/no-empty-file': 1,
      'unicorn/no-lonely-if': 1,
      'unicorn/no-negation-in-equality-check': 1,
      'unicorn/no-useless-switch-case': 1,
      'unicorn/no-useless-length-check': 1,
      'unicorn/prefer-array-find': 1,
      'unicorn/prefer-array-index-of': 1,
      'unicorn/prefer-includes': 1,
      'unicorn/prefer-array-some': 1,
      'unicorn/prefer-object-from-entries': 1,
      'unicorn/require-array-join-separator': 1,
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 140, lineBreakStyle: 'windows' }],
      'better-tailwindcss/enforce-consistent-variable-syntax': ['warn', { syntax: 'shorthand' }],
      'better-tailwindcss/no-unnecessary-whitespace': ['warn'],
      'better-tailwindcss/no-duplicate-classes': ['warn'],
      'better-tailwindcss/enforce-consistent-class-order': ['warn', { order: 'official' }],
      'better-tailwindcss/enforce-consistent-important-position': ['warn', { position: 'recommended' }],
      'better-tailwindcss/enforce-consistent-variant-order': ['warn'],
    },
  },
]);
