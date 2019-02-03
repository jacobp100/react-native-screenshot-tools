import React from "react";
import ReactDOM from "react-dom";
import FileDrop from "react-file-drop";
import CanvasBackend from "react-native-headless-snapshotter/backend-render/CanvasBackend";
import FetchBackend from "react-native-headless-snapshotter/backend-font-loader/FetchBackend";
import BrowserBackend from "react-native-headless-snapshotter/backend-image-loader/BrowserBackend";
import createBackend from "react-native-headless-snapshotter/createBackend";
import render from "react-native-headless-snapshotter/render";
import DeviceContext, { defaults } from "system-components-js/DeviceContext";
import { Frame } from "react-native-device-frames";

const Image = "Image";
const Text = "Text";
const View = "View";

const App = () => {
  let [file, setFile] = React.useState(null);
  const size = {
    width: 640,
    height: 1136
  };
  const dpi = 2;
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;

    const backend = createBackend({
      renderBackend: new CanvasBackend(canvas, { dpi }),
      imageLoader: new BrowserBackend(),
      fontLoader: new FetchBackend(),
      rasterizeText: true
    });

    const jsx = (
      <DeviceContext.Provider value={{ ...defaults, ...size }}>
        <View style={{ ...size, backgroundColor: "orange", padding: 32 }}>
          <Text style={{ fontSize: 96, textAlign: "center", marginBottom: 24 }}>
            Hello world!
          </Text>
          <Frame device="Apple iPhone SE" align={Frame.STRETCH}>
            {file != null ? (
              <Image style={{ width: "100%", height: "100%" }} source={file} />
            ) : (
              <View />
            )}
          </Frame>
        </View>
      </DeviceContext.Provider>
    );

    render(backend, jsx, {});
  });

  return (
    <FileDrop onDrop={f => setFile(URL.createObjectURL(f[0]))}>
      <canvas
        width={size.width * dpi}
        height={size.height * dpi}
        style={size}
        ref={ref}
      />
    </FileDrop>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
