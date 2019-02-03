import React from "react";
import { View, Image } from "react-native-snapshotter-mocks";
import DeviceContext, { defaults } from "system-components-js/DeviceContext";
// import StatusBar from "system-components-js/StatusBar";
import StatusBars from "./StatusBars";
import devices from "./devices.json";

export default ({ device, children, ...viewProps }) =>
  React.createElement(
    View,
    viewProps,
    // React.createElement(
    //   StatusBar.Consumer,
    //   null,
    //   ({ barStyle = "dark-content", hidden = false }) =>
    //     !hidden &&
    //     React.createElement(Image, {
    //       source: StatusBars[devices[device].statusBars.portrait],
    //       style: {
    //         position: "absolute",
    //         top: 0,
    //         left: 0,
    //         zIndex: 1e9,
    //         tintColor: barStyle === "dark-content" ? "black" : "white"
    //       }
    //     })
    // ),
    React.createElement(
      DeviceContext.Provider,
      { value: { ...defaults, ...devices[device].deviceContext } },
      children
    )
  );
