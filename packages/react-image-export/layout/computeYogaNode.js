const yoga = require("yoga-layout");

const display = {
  flex: yoga.DISPLAY_FLEX,
  none: yoga.DISPLAY_NONE
};

const overflow = {
  visible: yoga.OVERFLOW_VISIBLE,
  scroll: yoga.OVERFLOW_SCROLL,
  hidden: yoga.OVERFLOW_HIDDEN
};

const flexDirection = {
  row: yoga.FLEX_DIRECTION_ROW,
  column: yoga.FLEX_DIRECTION_COLUMN,
  "row-reverse": yoga.FLEX_DIRECTION_ROW_REVERSE,
  "column-reverse": yoga.FLEX_DIRECTION_COLUMN_REVERSE
};

const justifyContent = {
  "flex-start": yoga.JUSTIFY_FLEX_START,
  "flex-end": yoga.JUSTIFY_FLEX_END,
  center: yoga.JUSTIFY_CENTER,
  "space-between": yoga.JUSTIFY_SPACE_BETWEEN,
  "space-around": yoga.JUSTIFY_SPACE_AROUND
};

const alignContent = {
  "flex-start": yoga.ALIGN_FLEX_START,
  "flex-end": yoga.ALIGN_FLEX_END,
  center: yoga.ALIGN_CENTER,
  stretch: yoga.ALIGN_STRETCH,
  baseline: yoga.ALIGN_BASELINE,
  "space-between": yoga.ALIGN_SPACE_BETWEEN,
  "space-around": yoga.ALIGN_SPACE_AROUND,
  auto: yoga.ALIGN_AUTO
};

const alignItems = {
  "flex-start": yoga.ALIGN_FLEX_START,
  "flex-end": yoga.ALIGN_FLEX_END,
  center: yoga.ALIGN_CENTER,
  stretch: yoga.ALIGN_STRETCH,
  baseline: yoga.ALIGN_BASELINE
};

const alignSelf = {
  "flex-start": yoga.ALIGN_FLEX_START,
  "flex-end": yoga.ALIGN_FLEX_END,
  center: yoga.ALIGN_CENTER,
  stretch: yoga.ALIGN_STRETCH,
  baseline: yoga.ALIGN_BASELINE
};

const flexWrap = {
  nowrap: yoga.WRAP_NO_WRAP,
  wrap: yoga.WRAP_WRAP,
  "wrap-reverse": yoga.WRAP_WRAP_REVERSE
};

