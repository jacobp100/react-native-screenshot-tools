import React from "react";
import { View } from "react-native";
import Thumb, { thumbSize } from "./util/ThumbIOS";

const inset = thumbSize / 2;

const track = {
  position: "absolute",
  top: "50%",
  marginTop: -1,
  height: 2,
  borderRadius: 1000
};

const Track = ({ backgroundColor, position }) => (
  <View style={[track, position, { backgroundColor }]} />
);

export default ({
  style,
  disabled,
  maximumValue = 1,
  minimumTrackTintColor = "#007AFF",
  minimumValue = 0,
  maximumTrackTintColor = "#C7C7CC",
  value = 0,
  // thumbTintColor, - not supported on iOS apparently
  maximumTrackImage,
  minimumTrackImage,
  thumbImage,
  trackImage
}) => {
  let positionValue = (value - minimumValue) / (maximumValue - minimumValue);
  positionValue = Math.max(Math.min(positionValue, 1), 0);
  const position = `${positionValue * 100}%`;

  return (
    <View style={style}>
      <Track
        backgroundColor={minimumTrackTintColor}
        position={{ left: 0, width: position }}
      />
      <Track
        backgroundColor={maximumTrackTintColor}
        position={{ left: position, right: 0 }}
      />
      <View style={{ paddingHorizontal: inset }}>
        <Thumb style={{ marginHorizontal: -inset, left: position }} />
      </View>
    </View>
  );
};
