import React from "react";
import { View } from "react-native";

const base = {
  width: 51,
  height: 31,
  borderWidth: 1.5,
  borderRadius: 1000,
  flexDirection: "row",
  alignItems: "center"
};

const checked = {
  justifyContent: "flex-end",
  backgroundColor: "#4CD964",
  borderColor: "#4CD964"
};

const unchecked = {
  justifyContent: "flex-start",
  backgroundColor: "#FEFEFE",
  borderColor: "#E5E5EA"
};

const thumbElement = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 1000
};

module.exports = ({ value }) => {
  const trackStyle = value ? checked : unchecked;

  return (
    <View style={[base, trackStyle]}>
      <View style={{ width: 28, height: 28 }}>
        <View
          style={[
            thumbElement,
            trackStyle,
            {
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15
            }
          ]}
        />
        <View
          style={[
            thumbElement,
            trackStyle,
            {
              shadowRadius: 1,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.16
            }
          ]}
        />
        <View
          style={[
            thumbElement,
            trackStyle,
            {
              shadowRadius: 1,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1
            }
          ]}
        />
        <View
          style={[
            thumbElement,
            {
              top: -0.5,
              right: -0.5,
              bottom: -0.5,
              left: -0.5,
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          ]}
        />
        <View style={[thumbElement, { backgroundColor: "white" }]} />
      </View>
    </View>
  );
};
