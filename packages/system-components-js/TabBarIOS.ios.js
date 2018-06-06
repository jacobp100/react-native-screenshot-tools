import React, { Children } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// FIXME: Use itemPositioning, we need iOS size classes
// FIXME: We need to support icons
// FIXME: Badges for tabs

const shadows = {
  default: {
    backgroundColor: "black",
    opacity: 0.3,
    transform: [{ translateY: -StyleSheet.hairlineWidth }]
  },
  black: {
    backgroundColor: "white",
    opacity: 0.16,
    transform: [{ translateY: -StyleSheet.hairlineWidth }]
  }
};

module.exports = ({
  translucent = true,
  barStyle = "default",
  barTintColor = barStyle === "black"
    ? `rgba(33, 33, 33, ${translucent ? 0.72 : 1})`
    : `rgba(248, 248, 248, ${translucent ? 0.82 : 1})`,
  tintColor = barStyle === "black" ? "#FF9500" : "#007AFF",
  unselectedItemTintColor = "#8E8E93",
  unselectedTintColor = "#8E8E93",
  itemPositioning = "auto",
  style,
  children
}) => (
  <View style={[{ flex: 1 }, style]}>
    {Children.map(
      children,
      ({ props }) => (props.selected ? props.children : null)
    )}
    <View
      style={{
        height: 49,
        marginTop: -49,
        flexDirection: "row"
      }}
    >
      <View style={[StyleSheet.absoluteFill, shadows[barStyle]]} />
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: barTintColor }]}
      />
      {Children.toArray(children)
        .slice(0, 5)
        .map(({ props: { title, selected, icon, selectedIcon = icon } }, i) => (
          <View
            key={i}
            style={{ flex: 1, alignItems: "center", paddingTop: 4 }}
          >
            <Image
              source={selected ? selectedIcon : icon}
              style={{
                marginBottom: 2,
                width: 30,
                height: 30,
                tintColor: selected ? tintColor : unselectedItemTintColor
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: selected ? tintColor : unselectedTintColor
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        ))}
    </View>
  </View>
);

module.exports.Item = () => null;
