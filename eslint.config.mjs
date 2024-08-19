import oxlint from 'eslint-plugin-oxlint';
import prettier from 'eslint-plugin-prettier/recommended';

/**
 * @type {import('eslint').Linter.Config}
 */
export default [prettier, oxlint.configs['flat/recommended']];
