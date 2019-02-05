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
  const { dpi } = devices[device].deviceContext; // FIXME
  const textStyle = {
    color,
    fontSize: fontSize * dpi,
    textAlign,
    [textBelowDevice ? "marginTop" : "marginBottom"]: spacing
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
    padding,
    [textBelowDevice ? "paddingTop" : "paddingBottom"]: scaleDevice ? null : 0
  };

  return <View style={style}>{body}</View>;
};
