import React from "react";
import { Frame } from "react-native-device-frames";

const Image = "Image";
const Text = "Text";
const View = "View";

export default ({
  title = "",
  source = null,
  backgroundColor = "white",
  fontSize = 96,
  textAlign = "center",
  textBelowDevice,
  scaleDevice = true,
  padding = "5%",
  spacing = 16
}) => {
  const textStyle = {
    fontSize,
    textAlign,
    [textBelowDevice ? "marginTop" : "marginBottom"]: spacing
  };

  const text = <Text style={textStyle}>{title}</Text>;

  const frame = (
    <Frame device="Apple iPhone SE" align={Frame.STRETCH}>
      {source != null ? (
        <Image style={{ width: "100%", height: "100%" }} source={source} />
      ) : (
        <View />
      )}
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
