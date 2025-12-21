/** @type {import('jest').Config} */
export default {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		// Note: No @/ alias - not used in codebase, keeps config aligned with TS/Vite
	},
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: "tsconfig.test.json",
			},
		],
	},
	transformIgnorePatterns: ["/node_modules/(?!(@testing-library/jest-dom)/)"],
	extensionsToTreatAsEsm: [".ts", ".tsx"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/main.tsx",
		"!src/test/**/*",
		"!src/config/**/*", // Exclude config from coverage
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
};
