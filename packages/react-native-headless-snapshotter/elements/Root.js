const yoga = require("yoga-layout");
const computeYogaNode = require("../layout/computeYogaNode");
const Base = require("./Base");

const frameChanged = (a, b) =>
  a == null ||
  b == null ||
  a.x !== b.x ||
  a.y !== b.y ||
  a.width !== b.width ||
  a.height !== b.height;

module.exports = class Root extends Base {
  async layout(iteration = 0) {
    if (iteration > 100) {
      throw new Error(
        "Could not compute layout: do you have circular logic for `onLayout` anywhere?"
      );
    }
    const { settings } = this;

    const config = yoga.Config.create();
    config.setPointScaleFactor(settings.dpi);

    const componentToNodeMap = new WeakMap();
    const buildNodeTree = async element => {
      const hostStyles = await element.getHostStyles();
      // Recreate tree on every frame to avoid resetting frame params
      const node = computeYogaNode({ ...hostStyles, ...element.style }, config);
      if (element.measureFunc) {
        node.setMeasureFunc(element.measureFunc.bind(element));
      }

      componentToNodeMap.set(element, node);

      const children = element.filteredChildren();
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        // eslint-disable-next-line
        const childNode = await buildNodeTree(child);
        node.insertChild(childNode, index);
      }

      return node;
    };

    const rootNode = await buildNodeTree(this);
    rootNode.calculateLayout(
      settings.width,
      settings.height,
      yoga.DIRECTION_LTR
    );

    const affectedComponents = new Set();
    const applyNodeTree = element => {
      const node = componentToNodeMap.get(element);
      const frame = {
        x: node.getComputedLeft(),
        y: node.getComputedTop(),
        width: node.getComputedWidth(),
        height: node.getComputedHeight()
      };
      if (frameChanged(element.frame, frame)) affectedComponents.add(element);
      element.frame = frame; // eslint-disable-line
      element.filteredChildren().forEach(applyNodeTree);
    };
    applyNodeTree(this);

    let shouldUpdate;
    affectedComponents.forEach(child => {
      const shouldComputeLayout = typeof child.props.onLayout === "function";
      if (shouldComputeLayout) {
        const event = { nativeEvent: { layout: child.frame } };
        child.props.onLayout(event);
      }
      shouldUpdate = shouldUpdate || shouldComputeLayout;
    });

    if (shouldUpdate) this.computeLayout(iteration + 1);
  }
};
