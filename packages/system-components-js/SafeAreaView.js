import React from "react";
import { View } from "react-native";
import DeviceContext from "./DeviceContext";

export default ({ style, children, ...props }) => (
  <DeviceContext.Consumer>
    {({ safeArea }) => (
      <View
        style={[
          style,
          {
            paddingTop: safeArea.top,
            paddingRight: safeArea.right,
            paddingBottom: safeArea.bottom,
            paddingLeft: safeArea.left
          }
        ]}
        {...props}
      >
        {children}
      </View>
    )}
  </DeviceContext.Consumer>
);
