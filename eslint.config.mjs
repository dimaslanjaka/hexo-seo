import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import jsonc from 'jsonc-parser';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});
const prettierrc = jsonc.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc.json'), 'utf-8'));

export default [
  {
    // Ignore certain files and directories from linting
    ignores: [
      '**/*.md', // Markdown files
      '**/*.html', // HTML files
      '**/*.py', // Python files
      '**/*.txt', // Text files
      '**/tmp/**', // Temporary files
      '**/app/**', // Application-specific files
      '**/dist/**', // Distribution/build files
      '**/node_modules/**', // Node.js dependencies
      '**/coverage/**', // Test coverage reports
      '**/logs/**', // Log files
      '**/vendor/**', // Third-party libraries
      '**/min.*', // Minified files (e.g., min.js, min.css)
      '**/*.lock', // Lock files (e.g., package-lock.json, yarn.lock)
      '**/public/**', // Public/static assets
      '**/.yarn/**', // Yarn folder
      '**/release/**' // Yarn folder
    ]
  },

  // Extend recommended ESLint rules, TypeScript plugin rules, and Prettier plugin rules
  ...compat.extends(
    'eslint:recommended', // Base ESLint recommended rules
    'plugin:@typescript-eslint/eslint-recommended', // TypeScript-specific recommended rules
    'plugin:@typescript-eslint/recommended', // Additional TypeScript rules
    'plugin:prettier/recommended' // Integrate Prettier for code formatting
  ),

  {
    linterOptions: {
      reportUnusedDisableDirectives: true // Report unused ESLint disable comments
    },

    languageOptions: {
      globals: {
        ...globals.browser, // Browser global variables
        ...globals.amd, // AMD module globals
        ...globals.node, // Node.js global variables
        $: 'readonly', // jQuery object
        jQuery: 'readonly', // jQuery object
        adsbygoogle: 'writable', // Google Ads
        hexo: 'readonly' // Hexo static site generator object
      },

      parser: tsParser, // Use TypeScript parser
      ecmaVersion: 2020, // Specify ECMAScript version 2020
      sourceType: 'module' // Enable ES6 modules
    },

    rules: {
      // Prettier formatting rules
      'prettier/prettier': [
        'error',
        Object.assign(prettierrc, {
          // Override settings for specific file types
          overrides: [
            {
              excludeFiles: ['*.min.js', '*.min.cjs', '*.min.css', '*.min.html', '*.min.scss'], // Skip minified files
              files: ['*.js', '*.css', '*.sass', '*.html', '*.md', '*.ts'], // Target specific file types
              options: { semi: true } // Always use semicolons
            },
            {
              files: ['*.ejs', '*.njk', '*.html'], // Specific parser for templating and HTML files
              options: { parser: 'html' }
            }
          ]
        })
      ],

      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off', // Disable enforcing return type on functions
      'no-unused-vars': 'off', // Disable base rule (TypeScript has its own)

      // Allow unused variables starting with _ (common convention for ignored variables)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments starting with _
          varsIgnorePattern: '^_', // Ignore unused variables starting with _
          caughtErrorsIgnorePattern: '^_' // Ignore unused caught errors starting with _
        }
      ],

      '@typescript-eslint/no-explicit-any': 'off', // Allow usage of 'any' type
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: false, // Disallow destructuring with aliasing
          allowedNames: ['self', 'hexo'] // Allow specific aliases like 'self' and 'hexo'
        }
      ],

      // JavaScript arrow function rules
      'arrow-body-style': 'off', // Disable forcing arrow function bodies
      'prefer-arrow-callback': 'off' // Disable enforcing arrow functions for callbacks
    }
  },
  {
    // Specific rules for JavaScript and CommonJS files
    files: ['**/*.js', '**/*.cjs'],

    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Allow require() in CommonJS files
      '@typescript-eslint/no-require-imports': 'off' // Allow require imports
    }
  }
];
