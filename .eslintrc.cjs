module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // 这里参照webpack的别名配置映射
          ['@', './src'],
        ],
        // 告诉resolver-alias有哪些后缀的文件要解析
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 0,
    // indent: ["error", "tab"],
    // "linebreak-style": ["error", "windows"],
    // quotes: ["error", "single"],
    // semi: ["error", "always"],
  },
};
