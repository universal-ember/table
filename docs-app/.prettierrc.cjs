'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      // Lol, JavaScript
      files: ['*.js', '*.ts', '*.cjs', '.mjs', '.cts', '.mts', '.cts'],
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
    {
      files: ['src/routes/application.ts'],
      options: {
        printWidth: 160,
      },
    },
  ],
};
