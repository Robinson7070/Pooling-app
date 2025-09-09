// Jest configuration for Poll App testing
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.join('<rootDir>', 'tests', 'jest.setup.js')],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\.module\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\.(css|sass|scss)$': path.join('<rootDir>', 'tests', '__mocks__', 'styleMock.js'),

    // Handle image imports
    '^.+\.(jpg|jpeg|png|gif|webp|avif|svg)$': path.join('<rootDir>', 'tests', '__mocks__', 'fileMock.js'),

    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\.module\.(css|sass|scss)$',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/tests/__mocks__/**',
    '!**/tests/jest.setup.js',
    '!**/jest.config.js',
    '!**/*.config.js',
  ],
};