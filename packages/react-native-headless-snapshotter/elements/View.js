const chroma = require("chroma-js");
const Base = require("./Base");
const { drawBackground, drawBorders } = require("../render/viewBackground");

module.exports = class View extends Base {
  normalizeStyle(style, props) {
    if (this.settings.platform === "android") {
      const { elevation = 0 } = style;
      const shadow = props.forceDrawShadow
        ? null
        : {
            shadowRadius: elevation,
            shadowOffset: { width: 0, height: elevation },
            shadowColor: "black",
            shadowOpacity: 0.38
          };
      const zIndex = elevation in style ? { zIndex: elevation } : null;
      return { ...style, ...shadow, ...zIndex };
    }
    return style;
  }

  draw(screenFrame) {
    const { backend, settings, style } = this;

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
