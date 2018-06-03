import React from "react";
import { View, StyleSheet } from "react-native";
import Thumb from "./util/ThumbIOS";

// Only tested for 2x and 3x. We don't have a 1x device.
const baseBorderWidth = 2 - StyleSheet.hairlineWidth;

const base = {
  flexDirection: "row",
  alignItems: "center",
  width: 48 + 2 * baseBorderWidth,
  height: 28 + 2 * baseBorderWidth,
  borderWidth: baseBorderWidth,
  borderRadius: 1000
};

export default ({
  disabled,
  onTintColor = "#4CD964",
  thumbTintColor = "white",
  tintColor = "#E5E5EA",
  value
}) => {
  const trackBackground = value ? onTintColor : "#FEFEFE";
  const trackStyle = {
    justifyContent: value ? "flex-end" : "flex-start",
    backgroundColor: trackBackground,
    borderColor: value ? onTintColor : tintColor
  };

  return (
    <View style={[base, trackStyle]}>
      <Thumb
        backgroundColor={trackBackground}
        thumbTintColor={thumbTintColor}
      />
    </View>
  );
};
