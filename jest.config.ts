/**
 * Jest configuration object.
 *
 * @see https://jestjs.io/docs/configuration
 */
const config = {
  // Only run test files with the specified extensions
  moduleFileExtensions: ['cjs', 'js', 'mjs', 'ts'],
  // Use the specified test environment
  testEnvironment: 'node',
  testMatch: ['**/*.test.{cjs,js,mjs,ts}'],
  // Global timeout for all tests
  globalTimeout: 300000,
  // Default timeout for each test
  testTimeout: 300000
};

export default config;
