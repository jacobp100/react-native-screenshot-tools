const chroma = require("chroma-js");
const drawIosBorder = require("./iosBorders");
const {
  ContinuationCommand,
  drawArc,
  runContinuationCommand
} = require("./util");

const { NONE, MOVE, LINE } = ContinuationCommand;

const lineDashes = {
  solid: () => [],
  dotted: width => ({ lineCap: "round", lineDash: [0, 1.5 * width] }),
  dashed: width => ({ lineDash: [2 * width, width] })
};

const sidesEqual = sides =>
  sides[0] === sides[1] && sides[0] === sides[2] && sides[0] === sides[3];

const scaleSides = (sides, scale) => [
  sides[0] * scale,
  sides[1] * scale,
  sides[2] * scale,
  sides[3] * scale
];

const outsetFrame = ({ x, y, width, height }, outset) => ({
  x: x - outset,
  y: y - outset,
  width: width + 2 * outset,
  height: height + 2 * outset
});

const getBorderWidths = ({
  borderTopWidth = 0,
  borderRightWidth = 0,
  borderBottomWidth = 0,
  borderLeftWidth = 0
}) => [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];

const getBorderColors = ({
  borderTopColor = "black",
  borderRightColor = "black",
  borderBottomColor = "black",
  borderLeftColor = "black"
}) => [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];

const getBorderRadii = ({
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

const getScaledBorderRadii = (style, width, height) => {
  let borderRadii = getBorderRadii(style);

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
  const completionFactor = (Math.PI / 2) * (anticlockwise ? -1 : 1);

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
  { x, y, width, height },
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

const drawSideFill = (ctx, { x, y, width, height }, radii, insets, side) => {
  drawSide(ctx, x, y, width, height, radii, [0, 0, 0, 0], side, {
    continuationCommand: MOVE
  });
  drawSide(ctx, x, y, width, height, radii, insets, side, {
    continuationCommand: LINE,
    anticlockwise: true
  });
  ctx.closePath();
};

const drawSideStroke = (ctx, { x, y, width, height }, radii, insets, side) => {
  drawSide(ctx, x, y, width, height, radii, insets, side, {
    continuationCommand: MOVE
  });
};

const isSolidBorder = style => {
  const { borderStyle = "solid" } = style;
  return (
    borderStyle === "solid" &&
    getBorderColors(style).every(color => chroma(color).alpha() === 1)
  );
};

const shouldDrawIOSBorder = (style, settings) => {
  if (settings.platform !== "ios") return false;
  return (
    sidesEqual(getBorderRadii(style)) &&
    sidesEqual(getBorderWidths(style)) &&
    sidesEqual(getBorderColors(style)) &&
    isSolidBorder(style)
  );
};

const drawOutline = (ctx, frame, settings, style, insetScale = 0) => {
  const useIOSBorderRendering = shouldDrawIOSBorder(style, settings);
  const borderWidths = getBorderWidths(style);
  const borderRadii = getScaledBorderRadii(style, frame.width, frame.height);

  if (useIOSBorderRendering) {
    const appliedInset = insetScale * borderWidths[0];
    drawIosBorder(
      ctx,
      outsetFrame(frame, -appliedInset),
      borderRadii[0] - appliedInset
    );
  } else {
    const borderInsets = scaleSides(borderWidths, insetScale);
    drawRect(ctx, frame, borderRadii, borderInsets);
  }
};

module.exports.drawBackground = (
  backend,
  frame,
  settings,
  style,
  shadowParams = null
) => {
  const backgroundParams = { fill: style.backgroundColor, ...shadowParams };

  const backgroundCtx = backend.beginShape();
  const shouldInset = isSolidBorder(style) && shadowParams == null;
  drawOutline(backgroundCtx, frame, settings, style, shouldInset ? 0.5 : 0);
  backend.commitShape(backgroundParams);
};

module.exports.drawBorders = (backend, frame, settings, style) => {
  const useIOSBorderRendering = shouldDrawIOSBorder(style, settings);
  const borderWidths = getBorderWidths(style);
  const borderColors = getBorderColors(style);
  const borderRadii = getScaledBorderRadii(style, frame.width, frame.height);
  const { borderStyle = "solid" } = style;

  if (useIOSBorderRendering) {
    const [borderWidth = 0] = borderWidths;
    const borderCtx = backend.beginShape();
    const inset = borderWidth / 2;
    drawIosBorder(
      borderCtx,
      outsetFrame(frame, -inset),
      borderRadii[0] - inset
    );
    backend.commitShape({
      stroke: borderColors[0],
      lineWidth: borderWidth,
      ...lineDashes[borderStyle](borderWidth)
    });
  } else if (sidesEqual(borderWidths) && sidesEqual(borderColors)) {
    // The border is consistent in width and colour. It doesn't matter if it's solid
    // Draw a border with a line
    const [borderWidth = 0] = borderWidths;
    const borderCtx = backend.beginShape();
    drawRect(borderCtx, frame, borderRadii, scaleSides(borderWidths, 0.5));
    backend.commitShape({
      stroke: borderColors[0],
      lineWidth: borderWidth,
      ...lineDashes[borderStyle](borderWidth)
    });
  } else if (borderStyle === "solid") {
    // Solid border - use a filled shape (alpha values for border are okay here)
    borderColors.forEach((borderColor, side) => {
      const borderCtx = backend.beginShape();
      drawSideFill(borderCtx, frame, borderRadii, borderWidths, side);
      backend.commitShape({ fill: borderColor });
    });
  } else {
    // Non-solid border. Use multiple lines.
    // Will look bad when border width varies.
    // FIXME: Handle border style
    const insets = scaleSides(borderWidths, 0.5);
    borderColors.forEach((borderColor, side) => {
      const borderCtx = backend.beginShape();
      drawSideStroke(borderCtx, frame, borderRadii, insets, side);
      backend.commitShape({
        stroke: borderColor,
        lineWidth: borderWidths[side],
        ...lineDashes[borderStyle](borderWidths[side])
      });
    });
  }
};

module.exports.clip = (ctx, frame, settings, style) => {
  drawOutline(ctx, frame, settings, style, 0);
};

module.exports.clipInside = (ctx, frame, settings, style) => {
  drawOutline(ctx, frame, settings, style, 1);
};
