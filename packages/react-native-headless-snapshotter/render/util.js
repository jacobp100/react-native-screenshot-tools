const ContinuationCommand = {
  MOVE: "M",
  LINE: "L",
  NONE: ""
};

const runContinuationCommand = (ctx, x, y, continuationCommand) => {
  switch (continuationCommand) {
    case ContinuationCommand.MOVE:
      ctx.moveTo(x, y);
      break;
    case ContinuationCommand.LINE:
      ctx.lineTo(x, y);
      break;
    case ContinuationCommand.NONE:
      break;
    default:
      throw new Error("Invalid continuation command");
  }
};

module.exports.ContinuationCommand = ContinuationCommand;
module.exports.runContinuationCommand = runContinuationCommand;
module.exports.drawArc = (
  ctx,
  cx,
  cy,
  rx,
  ry,
  startAngle,
  endAngle,
  continuationCommand = ContinuationCommand.NONE
) => {
  if (Math.abs(endAngle - startAngle) > Math.PI / 2) {
    // We don't need to be able to do this
    throw new Error("This only handles a quarter arc maximum");
  }

  const h = (4 / 3) * Math.tan((endAngle - startAngle) / 4);
  const sx = cx + rx * Math.cos(startAngle);
  const sy = cy + ry * Math.sin(startAngle);

  runContinuationCommand(ctx, sx, sy, continuationCommand);

  if (rx === 0 && ry === 0) {
    return;
  } else if (rx === 0 && ry === 0) {
    ctx.lineTo(cx + rx, cy + ry);
    return;
  }

  ctx.bezierCurveTo(
    cx + rx * (Math.cos(startAngle) - h * Math.sin(startAngle)),
    cy + ry * (Math.sin(startAngle) + h * Math.cos(startAngle)),
    cx + rx * (Math.cos(endAngle) + h * Math.sin(endAngle)),
    cy + ry * (Math.sin(endAngle) - h * Math.cos(endAngle)),
    cx + rx * Math.cos(endAngle),
    cy + ry * Math.sin(endAngle)
  );
};
