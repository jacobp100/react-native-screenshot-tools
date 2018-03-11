function addCustomRoundedRect1(ctx, x, y, width, height, r, r2) {
  ctx.moveTo(x + 1.528 * r2, y);
  ctx.lineTo(x + width - 1.528 * r2, y);
  ctx.bezierCurveTo(
    x + width - 1.088 * r2,
    y,
    x + width - 0.868 * r2,
    y,
    x + width - 0.669 * r2,
    y + 0.065 * r2
  );
  ctx.lineTo(x + width - 0.631 * r2, y + 0.074 * r2);
  ctx.bezierCurveTo(
    x + width - 0.372 * r2,
    y + 0.169 * r2,
    x + width - 0.169 * r2,
    y + 0.372 * r2,
    x + width - 0.074 * r2,
    y + 0.631 * r2
  );
  ctx.bezierCurveTo(
    x + width,
    y + 0.868 * r2,
    x + width,
    y + 1.088 * r2,
    x + width,
    y + 1.528 * r2
  );
  ctx.lineTo(x + width, y + height - 1.528 * r2);
  ctx.bezierCurveTo(
    x + width,
    y + height - 1.088 * r2,
    x + width,
    y + height - 0.868 * r2,
    x + width - 0.065 * r2,
    y + height - 0.669 * r2
  );
  ctx.lineTo(x + width - 0.074 * r2, y + height - 0.631 * r2);
  ctx.bezierCurveTo(
    x + width - 0.169 * r2,
    y + height - 0.372 * r2,
    x + width - 0.372 * r2,
    y + height - 0.169 * r2,
    x + width - 0.631 * r2,
    y + height - 0.074 * r2
  );
  ctx.bezierCurveTo(
    x + width - 0.868 * r2,
    y + height,
    x + width - 1.088 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height
  );
  ctx.lineTo(x + 1.528 * r2, y + height);
  ctx.bezierCurveTo(
    x + 1.088 * r2,
    y + height,
    x + 0.868 * r2,
    y + height,
    x + 0.669 * r2,
    y + height - 0.065 * r2
  );
  ctx.lineTo(x + 0.631 * r2, y + height - 0.074 * r2);
  ctx.bezierCurveTo(
    x + 0.372 * r2,
    y + height - 0.169 * r2,
    x + 0.169 * r2,
    y + height - 0.372 * r2,
    x + 0.074 * r2,
    y + height - 0.631 * r2
  );
  ctx.bezierCurveTo(
    x,
    y + height - 0.868 * r2,
    x,
    y + height - 1.088 * r2,
    x,
    y + height - 1.528 * r2
  );
  ctx.lineTo(x, y + 1.528 * r2);
  ctx.bezierCurveTo(
    x,
    y + 1.088 * r2,
    x,
    y + 0.868 * r2,
    x + 0.065 * r2,
    y + 0.669 * r2
  );
  ctx.lineTo(x + 0.074 * r2, y + 0.631 * r2);
  ctx.bezierCurveTo(
    x + 0.169 * r2,
    y + 0.372 * r2,
    x + 0.372 * r2,
    y + 0.169 * r2,
    x + 0.631 * r2,
    y + 0.074 * r2
  );
  ctx.bezierCurveTo(x + 0.868 * r2, y, x + 1.088 * r2, y, x + 1.528 * r2, y);
}

