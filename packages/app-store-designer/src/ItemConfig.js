import React from "react";
import { Input } from "antd";
import StoreContext from "./StoreContext";
import { getImageConfig, setImageConfig } from "./store";

export default ({ index = 0 }) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const config = getImageConfig(index, state);

  return (
    <Input.TextArea
      autosize
      value={config.title}
      onChange={e => dispatch(setImageConfig(index, "title", e.target.value))}
    />
  );
};
