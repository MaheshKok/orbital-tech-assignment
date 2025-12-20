/** @type {import('jest').Config} */
export default {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: "tsconfig.json",
			},
		],
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/main.tsx",
		"!src/test/**/*",
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
