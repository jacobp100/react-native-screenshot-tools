import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import ButtonIOS from "../Button.ios";
import ButtonAndroid from "../Button.android";

const View = "View";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const settings = {
  width: 300,
  height: 500,
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

test("styles", async () => {
  const jsx = (
    <View>
      <ButtonIOS title="Hello" />
      <ButtonAndroid title="Hello" />
      <ButtonIOS title="Hello" color="red" />
      <ButtonAndroid title="Hello" color="red" />
      <ButtonIOS title="Hello" disabled />
      <ButtonAndroid title="Hello" disabled />
      <ButtonIOS title="Hello" color="red" disabled />
      <ButtonAndroid title="Hello" color="red" disabled />
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
