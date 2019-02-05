import React from "react";
import devices from "react-native-device-frames/devices.json";
import { Frame, ExistingScreenshots } from "react-native-device-frames";

const Text = "Text";
const View = "View";

export default ({
  device,
  title,
  colors,
  sources,
  backgroundColor,
  color,
  fontSize,
  textAlign,
  textBelowDevice,
  scaleDevice,
  padding,
  spacing
}) => {
  const scale = /iPad/.test(device) ? 2 : 1;
  const { dpi } = devices[device].deviceContext; // FIXME - text sizes
  const textStyle = {
    color,
    fontSize: fontSize * dpi * scale,
    textAlign,
    [textBelowDevice ? "marginTop" : "marginBottom"]: spacing * scale
  };

  const text = title ? <Text style={textStyle}>{title}</Text> : null;

  let align;
  if (scaleDevice) {
    align = Frame.STRETCH;
  } else if (textBelowDevice) {
    align = Frame.ALIGN_END;
  } else {
    align = Frame.ALIGN_START;
  }

  const frame = (
    <Frame device={device} colors={colors} align={align}>
      <ExistingScreenshots sources={sources} />
    </Frame>
  );

  const body = !textBelowDevice ? (
    <>
      {text}
      {frame}
    </>
  ) : (
    <>
      {frame}
      {text}
    </>
  );

  const style = {
    flex: 1,
    backgroundColor,
    padding: padding * scale,
    [textBelowDevice ? "paddingTop" : "paddingBottom"]: scaleDevice ? null : 0
  };

  return <View style={style}>{body}</View>;
};
