module.exports = {
  root: true,
  extends: ['@antfu', 'plugin:tailwindcss/recommended'],
  rules: {
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/semi': 'off',
    'antfu/if-newline': 'off',
    'no-console': 'warn',
    'prefer-promise-reject-errors': 'off',
    'unused-imports/no-unused-imports': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
        },
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
  },
};
