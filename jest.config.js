module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/server.ts",
    "!src/database/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
};
