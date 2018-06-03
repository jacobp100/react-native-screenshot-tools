import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import ScrollView from "../ScrollView";

const View = "View";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const settings = {
  width: 300,
  height: 300,
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

test("vertical", async () => {
  const jsx = (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flexGrow: 0, height: 200, borderWidth: 5 }}>
        <View style={{ height: 45, backgroundColor: "red" }} />
        <View style={{ height: 45, backgroundColor: "yellow" }} />
        <View style={{ height: 45, backgroundColor: "green" }} />
        <View style={{ height: 45, backgroundColor: "blue" }} />
        <View style={{ height: 45, backgroundColor: "magenta" }} />
      </ScrollView>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("horizontal", async () => {
  const jsx = (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ width: 200, borderWidth: 5 }} horizontal>
        <View style={{ width: 45, backgroundColor: "red" }} />
        <View style={{ width: 45, backgroundColor: "yellow" }} />
        <View style={{ width: 45, backgroundColor: "green" }} />
        <View style={{ width: 45, backgroundColor: "blue" }} />
        <View style={{ width: 45, backgroundColor: "magenta" }} />
      </ScrollView>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("endFillColor", async () => {
  const jsx = (
    <ScrollView endFillColor="green">
      <View style={{ height: 50, backgroundColor: "red" }} />
    </ScrollView>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
