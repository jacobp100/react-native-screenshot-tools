const ReactFiberReconciler = require("react-reconciler");
const elements = require("./elements");
const Root = require("./elements/Root");

const emptyObject = {};

/* eslint-disable no-unused-vars */
const Renderer = ReactFiberReconciler({
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  createInstance(type, props, rootContainerInstance) {
    const { backend, settings } = rootContainerInstance;
    return new elements[type](backend, settings, props);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return { text };
  },

  finalizeInitialChildren(element, type, props) {
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit(c) {
    return true;
    // Noop
  },

  prepareUpdate(element, type, oldProps, newProps) {
    return null;
  },

  resetAfterCommit(c) {
    // Noop
  },

  resetTextContent(element) {
    // Noop
  },

  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
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

    insertBefore(parentInstance, child, beforeChild) {},

    insertInContainerBefore(parentInstance, child, beforeChild) {},

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    removeChildFromContainer(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.text = newText; // eslint-disable-line
    },

    commitMount(instance, type, newProps) {
      // Noop
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      if (type !== instance.constructor.name) throw new Error("Not handled");
      instance.setProps(newProps);
    }
  }
});
/* eslint-enable */

const render = (element, backend, settings) => {
  const root = new Root(backend, settings, {});
  const node = Renderer.createContainer(root, false, false);
  Renderer.updateContainer(element, node, null);
  return root;
};

module.exports = render;
