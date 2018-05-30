import React, { Children } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// FIXME: Use itemPositioning, we need iOS size classes
// FIXME: We need to support icons
// FIXME: Badges for tabs

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
    <View
      style={{
        top: -StyleSheet.hairlineWidth,
        height: 49,
        backgroundColor:
          barStyle === "black"
            ? "rgba(255, 255, 255, 0.16)"
            : "rgba(0, 0, 0, 0.3)"
      }}
    />
    <View
      style={{
        height: 49,
        backgroundColor: barTintColor,
        flexDirection: "row",
        justifyContent: "space-around"
      }}
    >
      {Children.toArray(children)
        .slice(0, 5)
        .map(({ props: { title, selected, icon, selectedIcon = icon } }) => (
          <View style={{ width: 48 }}>
            <View style={{ width: 48, height: 32, marginTop: 3 }}>
              {icon != null ? (
                <Image src={selected ? selectedIcon : icon} />
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
