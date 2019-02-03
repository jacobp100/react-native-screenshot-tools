import React from "react";
import ReactDOM from "react-dom";
import CanvasBackend from "react-native-headless-snapshotter/backend-render/CanvasBackend";
import FetchBackend from "react-native-headless-snapshotter/backend-font-loader/FetchBackend";
import BrowserBackend from "react-native-headless-snapshotter/backend-image-loader/BrowserBackend";
import createBackend from "react-native-headless-snapshotter/createBackend";
import render from "react-native-headless-snapshotter/render";
import { Frame } from "react-native-device-frames";

const Image = "Image";
const Text = "Text";
const View = "View";

const App = () => {
  const size = 500;
  const dpi = window.devicePixelRatio;
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;

    const backend = createBackend({
      renderBackend: new CanvasBackend(canvas, { dpi }),
      imageLoader: new BrowserBackend()
      // fontLoader: new FetchBackend()
    });

    const jsx = (
      <Frame device="Apple iPhone 5c Red">
        <View>
          <View style={{ width: 100, backgroundColor: "red" }}>
            <Text>Here come dat boi</Text>
          </View>
          <View style={{ width: 100, backgroundColor: "lime" }}>
            <Text>Oh shit waddup</Text>
          </View>
          <Image source="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/smiling-face-with-smiling-eyes.png" />
        </View>
      </Frame>
    );

    render(backend, jsx, {});
  });

  return (
    <canvas
      width={size * dpi}
      height={size * dpi}
      style={{ width: size, height: size }}
      ref={ref}
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
