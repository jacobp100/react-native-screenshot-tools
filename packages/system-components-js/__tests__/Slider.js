import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import SliderIOS from "../Slider.ios";
import SliderAndroid from "../Slider.android";

const View = "View";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const settings = {
  width: 200,
  height: 400,
  dpi: 1
};

// Note formatting the SVG messes up text layout slightly, as it adds whitespace
const renderSvg = async (jsx, userSettings = settings) =>
  format(await renderToSvg(jsx, userSettings));

const renderPng = async (jsx, userSettings = settings) => {
  const { dpi } = userSettings;
  const canvas = new Canvas(
    userSettings.width * dpi,
    userSettings.height * dpi
  );
  await renderToCanvas(canvas, jsx, userSettings);
  return canvas.toBuffer();
};

test("ios", async () => {
  const jsx = (
    <View style={{ flex: 1, padding: 5, justifyContent: "space-between" }}>
      <SliderIOS value={1} />
      <SliderIOS value={0.5} />
      <SliderIOS value={0} />
      <SliderIOS
        value={1}
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
      <SliderIOS
        value={0.5}
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
      <SliderIOS
        value={0}
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
    </View>
  );

  expect(
    await renderSvg(jsx, { ...settings, platform: "ios" })
  ).toMatchFileSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "ios", dpi: 1 })
  ).toMatchImageSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "ios", dpi: 2 })
  ).toMatchImageSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "ios", dpi: 3 })
  ).toMatchImageSnapshot();
});

test("android", async () => {
  const jsx = (
    <View style={{ flex: 1, padding: 5, justifyContent: "space-between" }}>
      <SliderAndroid value={1} />
      <SliderAndroid value={0.5} />
      <SliderAndroid value={0} />
      <SliderAndroid
        value={1}
        thumbTintColor="orange"
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
      <SliderAndroid
        value={0.5}
        thumbTintColor="orange"
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
      <SliderAndroid
        value={0}
        thumbTintColor="orange"
        maximumTrackTintColor="red"
        minimumTrackTintColor="lime"
      />
    </View>
  );

  expect(
    await renderSvg(jsx, { ...settings, platform: "android" })
  ).toMatchFileSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "android", dpi: 1 })
  ).toMatchImageSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "android", dpi: 2 })
  ).toMatchImageSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "android", dpi: 3 })
  ).toMatchImageSnapshot();
});
