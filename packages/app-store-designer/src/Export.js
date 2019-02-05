import React from "react";
import { Table, Spin, Button, Empty } from "antd";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import devices from "react-native-device-frames/devices.json";
import StoreContext from "./StoreContext";
import Layout from "./Layout";
import {
  deviceNames,
  getIndices,
  getExportedDevices,
  getImageConfig,
  getJson,
  setExports,
  addError
} from "./store";
import render from "./render";

const renderIntoCanvas = async (config, device) => {
  const { width, height } = devices[device].deviceContext;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  await render({
    dpi: 1,
    width,
    height,
    children: <Layout device={device} {...config} />,
    canvas
  });

  return new Promise(res => canvas.toBlob(res, "image/png", 1));
};

const renderDevices = async state => {
  const zip = new JSZip();

  const indices = getIndices(state);
  const exportedDevices = getExportedDevices(state);

  await Promise.all(
    indices.map(async index => {
      const config = getImageConfig(index, state);

      await Promise.all(
        exportedDevices.map(async device => {
          const name = `${device} - ${index}.png`;
          const blob = await renderIntoCanvas(config, device);
          zip.file(name, blob);
        })
      );
    })
  );

  const json = getJson(state);
  zip.file("config.json", JSON.stringify(json));

  const blob = await zip.generateAsync({ type: "blob" });
  await saveAs(blob, "screenshots.zip");
};

export default () => {
  const [numRenders, setNumRenders] = React.useState(0);
  const { state, dispatch } = React.useContext(StoreContext);

  if (getIndices(state).length === 0) {
    return <Empty description="No screenshots uploaded" />;
  }

  const render = async () => {
    setNumRenders(s => s + 1);
    try {
      await renderDevices(state);
    } catch {
      dispatch(addError("Failed to export screenshots"));
    } finally {
      setNumRenders(s => s - 1);
    }
  };

  const columns = [{ title: "Device", dataIndex: "title" }];
  const dataSource = deviceNames.map(device => ({
    title: device,
    key: device
  }));
  const exportedDevices = getExportedDevices(state);
  const rowSelection = {
    selectedRowKeys: exportedDevices,
    onChange: rowKeys => dispatch(setExports(rowKeys))
  };

  return (
    <Spin spinning={numRenders > 0}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      />
      <div style={{ textAlign: "center" }}>
        <Button type="primary" size="large" onClick={render}>
          Export Screenshots
        </Button>
      </div>
    </Spin>
  );
};
