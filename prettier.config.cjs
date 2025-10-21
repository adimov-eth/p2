module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  overrides: [
    {
      files: ["*.njk", "*.html"],
      options: {
        parser: "html"
      }
    }
  ]
};
