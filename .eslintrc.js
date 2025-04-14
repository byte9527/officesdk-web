/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  extends: ['plugin:import/typescript', 'alloy/base'],
  plugins: ['import', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
    parser: '@typescript-eslint/parser',
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    complexity: 'off',
    'no-return-await': 'error',
    'max-params': 'off',
    'max-nested-callbacks': ['error', 5],
    'prefer-const': 'error',
    'no-param-reassign': 'off',
    'no-undef': 'off', // 交给 ts 处理
    'import/no-relative-packages': 'error',
    'prefer-arrow-callback': 'error',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'parameter',
        modifiers: ['unused'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'variable',
        format: [
          'camelCase', // 变量默认使用 camelCase
        ],
        leadingUnderscore: 'forbid',
      },
      {
        // 保持上一条规则的同时，只允许 UPPER_CASE 的变量为 const
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
      },
      {
        // 用作 export 的变量运行使用 PascalCase 和 camelCase
        selector: 'variable',
        modifiers: ['exported'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'memberLike',
        modifiers: ['readonly', 'static'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
      },
    ],
  },
};
