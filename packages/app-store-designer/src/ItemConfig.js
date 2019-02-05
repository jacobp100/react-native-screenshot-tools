import React from "react";
import { Form, Input, Checkbox, Select, Slider } from "antd";
import StoreContext from "./StoreContext";
import { getImageConfig, setImageConfig } from "./store";

export default ({ index = 0 }) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const config = getImageConfig(index, state);

  const setValue = React.useCallback(
    e => dispatch(setImageConfig(index, e.target.name, e.target.value)),
    [index]
  );
  const setChecked = React.useCallback(
    e => dispatch(setImageConfig(index, e.target.name, e.target.checked)),
    [index]
  );
  const setSlider = name => value =>
    dispatch(setImageConfig(index, name, value));

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
      <Form.Item label="Text Color">
        <Input name="color" value={config.color} onChange={setValue} />
      </Form.Item>
      <Form.Item label="Device Color">
        <Select
          name="colors"
          value={config.colors.join(",")}
          onChange={value =>
            dispatch(setImageConfig(index, "colors", value.split(",")))
          }
        >
          <Select.Option value="Silver">Silver</Select.Option>
          <Select.Option value="Space Gray">Space Gray</Select.Option>
          <Select.Option value="Gold,Silver">Gold</Select.Option>
          <Select.Option value="Rose Gold,Silver">Rose Gold</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Font Size">
        <Slider
          value={config.fontSize}
          min={6}
          max={128}
          onChange={setSlider("fontSize")}
        />
      </Form.Item>
      <Form.Item label="Padding">
        <Slider
          value={config.padding}
          min={0}
          max={100}
          onChange={setSlider("padding")}
        />
      </Form.Item>
      <Form.Item label="Spacing">
        <Slider
          value={config.spacing}
          min={0}
          max={100}
          onChange={setSlider("spacing")}
        />
      </Form.Item>
      <Checkbox
        name="textBelowDevice"
        checked={config.textBelowDevice}
        onChange={setChecked}
      >
        Text below device
      </Checkbox>
      <Checkbox
        name="scaleDevice"
        checked={config.scaleDevice}
        onChange={setChecked}
      >
        Scale device
      </Checkbox>
    </Form>
  );
};
