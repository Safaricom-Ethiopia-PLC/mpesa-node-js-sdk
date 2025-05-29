/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.(ts|js)', '**/*.spec.(ts|js)'],
  globals: {},
  collectCoverage: true, // Optional: Collect test coverage
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'], // Optional: Coverage paths
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};