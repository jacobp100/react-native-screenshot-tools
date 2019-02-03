# React Image Export

I want to be able to generate app store screenshots of React Native apps easily and without a simulator. It's very in-progress and probably everything is broken. It used to work in node, but not in the browser. Now it works in the browser, and I have no idea about node. Every package name I use will also change.

`react-native-headless-snapshotter` is a fork of [jest-snapshots-svg](https://github.com/jest-community/jest-snapshots-svg) and [render-react-native-to-image](https://github.com/jaredly/render-react-native-to-image). It will export to SVG and PNG.

`react-image-screenshot-generator` lets you generate screenshots easily. It's pretty much Jest without the testing stuff. It lets you do mocking the same way as Jest, so if you have native modules, you can just mock them out.

`system-components-js` is a JS implementation for look-alike system components (they don't have any interactivity when used in a real app).

`react-native-device-frames` is a react component that wraps its children in a device frame. This is useful for app screenshots.

## Prerequisites

Download [Roboto fonts](https://fonts.google.com/specimen/Roboto) (click "select this font", expand the window that pops up, and then click the download icon)
Download [San Francisco fonts](https://developer.apple.com/fonts/)

Extract these into `packages/react-native-headless-snapshotter/fonts` (anywhere in this folder is fine)

## Usage

In your React Native project, create a folder called `__snapshotter__`. Every JS file in here will run as a snapshot. Make an `index.js` file here,

```jsx
import React from "react";
import { View, Text } from "react-native";

snapshot("filename", () => (
  <View
    style={{
      width: 200,
      height: 200,
      backgroundColor: "red"
    }}
  >
    <Text>Hello world</Text>
  </View>
));
```

This will generate an SVG called `filename.svg`.

## Current Progress

- All(\*) layout props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/10), [docs](https://facebook.github.io/react-native/docs/layout-props.html))
- All-but-one view style props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/8), [docs](https://facebook.github.io/react-native/docs/view-props.html))
- Most text style props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/9), [docs](https://facebook.github.io/react-native/docs/text-style-props.html))
- All-but-one image style props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/11), [docs](https://facebook.github.io/react-native/docs/image-style-props.html))

\* We don't yet support RTL layouts. The above issues have the RTL props moved to a separate [issue](https://github.com/jacobp100/react-image-export/issues/15)

We only support 2D transforms. We should be able to support all but `perspective`.

We have some native components working.

- [iOS components issue](https://github.com/jacobp100/react-image-export/issues/5)
- [Android components issue](https://github.com/jacobp100/react-image-export/issues/6)

### Other Known Issues

- Semi-transparent views with shadows aren't as shown on a device
- SVG does not support textDecorationColor and textDecorationStyle
