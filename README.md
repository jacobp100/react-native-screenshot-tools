# React Image Export

I want to be able to generate app store screenshots of React Native apps easily and without a simulator. It's very in-progress and probably everything is broken. Every package name I use will also change.

`react-image-export` is a fork of [jest-snapshots-svg](https://github.com/jest-community/jest-snapshots-svg) and [render-react-native-to-image](https://github.com/jaredly/render-react-native-to-image). It will export to SVG and PNG.

`snapshotter` lets you generate screenshots easily. It's pretty much Jest without the testing stuff. It lets you do mocking the same way as Jest, so if you have native modules, you can just mock them out.

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

* All* layout props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/10), [docs](https://facebook.github.io/react-native/docs/layout-props.html))
* All-but-one props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/8), [docs](https://facebook.github.io/react-native/docs/view-props.html))
* Most text style props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/9), [docs](https://facebook.github.io/react-native/docs/text-style-props.html))
* All-but-one image style props are implemented ([issue](https://github.com/jacobp100/react-image-export/issues/11), [docs](https://facebook.github.io/react-native/docs/image-style-props.html))

\* We don't yet support RTL layouts. The above issues have the RTL props moved to a separate [issue](https://github.com/jacobp100/react-image-export/issues/15)

We only support 2D transforms. We should be able to support all but `perspective`.

We have some native components working.

* [iOS components issue](https://github.com/jacobp100/react-image-export/issues/5)
* [Android components issue](https://github.com/jacobp100/react-image-export/issues/6)

The test snapshotter is mostly working as proof of concept.
