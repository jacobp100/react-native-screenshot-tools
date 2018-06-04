const { StyleSheet, Platform } = require("react-native");

StyleSheet.hairlineWidth = 1 / snapshotterSettings.dpi;
StyleSheet.create = p => p;

Platform.os = snapshotterSettings.os;
Platform.select = p => p[snapshotterSettings.os];

const JS = require("system-components-js");

Object.keys(JS).forEach(mock => jest.doMock(mock, () => JS[mock]));
