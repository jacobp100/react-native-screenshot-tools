/* eslint-disable class-methods-use-this, no-console */
const chalk = require("chalk");

const pipe = (value, ...fns) => fns.reduce((current, fn) => fn(current), value);

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    const {
      testResults,
      numPassedTests: passed,
      numFailedTests: failed
    } = results;

    testResults.forEach(suiteResults => {
      suiteResults.testResults.forEach(result => {
        result.failureMessages.forEach(e => {
          console.error(chalk.red(e.message));
          console.error(e.stack);
        });
      });
    });

    pipe(
      `${passed} ${passed !== 1 ? "snapshots" : "snapshot"} generated`,
      chalk.green,
      console.log
    );

    if (failed === 0) return;

    pipe(
      `${failed} ${failed !== 1 ? "snapshots" : "snapshot"} failed`,
      chalk.red,
      console.error
    );
  }
};
