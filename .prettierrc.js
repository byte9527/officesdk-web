module.exports = {
  // Maximum line length of 120 characters
  printWidth: 120,
  // Use 2 spaces for indentation
  tabWidth: 2,
  // Use spaces instead of tabs
  useTabs: false,
  // Require semicolons at the end of statements
  semi: true,
  // Use single quotes
  singleQuote: true,
  // Only add quotes around object properties when necessary
  quoteProps: 'as-needed',
  // Use double quotes for JSX
  jsxSingleQuote: false,
  // Add spaces inside brackets
  bracketSpacing: true,
  // Add trailing commas
  trailingComma: 'all',
  // Always add parentheses around arrow function parameters
  arrowParens: 'always',
  // Format the entire file
  rangeStart: 0,
  rangeEnd: Infinity,
  parser: 'typescript',
  // Don't require the @prettier pragma
  requirePragma: false,
  // Don't insert @prettier pragma
  insertPragma: false,
  // Preserve existing line wrapping
  proseWrap: 'preserve',
  // HTML whitespace sensitivity based on CSS display
  htmlWhitespaceSensitivity: 'css',
  // Don't indent script and style tags in Vue files
  vueIndentScriptAndStyle: false,
  // Use LF line endings
  endOfLine: 'lf',
  // Format embedded code
  embeddedLanguageFormatting: 'auto',
};
