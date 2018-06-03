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
  await renderToCanvas(canvas, jsx, settings);
  return canvas.toBuffer();
};

test("Transforms", async () => {
  const jsx = (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        width: 500,
        height: 500
      }}
    >
      {Array.from({ length: 16 }, (_, i) => (
        <View
          key={i}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            margin: 10,
            backgroundColor: "red",
            borderTopWidth: 5,
            borderRightWidth: 10,
            borderBottomWidth: 15,
            borderLeftWidth: 20,
            borderTopColor: "yellow",
            borderRightColor: "green",
            borderBottomColor: "blue",
            borderLeftColor: "magenta",
            borderRadius: 33,
            transform: [{ rotate: `${Math.floor((360 * i) / 16)}deg` }]
          }}
        >
          <Text style={{ textAlign: "center" }}>Hello World</Text>
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Opacity", async () => {
  const jsx = (
    <View
      style={{
        backgroundColor: "red",
        opacity: 0.66,
        width: 100,
        height: 200
      }}
    >
      <View
        style={{
          backgroundColor: "yellow",
          top: 10,
          left: 10,
          width: 100,
          height: 100
        }}
      />
      <View
        style={{
          backgroundColor: "green",
          opacity: 0.66,
          top: 10,
          left: 10,
          width: 100,
          height: 100
        }}
      >
        <View
          style={{
            backgroundColor: "blue",
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        />
        <View
          style={{
            backgroundColor: "purple",
            opacity: 0.66,
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        />
      </View>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Overflow hidden", async () => {
  const jsx = (
    <View
      style={{
        backgroundColor: "red",
        width: 100,
        height: 100,
        borderRadius: 25,
        overflow: "hidden"
      }}
    >
      <View
        style={{
          top: 50,
          left: 50,
          backgroundColor: "green",
          width: 100,
          height: 100,
          borderRadius: 25
        }}
      />
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
