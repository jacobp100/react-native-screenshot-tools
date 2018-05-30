const ReactFiberReconciler = require("react-reconciler");
const elements = require("./elements");
const Root = require("./elements/Root");

const emptyObject = {};

const Renderer = ReactFiberReconciler({
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  createInstance(type, props, rootContainerInstance) {
    const { backend, settings } = rootContainerInstance;
    return new elements[type](backend, settings, props);
  },

  createTextInstance(text) {
    return new elements.Text.Container(text);
  },

  finalizeInitialChildren() {
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    return true;
  },

  prepareUpdate(instance, tagName, prevProps, nextProps) {
    instance.setProps(nextProps);
  },

  resetAfterCommit() {
    // Noop
  },

  resetTextContent() {
    // Noop
  },

  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent() {
    return false;
  },

  now: () => 0,

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    appendChildToContainer(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    insertBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },

    insertInContainerBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    removeChildFromContainer(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.updateText(newText);
    },

    commitMount() {
      // Noop
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      if (type !== instance.constructor.name) throw new Error("Not handled");
      instance.setProps(newProps);
    }
  }
});

const render = (element, backend, settings) => {
  const root = new Root(backend, settings, {});
  const node = Renderer.createContainer(root, false, false);
  Renderer.updateContainer(element, node, null);
  return root;
};

module.exports = render;
