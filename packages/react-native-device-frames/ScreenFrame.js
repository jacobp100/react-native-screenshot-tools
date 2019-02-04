import React from "react";
import { View } from "react-native-snapshotter-mocks";
import DeviceContext from "system-components-js/DeviceContext";

export default ({ children }) =>
  React.createElement(DeviceContext.Consumer, null, ({ width, height }) =>
    React.createElement(View, { style: { width, height } }, children)
  );
