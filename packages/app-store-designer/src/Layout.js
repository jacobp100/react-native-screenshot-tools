import React from "react";
import { Frame, ExistingScreenshots } from "react-native-device-frames";

const Text = "Text";
const View = "View";

export default ({
  device,
  title,
  sources,
  backgroundColor,
  fontSize,
  textAlign,
  textBelowDevice,
  scaleDevice,
  padding,
  spacing
}) => {
  const textStyle = {
    fontSize,
    textAlign,
    [textBelowDevice ? "marginTop" : "marginBottom"]: spacing
  };

  const text = <Text style={textStyle}>{title}</Text>;

  const frame = (
    <Frame device={device} align={Frame.STRETCH}>
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
