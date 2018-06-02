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

  normalizeStyle(style) {
    if (this.settings.platform === "ios") {
      return { ...style, overlayColor: "transparent" };
    }
    return style;
  }

  async getHostStyles() {
    const {
      props: { source },
      settings
    } = this;
    let image;
    if (source.absoluteFilePath) {
      image = await readImage(source.absoluteFilePath, settings.testFilePath);
    } else {
      // FIXME: Network requests
      throw new Error("Unhandled image source");
    }
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
