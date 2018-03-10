const Base = require("./Base");
const renderViewBackground = require("../render/viewBackground");

module.exports = class View extends Base {
  draw(screenFrame) {
    const { backend, settings, props, style } = this;
    const drawShadow =
      settings.platform === "ios" || props.forceDrawShadow === true;
    renderViewBackground(backend, screenFrame, settings, style, drawShadow);
  }
};
