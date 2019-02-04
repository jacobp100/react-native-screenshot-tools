import React from "react";
import { Pagination, Select, Empty } from "antd";
import devices from "react-native-device-frames/devices.json";
import StoreContext from "./StoreContext";
import Layout from "./Layout";
import ItemConfig from "./ItemConfig";
import { getImageConfig, getFilesTable } from "./store";
import render from "./render";

export default () => {
  const ref = React.useRef(null);
  const { state } = React.useContext(StoreContext);
  const table = getFilesTable(state);
  const defaultDevice = table.columns[/* 0 */ table.columns.length - 1];
  const [device, setDevice] = React.useState(defaultDevice);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (config == null) return null;

    const timeout = setTimeout(() => {
      render({
        dpi,
        width,
        height,
        children: <Layout device={device} {...config} />,
        canvas: ref.current
      });
    }, 500);
    return () => clearTimeout(timeout);
  });

  if (table.columns.length === 0) {
    return <Empty description="No screenshots uploaded" />;
  } else if (!devices[device]) {
    setDevice(defaultDevice);
    return null;
  }

  const config = getImageConfig(index, state);
  const { dpi, width, height } = devices[device].deviceContext;

  const form = (
    <>
      <Select value={device} onChange={setDevice}>
        {table.columns.map(device => (
          <Select.Option key={device} value={device}>
            {device}
          </Select.Option>
        ))}
      </Select>
      <Pagination
        current={index}
        total={table.rows.length}
        onChange={setIndex}
      />
      <ItemConfig index={index} />
    </>
  );

  return (
    <div>
      {form}
      <canvas
        width={width * dpi}
        height={height * dpi}
        style={{ width, height }}
        ref={ref}
      />
    </div>
  );
};
