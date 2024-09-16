import typescriptEslint from 'typescript-eslint';

export default [
  {
    files: ['src/**/*.{ts,js,mjs}'],
    ignores: ['dist', 'node_modules']
  },
  ...typescriptEslint.configs.recommended,
  {
    rules: {
      'prefer-const': 'warn',
      'prefer-rest-params': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn'
    }
  }
];
