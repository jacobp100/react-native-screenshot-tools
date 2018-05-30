import React from "react";
import { View, Text } from "react-native";

const margin = 3;

const base = {
  flexDirection: "row",
  alignItems: "center",
  width: 34,
  height: 14,
  margin,
  backgroundColor: "rgba(0, 150, 136, 0.5)",
  borderRadius: 1000
};

const thumbBase = {
  margin: -margin
};

const thumb = {
  width: 20,
  height: 20,
  // FIXME: Linear gradient border
  borderRadius: 1000
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
    forceDrawShadow
  />
);

const Thumb = ({ backgroundColor }) => (
  <View style={thumbBase}>
    <ThumbDropShadow
      backgroundColor={backgroundColor}
      radius={1}
      offsetY={0}
      opacity={0.12}
    />
    <ThumbDropShadow
      backgroundColor={backgroundColor}
      radius={1}
      offsetY={1}
      opacity={0.2376}
    />
    <View style={[thumb, { backgroundColor }]} />
  </View>
);

export default ({
  disabled,
  // unused: onTintColor,
  thumbTintColor = "#009688",
  tintColor = "#F1F1F1",
  value
}) => (
  <View
    style={[
      base,
      {
        backgroundColor: value
          ? "rgba(0, 150, 136, 0.5)"
          : "rgba(34, 31, 31, 0.26)",
        justifyContent: value ? "flex-end" : "flex-start"
      }
    ]}
  >
    <Thumb backgroundColor={value ? thumbTintColor : tintColor} />
  </View>
);
