import React from "react";
import { View, StyleSheet } from "react-native";

export const thumbSize = 28;

const base = { width: thumbSize, height: thumbSize };

const thumbElement = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 1000
};

const ThumbDropShadow = ({ backgroundColor, radius, offsetY, opacity }) => (
  <View
    style={[
      thumbElement,
      {
        backgroundColor,
        shadowRadius: radius,
        shadowOffset: { width: 0, height: offsetY },
        shadowOpacity: opacity
      }
    ]}
  />
);

const ThumbOutsideStroke = ({ width, color }) => (
  <View
    style={[
      thumbElement,
      {
        top: -width,
        right: -width,
        bottom: -width,
        left: -width,
        backgroundColor: color
      }
    ]}
  />
);

export default ({
  backgroundColor = "white",
  thumbTintColor = "white",
  style
}) => (
  <View style={[base, style]}>
    <ThumbDropShadow
      backgroundColor={backgroundColor}
      radius={8}
      offsetY={3}
      opacity={0.15}
    />
    <ThumbDropShadow
      backgroundColor={backgroundColor}
      radius={1}
      offsetY={1}
      opacity={0.16}
    />
    <ThumbDropShadow
      backgroundColor={backgroundColor}
      radius={1}
      offsetY={3}
      opacity={0.1}
    />
    <ThumbOutsideStroke
      width={StyleSheet.hairlineWidth}
      color="rgba(0, 0, 0, 0.04)"
    />
    <View style={[thumbElement, { backgroundColor: thumbTintColor }]} />
  </View>
);
