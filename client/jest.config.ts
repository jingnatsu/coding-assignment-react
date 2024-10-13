/* eslint-disable */
const path = require('path'); // Import path module to resolve node_modules correctly
export default {
  displayName: 'client',
  preset: '../jest.preset.js',
  transform: {
    // Handle non-JS/TS files with Nx Jest plugin
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',

    // Use @swc/jest for transforming JS, JSX, TS, and TSX files
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true, // Enable TSX syntax
            decorators: true, // Enable decorators if used
          },
          transform: {
            react: {
              runtime: 'automatic', // New JSX transform (no need for import React)
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    // Ignore node_modules except for MUI and other ESM libraries
    'node_modules/(?!(@mui|@babel|lodash-es)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock stylesheets

    // Adjust path to resolve node_modules outside rootDir
    '^@mui/material/(.*)$': path.resolve(
      __dirname,
      '../node_modules/@mui/material/$1'
    ),
    '^@mui/icons-material/(.*)$': path.resolve(
      __dirname,
      '../node_modules/@mui/icons-material/$1'
    ),
  },
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Support these extensions
  coverageDirectory: '../coverage/apps/react-client',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
};
