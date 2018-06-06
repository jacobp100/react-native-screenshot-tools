const ReactFiberReconciler = require("react-reconciler");
const elements = require("./elements");
const Root = require("./elements/Root");

const emptyObject = {};

const shim = () => {
  throw new Error("This should not be called by React");
};

const Renderer = ReactFiberReconciler({
  supportsPersistence: false,
  cloneInstance: shim,
  createContainerChildSet: shim,
  appendChildToContainerChildSet: shim,
  finalizeContainerChildren: shim,
  replaceContainerChildren: shim,
  supportsHydration: false,
  canHydrateInstance: shim,
  canHydrateTextInstance: shim,
  getNextHydratableSibling: shim,
  getFirstHydratableChild: shim,
  hydrateInstance: shim,
  hydrateTextInstance: shim,
  didNotMatchHydratedContainerTextInstance: shim,
  didNotMatchHydratedTextInstance: shim,
  didNotHydrateContainerInstance: shim,
  didNotHydrateInstance: shim,
  didNotFindHydratableContainerInstance: shim,
  didNotFindHydratableContainerTextInstance: shim,
  didNotFindHydratableInstance: shim,
  didNotFindHydratableTextInstance: shim,
  getPublicInstance(instance) {
    return instance;
  },
  appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  getRootHostContext() {
    return emptyObject;
  },
  getChildHostContext() {
    return emptyObject;
  },
  prepareForCommit() {
    return true;
  },
  resetAfterCommit() {
    // Noop
  },
  createInstance(type, props, rootContainerInstance) {
    const { backend, settings } = rootContainerInstance;
    if (elements[type] == null) {
      throw new Error(`Cannot render instance of ${type}`);
    }
    return new elements[type](backend, settings, props);
  },
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  finalizeInitialChildren() {
    return false;
  },
  prepareUpdate(instance, tagName, prevProps, nextProps) {
    instance.setProps(nextProps);
  },
  shouldSetTextContent() {
    return false;
  },
  shouldDeprioritizeSubtree() {
    return false;
  },
  createTextInstance(text) {
    return new elements.Text.Container(text);
  },
  isPrimaryRenderer: true,
  now() {
    return 0;
  },
  scheduleDeferredCallback: shim,
  cancelDeferredCallback: shim,
  supportsMutation: true,
  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    if (type !== instance.constructor.name) throw new Error("Not handled");
    instance.setProps(newProps);
  },
  commitMount() {
    // Noop
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.updateText(newText);
  },
  resetTextContent() {
    // Noop
  },
  appendChildToContainer(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  insertInContainerBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
  },
  removeChildFromContainer(parentInstance, child) {
    parentInstance.removeChild(child);
  }
});

const create = (element, backend, settings) => {
  const root = new Root(backend, settings, {});
  const node = Renderer.createContainer(root, false, false);
  Renderer.updateContainer(element, node, null);
  return {
    root,
    update: e => Renderer.updateContainer(e, node, null, null),
    unmount: () => Renderer.updateContainer(null, node, null, null)
  };
};

module.exports = create;
