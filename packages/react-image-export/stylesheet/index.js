const expandStyle = require("./expandStyle");

const mergeTransforms = (a, b) => {
  if (!a || a.length === 0) return b; // in this case, a has nothing to contribute.
  const result = [];
  const transformsInA = a.reduce((hash, t) => {
    const key = Object.keys(t)[0];
    result.push(t);
    hash[key] = result.length - 1;
    return hash;
  }, {});
  b.forEach(t => {
    const key = Object.keys(t)[0];
    const index = transformsInA[key];
    if (index !== undefined) {
      result[index] = t;
    } else {
      result.push(t);
    }
  });
  return result;
};

// merge two style hashes together. Sort of like `Object.assign`, but is aware of `transform` as a
// special case.
// NOTE(lmr): mutates the first argument!
const mergeStyle = (a, b) => {
  let key;
  // eslint-disable-next-line no-restricted-syntax
  for (key in b) {
    if (hasOwnProperty.call(b, key)) {
      switch (key) {
        case "transform":
          a[key] = mergeTransforms(a[key], b[key]);
          break;
        default:
          /* eslint no-param-reassign: 0 */
          a[key] = b[key];
          break;
      }
    }
  }
  return a;
};

const flattenStyle = input => {
  if (Array.isArray(input)) {
    return input.reduce((acc, val) => mergeStyle(acc, flattenStyle(val)), {});
  } else if (typeof input === "number") {
    return input;
  } else if (!input) {
    // input is falsy, so we skip it by returning undefined
    return undefined;
  }
  return expandStyle(input);
};

module.exports.flattenStyle = flattenStyle;
