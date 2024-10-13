module.exports = {
    testEnvironment: 'node', // Set the test environment to Node.js
    moduleNameMapper: {
    },
    setupFiles: ['<rootDir>/setupTests.js'], // Add any setup files you may need
    testPathIgnorePatterns: ['/node_modules/'], // Ignore the 'node_modules' directory
    verbose: true, // Show detailed test results
    collectCoverage: true, // Enable test coverage reporting
    collectCoverageFrom: ['**/*.js'], // Include all JavaScript files for coverage
    coverageDirectory: 'coverage', // Output directory for coverage reports
};