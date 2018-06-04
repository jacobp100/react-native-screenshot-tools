module.exports.getInnerFrame = ({ x, y, width, height }, style) => {
  const {
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    borderTopWidth = 0,
    borderRightWidth = 0,
    borderBottomWidth = 0,
    borderLeftWidth = 0
  } = style;
  const top = paddingTop + borderTopWidth;
  const right = paddingRight + borderRightWidth;
  const bottom = paddingBottom + borderBottomWidth;
  const left = paddingLeft + borderLeftWidth;
  return {
    x: x + left,
    y: y + top,
    width: width - left - right,
    height: height - top - bottom
  };
};
