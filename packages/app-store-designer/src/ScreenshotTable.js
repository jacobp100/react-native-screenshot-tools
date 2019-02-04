import React from "react";
import { Table } from "antd";
import StoreContext from "./StoreContext";
import { getFilesTable } from "./store";

const renderCell = (file, props) =>
  file != null ? (
    <img
      src={file.uri}
      alt="Screenshot"
      style={{ display: "block", height: 100, margin: "0 auto" }}
    />
  ) : null;

export default () => {
  const { state } = React.useContext(StoreContext);
  const table = getFilesTable(state);

  const columns = table.columns.map(size => ({
    title: size,
    dataIndex: size,
    key: size,
    render: renderCell
  }));

  const dataSource = table.rows.map((cell, key) => ({ ...cell, key }));

  return <Table dataSource={dataSource} columns={columns} />;
};
