import React from "react";
import { View } from "react-native";

const thumbSize = 12;

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

const thumb = {
  width: thumbSize,
  height: thumbSize,
  borderRadius: 1000
};

const Thumb = ({ thumbTintColor = "#009688", style }) => (
  <View style={[thumb, { backgroundColor: thumbTintColor }, style]} />
);

export default ({
  style,
  disabled,
  maximumValue = 1,
  minimumTrackTintColor = "#009688",
  minimumValue = 0,
  maximumTrackTintColor = "rgba(0, 0, 0, 0.26)",
  value = 0,
  thumbTintColor,
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
        <Thumb
          style={{ marginHorizontal: -inset, left: position }}
          thumbTintColor={thumbTintColor}
        />
      </View>
    </View>
  );
};
