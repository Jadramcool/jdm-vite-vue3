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
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    // 针对自动导入的规则
    './.eslintrc-auto-import.json',
    // 1. 接入 prettier 的规则
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
  plugins: [
    '@typescript-eslint',
    'vue',
    // 2. 加入 prettier 的 eslint 插件
    'prettier',
  ],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 0,
    // turn on errors for missing imports
    'import/no-unresolved': 'off',
    // 对后缀的检测，否则 import 一个ts文件也会报错，需要手动添加'.ts', 增加了下面的配置后就不用了
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    // ],
    'import/extensions': ['off'],
    // 只允许1个默认导出，关闭，否则不能随意export xxx
    'import/prefer-default-export': ['off'],
    'no-console': ['off'],
    // 'no-unused-vars': ['off'],
    // '@typescript-eslint/no-unused-vars': ['off'],
    // 解决vite.config.ts报错问题
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // TODO 之后考虑删除
    'no-useless-escape': 'off',
    'import/export': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off', // 关闭箭头函数必须有返回值
    'no-restricted-syntax': 'off',
    'no-undef': 'off',
  },
};
