const Base = require("./Base");
const { positionForImage } = require("../render/image");
const {
  drawBackground,
  drawBorders,
  clip
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

    if (source == null) return null;

    const filePath =
      typeof source === "string" ? source : source.absoluteFilePath;
    const image = await this.backend.readImage(filePath, settings);
    this.image = image;
    return { width: image.width, height: image.height };
  }

  draw(screenFrame) {
    const { backend, settings, props, style, image } = this;

    // Draw borders & background?
    if (image == null) return;

    const { resizeMode = style.resizeMode } = props;
    const { tintColor } = style;

    drawBackground(backend, screenFrame, settings, style);

    const clipCtx = backend.beginClip();
    clip(clipCtx, screenFrame, settings, style);
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
