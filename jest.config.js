/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  testResultsProcessor: 'jest-sonar-reporter',
  testPathIgnorePatterns: ['<rootDir>/build/']
};

module.exports = config;
