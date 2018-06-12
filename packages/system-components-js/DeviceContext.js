import React from "react";

export const defaults = {
  safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
};

export default React.createContext(defaults);
