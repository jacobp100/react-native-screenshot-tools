const chalk = require("chalk");
const devices = require("./devices");

const pipe = (value, ...fns) => fns.reduce((current, fn) => fn(current), value);

/* eslint-disable no-console */
module.exports = ({ results }, i) => {
  const {
    testResults,
    numPassedTests: passed,
    numFailedTests: failed
  } = results;

  console.log(devices[i].name);

  testResults.forEach(suiteResults => {
    if (suiteResults.testExecError) {
      const e = suiteResults.testExecError;
      console.error(chalk.red(e.message));
      console.error(e.stack);
    }

    suiteResults.testResults.forEach(result => {
      result.failureMessages.forEach(e => {
        console.error(chalk.red(e.message));
        console.error(e.stack);
      });
    });
  });

  pipe(
    `  ${passed} ${passed !== 1 ? "snapshots" : "snapshot"} generated`,
    chalk.green,
    console.log
  );

  if (failed !== 0) {
    pipe(
      `  ${failed} ${failed !== 1 ? "snapshots" : "snapshot"} failed`,
      chalk.red,
      console.error
    );
  }
};
