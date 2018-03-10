const { enumerateLines } = require("./util");

const applyAlpha = (alpha, imageData) => {
  const target = imageData.data;

  for (let i = 0; i < target.length; i += 4) {
    target[i + 3] *= alpha;
  }
};

const mergeDown = (targetData, foregroundData) => {
  const foreground = targetData.data;
  const target = foregroundData.data;

  for (let i = 0; i < target.length; i += 4) {
    const a0 = foreground[i + 3] / 255;
    const a1 = target[i + 3] / 255;
    const a01 = a0 + (1 - a0) * a1;

    for (let c = 0; c < 3; c += 1) {
      const c0 = foreground[i + c] / 255;
      const c1 = target[i + c] / 255;
      target[i + c] = Math.round(255 * ((1 - a0) * a1 * c1 + a0 * c0) / a01);
    }
    target[i + 3] = Math.round(255 * a01);
  }
};

module.exports = class CanvasBackend {
  constructor(ctx, { width, height }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.stackingContext = [];
  }

  pushTransform(m, { x, y, width, height }) {
    const tx = x + width / 2;
    const ty = y + height / 2;
    const { ctx } = this;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.transform(...m);
    ctx.translate(-tx, -ty);
  }

  popTransform() {
    const { ctx } = this;
    ctx.restore();
  }

  pushAlpha(alpha) {
    const { ctx, stack, width, height } = this;
    const imageData = ctx.getImageData(0, 0, width, height);
    stack.push({ alpha, imageData });
    ctx.clearRect(0, 0, width, height);
  }

  popAlpha() {
    const { ctx, stack, width, height } = this;
    const { alpha, imageData } = stack.pop();
    const appliedImageData = ctx.getImageData(0, 0, width, height);
    applyAlpha(alpha, appliedImageData);
    mergeDown(imageData, appliedImageData);
    ctx.putImageData(imageData, 0, 0);
  }

  beginClip() {
    this.save();
    return this.ctx;
  }

  pushClip() {
    this.ctx.clip();
  }

  popClip() {
    this.restore();
  }

  beginShape() {
    this.ctx.beginPath();
    return this.ctx;
  }

  commitShape({ fill, stroke, lineWidth }) {
    const { ctx } = this;
    if (fill != null) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke != null) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  applyTextStyle({
    fontFamily = "Helvetica",
    fontWeight = "normal",
    fontStyle = "normal",
    fontSize = 12,
    color = "black"
  }) {
    this.ctx.font = `${fontSize}px ${fontWeight} ${fontStyle} ${JSON.stringify(
      fontFamily
    )}`;
    this.ctx.fillStyle = color;
  }

  fillLines(lines, frame) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;
    const { ctx } = this;

    ctx.textBaseline = "top";
    ctx.textAlign = textAlign;

    enumerateLines(lines, ({ x, y, body, style }) => {
      this.applyTextStyle(style);
      const textWidth = ctx.measureText(body);
      ctx.fillText(body, frame.x + x, frame.y + y);
      return x + textWidth;
    });
  }

  measureText(text, style) {
    this.applyTextStyle(style);
    return this.ctx.measureText(text);
  }
};
