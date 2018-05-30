const readImage = require("../imageLoader");
const Base = require("./Base");
const { positionForImage } = require("../render/image");
const {
  drawBackground,
  drawBorders,
  clipInside
} = require("../render/viewBackground");

module.exports = class Image extends Base {
  constructor(...args) {
    super(...args);
    this.image = null;
  }

  async getHostStyles() {
    const { props, settings } = this;
    const image = await readImage(props.source.testUri, settings.testFilePath);
    this.image = image;
    return { width: image.width, height: image.height };
  }

  draw(screenFrame) {
    const { backend, settings, props, style, image } = this;
    const { resizeMode = style.resizeMode } = props;
    const { tintColor } = style;

    drawBackground(backend, screenFrame, settings, style);

    const clipCtx = backend.beginClip();
    clipInside(clipCtx, screenFrame, settings, style);
    backend.pushClip();

    if (tintColor != null) backend.pushTintColor(tintColor);

    const { x, y, width, height } = positionForImage(
      image,
      screenFrame,
      resizeMode
    );
    backend.drawImage(image, x, y, width, height, tintColor);

    if (tintColor != null) backend.popTintColor();

    backend.popClip();

    drawBorders(backend, screenFrame, settings, style);
  }
};
