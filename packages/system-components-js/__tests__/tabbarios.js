import * as path from "path";
import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import TabBarIOS from "../TabBarIOS.ios";

const View = "View";
const Text = "Text";

expect.extend({ toMatchImageSnapshot });
expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

const parrot = {
  // snapshotter would output this format, RN has some weird path format
  absoluteFilePath: path.join(__dirname, "/parrot.png")
};

const settings = {
  width: 320,
  height: 640,
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

test(
  "ios tab bar",
  async () => {
    console.time("TAB BAR");
    const jsx = (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          backgroundColor: "white"
        }}
      >
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
        </TabBarIOS>
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
        </TabBarIOS>
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
        </TabBarIOS>
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
        </TabBarIOS>
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
        </TabBarIOS>
        <TabBarIOS style={{ flex: 1 }}>
          <TabBarIOS.Item icon={parrot} title="Tab 1" selected />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
          <TabBarIOS.Item icon={parrot} title="Tab 1" />
        </TabBarIOS>
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
    console.timeEnd("TAB BAR");
  },
  60000
);

test("ios tab bar with content", async () => {
  const jsx = (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TabBarIOS style={{ flex: 1 }}>
        <TabBarIOS.Item icon={parrot} title="Tab 1" selected>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 1</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 2">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 2</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 3">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 3</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 4">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 4</Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>
    </View>
  );

  expect(
    await renderSvg(jsx, { ...settings, platform: "ios" })
  ).toMatchFileSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "ios" })
  ).toMatchImageSnapshot();
});

test("ios tab bar other tab selected", async () => {
  const jsx = (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TabBarIOS style={{ flex: 1 }}>
        <TabBarIOS.Item icon={parrot} title="Tab 1">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 1</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 2">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 2</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 3" selected>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 3</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item icon={parrot} title="Tab 4">
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Tab 4</Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>
    </View>
  );

  expect(
    await renderSvg(jsx, { ...settings, platform: "ios" })
  ).toMatchFileSnapshot();
  expect(
    await renderPng(jsx, { ...settings, platform: "ios" })
  ).toMatchImageSnapshot();
});
