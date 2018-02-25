const renderViewBackground = require("./viewBackground");

const renderers = {
  View(backend, node, layout) {
    renderViewBackground(backend, layout, node.style);
  },
  Text(backend, node, layout) {
    backend.fillLines(node.text, layout);
  }
};

const renderNode = (backend, node, settings) =>
  renderers[node.type](backend, node, settings);

const recurseTree = async (
  backend,
  node,
  settings,
  origin = { x: 0, y: 0 }
) => {
  const hasTransform = node.style != null && node.style.transform != null;
  if (hasTransform) backend.pushTransform(node.style.transform, node.layout);

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

  if (hasTransform) backend.popTransform();
};

module.exports = recurseTree;
