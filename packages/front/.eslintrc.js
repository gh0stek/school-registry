module.exports = {
  root: true,
  env: {
    node: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['vue.config.*', 'shims-tsx.d.ts', 'shims-vue.d.ts'],
}
