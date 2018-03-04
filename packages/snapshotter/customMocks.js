const { StyleSheet } = require("react-native");

StyleSheet.hairlineWidth = 1 / snapshotterSettings.dpi;

const JS = require("js-versions-of-native-components");

jest.doMock("Switch", () => JS.Switch);
