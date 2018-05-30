// const { isElement } = require("react-is");
const { CanvasBackend, SvgBackend } = require("./backends");
const reconciler = require("./reconciler");

const defaultSettings = {
  width: 500,
  height: 500,
  dpi: 2,
  systemFont: "Helvetica"
};

const renderBackend = async (backend, jsx, settings) => {
  const rootInstance = reconciler(jsx, backend, {
    ...defaultSettings,
    ...settings
  });
  await rootInstance.layout();
  await rootInstance.render();
  return backend;
};

module.exports.renderToSvg = async (jsx, settings) =>
  String(await renderBackend(new SvgBackend(settings), jsx, settings));

module.exports.renderToCanvas = async (ctx, jsx, settings) => {
  await renderBackend(new CanvasBackend(ctx, settings), jsx, settings);
  return ctx;
};
