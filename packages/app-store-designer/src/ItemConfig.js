import React from "react";
import { Form, Input, Slider } from "antd";
import StoreContext from "./StoreContext";
import { getImageConfig, setImageConfig } from "./store";

export default ({ index = 0 }) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const config = getImageConfig(index, state);

  const setValue = React.useCallback(
    e => dispatch(setImageConfig(index, e.target.name, e.target.value)),
    [index]
  );

  return (
    <Form>
      <Form.Item label="Title">
        <Input.TextArea
          autosize
          name="title"
          value={config.title}
          onChange={setValue}
        />
      </Form.Item>
      <Form.Item label="Background Color">
        <Input
          name="backgroundColor"
          value={config.backgroundColor}
          onChange={setValue}
        />
      </Form.Item>
      <Form.Item label="Font Size">
        <Slider
          value={config.fontSize}
          min={6}
          max={128}
          onChange={v => dispatch(setImageConfig(index, "fontSize", v))}
        />
      </Form.Item>
    </Form>
  );
};
