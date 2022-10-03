/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testResultsProcessor: 'jest-sonar-reporter',
};

module.exports = config;
