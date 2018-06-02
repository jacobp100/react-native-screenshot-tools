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
  absoluteFilePath: path.join(__dirname, "/parrot.png")
};

const settings = {
  width: 640,
  height: 1000,
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

test("Render test 1", async () => {
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

test("Render test 2", async () => {
  const jsx = (
    <View
      style={{
        flex: 1,
        backgroundColor: "#eee",
        justifyContent: "space-between"
      }}
    >
      <View
        style={{
          backgroundColor: "red",
          height: 50,
          transform: [{ scale: 0.5 }, { rotate: "-10deg" }]
        }}
      />
      <View
        style={{
          backgroundColor: "red",
          opacity: 0.66,
          width: 100,
          height: 100
        }}
      >
        <View
          style={{
            backgroundColor: "yellow",
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        />
        <View
          style={{
            backgroundColor: "green",
            opacity: 0.66,
            top: 10,
            left: 10,
            width: 100,
            height: 50
          }}
        >
          <View
            style={{
              backgroundColor: "blue",
              top: 10,
              left: 10,
              width: 100,
              height: 25
            }}
          />
          <View
            style={{
              backgroundColor: "purple",
              opacity: 0.66,
              top: 10,
              left: 10,
              width: 100,
              height: 25
            }}
          />
        </View>
      </View>
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
      <Image
        source={parrot}
        style={{ width: "100%", height: 100, aspectRatio: undefined }}
      />
      <Image
        source={parrot}
        resizeMode="cover"
        style={{ width: "100%", height: 100, aspectRatio: undefined }}
      />
      <View style={{ height: 1, backgroundColor: "black" }} />
      <View>
        <Text>Hello world</Text>
      </View>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Text", async () => {
  const Row = ({ children }) => (
    <View style={{ width: 450, borderWidth: 1, marginBottom: 12 }}>
      {children}
    </View>
  );

  const jsx = (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#eee" }}>
      <Text>Text alignment</Text>
      <Row>
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
      </Row>
      <Text>Letter spacing</Text>
      <Row>
        {[0, 1, 2, 5, 10].map(letterSpacing => (
          <Text key={letterSpacing} style={{ letterSpacing }}>
            Letter spacing
          </Text>
        ))}
      </Row>
      <Text>Kerning with letter spacing</Text>
      <Row>
        <Text>No letter spacing</Text>
        <Text style={{ fontSize: 42 }}>AVAW</Text>
        <Text>Infinitesimal letter spacing</Text>
        <Text style={{ fontSize: 42, letterSpacing: 1e-9 }}>AVAW</Text>
      </Row>
      <Text>Font variants</Text>
      <Row>
        <Text style={{ fontSize: 24 }}>Hello World</Text>
        <Text style={{ fontSize: 24, fontVariant: ["small-caps"] }}>
          Hello World
        </Text>
      </Row>
      <Text>Line decoration</Text>
      <Row>
        <Text
          style={{ textDecoration: "underline", fontSize: 18, color: "blue" }}
        >
          Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
          <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
        </Text>
        <Text
          style={{
            textDecoration: "underline",
            textDecorationColor: "red",
            fontSize: 18,
            color: "blue"
          }}
        >
          Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
          <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
        </Text>
        <Text
          style={{
            textDecoration: "line-through",
            textDecorationColor: "red",
            fontSize: 18,
            color: "blue"
          }}
        >
          Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
          <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
        </Text>
        <Text
          style={{
            textDecoration: "underline line-through",
            textDecorationColor: "red",
            fontSize: 18,
            color: "blue"
          }}
        >
          Underlined <Text style={{ fontStyle: "italic" }}>text</Text> with{" "}
          <Text style={{ fontSize: 24, color: "green" }}>mixed</Text> styles
        </Text>
        <Text style={{ fontSize: 18, textDecorationStyle: "dotted" }}>
          <Text style={{ textDecoration: "underline" }}>Dotted </Text>
          <Text style={{ textDecoration: "line-through" }}>dotted </Text>
          <Text style={{ textDecoration: "underline line-through" }}>
            dotted
          </Text>
        </Text>
        <Text style={{ fontSize: 18, textDecorationStyle: "dashed" }}>
          <Text style={{ textDecoration: "underline" }}>Dashed </Text>
          <Text style={{ textDecoration: "line-through" }}>dashed </Text>
          <Text style={{ textDecoration: "underline line-through" }}>
            dashed
          </Text>
        </Text>
        <Text style={{ fontSize: 18, textDecorationStyle: "double" }}>
          <Text style={{ textDecoration: "underline" }}>Double </Text>
          <Text style={{ textDecoration: "line-through" }}>double </Text>
          <Text style={{ textDecoration: "underline line-through" }}>
            double
          </Text>
        </Text>
      </Row>
      <Text>Inheritance</Text>
      <Row>
        <Text style={{ color: "red", fontSize: 24 }}>
          Hello{" "}
          <Text style={{ fontWeight: "bold" }}>
            World{" "}
            <Text style={{ fontStyle: "italic", color: "blue" }}>
              Foo <Text>Bar</Text>
            </Text>
          </Text>
        </Text>
      </Row>
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("Images", async () => {
  const jsx = (
    <View style={{ flex: 1, backgroundColor: "#eee" }}>
      <Text>Resize mode</Text>
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
      <Text>Resize mode using prop</Text>
      <Image
        source={parrot}
        resizeMode="cover"
        style={{ width: "100%", height: 100, aspectRatio: undefined }}
      />
      <Text>Border radii</Text>
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
      <Text>Border widths</Text>
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
      <Text>Tint color</Text>
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
      <Text>Background color</Text>
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
    </View>
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
