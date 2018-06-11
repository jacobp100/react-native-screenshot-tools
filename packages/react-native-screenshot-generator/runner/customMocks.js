const JS = require("system-components-js");

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

jest.doMock("StatusBar", () => () => null);
