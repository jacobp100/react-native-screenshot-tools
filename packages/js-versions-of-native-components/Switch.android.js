import React from "react";
import { View, Text } from "react-native";

const margin = 3;

const base = {
  width: 34,
  height: 14,
  margin,
  backgroundColor: "rgba(0, 150, 136, 0.5)",
  borderRadius: 1000
};

const thumb = {
  width: 20,
  height: 20,
  margin: -margin,
  backgroundColor: "#009688",
  borderColor: "rgba(255, 255, 255, 0.12)",
  borderWidth: 0.5,
  borderRadius: 1000
};

export default ({ value }) => (
  <View style={[base, { justifyContent: value ? "flex-end" : "flex-start" }]}>
    <View style={thumb} />
  </View>
);
