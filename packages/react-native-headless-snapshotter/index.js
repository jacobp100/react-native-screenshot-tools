// const { isElement } = require("react-is");
const { CanvasBackend, SvgBackend } = require("./backend-render");
const LocalFontLoader = require("./backend-font-loader/LocalBackend");
const imageLoader = require("./backend-image-loader/NodeCanvasBackend");
const createBackend = require("./createBackend");
const render = require("./render");

const fontLoader = new LocalFontLoader();

const renderWithBackend = async (renderBackend, jsx, settings) => {
  const backend = createBackend({ renderBackend, fontLoader, imageLoader });
  await render(backend, jsx, settings);
  return backend;
};

module.exports.renderToSvg = async (jsx, settings) =>
  String(await renderWithBackend(new SvgBackend(settings), jsx, settings));

module.exports.renderToCanvas = async (ctx, jsx, settings) => {
  await renderWithBackend(new CanvasBackend(ctx, settings), jsx, settings);
  return ctx;
};
