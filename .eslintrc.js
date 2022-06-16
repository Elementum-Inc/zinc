module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    indent: ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: 'off',
    semi: ['error', 'always', { 'omitLastInOneLineBlock': true }],
    'no-undef': 'off',
    'no-unused-vars': 'warn'
  },
  ignorePatterns: ['assets/theme.js', 'cypress/*', './*.js']
};
