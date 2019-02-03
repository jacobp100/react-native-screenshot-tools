import React, { Component } from "react";
import { Image } from "react-native";
import DeviceContext from "system-components-js/DeviceContext";

const sourceFit = (baseSize, source) => {
  const { width, height } = Image.resolveAssetSource(source);
  return Math.abs(baseSize.width - width * baseSize.height - height);
};

export default ({ sources }) => (
  <DeviceContext.Consumer>
    {baseSize => {
      const [bestSource = null] = sources
        .slice()
        .sort((a, b) => sourceFit(baseSize, a) - sourceFit(baseSize, b));
      return <Image source={bestSource} />;
    }}
  </DeviceContext.Consumer>
);
