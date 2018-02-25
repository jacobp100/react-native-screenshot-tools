const childrenToArray = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (value != null) {
    return [value];
  }
  return [];
};

const forEachChild = (cb, value) => childrenToArray(value).forEach(cb);

const STOP_ITERATION = Symbol("STOP_ITERATION");
const depthFirst = (cb, element, value) => {
  const nextValue = cb(element, value);
  if (nextValue !== STOP_ITERATION) {
    forEachChild(child => depthFirst(cb, child, nextValue), element.rendered);
  }
};

module.exports.childrenToArray = childrenToArray;
module.exports.forEachChild = forEachChild;
module.exports.depthFirst = depthFirst;
module.exports.STOP_ITERATION = STOP_ITERATION;
