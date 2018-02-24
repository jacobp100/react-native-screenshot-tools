const childrenToArray = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (value != null) {
    return [value];
  }
  return [];
};

const forEachChild = (cb, value) => childrenToArray(value).forEach(cb);

const depthFirst = (cb, element) => {
  if (cb(element) !== false) {
    forEachChild(child => depthFirst(cb, child), element.rendered);
  }
};

module.exports.childrenToArray = childrenToArray;
module.exports.forEachChild = forEachChild;
module.exports.depthFirst = depthFirst;
