import React, { Component } from "react";
import { View, Image } from "react-native-snapshotter-mocks";
import DeviceContext from "system-components-js/DeviceContext";
import AppContainer from "./AppContainer";
import FacebookDevices from "./FacebookDevices";
import devices from "./devices.json";
import framePositions from "./framePositions.json";

const scaleFrame = ({ width, height }, scale) => ({
  width: width * scale,
  height: height * scale
});

export default class Frame extends Component {
  constructor({ device, color }) {
    super();

    const { frames } = devices[device];
    const frame = frames[color] || Object.values(frames)[0];
    this.source = FacebookDevices[frame];
    this.framePosition = framePositions.find(md => md.name === frame);

    this.state = { containerLayout: null, imageLayout: null };

    this.handleContainerLayout = ({ nativeEvent: { layout } }) =>
      this.setState(s =>
        s.containerLayout == null ? { containerLayout: layout } : null
      );
    this.handleImageLayout = ({ nativeEvent: { layout } }) =>
      this.setState(s =>
        s.imageLayout == null ? { imageLayout: layout } : null
      );
  }

  renderAppFrame(deviceContext, scale) {
    const { device, children } = this.props;
    const { screenX, screenY } = this.framePosition;

    const style = [
      {
        backgroundColor: "black",
        width: deviceContext.width,
        height: deviceContext.height,
        position: "absolute",
        top: 0,
        left: 0,
        transform: [
          { translate: [-deviceContext.width / 2, -deviceContext.height / 2] },
          { scale },
          { translate: [deviceContext.width / 2, deviceContext.height / 2] },
          { translate: [screenX, screenY] }
        ]
      }
    ];

    return React.createElement(AppContainer, { device, style }, children);
  }

  render() {
    const { direction = Frame.PORTRAIT, align = Frame.STRETCH } = this.props;
    const { containerLayout, imageLayout } = this.state;

    if (direction !== Frame.PORTRAIT) {
      throw new Error("Non portrait frames don't work. Fix me please :D");
    }

    let imageTransform = [];
    let scale = 1;
    let imageFrame = null;

    if (containerLayout != null && imageLayout != null) {
      const [containerWidth, containerHeight] =
        direction === Frame.PORTRAIT
          ? [containerLayout.width, containerLayout.height]
          : [containerLayout.height, containerLayout.width];
      const [imageWidth, imageHeight] =
        direction === Frame.PORTRAIT
          ? [imageLayout.width, imageLayout.height]
          : [imageLayout.height, imageLayout.width];
      const xScale = containerWidth / imageWidth;
      const yScale = containerHeight / imageHeight;

      if (align === Frame.STRETCH) {
        scale = Math.min(xScale, yScale);
      } else if (direction === Frame.PORTRAIT) {
        scale = xScale;
      } else {
        scale = yScale;
      }

      imageFrame = scaleFrame(imageLayout, scale);

      const rotate = {
        [Frame.PORTRAIT]: null,
        [Frame.LANDSCAPE]: "-90deg",
        [Frame.LANDSCAPE_REVERSE]: "90deg"
      }[direction];

      const alignments = {
        [Frame.ALIGN_START]: 0,
        [Frame.STRETCH]: 0.5,
        [Frame.ALIGN_END]: 1
      };

      const xAlignment =
        alignments[direction !== Frame.PORTRAIT ? align : Frame.STRETCH];
      const yAlignment =
        alignments[direction === Frame.PORTRAIT ? align : Frame.STRETCH];
      const translate = [
        (containerWidth - imageWidth * scale) * xAlignment,
        (containerHeight - imageHeight * scale) * yAlignment
      ];

      imageTransform =
        rotate != null ? [{ translate }, { rotate }] : [{ translate }];
    }

    return React.createElement(
      View,
      {
        style: { flex: 1, overflow: "hidden" },
        onLayout: this.handleContainerLayout
      },
      React.createElement(DeviceContext.Consumer, null, deviceContext =>
        React.createElement(
          View,
          { style: { transform: imageTransform } },
          this.renderAppFrame(deviceContext, scale),
          React.createElement(Image, {
            source: this.source,
            style: imageFrame,
            onLayout: this.handleImageLayout
          })
        )
      )
    );
  }
}

Frame.defaultProps = {
  device: null
};

Frame.PORTRAIT = 0;
Frame.LANDSCAPE = 1;
Frame.LANDSCAPE_REVERSE = 2;

Frame.STRETCH = 0;
Frame.ALIGN_START = 1;
Frame.ALIGN_END = 2;
