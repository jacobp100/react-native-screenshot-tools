import React from "react";

const {
  dpi = 1,
  width = 100,
  height = 100,
  safeArea = { top: 0, right: 0, bottom: 0, left: 0 }
} = global.snapshotterSettings || {};

export const defaults = { dpi, width, height, safeArea };

export default React.createContext(defaults);
