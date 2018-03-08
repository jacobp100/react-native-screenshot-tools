const { sortBy, getOr } = require("lodash/fp");
const renderViewBackground = require("./viewBackground");
const processTransform = require("./transform");

const renderers = {
  View(backend, node, layout, settings) {
    const drawShadow =
      settings.platform === "ios" || node.props.forceDrawShadow === true;
    renderViewBackground(backend, layout, settings, node.style, drawShadow);
  },
  Text(backend, node, layout) {
    backend.fillLines(node.text, layout);
  },
  Image(backend, node, layout) {
    backend.drawImage(node.image, layout, node.props.resizeMode);
  }
};

const renderNode = (backend, node, layout, settings) =>
  renderers[node.type](backend, node, layout, settings);

const recurseTree = async (
  backend,
  node,
  settings,
  origin = { x: 0, y: 0 }
) => {
  const { style = {} } = node;

  if (style.display === "none") return;

  const hasTransform = style != null && style.transform != null;
  const hasAlpha =
    style != null && style.opacity != null && style.opacity !== 1;
  const hasClip = node.type === "View" && style.overflow === "hidden";

  if (hasTransform) {
    backend.pushTransform(processTransform(style.transform), node.layout);
  }

  if (hasAlpha) {
    backend.pushAlpha(style.opacity);
  }

  if (hasClip) {
    const ctx = backend.beginClip();
    renderViewBackground.clip(ctx, node.layout, settings, style);
    backend.pushClip();
  }

  const layout = {
    top: node.layout.top + origin.y,
    left: node.layout.left + origin.x,
    width: node.layout.width,
    height: node.layout.height
  };
  await renderNode(backend, node, layout, settings);

  if (!node.children) {
    return;
  }

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  const nextOrigin = { x: layout.left, y: layout.top };
  const childrenByZIndex = sortBy(getOr("style.zIndex", 0), node.children);
  for (const child of childrenByZIndex) {
    await recurseTree(backend, child, settings, nextOrigin);
  }
  /* eslint-enable */

  if (hasClip) backend.popClip();
  if (hasAlpha) backend.popAlpha();
  if (hasTransform) backend.popTransform();
};

module.exports = recurseTree;
