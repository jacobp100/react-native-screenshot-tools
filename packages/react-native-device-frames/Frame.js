import React, { Component } from "react";
import { View, Image } from "react-native";
import AppContainer from "./AppContainer";
import FacebookDevices from "./FacebookDevices";
import devices from "./devices.json";
import framePositions from "./framePositions.json";

// FIXME: Shouldn't rely on our snapshotter
const appFrame = {
  width: global.snapshotterSettings.width,
  height: global.snapshotterSettings.height
};

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

  renderAppFrame(imageFrame) {
    const { device, direction = Frame.PORTRAIT, children } = this.props;

    const imageTransform = {
      [Frame.PORTRAIT]: [],
      [Frame.LANDSCAPE]: [{ rotate: "-90deg" }],
      [Frame.LANDSCAPE_REVERSE]: [{ rotate: "90deg" }]
    }[direction];

    const { screenWidth, imageWidth, screenX, screenY } = this.framePosition;
    const screenScale = screenWidth / imageWidth;
    const scale = screenScale * (imageFrame.width / appFrame.width);
    const positionScale = imageFrame.width / imageWidth;

    return (
      <AppContainer
        device={device}
        style={[
          appFrame,
          {
            position: "absolute",
            top: 0,
            left: 0,
            transform: [
              { translateX: (appFrame.width * (scale - 1)) / 2 },
              { translateY: (appFrame.height * (scale - 1)) / 2 },
              { translateX: screenX * positionScale },
              { translateY: screenY * positionScale },
              { scale }
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
        {imageFrame != null && this.renderAppFrame(imageFrame)}
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
