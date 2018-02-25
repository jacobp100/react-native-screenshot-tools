const { enumerateLines } = require("./util");

module.exports = class CanvasBackend {
  constructor(ctx) {
    this.ctx = ctx;
  }

  // eslint-disable-next-line
  setDimensions() {}

  pushTransform(transform, { top, left, width, height }) {
    const x = left + width / 2;
    const y = top + height / 2;
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(1);
    ctx.translate(-x, -y);
  }

  popTransform() {
    const { ctx } = this;
    ctx.restore();
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

  fillLines(lines, { top, left }) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;
    const { ctx } = this;

    ctx.textBaseline = "top";
    ctx.textAlign = textAlign;

    enumerateLines(lines, ({ x, y, body, style }) => {
      this.applyTextStyle(style);
      const textWidth = ctx.measureText(body);
      ctx.fillText(body, left + x, top + y);
      return x + textWidth;
    });
  }

  measureText(text, style) {
    this.applyTextStyle(style);
    return this.ctx.measureText(text);
  }
};
