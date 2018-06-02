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
const renderSvg = async jsx => format(await renderToSvg(jsx, settings));

const renderPng = async jsx => {
  const canvas = new Canvas(settings.width, settings.height);
  const ctx = canvas.getContext("2d");
  await renderToCanvas(ctx, jsx, settings);
  return canvas.toBuffer();
};

it("No border radius", async () => {
  const jsx = (
    <View style={{ backgroundColor: "red", width: 100, height: 50 }} />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

it("Small border radius", async () => {
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

it("Border radius larger than height", async () => {
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

it("Border radius larger than width", async () => {
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

it("Varying border radii", async () => {
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

it("Varying border radii dashed", async () => {
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

it("Varying border radii dotted", async () => {
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

it("Varying border widths", async () => {
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

it("Varying border colors", async () => {
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

it("Varying border colors dashed", async () => {
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

it("Varying border colors dotted", async () => {
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

it("Varying border colors and widths", async () => {
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

it("Varying border colors, radii and widths", async () => {
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
