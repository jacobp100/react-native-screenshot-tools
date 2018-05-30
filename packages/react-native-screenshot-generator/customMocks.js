const { StyleSheet } = require("react-native");

StyleSheet.hairlineWidth = 1 / snapshotterSettings.dpi;

const JS = require("system-components-js");

Object.keys(JS).forEach(mock => jest.doMock(mock, () => JS[mock]));
