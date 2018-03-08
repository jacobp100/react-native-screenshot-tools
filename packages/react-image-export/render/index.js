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
  const hasTransform = node.style != null && node.style.transform != null;
  const hasAlpha =
    node.style != null &&
    node.style.opacity != null &&
    node.style.opacity !== 1;

  if (hasTransform) {
    backend.pushTransform(processTransform(node.style.transform), node.layout);
  }

  if (hasAlpha) {
    backend.pushAlpha(node.style.opacity);
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
  for (const child of node.children) {
    await recurseTree(backend, child, settings, nextOrigin);
  }
  /* eslint-enable */

  if (hasAlpha) backend.popAlpha();
  if (hasTransform) backend.popTransform();
};

module.exports = recurseTree;
