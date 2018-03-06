const { StyleSheet } = require("react-native");

StyleSheet.hairlineWidth = 1 / snapshotterSettings.dpi;

const JS = require("js-versions-of-native-components");

Object.keys(JS).forEach(mock => jest.doMock(mock, () => JS[mock]));
