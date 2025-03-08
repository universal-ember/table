import { ember } from "ember-eslint";

export default [
  ...ember.recommended(import.meta.dirname),
  {
    files: ["**/*.{gjs,gts}"],
    rules: {
      "ember/template-no-let-reference": 0,
    },
  },
  {
    // Tech debt from CrowdStrike (but really: me, but a while ago)
    files: ["**/*.{js,ts,gjs,gts}"],
    rules: {
      "prefer-const": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-floating-promises": 0,
      "@typescript-eslint/require-await": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-redundant-type-constituents": 0,
      "@typescript-eslint/no-unsafe-enum-comparison": 0,
      "@typescript-eslint/no-unsafe-return": 0,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-unsafe-call": 0,
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/unbound-method": 0,
      "@typescript-eslint/no-empty-object-types": 0,
    },
  },
];
