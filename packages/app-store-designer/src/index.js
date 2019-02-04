import React from "react";
import ReactDOM from "react-dom";
import { Steps } from "antd";
import "antd/dist/antd.css";
import StoreContext from "./StoreContext";
import ScreenshotTable from "./ScreenshotTable";
import FileUploader from "./FileUploader";
import Preview from "./Preview";
import { reducer, initialState } from "./store";

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [current, setCurrent] = React.useState(0);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <FileUploader>
        <Steps current={current} style={{ padding: 32 }}>
          <Steps.Step title="Pick" onClick={() => setCurrent(0)} />
          <Steps.Step title="Configure" onClick={() => setCurrent(1)} />
          <Steps.Step title="Export" onClick={() => setCurrent(2)} />
        </Steps>
        {[<ScreenshotTable />, <Preview />, null][current]}
      </FileUploader>
    </StoreContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