module.exports = style => {
  const yogaNode = yoga.Node.create();

  if (style == null) return yogaNode;

  // http://facebook.github.io/react-native/releases/0.48/docs/layout-props.html

  if (style.width != null) yogaNode.setWidth(style.width);
  if (style.height != null) yogaNode.setHeight(style.height);
  if (style.minHeight != null) yogaNode.setMinHeight(style.minHeight);
  if (style.minWidth != null) yogaNode.setMinWidth(style.minWidth);
  if (style.maxHeight != null) yogaNode.setMaxHeight(style.maxHeight);
  if (style.maxWidth != null) yogaNode.setMaxWidth(style.maxWidth);

  // Margin
  if (style.marginTop != null) {
    yogaNode.setMargin(yoga.EDGE_TOP, style.marginTop);
  }
  if (style.marginBottom != null) {
    yogaNode.setMargin(yoga.EDGE_BOTTOM, style.marginBottom);
  }
  if (style.marginLeft != null) {
    yogaNode.setMargin(yoga.EDGE_LEFT, style.marginLeft);
  }
  if (style.marginRight != null) {
    yogaNode.setMargin(yoga.EDGE_RIGHT, style.marginRight);
  }
  if (style.marginVertical != null) {
    yogaNode.setMargin(yoga.EDGE_VERTICAL, style.marginVertical);
  }
  if (style.marginHorizontal != null) {
    yogaNode.setMargin(yoga.EDGE_HORIZONTAL, style.marginHorizontal);
  }
  if (style.margin != null) {
    yogaNode.setMargin(yoga.EDGE_ALL, style.margin);
  }

  // Padding
  if (style.paddingTop != null) {
    yogaNode.setPadding(yoga.EDGE_TOP, style.paddingTop);
  }
  if (style.paddingBottom != null) {
    yogaNode.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom);
  }
  if (style.paddingLeft != null) {
    yogaNode.setPadding(yoga.EDGE_LEFT, style.paddingLeft);
  }
  if (style.paddingRight != null) {
    yogaNode.setPadding(yoga.EDGE_RIGHT, style.paddingRight);
  }
  if (style.paddingVertical != null) {
    yogaNode.setPadding(yoga.EDGE_VERTICAL, style.paddingVertical);
  }
  if (style.paddingHorizontal != null) {
    yogaNode.setPadding(yoga.EDGE_HORIZONTAL, style.paddingHorizontal);
  }
  if (style.padding != null) {
    yogaNode.setPadding(yoga.EDGE_ALL, style.padding);
  }

  // Border
  if (style.borderTopWidth != null) {
    yogaNode.setBorder(yoga.EDGE_TOP, style.borderTopWidth);
  }
  if (style.borderBottomWidth != null) {
    yogaNode.setBorder(yoga.EDGE_BOTTOM, style.borderBottomWidth);
  }
  if (style.borderLeftWidth != null) {
    yogaNode.setBorder(yoga.EDGE_LEFT, style.borderLeftWidth);
  }
  if (style.borderRightWidth != null) {
    yogaNode.setBorder(yoga.EDGE_RIGHT, style.borderRightWidth);
  }
  if (style.borderWidth != null) {
    yogaNode.setBorder(yoga.EDGE_ALL, style.borderWidth);
  }

  // Flex
  if (style.flex != null) {
    yogaNode.setFlex(style.flex);
  }
  if (style.flexGrow != null) {
    yogaNode.setFlexGrow(style.flexGrow);
  }
  if (style.flexShrink != null) {
    yogaNode.setFlexShrink(style.flexShrink);
  }
  if (style.flexBasis != null) {
    yogaNode.setFlexBasis(style.flexBasis);
  }

  if (style.position === "absolute") {
    yogaNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
  } else if (style.position === "relative") {
    yogaNode.setPositionType(yoga.POSITION_TYPE_RELATIVE);
  }

  if (style.top != null) {
    yogaNode.setPosition(yoga.EDGE_TOP, style.top);
  }
  if (style.left != null) {
    yogaNode.setPosition(yoga.EDGE_LEFT, style.left);
  }
  if (style.right != null) {
    yogaNode.setPosition(yoga.EDGE_RIGHT, style.right);
  }
  if (style.bottom != null) {
    yogaNode.setPosition(yoga.EDGE_BOTTOM, style.bottom);
  }

  if (style.display != null && style.display in display) {
    yogaNode.setDisplay(display[style.display]);
  }

  if (style.overflow != null && style.overflow in overflow) {
    yogaNode.setDisplay(overflow[style.overflow]);
  }

  if (style.flexDirection != null && style.flexDirection in flexDirection) {
    yogaNode.setFlexDirection(flexDirection[style.flexDirection]);
  }

  if (style.justifyContent != null && style.justifyContent in justifyContent) {
    yogaNode.setJustifyContent(justifyContent[style.justifyContent]);
  }

  if (style.alignContent != null && style.alignContent in alignContent) {
    yogaNode.setAlignContent(alignContent[style.alignContent]);
  }

  if (style.alignItems != null && style.alignItems in alignItems) {
    yogaNode.setAlignItems(alignItems[style.alignItems]);
  }

  if (style.alignSelf != null && style.alignSelf in alignSelf) {
    yogaNode.setAlignSelf(alignSelf[style.alignSelf]);
  }

  if (style.flexWrap != null && style.flexWrap in flexWrap) {
    yogaNode.setFlexWrap(flexWrap[style.flexWrap]);
  }

  return yogaNode;
};
