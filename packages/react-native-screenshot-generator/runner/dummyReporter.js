const {
  default: BaseReporter
} = require("jest-cli/build/reporters/base_reporter");

// This removes the `Determining test suites to run...` messages
module.exports = class extends BaseReporter {};
