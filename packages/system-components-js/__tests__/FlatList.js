import React from "react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { configureToMatchFileSnapshot } from "jest-file-snapshot";
import Canvas from "canvas-prebuilt";
import format from "xml-formatter";
import { renderToSvg, renderToCanvas } from "react-native-headless-snapshotter";
import FlatList from "../FlatList";

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
    <FlatList
      data={[
        { key: "1", title: "Hello" },
        { key: "2", title: "World" },
        { key: "3", title: "Foo" },
        { key: "4", title: "Bar" },
        { key: "5", title: "Buzz" }
      ]}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
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
    <FlatList
      data={[
        { key: "1", title: "Hello" },
        { key: "2", title: "World" },
        { key: "3", title: "Foo" },
        { key: "4", title: "Bar" },
        { key: "5", title: "Buzz" }
      ]}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
          <Text>{item.title}</Text>
        </View>
      )}
      ItemSeparatorComponent={
        <View style={{ height: 1, backgroundColor: "black" }} />
      }
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("multi-column", async () => {
  const jsx = (
    <FlatList
      data={[
        { key: "1", title: "Hello" },
        { key: "2", title: "World" },
        { key: "3", title: "Foo" },
        { key: "4", title: "Bar" },
        { key: "5", title: "Buzz" },
        { key: "10", title: "Hello" },
        { key: "20", title: "World" },
        { key: "30", title: "Foo" },
        { key: "40", title: "Bar" },
        { key: "50", title: "Buzz" }
      ]}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ flex: 1, padding: 12, borderWidth: 1 }}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("header and footer", async () => {
  const jsx = (
    <FlatList
      data={[
        { key: "1", title: "Hello" },
        { key: "2", title: "World" },
        { key: "3", title: "Foo" },
        { key: "4", title: "Bar" },
        { key: "5", title: "Buzz" }
      ]}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
          <Text>{item.title}</Text>
        </View>
      )}
      ListHeaderComponent={
        <View style={{ padding: 12, backgroundColor: "#eee" }}>
          <Text>Header</Text>
        </View>
      }
      ListFooterComponent={
        <View style={{ padding: 12, backgroundColor: "#eee" }}>
          <Text>Footer</Text>
        </View>
      }
      ItemSeparatorComponent={
        <View style={{ height: 1, backgroundColor: "black" }} />
      }
    />
  );

  expect(await renderSvg(jsx)).toMatchFileSnapshot();
  expect(await renderPng(jsx)).toMatchImageSnapshot();
});

test("header, footer, and separator as component", async () => {
  class Separator extends React.Component {
    render() {
      return <View style={{ height: 1, backgroundColor: "black" }} />;
    }
  }

  class Header extends React.Component {
    render() {
      return (
        <View style={{ padding: 12, backgroundColor: "#eee" }}>
          <Text>Header</Text>
        </View>
      );
    }
  }

  class Footer extends React.Component {
    render() {
      return (
        <View style={{ padding: 12, backgroundColor: "#eee" }}>
          <Text>Footer</Text>
        </View>
      );
    }
  }

  const jsx = (
    <FlatList
      data={[
        { key: "1", title: "Hello" },
        { key: "2", title: "World" },
        { key: "3", title: "Foo" },
        { key: "4", title: "Bar" },
        { key: "5", title: "Buzz" }
      ]}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
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
    <FlatList
      data={[{ key: "1", title: "Hello" }, { key: "2", title: "World" }]}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
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
    <FlatList
      data={[]}
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
