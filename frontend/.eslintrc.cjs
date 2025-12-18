/* eslint-disable no-undef */
module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },

  plugins: ['vue', '@typescript-eslint'],

  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}

