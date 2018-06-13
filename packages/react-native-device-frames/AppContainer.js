import React from "react";
import { View, Image } from "react-native";
import { StatusBar } from "system-components-js";
import DeviceContext, { defaults } from "system-components-js/DeviceContext";
import StatusBars from "./StatusBars";
import devices from "./devices.json";

export default ({ device, children, ...viewProps }) => (
  <View {...viewProps}>
    <StatusBar.Consumer>
      {({ barStyle = "dark-content", hidden = false }) =>
        !hidden && (
          <Image
            source={StatusBars[devices[device].statusBars.portrait]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1e9,
              tintColor: barStyle === "dark-content" ? "black" : "white"
            }}
          />
        )
      }
    </StatusBar.Consumer>
    <DeviceContext.Provider
      value={{ ...defaults, ...devices[device].deviceContext }}
    >
      {children}
    </DeviceContext.Provider>
  </View>
);
