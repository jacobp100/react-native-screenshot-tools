import React from "react";
import ReactDOM from "react-dom";
import { Steps, Modal } from "antd";
import "antd/dist/antd.css";
import StoreContext from "./StoreContext";
import ScreenshotTable from "./ScreenshotTable";
import FileUploader from "./FileUploader";
import Preview from "./Preview";
import Export from "./Export";
import { reducer, initialState, clearMessages } from "./store";

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [current, setCurrent] = React.useState(0);
  global.state = state;
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <FileUploader>
        <Steps current={current} style={{ padding: 32 }}>
          <Steps.Step title="Pick" onClick={() => setCurrent(0)} />
          <Steps.Step title="Configure" onClick={() => setCurrent(1)} />
          <Steps.Step title="Export" onClick={() => setCurrent(2)} />
        </Steps>
        {[<ScreenshotTable />, <Preview />, <Export />][current]}
      </FileUploader>
      <Modal
        visible={state.messages.length > 0}
        title="Something went wrong"
        onOk={() => dispatch(clearMessages())}
      >
        <ul>
          {state.messages.map((message, i) => (
            <li key={i}>{message.body}</li>
          ))}
        </ul>
      </Modal>
    </StoreContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
