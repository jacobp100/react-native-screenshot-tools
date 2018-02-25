/* eslint-disable class-methods-use-this */
const cheerio = require("cheerio");
const { path } = require("d3-path");
const format = require("xml-formatter");
const { fontForStyle } = require("../fontLoader");
const { enumerateLines } = require("./util");

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1
};

const textAnchors = {
  left: "start",
  center: "middle",
  right: "end"
};

module.exports = class SvgBackend {
  constructor() {
    this.$ = cheerio.load(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
      ></svg>`,
      { xmlMode: true }
    );
    this.$container = this.$("svg");
  }

  toString() {
    return format(this.$.xml());
  }

  pushTransform(transform, { top, left, width, height }) {
    const angle = parseInt(transform[0].rotate, 10);
    const x = left + width / 2;
    const y = top + height / 2;
    const $container = this.$("<g />").attr(
      "transform",
      `translate(${x}, ${y}) rotate(${angle}) translate(${-x}, ${-y})`
    );
    this.$container.append($container);
    this.$container = $container;
  }

  popTransform() {
    this.$container = this.$container.parent();
  }

  setDimensions({ width, height }) {
    this.$("svg")
      .attr("width", width)
      .attr("height", height);
  }

  beginShape() {
    this.ctx = path();
    return this.ctx;
  }

  commitShape({ fill = "none", stroke = "none", lineWidth = 0 }) {
    if (fill !== "none" || !(stroke === "none" || lineWidth === 0)) {
      const $path = this.$(`<path />`)
        .attr("d", String(this.ctx))
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", lineWidth);
      this.$container.append($path);
    }
    this.ctx = null;
  }

  lineBaseline(line) {
    line.attributedStyles
      .map(({ style }) => {
        const font = fontForStyle(style);
        return font.ascent / font.unitsPerEm * style.fontSize;
      })
      .reduce(Math.max, 0);
  }

  fillLines(lines, { top, left, width }) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;
    const originX = left + width * textAligns[textAlign];
    const originY = top;

    const $text = this.$(`<text />`).attr(
      "text-anchor",
      textAnchors[textAlign]
    );

    enumerateLines(lines, ({ y, body, style, i }) => {
      const font = fontForStyle(style);
      const baselineShift = font.ascent / font.unitsPerEm * style.fontSize;

      const $tspan = this.$("<tspan/>")
        .attr("x", i === 0 ? originX : null)
        .attr("y", i === 0 ? originY + y + baselineShift : null)
        .attr("fill", style.color)
        .text(body);
      $text.append($tspan);
    });

    this.$container.append($text);
  }

  measureText(text, style) {
    const font = fontForStyle(style);
    return font.layout(text).advanceWidth / font.unitsPerEm * style.fontSize;
  }
};
