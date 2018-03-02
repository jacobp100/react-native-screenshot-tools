const yoga = require("yoga-layout");
const { flattenStyle } = require("../stylesheet");
const computeYogaNode = require("./computeYogaNode");
const extractText = require("./extractText");
const { breakLines, measureLines } = require("./textLayout");
const { childrenToArray, depthFirst, STOP_ITERATION } = require("./util");

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
  depthFirst((element, parentNode) => {
    const childHostInstanceType = getChildHostInstanceType(element);
    if (childHostInstanceType == null) return parentNode;
    const { instance, props } = element;
    const style = flattenStyle(props.style) || {};
    styles.set(instance, style);

    const node = computeYogaNode(style);

    let returnValue;
    if (childHostInstanceType === "Text") {
      const styledText = extractText(element);
      texts.set(instance, [styledText]);

      node.setMeasureFunc(width => {
        const lines = breakLines(backend, styledText, width);
        texts.set(instance, lines);
        return measureLines(backend, lines);
      });

      returnValue = STOP_ITERATION;
    } else {
      returnValue = node;
    }

    nodes.set(instance, node);

    if (rootNode == null) {
      rootNode = node;
    } else {
      parentNode.insertChild(node, parentNode.getChildCount());
    }

    return returnValue;
  }, rootElement);

  if (!rootNode) throw new Error("Expected to find a root node");

  rootNode.calculateLayout(500, 500, yoga.DIRECTION_LTR);

  depthFirst(element => {
    if (getChildHostInstanceType(element) == null) return;
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
const childrenToJson = (children, params, layout, style, text) =>
  childrenToArray(children).reduce((accum, child) => {
    let resolvedChild;
    if (child == null || child === false) {
      return accum;
    } else if (typeof child !== "object") {
      resolvedChild = child;
    } else {
      resolvedChild = treeToJson(child, params, layout, style, text);
    }
    return accum.concat(resolvedChild);
  }, []);
/* eslint-enable */

const removeChildren = ({ children, ...props }) => props;

const treeToJson = (element, params, layout, style, text) => {
  switch (element.nodeType) {
    case "component":
      return childrenToJson(
        element.rendered,
        params,
        params.layouts.get(element.instance),
        params.styles.get(element.instance),
        params.texts.get(element.instance)
      );
    case "host":
      return {
        type: element.type,
        props: removeChildren(element.props),
        children:
          element.type !== "Text"
            ? childrenToJson(element.rendered, params)
            : null,
        layout,
        style,
        text
      };
    default:
      throw new Error("Unknown element");
  }
};

module.exports = (backend, testRendererInstance) => {
  const params = computeLayout(backend, testRendererInstance);
  return treeToJson(testRendererInstance.toTree(), params)[0];
};
