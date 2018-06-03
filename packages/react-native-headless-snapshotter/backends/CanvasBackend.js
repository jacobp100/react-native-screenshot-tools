const chroma = require("chroma-js");
const { enumerateLines } = require("./util");

const applyAlpha = alpha => imageData => {
  const target = imageData.data;

  for (let i = 0; i < target.length; i += 4) {
    target[i + 3] = Math.round(target[i + 3] * alpha);
  }
};

const setColor = (r, g, b) => imageData => {
  const target = imageData.data;

  for (let i = 0; i < target.length; i += 4) {
    target[i + 0] = r;
    target[i + 1] = g;
    target[i + 2] = b;
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
      target[i + c] = Math.round((255 * ((1 - a0) * a1 * c1 + a0 * c0)) / a01);
    }
    target[i + 3] = Math.round(255 * a01);
  }
};

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1
};

const borderStyles = {
  solid: [],
  dotted: [1, 2],
  dashed: [4, 5]
};

const drawLineDecoration = (ctx, x, y, width, textDecoration) => {
  if (textDecoration.includes("underline")) {
    const y0 = y + 2.5;
    ctx.moveTo(x, y0);
    ctx.lineTo(x + width, y0);
  }
  if (textDecoration.includes("line-through")) {
    const y0 =
      y - Math.round(ctx.measureText("x").actualBoundingBoxAscent / 2) + 0.5;
    ctx.moveTo(x, y0);
    ctx.lineTo(x + width, y0);
  }
};

module.exports = class CanvasBackend {
  constructor(canvas, { dpi }) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.dpi = dpi;
    this.stackingContext = [];
    this.alphas = [];
    this.tintColors = [];
    this.compositeOperations = ["source-over"];

    this.prepare();
  }

  prepare() {
    this.ctx.save();
    this.ctx.scale(this.dpi, this.dpi);
  }

  tearDown() {
    this.ctx.restore();
  }

  pushStackingContext() {
    const { ctx, stackingContext, width, height } = this;
    const imageData = ctx.getImageData(0, 0, width, height);
    stackingContext.push(imageData);

    // Clear canvas with transparent black
    this.ctx.putImageData(this.ctx.createImageData(width, height), 0, 0);
  }

  popStackingContext(appliedImageData) {
    const { ctx, stackingContext } = this;
    const imageData = stackingContext.pop();
    mergeDown(imageData, appliedImageData);
    ctx.putImageData(imageData, 0, 0);
  }

  transformPixels(transform) {
    const { ctx, width, height } = this;
    const appliedImageData = ctx.getImageData(0, 0, width, height);
    transform(appliedImageData);
    return appliedImageData;
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
    this.pushStackingContext();
    this.alphas.push(alpha);
  }

  popAlpha() {
    const alpha = this.alphas.pop();
    this.popStackingContext(this.transformPixels(applyAlpha(alpha)));
  }

  pushTintColor(tintColor) {
    this.pushStackingContext();
    const [r, g, b] = chroma(tintColor).rgb();
    this.tintColors.push([r, g, b]);
  }

  popTintColor() {
    const [r, g, b] = this.tintColors.pop();
    this.popStackingContext(this.transformPixels(setColor(r, g, b)));
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
    lineDash = [],
    lineCap = "butt",
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
      ctx.setLineDash(lineDash);
      ctx.lineCap = lineCap;
      ctx.stroke();
    }
  }

  applyTextStyle({
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize,
    color,
    fontVariant
  }) {
    // We can only do small caps (and this doesn't work in node-canvas 😞)
    const variant = fontVariant.includes("small-caps") ? "small-caps" : "";
    this.ctx.font = `${fontStyle} ${variant} ${fontWeight} ${fontSize}px ${JSON.stringify(
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

      let width;
      if (style.letterSpacing === 0) {
        ctx.fillText(body, x, y);
        ({ width } = ctx.measureText(body));
      } else {
        width = Array.from(body).reduce((offsetX, char, i, text) => {
          const prevChar = i > 0 ? text[i - 1] : null;
          const { width: charWidth } = ctx.measureText(char);
          const kerning =
            prevChar != null
              ? 0
              : ctx.measureText(char + prevChar).width -
                charWidth -
                ctx.measureText(prevChar).width;
          const currentX =
            offsetX + kerning + (prevChar != null ? style.letterSpacing : 0);
          ctx.fillText(char, currentX, y);
          return currentX + charWidth;
        }, x);
      }

      if (style.textDecoration !== "none") {
        ctx.beginPath();
        ctx.strokeStyle = style.textDecorationColor;
        ctx.strokeWidth = 1;
        if (style.textDecorationStyle === "double") {
          drawLineDecoration(ctx, x, y, width, style.textDecoration);
          drawLineDecoration(ctx, x, y + 2, width, style.textDecoration);
          ctx.setLineDash(borderStyles.solid);
        } else {
          drawLineDecoration(ctx, x, y, width, style.textDecoration);
          ctx.setLineDash(borderStyles[style.textDecorationStyle]);
        }
        ctx.stroke();
      }

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
    return {
      width: width + style.letterSpacing * text.length,
      emHeightAscent,
      emHeightDescent
    };
  }

  drawImage(image, x, y, width, height) {
    this.ctx.drawImage(image.image, x, y, width, height);
  }
};
