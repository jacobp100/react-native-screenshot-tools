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
  width: 500,
  height: 500,
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

test("Alignment", async () => {
  const jsx = (
    <View>
      {["left", "center", "right"].map(textAlign => (
        <Text key={textAlign} style={{ textAlign }}>
          Lorem ipsum{" "}
          <Text
            style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 18 }}
          >
            dolor
          </Text>{" "}
          <Text style={{ fontSize: 24 }}>sit</Text> amet.
        </Text>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Letter spacing", async () => {
  const jsx = (
    <View>
      {[0, 1, 2, 5, 10].map(letterSpacing => (
        <Text key={letterSpacing} style={{ fontSize: 18, letterSpacing }}>
          Letter spacing = {letterSpacing}
        </Text>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Letter spacing kerning", async () => {
  const jsx = (
    <View>
      <Text>No letter spacing</Text>
      <Text style={{ fontSize: 42 }}>AVAW</Text>
      <Text>Infinitesimal letter spacing</Text>
      <Text style={{ fontSize: 42, letterSpacing: 1e-9 }}>AVAW</Text>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Font variants", async () => {
  const jsx = (
    <View>
      <Text style={{ fontSize: 24 }}>Hello World</Text>
      <Text style={{ fontSize: 24, fontVariant: ["small-caps"] }}>
        Hello World
      </Text>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Text decoration", async () => {
  const jsx = (
    <View>
      {["none", "underline", "line-through", "underline-linethrough"].map(
        textDecoration => (
          <Text
            key={textDecoration}
            style={{ textDecoration, fontSize: 18, color: "blue" }}
          >
            Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
            <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
          </Text>
        )
      )}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Text decoration color", async () => {
  const jsx = (
    <View>
      {["none", "underline", "line-through", "underline-linethrough"].map(
        textDecoration => (
          <Text
            key={textDecoration}
            style={{
              textDecoration,
              textDecorationColor: "red",
              fontSize: 18,
              color: "blue"
            }}
          >
            Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
            <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
          </Text>
        )
      )}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Text decoration styles", async () => {
  const jsx = (
    <View>
      {["solid", "dotted", "dashed", "double"].map(textDecorationStyle => (
        <Text
          key={textDecorationStyle}
          style={{ fontSize: 18, textDecorationStyle }}
        >
          Decoration{" "}
          <Text style={{ textDecoration: "underline" }}>decoration </Text>
          <Text style={{ textDecoration: "line-through" }}>decoration </Text>
          <Text style={{ textDecoration: "underline line-through" }}>
            decoration
          </Text>
        </Text>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Inheritance", async () => {
  const jsx = (
    <View>
      <Text style={{ color: "red", fontSize: 24 }}>
        Hello{" "}
        <Text style={{ fontWeight: "bold" }}>
          World{" "}
          <Text style={{ fontStyle: "italic", color: "blue" }}>
            Foo <Text>Bar</Text>
          </Text>
        </Text>
      </Text>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
