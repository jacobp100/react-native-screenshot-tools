import * as path from "path";
import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import SwitchIOS from "../Switch.ios";
import SwitchAndroid from "../Switch.android";

const View = "View";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const settings = {
  width: 100,
  height: 200,
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

test("ios switches", async () => {
  const jsx = (
    <View style={{ flex: 1, padding: 5, justifyContent: "space-between" }}>
      <SwitchIOS value={true} />
      <SwitchIOS value={false} />
      <SwitchIOS
        value={true}
        thumbTintColor="red"
        tintColor="blue"
        onTintColor="lime"
      />
      <SwitchIOS
        value={false}
        thumbTintColor="red"
        tintColor="blue"
        onTintColor="lime"
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

test("android switches", async () => {
  const jsx = (
    <View style={{ flex: 1, padding: 5, justifyContent: "space-between" }}>
      <SwitchAndroid value={true} />
      <SwitchAndroid value={false} />
      <SwitchAndroid value={true} thumbTintColor="red" tintColor="blue" />
      <SwitchAndroid value={false} thumbTintColor="red" tintColor="blue" />
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
