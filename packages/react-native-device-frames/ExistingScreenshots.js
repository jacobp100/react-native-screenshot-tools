import React from "react";
import { Image } from "react-native-snapshotter-mocks";
import DeviceContext from "system-components-js/DeviceContext";

const sourceFit = (baseSize, source) => {
  const { width, height } = Image.resolveAssetSource(source);
  return Math.abs(baseSize.width - width * baseSize.height - height);
};

export default ({ sources }) =>
  React.createElement(DeviceContext.Consumer, null, baseSize => {
    const [bestSource = null] = sources
      .slice()
      .sort((a, b) => sourceFit(baseSize, a) - sourceFit(baseSize, b));
    return React.createElement(Image, { source: bestSource });
  });
