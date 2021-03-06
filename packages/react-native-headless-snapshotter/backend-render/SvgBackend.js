/* eslint-disable class-methods-use-this */
const cheerio = require("cheerio");
const { path } = require("d3-path");
const chroma = require("chroma-js");
const { enumerateLines, textAligns } = require("./util");

const textAnchors = {
  left: "start",
  center: "middle",
  right: "end"
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

    this.ctx = null;

    this.$container = this.$("svg");
    this.defId = 0;
  }

  setUp() {}

  tearDown() {}

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

  pushTintColor(tintColor) {
    const filter = this.generateId();
    const $filter = this.$("<filter />").attr("id", filter);
    this.$("<feFlood />")
      .attr("flood-color", tintColor)
      .attr("result", "flood")
      .appendTo($filter);
    this.$("<feComposite />")
      .attr("in", "flood")
      .attr("in2", "SourceGraphic")
      .attr("operator", "in")
      .attr("result", "comp")
      .appendTo($filter);
    $filter.appendTo("defs");

    const $group = this.$("<g />").attr("filter", `url(#${filter})`);
    this.pushGroup($group);
  }

  popTintColor() {
    this.popGroup();
  }

  pushCompositeOperation(compositeMode) {
    const $group = this.$("<g />").attr("composite-mode", compositeMode);
    this.pushGroup($group);
  }

  popCompositeOperation() {
    this.popGroup();
  }

  beginClip() {
    this.ctx = path();
    return this.ctx;
  }

  pushClip() {
    const clipPath = this.generateId();
    const $clipPath = this.$("<clipPath />").attr("id", clipPath);
    this.$("<path />")
      .attr("d", String(this.ctx))
      .appendTo($clipPath);
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
    lineDash = [],
    lineCap = "butt",
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
        .attr("stroke-dasharray", lineDash.join(", "))
        .attr("stroke-linecap", lineCap)
        .attr("filter", filter != null ? `url(#${filter})` : null);
      this.$container.append($path);
    }
    this.ctx = null;
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
        .attr("font-family", "Helvetica Neue")
        // .attr("font-family", style.fontFamily)
        .attr("font-size", `${style.fontSize}px`)
        .attr("font-weight", style.fontWeight)
        .attr("font-style", style.fontStyle)
        .attr("letter-spacing", `${style.letterSpacing}px`)
        .attr(
          "font-variant",
          style.fontVariant.includes("small-caps") ? "small-caps" : null
        )
        .attr("text-decoration", style.textDecoration)
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

  measureText() {
    throw new Error(
      "The SVG backend cannot measure text on its own. " +
        "You'll need to add a font loader to your setup"
    );
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
