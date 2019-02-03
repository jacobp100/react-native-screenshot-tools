import React, { Component } from "react";
import { View, Image } from "react-native";
import DeviceContext from "system-components-js/DeviceContext";
import AppContainer from "./AppContainer";
import FacebookDevices from "./FacebookDevices";
import devices from "./devices.json";
import framePositions from "./framePositions.json";

export default class Frame extends Component {
  constructor({ device, color }) {
    super();

    const { frames } = devices[device];
    const frame = frames[color] || Object.values(frames)[0];
    this.source = FacebookDevices[frame];
    this.framePosition = framePositions.find(md => md.name === frame);

    this.state = { layout: null };

    this.handleLayout = ({ nativeEvent: { layout } }) =>
      this.setState(s => (s.layout == null ? { layout } : null));
  }

  getFrames() {
    const { layout } = this.state;

    if (layout == null) {
      return { imageFrame: null, containerFrame: null };
    }

    const { width = layout.width, direction = Frame.PORTRAIT } = this.props;

    const imageFrame = {
      width,
      height: (layout.height * width) / layout.width
    };
    const containerFrame =
      direction === Frame.PORTRAIT
        ? imageFrame
        : { width: imageFrame.height, height: imageFrame.width };
    return { imageFrame, containerFrame };
  }

  renderAppFrame(deviceContext, imageFrame, imageTransform) {
    const { device, children } = this.props;

    const screenWidth = deviceContext.width;
    const { imageWidth, screenX, screenY } = this.framePosition;
    const screenScale = screenWidth / imageWidth;
    const scale = screenScale * (imageFrame.width / screenWidth);
    const positionScale = imageFrame.width / imageWidth;

    return (
      <AppContainer
        device={device}
        style={[
          {
            width: deviceContext.width,
            height: deviceContext.height,
            position: "absolute",
            top: 0,
            left: 0,
            transform: [
              { translateX: (deviceContext.width * (scale - 1)) / 2 },
              { translateY: (deviceContext.height * (scale - 1)) / 2 },
              { translateX: screenX * positionScale },
              { translateY: screenY * positionScale },
              { scale },
              imageTransform
            ]
          }
        ]}
      >
        {children}
      </AppContainer>
    );
  }

  render() {
    const { direction = Frame.PORTRAIT } = this.props;
    const { layout } = this.state;
    const { containerFrame, imageFrame } = this.getFrames(layout);

    const imageTransform = {
      [Frame.PORTRAIT]: [],
      [Frame.LANDSCAPE]: [{ rotate: "-90deg" }],
      [Frame.LANDSCAPE_REVERSE]: [{ rotate: "90deg" }]
    }[direction];

    return (
      <View style={containerFrame}>
        <DeviceContext.Consumer>
          {deviceContext =>
            imageFrame != null
              ? this.renderAppFrame(deviceContext, imageFrame, imageTransform)
              : null
          }
        </DeviceContext.Consumer>
        <Image
          source={this.source}
          style={[imageFrame, { transform: imageTransform }]}
          resizeMode="stretch"
          onLayout={this.handleLayout}
        />
      </View>
    );
  }
}

Frame.defaultProps = {
  device: null
};

Frame.PORTRAIT = 0;
Frame.LANDSCAPE = 1;
Frame.LANDSCAPE_REVERSE = 2;
