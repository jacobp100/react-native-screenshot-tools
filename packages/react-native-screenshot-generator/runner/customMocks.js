/* global jest, snapshotterSettings */
const React = require("react");
const JS = require("system-components-js");
const imageLoader = require("react-native-headless-snapshotter/imageLoader");

Object.keys(JS).forEach(mock => jest.doMock(mock, () => JS[mock]));

const flatten = x =>
  Array.isArray(x) ? Object.assign({}, ...x.map(flatten)) : x;

const absoluteFill = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
};

jest.doMock("Image", () =>
  Object.assign(props => React.createElement("Image", props), {
    resolveAssetSource: ({ absoulteFilePath }) => {
      const { width, height } = imageLoader.sync(
        absoulteFilePath,
        snapshotterSettings
      );
      return { uri: absoulteFilePath, width, height };
    }
  })
);

jest.doMock("StyleSheet", () => ({
  hairlineWidth: 1 / snapshotterSettings.dpi,
  create: p => p,
  compose: (a, b) => [a, b],
  flatten,
  absoluteFill,
  absoluteFillObject: absoluteFill
}));

jest.doMock("Platform", () => ({
  os: snapshotterSettings.os,
  select: p => p[snapshotterSettings.os]
}));

jest.doMock("Dimensions", () => ({
  get: () => ({
    width: snapshotterSettings.width,
    height: snapshotterSettings.height
  }),
  addEventListener() {},
  removeEventListener() {}
}));
