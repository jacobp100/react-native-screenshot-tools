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

const parrot = {
  // snapshotter would output this format, RN has some weird path format
  uri: path.join(__dirname, "/parrot.png")
};

const settings = {
  width: 640,
  height: 640,
  dpi: 1
};

// Note formatting the SVG messes up text layout slightly, as it adds whitespace
const renderSvg = async jsx => format(await renderToSvg(jsx, settings));

const renderPng = async jsx => {
  const canvas = new Canvas(settings.width, settings.height);
  await renderToCanvas(canvas, jsx, settings);
  return canvas.toBuffer();
};

test("Resize mode", async () => {
  const jsx = (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {["cover", "contain", "stretch", "center"].map(resizeMode => (
        <View key={resizeMode} style={{ alignItems: "center" }}>
          <Text>{resizeMode}</Text>
          <Image
            source={parrot}
            style={{
              resizeMode,
              width: 100,
              height: 100,
              aspectRatio: undefined
            }}
          />
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Resize mode with prop", async () => {
  const jsx = (
    <Image
      source={parrot}
      resizeMode="cover"
      style={{ width: "100%", height: 100, aspectRatio: undefined }}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Border radii", async () => {
  const jsx = (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {[0, 10, 20, 50, 100].map(borderRadius => (
        <View key={borderRadius} style={{ alignItems: "center" }}>
          <Text>{borderRadius}</Text>
          <Image
            source={parrot}
            style={{
              borderRadius,
              resizeMode: "center",
              width: 100,
              height: 100,
              aspectRatio: undefined
            }}
          />
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Border widths", async () => {
  const jsx = (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {[0, 1, 2, 5, 10].map(borderWidth => (
        <View key={borderWidth} style={{ alignItems: "center" }}>
          <Text>{borderWidth}</Text>
          <Image
            source={parrot}
            style={{
              borderWidth,
              borderRadius: 20,
              borderColor: "black",
              resizeMode: "center",
              width: 100,
              height: 100,
              aspectRatio: undefined
            }}
          />
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Tint color", async () => {
  const jsx = (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {["red", "green", "blue"].map(tintColor => (
        <View key={tintColor} style={{ alignItems: "center" }}>
          <Text>{tintColor}</Text>
          <Image
            source={parrot}
            style={{
              tintColor,
              resizeMode: "contain",
              width: 100,
              height: 100,
              aspectRatio: undefined
            }}
          />
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Background color", async () => {
  const jsx = (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {["red", "green", "blue"].map(backgroundColor => (
        <View key={backgroundColor} style={{ alignItems: "center" }}>
          <Text>{backgroundColor}</Text>
          <Image
            source={parrot}
            style={{
              backgroundColor,
              resizeMode: "contain",
              width: 100,
              height: 100,
              aspectRatio: undefined
            }}
          />
        </View>
      ))}
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
