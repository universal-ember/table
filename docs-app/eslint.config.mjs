import { ember } from 'ember-eslint';

export default [
  ...ember.recommended(import.meta.dirname),
  {
    // Tech debt from CrowdStrike (but really: me, but a while ago)
    files: ['**/*.{js,ts,gjs,gts}'],
    rules: {
      'prefer-const': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-redundant-type-constituents': 0,
      '@typescript-eslint/no-unsafe-enum-comparison': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/unbound-method': 0,
      '@typescript-eslint/no-empty-object-types': 0,
    },
  },
];
