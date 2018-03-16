/*
 * Copyright (c) 2017 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
/* eslint-disable no-underscore-dangle */
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const diff = require("jest-diff");
const {
  EXPECTED_COLOR,
  matcherHint,
  RECEIVED_COLOR
} = require("jest-matcher-utils");
const kebabCase = require("lodash/kebabCase");
const merge = require("lodash/merge");

const SNAPSHOTS_DIR = "__file_snapshots__";

function updateSnapshotState(oldSnapshotState, newSnapshotState) {
  return merge({}, oldSnapshotState, newSnapshotState);
}

function configureToMatchFileSnapshot({
  fileExtension: commonFileExtension = ""
} = {}) {
  return function toMatchFileSnapshot(
    received,
    {
      customSnapshotIdentifier = "",
      customSnapshotsDir,
      fileExtension = commonFileExtension
    } = {}
  ) {
    const { testPath, currentTestName, isNot } = this;

    let { snapshotState } = this;
    if (isNot) {
      throw new Error(
        "Jest: `.not` cannot be used with `.toMatchFileSnapshot()`."
      );
    }

    updateSnapshotState(snapshotState, {
      _counters: snapshotState._counters.set(
        currentTestName,
        (snapshotState._counters.get(currentTestName) || 0) + 1
      )
    }); // eslint-disable-line max-len
    const snapshotIdentifier =
      customSnapshotIdentifier ||
      kebabCase(
        `${path.basename(
          testPath
        )}-${currentTestName}-${snapshotState._counters.get(currentTestName)}`
      );

    const snapshotsDir =
      customSnapshotsDir || path.join(path.dirname(testPath), SNAPSHOTS_DIR);
    const snapshotPath = path.join(
      snapshotsDir,
      `${snapshotIdentifier}-snap${fileExtension}`
    );

    const updateSnapshot = snapshotState._updateSnapshot === "all";

    let pass = true;
    let expected = null;
    let actual = null;
    let updated = false;
    let added = false;
    if (fs.existsSync(snapshotPath) && !updateSnapshot) {
      expected = fs.readFileSync(snapshotPath, "utf8");
      actual = received;
      pass = actual === expected;
    } else {
      mkdirp.sync(snapshotsDir);
      fs.writeFileSync(snapshotPath, received);

      if (updateSnapshot) {
        updated = true;
      } else {
        added = true;
      }
    }

    /*
      istanbul ignore next
      `message` is implementation detail. Actual behavior is tested in integration.spec.js
    */
    let report = () => "";

    if (updated) {
      // once transition away from jasmine is done this will be a lot more elegant and pure
      // https://github.com/facebook/jest/pull/3668
      snapshotState = updateSnapshotState(snapshotState, {
        updated: (snapshotState.updated += 1)
      });
    } else if (added) {
      snapshotState = updateSnapshotState(snapshotState, {
        added: (snapshotState.added += 1)
      });
    } else if (!pass) {
      expected = (expected || "").trim();
      actual = (actual || "").trim();
      const diffMessage = diff(expected, actual, {
        aAnnotation: "Snapshot",
        bAnnotation: "Received",
        expand: snapshotState.expand
      });
      /* eslint-disable prefer-template */
      report = () =>
        `${RECEIVED_COLOR("Received value")} does not match ` +
        `${EXPECTED_COLOR("stored snapshot")}.\n\n` +
        (diffMessage ||
          EXPECTED_COLOR("- " + (expected || "")) +
            "\n" +
            RECEIVED_COLOR("+ " + actual));
    }

    return {
      message: () =>
        matcherHint(".toMatchFileSnapshot", "value", "") + "\n\n" + report(),
      pass
    };
  };
}

module.exports = {
  toMatchFileSnapshot: configureToMatchFileSnapshot(),
  configureToMatchFileSnapshot
};
