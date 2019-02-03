import React from "react";
import ReactDOM from "react-dom";
import FileDrop from "react-file-drop";
import CanvasBackend from "react-native-headless-snapshotter/backend-render/CanvasBackend";
import FetchBackend from "react-native-headless-snapshotter/backend-font-loader/FetchBackend";
import BrowserBackend from "react-native-headless-snapshotter/backend-image-loader/BrowserBackend";
import createBackend from "react-native-headless-snapshotter/createBackend";
import render from "react-native-headless-snapshotter/render";
import DeviceContext, { defaults } from "system-components-js/DeviceContext";
import Layout from "./Layout";
import useFileLoader from "./useFileLoader";

const App = () => {
  let [file, setFile] = React.useState(null);
  const size = {
    width: 640,
    height: 1136
  };
  const dpi = 2;
  const ref = React.useRef(null);

  const { filesLoading, loadFiles } = useFileLoader({
    onFileLoaded: f => setFile(f)
  });

  const View = "View";

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
        <View style={size}>
          <Layout
            title="Hello World"
            source={file != null ? file.uri : null}
            backgroundColor="white"
          />
        </View>
      </DeviceContext.Provider>
    );

    render(backend, jsx, {});
  });

  return (
    <FileDrop onDrop={loadFiles}>
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
