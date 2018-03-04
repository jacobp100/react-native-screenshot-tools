import React from "react";
import { View, StyleSheet } from "react-native";

const baseBorderWidth = 1 + StyleSheet.hairlineWidth;

const base = {
  width: 48 + 2 * baseBorderWidth,
  height: 28 + 2 * baseBorderWidth,
  borderWidth: baseBorderWidth,
  borderRadius: 1000,
  flexDirection: "row",
  alignItems: "center"
};

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

module.exports = ({
  value,
  onTintColor = "#4CD964",
  thumbTintColor = "white",
  tintColor = "#E5E5EA"
}) => {
  const trackBackground = value ? onTintColor : "#FEFEFE";
  const trackStyle = {
    justifyContent: value ? "flex-end" : "flex-start",
    backgroundColor: trackBackground,
    borderColor: value ? onTintColor : tintColor
  };

  return (
    <View style={[base, trackStyle]}>
      <View style={{ height: "100%", aspectRatio: 1 }}>
        <ThumbDropShadow
          backgroundColor={trackBackground}
          radius={8}
          offsetY={3}
          opacity={0.15}
        />
        <ThumbDropShadow
          backgroundColor={trackBackground}
          radius={1}
          offsetY={1}
          opacity={0.16}
        />
        <ThumbDropShadow
          backgroundColor={trackBackground}
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
    </View>
  );
};
