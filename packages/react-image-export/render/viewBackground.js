const chroma = require("chroma-js");
const {
  ContinuationCommand,
  drawArc,
  runContinuationCommand
} = require("./util");

const { NONE, MOVE, LINE } = ContinuationCommand;

const sidesOf = value => [value, value, value, value];

const sidesEqual = sides =>
  sides[0] === sides[1] && sides[0] === sides[2] && sides[0] === sides[3];

const scaleSides = (sides, scale) => [
  sides[0] * scale,
  sides[1] * scale,
  sides[2] * scale,
  sides[3] * scale
];

const getBorderWidth = ({
  borderTopWidth = 0,
  borderRightWidth = 0,
  borderBottomWidth = 0,
  borderLeftWidth = 0
}) => [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];

const getBorderColor = ({
  borderTopColor = "black",
  borderRightColor = "black",
  borderBottomColor = "black",
  borderLeftColor = "black"
}) => [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];

const getBorderRadius = ({
  borderTopLeftRadius = 0,
  borderTopRightRadius = 0,
  borderBottomRightRadius = 0,
  borderBottomLeftRadius = 0
}) => [
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius
];

const getScaledBorderRadius = (style, width, height) => {
  let borderRadii = getBorderRadius(style);

  const borderScale = Math.max(
    (borderRadii[0] + borderRadii[2]) / width,
    (borderRadii[1] + borderRadii[3]) / width,
    (borderRadii[0] + borderRadii[3]) / height,
    (borderRadii[1] + borderRadii[2]) / height,
    1
  );

  if (borderScale > 1) {
    borderRadii = scaleSides(borderRadii, 1 / borderScale);
  }

  return borderRadii;
};

const cornerEllipseAtSide = (x, y, width, height, radii, insets, side) => {
  const radius = radii[side];
  const insetBefore = insets[(side + 3) % 4];
  const insetAfter = insets[side];
  return {
    rx: Math.max(radius - (side % 2 === 0 ? insetBefore : insetAfter), 0),
    ry: Math.max(radius - (side % 2 === 0 ? insetAfter : insetBefore), 0),
    x: x + [0, 1, 1, 0][side] * width + [1, -1, -1, 1][side] * radius,
    y: y + [0, 0, 1, 1][side] * height + [1, 1, -1, -1][side] * radius
  };
};

const to6Dp = x => Math.round(x * 1e6) / 1e6;

const positionOnCorner = (angle, corner) => ({
  x: to6Dp(corner.x + corner.rx * Math.cos(angle)),
  y: to6Dp(corner.y + corner.ry * Math.sin(angle))
});

const drawCorner = (ctx, corner, startAngle, endAngle) => {
  drawArc(ctx, corner.x, corner.y, corner.rx, corner.ry, startAngle, endAngle);
};

const drawSide = (
  ctx,
  x,
  y,
  width,
  height,
  radii,
  insets,
  side,
  {
    startCompletion = 0.5,
    endCompletion = 0.5,
    anticlockwise = false,
    continuationCommand = NONE
  } = {}
) => {
  const baseAngle = (side + 3) * (Math.PI / 2);

  const startSide = anticlockwise ? (side + 1) % 4 : side;
  const endSide = anticlockwise ? side : (side + 1) % 4;
  const completionFactor = Math.PI / 2 * (anticlockwise ? -1 : 1);

  const startCorner = cornerEllipseAtSide(
    x,
    y,
    width,
    height,
    radii,
    insets,
    startSide
  );

  const startAngle = baseAngle - startCompletion * completionFactor;
  const move = positionOnCorner(startAngle, startCorner);
  runContinuationCommand(ctx, move.x, move.y, continuationCommand);

  if (startCompletion > 0) {
    drawCorner(ctx, startCorner, startAngle, baseAngle);
  }

  const endCorner = cornerEllipseAtSide(
    x,
    y,
    width,
    height,
    radii,
    insets,
    endSide
  );
  const mid = positionOnCorner(baseAngle, endCorner);
  ctx.lineTo(mid.x, mid.y);

  if (endCompletion > 0) {
    const endAngle = baseAngle + endCompletion * completionFactor;
    drawCorner(ctx, endCorner, baseAngle, endAngle);
  }
};

