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

const layouts = {
  1: { justifyContent: "space-around" },
  2: { justifyContent: "space-around" },
  3: { justifyContent: "space-between", paddingHorizontal: 38 },
  4: { justifyContent: "space-between", paddingHorizontal: 23 },
  5: { justifyContent: "space-between", paddingHorizontal: 14 },
  DEFAULT: { justifyContent: "space-around" }
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
  <View style={style}>
    {Children.map(
      children,
      ({ props }) => (props.selected ? props.children : null)
    )}
    <View
      style={{
        height: 49,
        flexDirection: "row",
        ...(layouts[Children.count(children)] || layouts.DEFAULT)
      }}
    >
      <View style={[StyleSheet.absoluteFill, shadows[barStyle]]} />
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: barTintColor }]}
      />
      {Children.toArray(children)
        .slice(0, 5)
        .map(({ props: { title, selected, icon, selectedIcon = icon } }, i) => (
          <View key={i} style={{ width: 48 }}>
            <View
              style={{
                width: 48,
                height: 32,
                marginTop: 3,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {icon != null ? (
                <Image
                  source={selected ? selectedIcon : icon}
                  style={{
                    width: 23,
                    height: 23,
                    tintColor: selected ? tintColor : unselectedItemTintColor
                  }}
                />
              ) : null}
            </View>
            <View style={{ width: 48, marginTop: -1 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: selected ? tintColor : unselectedTintColor
                }}
              >
                {title}
              </Text>
            </View>
          </View>
        ))}
    </View>
  </View>
);

module.exports.Item = () => null;
