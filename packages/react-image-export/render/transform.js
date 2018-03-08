/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const multiply = ([a0, b0, c0, d0, e0, f0], [a1, b1, c1, d1, e1, f1]) => [
  a0 * a1 + c0 * e1,
  b0 * a1 + d0 * b1,
  a0 * c1 + c0 * d1,
  b0 * c1 + d0 * d1,
  a0 * e1 + c0 * f1 + e0,
  b0 * e1 + d0 * f1 + f0
];

const convertToRadians = value => {
  const floatValue = parseFloat(value);
  return value.indexOf("rad") > -1 ? floatValue : floatValue * Math.PI / 180;
};

const processTransform = transform =>
  transform.reduce(
    (current, transformation) => {
      const key = Object.keys(transformation)[0];
      const value = transformation[key];

      switch (key) {
        case "matrix":
        case "perspective":
        case "rotateX":
        case "rotateY":
          throw new Error("Not handled");
        case "rotate":
        case "rotateZ": {
          const angle = convertToRadians(value);
          return multiply(current, [
            Math.cos(angle),
            Math.sin(angle),
            -Math.sin(angle),
            Math.cos(angle),
            0,
            0
          ]);
        }
        case "scale":
          return multiply(current, [value, 0, 0, value, 0, 0]);
        case "scaleX":
          return multiply(current, [value, 0, 0, 1, 0, 0]);
        case "scaleY":
          return multiply(current, [1, 0, 0, value, 0, 0]);
        case "translate":
          if (value[2] != null) throw new Error("Not handled");
          return multiply(current, [1, 0, 0, 1, value[0], value[1]]);
        case "translateX":
          return multiply(current, [1, 0, 0, 1, value, 0]);
        case "translateY":
          return multiply(current, [1, 0, 0, 1, 0, value]);
        case "skewX": {
          const shear = Math.atan(convertToRadians(value));
          return multiply(current, [1, shear, 0, 1, 0, 0]);
        }
        case "skewY": {
          const shear = Math.atan(convertToRadians(value));
          return multiply(current, [1, 0, shear, 1, 0, 0]);
        }
        default:
          throw new Error(`Invalid transform name: ${key}`);
      }
    },
    [1, 0, 0, 1, 0, 0]
  );

module.exports = processTransform;
