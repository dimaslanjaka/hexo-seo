const prettier = require("./.prettierrc.json");

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    amd: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": [
      "error",
      {
        allowDestructuring: false,
        allowedNames: ["self", "hexo"]
      }
    ],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "no-unused-labels": "off",
    "prettier/prettier": ["error", prettier]
  }
};

module.exports = config;
