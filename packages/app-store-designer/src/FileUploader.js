import React from "react";
import FileDrop from "react-file-drop";
import { Spin } from "antd";
import StoreContext from "./StoreContext";
import useFileLoader from "./useFileLoader";
import { addFile } from "./store";

export default ({ children }) => {
  const { dispatch } = React.useContext(StoreContext);
  const { filesLoading, loadFiles } = useFileLoader({
    onFileLoaded: f => dispatch(addFile(f))
  });
  return (
    <Spin spinning={filesLoading > 0}>
      <FileDrop onDrop={loadFiles}>
        <div style={{ minHeight: "100vh" }}>{children}</div>
      </FileDrop>
    </Spin>
  );
};
