import React from "react";
import CanvasBackend from "react-native-headless-snapshotter/backend-render/CanvasBackend";
import FetchBackend from "react-native-headless-snapshotter/backend-font-loader/FetchBackend";
import BrowserBackend from "react-native-headless-snapshotter/backend-image-loader/BrowserBackend";
import createBackend from "react-native-headless-snapshotter/createBackend";
import render from "react-native-headless-snapshotter/render";
import DeviceContext, { defaults } from "system-components-js/DeviceContext";
import ScreenFrame from "react-native-device-frames/ScreenFrame";

export default ({ dpi, width, height, children, canvas }) => {
  const backend = createBackend({
    renderBackend: new CanvasBackend(canvas, { dpi }),
    imageLoader: new BrowserBackend(),
    fontLoader: new FetchBackend(),
    rasterizeText: true
  });

  const jsx = (
    <DeviceContext.Provider value={{ ...defaults, dpi, width, height }}>
      <ScreenFrame>{children}</ScreenFrame>
    </DeviceContext.Provider>
  );

  return render(backend, jsx, {});
};
