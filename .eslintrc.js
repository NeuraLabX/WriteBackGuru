module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'semi': ['error', 'always'],
    'no-console': 'warn',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'no-unused-vars': 'warn',
    'linebreak-style': ['error', 'unix'],
    'no-var': 'error',
    'prefer-const': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
