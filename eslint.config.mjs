// @ts-check

import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js']
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended
);
