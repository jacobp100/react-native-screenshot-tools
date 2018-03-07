const { create } = require("react-test-renderer");
// const { isElement } = require("react-is");
const { CanvasBackend, SvgBackend } = require("./backends");
const layoutRoot = require("./layout");
const render = require("./render");

const defaultSettings = {
  width: 500,
  height: 500,
  dpi: 2
};

const getInstance = rootInstanceOrJsx => {
  if (typeof rootInstanceOrJsx.toTree === "function") {
    const rootInstance = rootInstanceOrJsx;
    return rootInstance;
  } else if (rootInstanceOrJsx) {
    // FIXME: Use react-is
    const element = rootInstanceOrJsx;
    return create(element);
  }
  throw new Error("Expected a test renderer instance or plain JSX");
};

const renderBackend = async (
  backend,
  rootInstanceOrJsx,
  settings = defaultSettings
) => {
  const rootInstance = getInstance(rootInstanceOrJsx);
  const formattedRoot = await layoutRoot(backend, rootInstance, settings);
  backend.setDimensions(formattedRoot.layout);
  await render(backend, formattedRoot, settings);
  return backend;
};

module.exports.renderToSvg = async (rootInstanceOrJsx, settings) =>
  String(await renderBackend(new SvgBackend(), rootInstanceOrJsx, settings));

module.exports.renderToCanvas = async (ctx, rootInstanceOrJsx, settings) => {
  await renderBackend(new CanvasBackend(ctx), rootInstanceOrJsx, settings);
  return ctx;
};
