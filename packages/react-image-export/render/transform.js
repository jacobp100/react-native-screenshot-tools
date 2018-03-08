/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const multiply = (a, b) => [];

function processTransform(transform) {
  const result = [1, 0, 0, 1, 0, 0];

  transform.forEach(transformation => {
    const key = Object.keys(transformation)[0];
    const value = transformation[key];

    switch (key) {
      case "matrix":
      case "perspective":
      case "rotateX":
      case "rotateY":
        throw new Error("Not handled");
      case "rotate":
      case "rotateZ":
        multiply(result, MatrixMath.reuseRotateZCommand, [
          convertToRadians(value)
        ]);
        break;
      case "scale":
        multiply(result, MatrixMath.reuseScaleCommand, [value]);
        break;
      case "scaleX":
        multiply(result, MatrixMath.reuseScaleXCommand, [value]);
        break;
      case "scaleY":
        multiply(result, MatrixMath.reuseScaleYCommand, [value]);
        break;
      case "translate":
        if (value[2] != null) throw new Error("Not handled");
        multiply(result, MatrixMath.reuseTranslate3dCommand, [
          value[0],
          value[1],
          value[2] || 0
        ]);
        break;
      case "translateX":
        multiply(result, MatrixMath.reuseTranslate2dCommand, [value, 0]);
        break;
      case "translateY":
        multiply(result, MatrixMath.reuseTranslate2dCommand, [0, value]);
        break;
      case "skewX":
        multiply(result, MatrixMath.reuseSkewXCommand, [
          convertToRadians(value)
        ]);
        break;
      case "skewY":
        multiply(result, MatrixMath.reuseSkewYCommand, [
          convertToRadians(value)
        ]);
        break;
      default:
        throw new Error("Invalid transform name: " + key);
    }
  });

  return result;
}
/**
 * Parses a string like '0.5rad' or '60deg' into radians expressed in a float.
 * Note that validation on the string is done in `_validateTransform()`.
 */
function convertToRadians(value) {
  const floatValue = parseFloat(value);
  return value.indexOf("rad") > -1 ? floatValue : floatValue * Math.PI / 180;
}

module.exports = processTransform;
