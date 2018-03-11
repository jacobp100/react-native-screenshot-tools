/* eslint-disable class-methods-use-this */
const cheerio = require("cheerio");
const { path } = require("d3-path");
const chroma = require("chroma-js");
const { fontForStyle } = require("../fontLoader");
const { enumerateLines } = require("./util");

const textAnchors = {
  left: "start",
  center: "middle",
  right: "end"
};

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1
};

module.exports = class SvgBackend {
  constructor({ width, height }) {
    this.$ = cheerio.load(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
      ><defs /></svg>`,
      { xmlMode: true }
    );
    this.$("svg")
      .attr("width", width)
      .attr("height", height);

    this.$container = this.$("svg");
    this.defId = 0;
  }

  toString() {
    return this.$.xml();
  }

  generateId() {
    const id = this.defId;
    this.defId += 1;
    return id;
  }

  pushGroup($group) {
    this.$container.append($group);
    this.$container = $group;
  }

  popGroup() {
    this.$container = this.$container.parent();
  }

  pushTransform(m, { x, y, width, height }) {
    const tx = x + width / 2;
    const ty = y + height / 2;
    const matrix = m.join(", ");
    const $group = this.$("<g />").attr(
      "transform",
      `translate(${tx}, ${ty}) matrix(${matrix}) translate(${-tx}, ${-ty})`
    );
    this.pushGroup($group);
  }

  popTransform() {
    this.popGroup();
  }

  pushAlpha(alpha) {
    const $group = this.$("<g />").attr("opacity", alpha);
    this.pushGroup($group);
  }

  popAlpha() {
    this.popGroup();
  }

  beginClip() {
    this.ctx = path();
    return this.ctx;
  }

  pushClip() {
    const clipPath = this.generateId();
    const $clipPath = this.$("<clipPath />").attr("id", clipPath);
    const $clipBody = this.$("<path />").attr("d", String(this.ctx));
    $clipBody.appendTo($clipPath);
    $clipPath.appendTo("defs");

    const $group = this.$("<g />").attr("clip-path", `url(#${clipPath})`);
    this.pushGroup($group);

    this.ctx = null;
  }

  popClip() {
    this.popGroup();
  }

  beginShape() {
    this.ctx = path();
    return this.ctx;
  }

  commitShape({
    fill = "none",
    stroke = "none",
    lineWidth = 0,
    shadowColor = "black",
    shadowBlur = 0,
    shadowOffsetX = 0,
    shadowOffsetY = 0
  }) {
    let filter = null;
    if (shadowBlur !== 0 || shadowOffsetX !== 0 || shadowOffsetY !== 0) {
      const color = chroma(shadowColor);
      filter = this.generateId();

      const pad = 100;
      const $filter = this.$("<filter />")
        .attr("id", filter)
        .attr("x", `${-pad}%`)
        .attr("y", `${-pad}%`)
        .attr("width", `${100 + 2 * pad}%`)
        .attr("height", `${100 + 2 * pad}%`);
      this.$("<feGaussianBlur />")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", shadowBlur)
        .appendTo($filter);
      this.$("<feOffset />")
        .attr("dx", shadowOffsetX)
        .attr("dy", shadowOffsetY)
        .attr("result", "onBlur")
        .appendTo($filter);
      this.$("<feFlood />")
        .attr("flood-color", color.hex())
        .attr("flood-opacity", color.alpha())
        .appendTo($filter);
      this.$("<feComposite />")
        .attr("in2", "onBlur")
        .attr("operator", "in")
        .appendTo($filter);
      const $merge = this.$("<feMerge />");
      this.$("<feMergeNode />").appendTo($merge);
      this.$("<feMergeNode />")
        .attr("in", "SourceGraphic")
        .appendTo($merge);
      $merge.appendTo($filter);
      $filter.appendTo("defs");
    }

    if (fill !== "none" || !(stroke === "none" || lineWidth === 0)) {
      const $path = this.$(`<path />`)
        .attr("d", String(this.ctx))
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", lineWidth)
        .attr("filter", filter != null ? `url(#${filter})` : null);
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

  fillLines(lines, screenFrame) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;

    const $text = this.$(`<text />`).attr(
      "text-anchor",
      textAnchors[textAlign]
    );

    const renderRun = ({ x, y, body, style, i }) => {
      const $tspan = this.$("<tspan/>")
        .attr("x", i === 0 ? x : null)
        .attr("y", i === 0 ? y : null)
        .attr("fill", style.color)
        .text(body);
      $text.append($tspan);
      return x; // Don't advance x
    };

    enumerateLines(
      this,
      lines,
      renderRun,
      screenFrame.y,
      screenFrame.x + screenFrame.width * textAligns[textAlign]
    );

    this.$container.append($text);
  }

  measureText(text, style) {
    const font = fontForStyle(style);
    const scale = style.fontSize / font.unitsPerEm;
    return {
      width: font.layout(text).advanceWidth * scale,
      emHeightAscent: font.ascent * scale,
      emHeightDescent: font.descent * scale
    };
  }

  drawImage(image, x, y, width, height) {
    const $image = this.$("<image />")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height)
      .attr(
        "xlink:href",
        `data:image/png;base64,${image.imageData.toString("base64")}`
      );
    this.$container.append($image);
  }
};
