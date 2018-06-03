import * as path from "path";
import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "..";

const View = "View";
const Text = "Text";
const Image = "Image";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const settings = {
  width: 100,
  height: 100,
  dpi: 1
};

// Note formatting the SVG messes up text layout slightly, as it adds whitespace
const renderSvg = async (jsx, userSettings = settings) =>
  format(await renderToSvg(jsx, userSettings));

const renderPng = async (jsx, userSettings = settings) => {
  const canvas = new Canvas(userSettings.width, userSettings.height);
  await renderToCanvas(canvas, jsx, userSettings);
  return canvas.toBuffer();
};

test("No border radius", async () => {
  const jsx = (
    <View style={{ backgroundColor: "red", width: 100, height: 50 }} />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Small border radius", async () => {
  const jsx = (
    <View
      style={{
        backgroundColor: "red",
        width: 100,
        height: 50,
        borderRadius: 10
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Border radius larger than height", async () => {
  const jsx = (
    <View
      style={{
        backgroundColor: "red",
        width: 100,
        height: 50,
        borderRadius: 1000
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Border radius larger than width", async () => {
  const jsx = (
    <View
      style={{
        backgroundColor: "red",
        width: 50,
        height: 100,
        borderRadius: 1000
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border radii", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        backgroundColor: "red"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border radii dashed", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        borderStyle: "dashed",
        backgroundColor: "red"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border radii dotted", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderWidth: 10,
        borderColor: "blue",
        borderStyle: "dotted",
        backgroundColor: "red"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border widths", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderTopWidth: 5,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftWidth: 20,
        borderColor: "blue",
        backgroundColor: "red"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border colors", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderWidth: 10,
        borderTopColor: "red",
        borderRightColor: "yellow",
        borderBottomColor: "green",
        borderLeftColor: "blue",
        backgroundColor: "black"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border colors dashed", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderWidth: 10,
        borderStyle: "dashed",
        borderTopColor: "red",
        borderRightColor: "yellow",
        borderBottomColor: "green",
        borderLeftColor: "blue",
        backgroundColor: "black"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border colors dotted", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderWidth: 10,
        borderStyle: "dotted",
        borderTopColor: "red",
        borderRightColor: "yellow",
        borderBottomColor: "green",
        borderLeftColor: "blue",
        backgroundColor: "black"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border colors and widths", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 30,
        borderTopWidth: 5,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftWidth: 20,
        borderTopColor: "red",
        borderRightColor: "yellow",
        borderBottomColor: "green",
        borderLeftColor: "blue",
        backgroundColor: "black"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Varying border colors, radii and widths", async () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 100,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 50,
        borderTopWidth: 5,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderLeftWidth: 20,
        borderTopColor: "red",
        borderRightColor: "yellow",
        borderBottomColor: "green",
        borderLeftColor: "blue",
        backgroundColor: "black"
      }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("iOS borders", async () => {
  // If it looks like this test has bugs, it's because iOS's border drawing also has bugs

  const Row = ({ children }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {children}
    </View>
  );

  const Cell = ({ title, children }) => (
    <View style={{ alignItems: "center" }}>
      <Text>{title}</Text>
      {children}
    </View>
  );

  const IOSDemo = ({ width, height, borderRadius }) => (
    <View style={{ width, height, backgroundColor: "red", borderRadius }} />
  );

  const RegularDemo = ({ width, height, borderRadius }) => (
    <View
      style={{
        width,
        height,
        backgroundColor: "red",
        borderRadius,
        borderTopLeftRadius: borderRadius + 1e-3
      }}
    />
  );

  const Demo = ({ width, height, borderRadius }) => (
    <Row>
      <Cell title="ios">
        <IOSDemo width={width} height={height} borderRadius={borderRadius} />
      </Cell>
      <Cell title="regular">
        <RegularDemo
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      </Cell>
    </Row>
  );

  const jsx = (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <Demo width={100} height={100} borderRadius={0} />
        <Demo width={100} height={100} borderRadius={5} />
        <Demo width={100} height={100} borderRadius={10} />
        <Demo width={100} height={100} borderRadius={20} />
        <Demo width={100} height={100} borderRadius={30} />
        <Demo width={100} height={100} borderRadius={40} />
        <Demo width={100} height={100} borderRadius={50} />
      </View>
      <View style={{ flex: 1 }}>
        <Demo width={50} height={100} borderRadius={0} />
        <Demo width={50} height={100} borderRadius={3} />
        <Demo width={50} height={100} borderRadius={5} />
        <Demo width={50} height={100} borderRadius={10} />
        <Demo width={50} height={100} borderRadius={15} />
        <Demo width={50} height={100} borderRadius={20} />
        <Demo width={50} height={100} borderRadius={25} />
      </View>
      <View style={{ flex: 1 }}>
        <Demo width={100} height={50} borderRadius={0} />
        <Demo width={100} height={50} borderRadius={3} />
        <Demo width={100} height={50} borderRadius={5} />
        <Demo width={100} height={50} borderRadius={10} />
        <Demo width={100} height={50} borderRadius={15} />
        <Demo width={100} height={50} borderRadius={20} />
        <Demo width={100} height={50} borderRadius={25} />
      </View>
    </View>
  );

  const iosSettings = {
    ...settings,
    width: 1000,
    height: 1000,
    platform: "ios"
  };
  expect(await renderSvg(jsx, iosSettings)).toMatchFileSnapshot();
  expect(await renderPng(jsx, iosSettings)).toMatchImageSnapshot();
});
