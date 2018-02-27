const fs = require("fs");
const path = require("path");
const os = require("os");
const Runtime = require("jest-runtime");
const NodeEnvironment = require("jest-environment-node");
const Resolver = require("jest-resolve");

const defaultConfig = {
  automock: false,
  bail: false,
  browser: false,
  cache: true,
  cacheDirectory: path.join(os.tmpdir(), "jest"),
  changedFilesWithAncestor: false,
  clearMocks: false,
  coveragePathIgnorePatterns: [/node_modules/],
  coverageReporters: ["json", "text", "lcov", "clover"],
  detectLeaks: false,
  expand: false,
  forceCoverageMatch: [],
  globalSetup: null,
  globalTeardown: null,
  globals: {},
  haste: {
    providesModuleNodeModules: []
  },
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  moduleNameMapper: {},
  modulePathIgnorePatterns: [],
  noStackTrace: false,
  notify: false,
  notifyMode: "always",
  preset: null,
  resetMocks: false,
  resetModules: false,
  restoreMocks: false,
  runTestsByPath: false,
  runner: "jest-runner",
  snapshotSerializers: [],
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {},
  testFailureExitCode: 1,
  testLocationInResults: false,
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)(spec|test).js?(x)"],
  testPathIgnorePatterns: [/node_modules/],
  testRegex: "",
  testResultsProcessor: null,
  testURL: "about:blank",
  timers: "real",
  transformIgnorePatterns: [/node_modules/],
  useStderr: false,
  verbose: null,
  watch: false,
  watchPathIgnorePatterns: [],
  watchman: true,
  // EXTRA
  setupFiles: []
};

module.exports = async testPath => {
  const source = fs.readFileSync(testPath, "utf8");
  const config = defaultConfig;
  const environment = new NodeEnvironment(config);
  const cacheFS = { [testPath]: source };
  const hasteMap = await Runtime.createHasteMap(config).build();
  const resolver = Runtime.createResolver(config, hasteMap.moduleMap);
  const runtime = new Runtime(config, environment, resolver, cacheFS);

  await environment.setup();

  runtime.requireModule(testPath);
};
