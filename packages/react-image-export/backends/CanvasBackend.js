const { enumerateLines } = require("./util");

const applyAlpha = (alpha, imageData) => {
  const target = imageData.data;

  for (let i = 0; i < target.length; i += 4) {
    target[i + 3] = Math.round(target[i + 3] * alpha);
  }
};

const mergeDown = (targetData, foregroundData) => {
  const foreground = foregroundData.data;
  const target = targetData.data;

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

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1
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
    this.ctx.restore();
  }

  pushAlpha(alpha) {
    const { ctx, stackingContext, width, height } = this;
    const imageData = ctx.getImageData(0, 0, width, height);
    stackingContext.push({ alpha, imageData });

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  }

  popAlpha() {
    const { ctx, stackingContext, width, height } = this;
    const { alpha, imageData } = stackingContext.pop();
    const appliedImageData = ctx.getImageData(0, 0, width, height);
    applyAlpha(alpha, appliedImageData);
    mergeDown(imageData, appliedImageData);
    ctx.putImageData(imageData, 0, 0);
  }

  beginClip() {
    this.ctx.save();
    this.ctx.beginPath();
    return this.ctx;
  }

  pushClip() {
    this.ctx.clip();
  }

  popClip() {
    this.ctx.restore();
  }

  beginShape() {
    this.ctx.beginPath();
    return this.ctx;
  }

  commitShape({
    fill,
    stroke,
    lineWidth,
    shadowBlur = 0,
    shadowColor = "transparent",
    shadowOffsetX = 0,
    shadowOffsetY = 0
  }) {
    if (shadowColor !== "transparent" && stroke != null) {
      throw new Error("Cannot apply shadow to a shape with a stroke");
    }

    const { ctx } = this;
    if (fill != null) {
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke != null && lineWidth !== 0) {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
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
    this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${JSON.stringify(
      fontFamily
    )}`;
    this.ctx.fillStyle = color;
  }

  fillLines(lines, screenFrame) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;
    const { ctx } = this;

    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    const getStartX = runs => {
      const totalWidth = runs.reduce((x, { body, style }) => {
        this.applyTextStyle(style);
        const { width } = ctx.measureText(body);
        return x + width;
      }, 0);

      const startX =
        screenFrame.x +
        (screenFrame.width - totalWidth) * textAligns[textAlign];
      return startX;
    };

    const renderRun = ({ x, y, body, style }) => {
      this.applyTextStyle(style);
      const { width } = ctx.measureText(body);
      ctx.fillText(body, x, y);
      return x + width;
    };

    // FIXME: This probably doesn't work in non-left layouts with multiple text styles
    enumerateLines(this, lines, renderRun, screenFrame.y, getStartX);
  }

  measureText(text, style) {
    this.applyTextStyle(style);
    const {
      width,
      emHeightAscent = style.fontSize * 0.66,
      emHeightDescent = style.fontSize * 0.33
    } = this.ctx.measureText(text);
    return { width, emHeightAscent, emHeightDescent };
  }

  drawImage(image, x, y, width, height) {
    this.ctx.drawImage(image.image, x, y, width, height);
  }
};
