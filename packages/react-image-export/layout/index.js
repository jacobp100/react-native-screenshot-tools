const yoga = require("yoga-layout");
const { flattenStyle } = require("../stylesheet");
const computeYogaNode = require("./computeYogaNode");
const extractText = require("./extractText");
const { breakLines, measureLines } = require("./textLayout");
const { childrenToArray, depthFirst } = require("./util");

const layoutChanged = (a, b) =>
  a == null ||
  b == null ||
  a.top !== b.top ||
  a.left !== b.left ||
  a.width !== b.width ||
  a.height !== b.height;

const getChildHostInstanceType = element =>
  element.rendered != null && element.rendered.nodeType === "host"
    ? element.rendered.type
    : null;

const viewsWithLayout = ["View", "Text", "Image"];

/*
jest-preset-react-native mocks View components with a class that renders View host components,
meaning one View has a component node and a host node. We can keep track of the component node's
instance for layouts, but we end up using the host node for rendering.
*/
const computeLayout = (
  backend,
  testRendererInstance,
  previousLayouts = new WeakMap()
) => {
  const rootElement = testRendererInstance.toTree();
  const nodes = new WeakMap();
  const styles = new WeakMap();
  const layouts = new WeakMap();
  const texts = new WeakMap();
  const updateRecords = new Set();

  let rootNode = null;
  depthFirst(element => {
    let returnValue = true;
    if (element.nodeType !== "host") return undefined;
    const { instance, props } = element;
    const style = flattenStyle(props.style);
    styles.set(instance, style);

    const node = computeYogaNode(style);

    if (getChildHostInstanceType(element) === "Text") {
      const styledText = extractText(element);
      texts.set(instance, [styledText]);

      node.setMeasureFunc(width => {
        const lines = breakLines(backend, styledText, width);
        texts.set(instance, lines);
        return measureLines(backend, lines);
      });

      returnValue = false;
    }

    nodes.set(instance, node);

    if (rootNode == null) rootNode = node;

    return returnValue;
  }, rootElement);

  if (!rootNode) throw new Error("Expected to find a root node");

  rootNode.calculateLayout(500, 500, yoga.DIRECTION_LTR);

  depthFirst(element => {
    if (element.nodeType !== "host") return;
    const { instance } = element;
    const node = nodes.get(instance);
    const layout = {
      top: node.getComputedTop(),
      left: node.getComputedLeft(),
      width: node.getComputedWidth(),
      height: node.getComputedHeight()
    };
    layouts.set(instance, layout);

    if (
      viewsWithLayout.includes(getChildHostInstanceType(element)) &&
      element.props.onLayout != null &&
      layoutChanged(previousLayouts.get(instance), layout)
    ) {
      updateRecords.add(instance);
    }
  }, rootElement);

  rootNode.freeRecursive();

  updateRecords.forEach(inst => {
    inst.props.onLayout({ layout: layouts.get(inst) });
  });

  return updateRecords.size > 0
    ? computeLayout(backend, testRendererInstance, layouts)
    : { styles, layouts, texts };
};

/* eslint-disable no-use-before-define */
const childrenToJson = (children, layouts, params, style, text) =>
  childrenToArray(children).reduce((accum, child) => {
    let resolvedChild;
    if (child == null || child === false) {
      return accum;
    } else if (typeof child !== "object") {
      resolvedChild = child;
    } else {
      resolvedChild = treeToJson(child, layouts, params, style, text);
    }
    return accum.concat(resolvedChild);
  }, []);
/* eslint-enable */

const removeChildren = ({ children, ...props }) => props;

const treeToJson = (node, params, layout, style, text) => {
  switch (node.nodeType) {
    case "component":
      return childrenToJson(
        node.rendered,
        params,
        params.layouts.get(node.instance),
        params.styles.get(node.instance),
        params.texts.get(node.instanece)
      );
    case "host":
      return {
        type: node.type,
        props: removeChildren(node.props),
        children: childrenToJson(node.rendered, params),
        layout,
        style,
        text
      };
    default:
      throw new Error("Unknown node");
  }
};

module.exports = (backend, testRendererInstance) => {
  const { layouts, styles, texts } = computeLayout(
    backend,
    testRendererInstance
  );
  return treeToJson(testRendererInstance.toTree(), layouts, styles, texts)[0];
};
