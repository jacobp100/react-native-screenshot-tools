const React = require("react");
const render = require("./reconciler");
const SvgBackend = require("./backends/SvgBackend");

const settings = {
  width: 500,
  height: 500,
  dpi: 2
};

render(
  React.createElement(
    "View",
    {},
    React.createElement(
      "Text",
      {},
      "Hello ",
      null,
      React.createElement("Text", { style: { fontWeight: "bold" } }, "world"),
      ["!", null]
    ),
    null
  ),
  new SvgBackend(settings),
  settings
);
