import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'build', 'node_modules', 'internal', 'archive', '.broken-backup', 'src/packages', 'src/src', 'src/supabase', 'src/tests', 'src/Dockerfile', 'src/apps', 'tests', 'src/scripts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Disable strict rules for existing codebase compatibility
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-console': 'off',
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
      'no-empty-pattern': 'off',
      'no-prototype-builtins': 'off',
      'prefer-rest-params': 'off',
      'prefer-const': 'off',
      'no-shadow-restricted-names': 'off',
      // React hooks - keep as warnings only
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
);
