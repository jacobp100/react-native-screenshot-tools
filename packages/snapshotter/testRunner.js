/* eslint-disable no-param-reassign */
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { renderToSvg } = require("react-image-export");

module.exports = async (
  globalConfig,
  config,
  environment,
  runtime,
  testFilePath
) => {
  const settings = { ...config.testEnvironmentOptions, testFilePath };

  const tests = [];
  environment.global.snapshotterSettings = settings;
  environment.global.snapshot = (title, fn) => {
    tests.push({ title, fn });
  };
  environment.global.testFilePath = testFilePath;

  runtime.requireModule(require.resolve("./customMocks"));
  runtime.requireModule(testFilePath);

  const errorPromises = tests.map(async ({ fn, title }) => {
    try {
      const jsx = fn();
      const svg = await renderToSvg(jsx, settings);
      await promisify(fs.writeFile)(
        path.join(testFilePath, "..", `${title}-${settings.name}.svg`),
        svg
      );
      return { title, error: null };
    } catch (error) {
      return { title, error };
    }
  });
  const errors = await Promise.all(errorPromises);

  return {
    numFailingTests: errors.filter(desc => desc.error != null).length,
    numPassingTests: errors.filter(desc => desc.error == null).length,
    numPendingTests: 0,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0
    },
    testFilePath,
    testResults: errors.map(({ title, error }) => ({
      ancestorTitles: [],
      failureMessages: error ? [error] : [],
      fullName: title,
      numPassingAsserts: 0,
      status: error ? "failed" : "passed",
      title
    }))
  };
};
