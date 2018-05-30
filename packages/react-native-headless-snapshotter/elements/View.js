const chroma = require("chroma-js");
const Base = require("./Base");
const { drawBackground, drawBorders } = require("../render/viewBackground");

module.exports = class View extends Base {
  draw(screenFrame) {
    const { backend, settings, props, style } = this;
    const drawShadow =
      settings.platform === "ios" || props.forceDrawShadow === true;

    const {
      shadowColor = "black",
      shadowOpacity = 0,
      shadowRadius = 0,
      shadowOffset = { width: 0, height: 0 }
    } = style;

    const [r, g, b, a] = chroma(shadowColor)
      .alpha(shadowOpacity)
      .rgba();

    const hasShadow =
      drawShadow &&
      a !== 0 &&
      (shadowRadius !== 0 ||
        shadowOffset.width !== 0 ||
        shadowOffset.height !== 0);

    const shadowParams = hasShadow
      ? {
          shadowBlur: shadowRadius,
          shadowOffsetX: shadowOffset.width,
          shadowOffsetY: shadowOffset.height,
          shadowColor: `rgba(${r}, ${g}, ${b}, ${a})`
        }
      : null;

    drawBackground(backend, screenFrame, settings, style, shadowParams);
    drawBorders(backend, screenFrame, settings, style);
  }
};