const drawRect = (
  ctx,
  { left: x, top: y, width, height },
  radii,
  insets,
  anticlockwise = false
) => {
  const sideIndices = [0, 1, 2, 3];

  if (anticlockwise) {
    sideIndices.reverse();
  }

  sideIndices.forEach((side, index) =>
    drawSide(ctx, x, y, width, height, radii, insets, side, {
      startCompletion: 0,
      endCompletion: 1,
      continuationCommand: index === 0 ? MOVE : NONE,
      anticlockwise
    })
  );
  ctx.closePath();
};

const drawSideFill = (
  ctx,
  { left: x, top: y, width, height },
  radii,
  insets,
  side
) => {
  drawSide(ctx, x, y, width, height, radii, [0, 0, 0, 0], side, {
    continuationCommand: MOVE
  });
  drawSide(ctx, x, y, width, height, radii, insets, side, {
    continuationCommand: LINE,
    anticlockwise: true
  });
  ctx.closePath();
};

const drawSideStroke = (
  ctx,
  { left: x, top: y, width, height },
  radii,
  insets,
  side
) => {
  drawSide(ctx, x, y, width, height, radii, scaleSides(insets, 0.5), side, {
    continuationCommand: MOVE
  });
};

const drawAsSingleShape = (
  backend,
  layout,
  backgroundParams,
  borderRadius,
  borderWidth,
  borderColor
) => {
  const backgroundCtx = backend.beginShape();
  drawRect(
    backgroundCtx,
    layout,
    sidesOf(borderRadius),
    sidesOf(borderWidth * 0.5)
  );
  backend.commitShape({
    ...backgroundParams,
    stroke: borderColor,
    lineWidth: borderWidth
  });
};

const drawAsMultipleShapes = (
  backend,
  layout,
  backgroundParams,
  borderRadii,
  borderWidths,
  borderColors,
  borderStyle
) => {
  const backgroundCtx = backend.beginShape();
  const borderInsets =
    borderStyle === "solid" ? scaleSides(borderWidths, 0.5) : [0, 0, 0, 0];
  drawRect(backgroundCtx, layout, borderRadii, borderInsets);
  backend.commitShape(backgroundParams);

  if (sidesEqual(borderWidths) && sidesEqual(borderColors)) {
    // The border is consistent in width and colour. It doesn't matter if it's solid
    // Draw a border with a line
    const [borderWidth = 0] = borderWidths;
    const borderCtx = backend.beginShape();
    drawRect(borderCtx, layout, borderRadii, scaleSides(borderWidths, 0.5));
    backend.commitShape({ stroke: borderColors[0], lineWidth: borderWidth });
  } else if (borderStyle === "solid") {
    // Solid border - use a filled shape
    borderColors.forEach((borderColor, side) => {
      const borderCtx = backend.beginShape();
      drawSideFill(borderCtx, layout, borderRadii, borderWidths, side);
      backend.commitShape({ fill: borderColor });
    });
  } else {
    // Non-solid border. Use multiple lines.
    // Will look bad when border width varies.
    borderColors.forEach((borderColor, side) => {
      const borderCtx = backend.beginShape();
      drawSideStroke(borderCtx, layout, borderRadii, borderWidths, side);
      backend.commitShape({
        stroke: borderColor,
        lineWidth: borderWidths[side]
      });
    });
  }
};

module.exports = (backend, layout, style) => {
  const borderWidths = getBorderWidth(style);
  const borderColors = getBorderColor(style);
  const borderRadii = getScaledBorderRadius(style, layout.width, layout.height);

  const {
    borderStyle = "solid",
    shadowColor = "black",
    shadowOpacity = 0,
    shadowRadius = 0,
    shadowOffset = { width: 0, height: 0 }
  } = style;

  const [r, g, b, a] = chroma(shadowColor)
    .alpha(shadowOpacity)
    .rgba();
  const backgroundParams = {
    fill: style.backgroundColor || "none",
    shadowColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    shadowBlur: shadowRadius,
    shadowOffsetX: shadowOffset.width,
    shadowOffsetY: shadowOffset.height
  };

  if (
    sidesEqual(borderRadii) &&
    sidesEqual(borderWidths) &&
    sidesEqual(borderColors) &&
    borderStyle === "solid"
  ) {
    // This follows the logic in iOS for `useIOSBorderRendering`.
    // When we are here, we can (eventually) do smooth iOS borders (bugs and all).
    drawAsSingleShape(
      backend,
      layout,
      backgroundParams,
      borderRadii[0],
      borderWidths[0],
      borderColors[0]
    );
  } else {
    drawAsMultipleShapes(
      backend,
      layout,
      backgroundParams,
      borderRadii,
      borderWidths,
      borderColors,
      borderStyle
    );
  }
};