function addCustomRoundedRect2a(ctx, x, y, width, height, r, r2) {
  ctx.moveTo(x + 2.005 * r2, y);
  ctx.lineTo(x + width - 1.528 * r, y);
  ctx.bezierCurveTo(
    x + width - 1.635 * r2,
    y,
    x + width - 1.298 * r2,
    y,
    x + width - 0.995 * r2,
    y + 0.1 * r2
  );
  ctx.lineTo(x + width - 0.936 * r2, y + 0.114 * r2);
  ctx.bezierCurveTo(
    x + width - 0.374 * r2,
    y + 0.319 * r2,
    x + width,
    y + 0.853 * r2,
    x + width,
    y + 1.452 * r2
  );
  ctx.bezierCurveTo(
    x + width,
    y + height / 2,
    x + width,
    y + height / 2,
    x + width,
    y + height / 2
  );
  ctx.lineTo(x + width, y + height / 2);
  ctx.bezierCurveTo(
    x + width,
    y + height / 2,
    x + width,
    y + height / 2,
    x + width,
    y + height / 2
  );
  ctx.lineTo(x + width, y + height - 1.452 * r2);
  ctx.bezierCurveTo(
    x + width,
    y + height - 0.853 * r2,
    x + width - 0.374 * r2,
    y + height - 0.319 * r2,
    x + width - 0.936 * r2,
    y + height - 0.114 * r2
  );
  ctx.bezierCurveTo(
    x + width - 1.298 * r2,
    y + height,
    x + width - 1.635 * r2,
    y + height,
    x + width - 2.308 * r2,
    y + height
  );
  ctx.lineTo(x + 1.528 * r, y + height);
  ctx.bezierCurveTo(
    x + 1.635 * r2,
    y + height,
    x + 1.298 * r2,
    y + height,
    x + 0.995 * r2,
    y + height - 0.1 * r2
  );
  ctx.lineTo(x + 0.936 * r2, y + height - 0.114 * r2);
  ctx.bezierCurveTo(
    x + 0.374 * r2,
    y + height - 0.319 * r2,
    x,
    y + height - 0.853 * r2,
    x,
    y + height - 1.452 * r2
  );
  ctx.bezierCurveTo(x, y + height / 2, x, y + height / 2, x, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.bezierCurveTo(x, y + height / 2, x, y + height / 2, x, y + height / 2);
  ctx.lineTo(x, y + 1.452 * r2);
  ctx.bezierCurveTo(
    x,
    y + 0.853 * r2,
    x + 0.374 * r2,
    y + 0.319 * r2,
    x + 0.936 * r2,
    y + 0.114 * r2
  );
  ctx.bezierCurveTo(x + 1.298 * r2, y, x + 1.635 * r2, y, x + 2.308 * r2, y);
  ctx.lineTo(x + 1.528 * r, y);
  ctx.lineTo(x + 2.005 * r2, y);
}

function addCustomRoundedRect2b(ctx, x, y, width, height, r, r2) {
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.bezierCurveTo(x + width / 2, y, x + width / 2, y, x + width / 2, y);
  ctx.lineTo(x + width - 1.452 * r2, y);
  ctx.bezierCurveTo(
    x + width - 0.853 * r2,
    y,
    x + width - 0.319 * r2,
    y + 0.374 * r2,
    x + width - 0.114 * r2,
    y + 0.936 * r2
  );
  ctx.bezierCurveTo(
    x + width,
    y + 1.298 * r2,
    x + width,
    y + 1.635 * r2,
    x + width,
    y + 2.308 * r2
  );
  ctx.lineTo(x + width, y + height - 1.528 * r);
  ctx.bezierCurveTo(
    x + width,
    y + height - 1.635 * r2,
    x + width,
    y + height - 1.298 * r2,
    x + width - 0.1 * r2,
    y + height - 0.995 * r2
  );
  ctx.lineTo(x + width - 0.114 * r2, y + height - 0.936 * r2);
  ctx.bezierCurveTo(
    x + width - 0.319 * r2,
    y + height - 0.374 * r2,
    x + width - 0.853 * r2,
    y + height,
    x + width - 1.452 * r2,
    y + height
  );
  ctx.bezierCurveTo(
    x + width / 2,
    y + height,
    x + width / 2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.lineTo(x + width / 2, y + height);
  ctx.bezierCurveTo(
    x + width / 2,
    y + height,
    x + width / 2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.lineTo(x + 1.452 * r2, y + height);
  ctx.bezierCurveTo(
    x + 0.853 * r2,
    y + height,
    x + 0.319 * r2,
    y + height - 0.374 * r2,
    x + 0.114 * r2,
    y + height - 0.936 * r2
  );
  ctx.bezierCurveTo(
    x,
    y + height - 1.298 * r2,
    x,
    y + height - 1.635 * r2,
    x,
    y + height - 2.308 * r2
  );
  ctx.lineTo(x, y + 1.528 * r);
  ctx.bezierCurveTo(
    x,
    y + 1.635 * r2,
    x,
    y + 1.298 * r2,
    x + 0.1 * r2,
    y + 0.995 * r2
  );
  ctx.lineTo(x + 0.114 * r2, y + 0.936 * r2);
  ctx.bezierCurveTo(
    x + 0.319 * r2,
    y + 0.374 * r2,
    x + 0.853 * r2,
    y,
    x + 1.452 * r2,
    y
  );
  ctx.bezierCurveTo(x + width / 2, y, x + width / 2, y, x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
}

function addCustomRoundedRect3a(ctx, x, y, width, height, r, r2) {
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.bezierCurveTo(x + width / 2, y, x + width / 2, y, x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.bezierCurveTo(
    x + width - 0.684 * r2,
    y,
    x + width,
    y + 0.684 * r2,
    x + width,
    y + 1.528 * r2
  );
  ctx.bezierCurveTo(
    x + width,
    y + 1.528 * r2,
    x + width,
    y + 1.528 * r2,
    x + width,
    y + 1.528 * r2
  );
  ctx.bezierCurveTo(
    x + width,
    y + 1.528 * r2,
    x + width,
    y + 1.528 * r2,
    x + width,
    y + 1.528 * r2
  );
  ctx.lineTo(x + width, y + height / 2);
  ctx.bezierCurveTo(
    x + width,
    y + height - 1.528 * r2,
    x + width,
    y + height - 1.528 * r2,
    x + width,
    y + height - 1.528 * r2
  );
  ctx.lineTo(x + width, y + height - 1.528 * r2);
  ctx.bezierCurveTo(
    x + width,
    y + height - 0.684 * r2,
    x + width - 0.684 * r2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.bezierCurveTo(
    x + width / 2,
    y + height,
    x + width / 2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.bezierCurveTo(
    x + width / 2,
    y + height,
    x + width / 2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.lineTo(x + width / 2, y + height);
  ctx.bezierCurveTo(
    x + width / 2,
    y + height,
    x + width / 2,
    y + height,
    x + width / 2,
    y + height
  );
  ctx.lineTo(x + width / 2, y + height);
  ctx.bezierCurveTo(
    x + 0.684 * r2,
    y + height,
    x,
    y + height - 0.684 * r2,
    x,
    y + height - 1.528 * r2
  );
  ctx.bezierCurveTo(
    x,
    y + height - 1.528 * r2,
    x,
    y + height - 1.528 * r2,
    x,
    y + height - 1.528 * r2
  );
  ctx.bezierCurveTo(
    x,
    y + height - 1.528 * r2,
    x,
    y + height - 1.528 * r2,
    x,
    y + height - 1.528 * r2
  );
  ctx.lineTo(x, y + height / 2);
  ctx.bezierCurveTo(x, y + 1.528 * r2, x, y + 1.528 * r2, x, y + 1.528 * r2);
  ctx.lineTo(x, y + 1.528 * r2);
  ctx.bezierCurveTo(x, y + 0.684 * r2, x + 0.684 * r2, y, x + width / 2, y);
  ctx.bezierCurveTo(x + width / 2, y, x + width / 2, y, x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
}

function addCustomRoundedRect3b(ctx, x, y, width, height, r, r2) {
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.bezierCurveTo(
    x + width - 1.528 * r2,
    y,
    x + width - 1.528 * r2,
    y,
    x + width - 1.528 * r2,
    y
  );
  ctx.lineTo(x + width - 1.528 * r2, y);
  ctx.bezierCurveTo(
    x + width - 0.684 * r2,
    y,
    x + width,
    y + 0.684 * r2,
    x + width,
    y + height / 2
  );
  ctx.bezierCurveTo(
    x + width,
    y + height / 2,
    x + width,
    y + height / 2,
    x + width,
    y + height / 2
  );
  ctx.bezierCurveTo(
    x + width,
    y + height / 2,
    x + width,
    y + height / 2,
    x + width,
    y + height / 2
  );
  ctx.lineTo(x + width, y + height / 2);
  ctx.bezierCurveTo(
    x + width,
    y + height / 2,
    x + width,
    y + height / 2,
    x + width,
    y + height / 2
  );
  ctx.lineTo(x + width, y + height / 2);
  ctx.bezierCurveTo(
    x + width,
    y + height - 0.684 * r2,
    x + width - 0.684 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height
  );
  ctx.bezierCurveTo(
    x + width - 1.528 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height
  );
  ctx.bezierCurveTo(
    x + width - 1.528 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height,
    x + width - 1.528 * r2,
    y + height
  );
  ctx.lineTo(x + width / 2, y + height);
  ctx.bezierCurveTo(
    x + 1.528 * r2,
    y + height,
    x + 1.528 * r2,
    y + height,
    x + 1.528 * r2,
    y + height
  );
  ctx.lineTo(x + 1.528 * r2, y + height);
  ctx.bezierCurveTo(
    x + 0.684 * r2,
    y + height,
    x,
    y + height - 0.684 * r2,
    x,
    y + height / 2
  );
  ctx.bezierCurveTo(x, y + height / 2, x, y + height / 2, x, y + height / 2);
  ctx.bezierCurveTo(x, y + height / 2, x, y + height / 2, x, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.bezierCurveTo(x, y + height / 2, x, y + height / 2, x, y + height / 2);
  ctx.lineTo(x, y + height / 2);
  ctx.bezierCurveTo(x, y + 0.684 * r2, x + 0.684 * r2, y, x + 1.528 * r2, y);
  ctx.bezierCurveTo(x + 1.528 * r2, y, x + 1.528 * r2, y, x + 1.528 * r2, y);
  ctx.lineTo(x + width / 2, y);
}

module.exports = (ctx, { x, y, width, height }, cornerRadius) => {
  const limitedCornerRadius = Math.min(
    cornerRadius,
    Math.min(width, height) / 2.0 / 1.528
  );

  const params = [ctx, x, y, width, height, cornerRadius, limitedCornerRadius];
  if (width > 1.528 * 2 * cornerRadius && height > 1.528 * 2 * cornerRadius) {
    addCustomRoundedRect1(...params);
  } else if (width > 1.528 * 2 * cornerRadius) {
    addCustomRoundedRect2a(...params);
  } else if (height > 1.528 * 2 * cornerRadius) {
    addCustomRoundedRect2b(...params);
  } else if (height > width) {
    addCustomRoundedRect3a(...params);
  } else {
    addCustomRoundedRect3b(...params);
  }

  ctx.closePath();
};
