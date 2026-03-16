import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleNameMapper: {
    "^@formlib/(.*)$": "<rootDir>/src/formlib/$1",
    "^@kyclib/(.*)$": "<rootDir>/src/kyclib/$1",
    "^@kycmodule/(.*)$": "<rootDir>/src/kycmodule/$1",
  },
};

export default config;
