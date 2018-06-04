import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import SectionList from "../SectionList";

const View = "View";
const Text = "Text";

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
    <SectionList
      sections={[
        {
          data: [{ key: "1", title: "Hello" }, { key: "2", title: "World" }]
        },
        {
          data: [
            { key: "3", title: "Foo" },
            { key: "4", title: "Bar" },
            { key: "5", title: "Buzz" }
          ]
        }
      ]}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderBottomWidth: 1
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("separator", async () => {
  const jsx = (
    <SectionList
      sections={[
        {
          data: [{ key: "1", title: "Hello" }, { key: "2", title: "World" }]
        },
        {
          data: [
            { key: "3", title: "Foo" },
            { key: "4", title: "Bar" },
            { key: "5", title: "Buzz" }
          ]
        }
      ]}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "white"
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: "#eee" }} />
      )}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("header and footer", async () => {
  const jsx = (
    <SectionList
      sections={[
        {
          data: [{ key: "1", title: "Hello" }, { key: "2", title: "World" }]
        },
        {
          data: [
            { key: "3", title: "Foo" },
            { key: "4", title: "Bar" },
            { key: "5", title: "Buzz" }
          ]
        }
      ]}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "white"
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      ListHeaderComponent={
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#ddd"
          }}
        >
          <Text>List Header</Text>
        </View>
      }
      ListFooterComponent={
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#ddd"
          }}
        >
          <Text>List Footer</Text>
        </View>
      }
      renderSectionHeader={() => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#eee"
          }}
        >
          <Text>Section Header</Text>
        </View>
      )}
      renderSectionFooter={() => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#eee"
          }}
        >
          <Text>Section Footer</Text>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: "#eee" }} />
      )}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("header, footer, and separator as component", async () => {
  class Separator extends React.Component {
    render() {
      return <View style={{ height: 1, backgroundColor: "#eee" }} />;
    }
  }

  class Header extends React.Component {
    render() {
      return (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#ddd"
          }}
        >
          <Text>Header</Text>
        </View>
      );
    }
  }

  class Footer extends React.Component {
    render() {
      return (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#ddd"
          }}
        >
          <Text>Footer</Text>
        </View>
      );
    }
  }

  const jsx = (
    <SectionList
      sections={[
        {
          data: [{ key: "1", title: "Hello" }, { key: "2", title: "World" }]
        },
        {
          data: [
            { key: "3", title: "Foo" },
            { key: "4", title: "Bar" },
            { key: "5", title: "Buzz" }
          ]
        }
      ]}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "white"
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
      ItemSeparatorComponent={Separator}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("inverted", async () => {
  const jsx = (
    <SectionList
      sections={[
        { data: [{ key: "1", title: "Hello" }, { key: "2", title: "World" }] }
      ]}
      renderItem={({ item }) => (
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "white"
          }}
        >
          <Text>{item.title}</Text>
        </View>
      )}
      inverted
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("empty state", async () => {
  const jsx = (
    <SectionList
      sections={[]}
      ListEmptyComponent={
        <View style={{ padding: 12, alignItems: "center" }}>
          <Text>Empty</Text>
        </View>
      }
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});
