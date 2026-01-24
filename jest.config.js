/**
 * Jest Configuration
 * Configures testing environment and settings
 */

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/tests/**',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
};
