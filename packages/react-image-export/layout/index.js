const yoga = require("yoga-layout");
const { flattenStyle } = require("../stylesheet");
const computeYogaNode = require("./computeYogaNode");
const extractText = require("./extractText");
const { breakLines, measureLines } = require("./textLayout");
const readImage = require("../imageLoader");
const {
  childrenToArray,
  depthFirst,
  asyncDepthFirst,
  STOP_ITERATION
} = require("./util");

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

const getConfig = settings => {
  const config = yoga.Config.create();
  config.setPointScaleFactor(settings.dpi);
  return config;
};

/*
jest-preset-react-native mocks View components with a class that renders View host components,
meaning one View has a component node and a host node. We can keep track of the component node's
instance for layouts, but we end up using the host node for rendering.
*/
const computeLayout = async (
  backend,
  testRendererInstance,
  settings,
  config = getConfig(settings),
  previousLayouts = new WeakMap()
) => {
  const rootElement = testRendererInstance.toTree();
  const nodes = new WeakMap();
  const styles = new WeakMap();
  const layouts = new WeakMap();
  const texts = new WeakMap();
  const images = new WeakMap();
  const updateRecords = new Set();

  let rootNode = null;
  await asyncDepthFirst(async (element, parentNode) => {
    const childHostInstanceType = getChildHostInstanceType(element);
    if (childHostInstanceType == null) return parentNode;
    const { instance, props } = element;
    const style = flattenStyle(props.style) || {};
    styles.set(instance, style);

    const hostStyles = {};
    if (childHostInstanceType === "Image") {
      const image = await readImage(props.src.testUri, settings.testFilePath);
      images.set(instance, image);
      hostStyles.width = image.width;
      hostStyles.height = image.height;
      hostStyles.aspectRatio = image.width / image.height;
    }

    const node = computeYogaNode({ ...hostStyles, ...style }, config);

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

  rootNode.calculateLayout(settings.width, settings.height, yoga.DIRECTION_LTR);

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
    ? computeLayout(backend, testRendererInstance, settings, config, layouts)
    : { styles, layouts, texts, images };
};

/* eslint-disable no-use-before-define */
const childrenToJson = (children, params, ...passedProps) =>
  childrenToArray(children).reduce((accum, child) => {
    let resolvedChild;
    if (child == null || child === false) {
      return accum;
    } else if (typeof child !== "object") {
      resolvedChild = child;
    } else {
      resolvedChild = treeToJson(child, params, ...passedProps);
    }
    return accum.concat(resolvedChild);
  }, []);
/* eslint-enable */

const removeChildren = ({ children, ...props }) => props;

const treeToJson = (element, params, layout, style, text, image) => {
  switch (element.nodeType) {
    case "component":
      return childrenToJson(
        element.rendered,
        params,
        params.layouts.get(element.instance),
        params.styles.get(element.instance),
        params.texts.get(element.instance),
        params.images.get(element.instance)
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
        text,
        image
      };
    default:
      throw new Error("Unknown element");
  }
};

module.exports = async (backend, testRendererInstance, settings) => {
  const params = await computeLayout(backend, testRendererInstance, settings);
  return treeToJson(testRendererInstance.toTree(), params)[0];
};
