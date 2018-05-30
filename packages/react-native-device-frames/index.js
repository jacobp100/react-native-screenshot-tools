import React, { Component } from "react";
import { View, Image } from "react-native";
import frames from "./frames";
import offsets from "./offsets";

// FIXME: Shouldn't rely on our snapshotter
const appFrame = {
  width: global.snapshotterSettings.width,
  height: global.snapshotterSettings.height
};

const imageWidth = 871;

export default class Frame extends Component {
  constructor({ device }) {
    super();

    this.source = frames[device];
    const possibleOffsetNames = device
      .split(" ")
      .map((_, i, words) => words.slice(0, i + 1).join(" "));
    this.offset = possibleOffsetNames
      .map(offsetName => offsets[offsetName])
      .find(offset => offset != null);
    this.scale = this.offset.width / imageWidth;

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

  render() {
    const { direction = Frame.PORTRAIT, children } = this.props;
    const { layout } = this.state;
    const { containerFrame, imageFrame } = this.getFrames(layout);

    const imageTransform = {
      [Frame.PORTRAIT]: [],
      [Frame.LANDSCAPE]: [{ rotate: "-90deg" }],
      [Frame.LANDSCAPE_REVERSE]: [{ rotate: "90deg" }]
    }[direction];

    return (
      <View style={containerFrame}>
        {imageFrame != null && (
          <View
            style={[
              appFrame,
              {
                position: "absolute",
                top: 0,
                left: 0,
                transform: [
                  { scale: (this.scale * imageFrame.width) / appFrame.width }
                ]
              }
            ]}
          >
            {children}
          </View>
        )}
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

Frame.PORTRAIT = 0;
Frame.LANDSCAPE = 1;
Frame.LANDSCAPE_REVERSE = 2;
