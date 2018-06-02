// const { isElement } = require("react-is");
const { CanvasBackend, SvgBackend } = require("./backends");
const createRenderer = require("./reconciler");

const defaultSettings = {
  width: 500,
  height: 500,
  dpi: 2,
  systemFont: "Helvetica"
};

const renderBackend = async (backend, jsx, settings) => {
  const instance = createRenderer(jsx, backend, {
    ...defaultSettings,
    ...settings
  });
  await instance.root.layout();
  await instance.root.render();
  instance.update(null);
  return backend;
};

module.exports.renderToSvg = async (jsx, settings) =>
  String(await renderBackend(new SvgBackend(settings), jsx, settings));

module.exports.renderToCanvas = async (ctx, jsx, settings) => {
  await renderBackend(new CanvasBackend(ctx, settings), jsx, settings);
  return ctx;
};
