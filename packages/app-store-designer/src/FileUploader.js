import React from "react";
import FileDrop from "react-file-drop";
import { Spin } from "antd";
import StoreContext from "./StoreContext";
import useFileLoader from "./useFileLoader";
import { addImage, setConfig } from "./store";

export default ({ children }) => {
  const { dispatch } = React.useContext(StoreContext);
  const { filesLoading, loadFiles } = useFileLoader({
    onImage: f => dispatch(addImage(f)),
    onConfig: f => dispatch(setConfig(f))
  });
  return (
    <Spin spinning={filesLoading > 0}>
      <FileDrop onDrop={loadFiles}>
        <div style={{ minHeight: "100vh" }}>{children}</div>
      </FileDrop>
    </Spin>
  );
};
