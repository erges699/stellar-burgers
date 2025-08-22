/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types'
  }
};

// import type { JestConfigWithTsJest } from 'ts-jest';

// const config: JestConfigWithTsJest = {
//   transform: {
//     '^.+\\.tsx?$': [
//       'ts-jest',
//       {
//         //
//       }
//     ]
//   }
// };

export default config;
