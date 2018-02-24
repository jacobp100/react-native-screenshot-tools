const renderViewBackground = require("./viewBackground");

const renderers = {
  View(backend, node) {
    renderViewBackground(backend, node.layout, node.style);
  },
  Text(backend, node) {
    backend.fillLines(node.text, node.layout);
  }
};

const renderNode = (backend, node, settings) =>
  renderers[node.type](backend, node, settings);

const recurseTree = async (backend, root, settings) => {
  await renderNode(backend, root, settings);

  if (!root.children) {
    return;
  }

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const child of root.children) {
    await recurseTree(backend, child, settings);
  }
  /* eslint-enable */
};

module.exports = recurseTree;
