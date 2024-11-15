module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: [
        '[**/__tests__/**](https://www.bing.com/search?form=SKPBOT&q=%2F__tests__%2F)/*.ts',
        '**/?(*.)+(spec|test).ts',
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text-summary'],
};
