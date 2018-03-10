const { positionForImage } = require("../render/image");
const readImage = require("../imageLoader");
const Base = require("./Base");

module.exports = class Image extends Base {
  constructor(...args) {
    super(...args);
    this.image = null;
  }

  async getHostStyles() {
    const { props, settings } = this;
    const image = await readImage(props.src.testUri, settings.testFilePath);
    this.image = image;
    return {
      width: image.width,
      height: image.height,
      aspectRatio: image.width / image.height
    };
  }

  draw(screenFrame) {
    const clipCtx = this.backend.beginClip();
    clipCtx.rect(
      screenFrame.x,
      screenFrame.y,
      screenFrame.width,
      screenFrame.height
    );
    this.backend.pushClip();

    const position = positionForImage(
      this.image,
      this.frame,
      this.props.resizeMode
    );
    this.backend.drawImage(
      this.image,
      screenFrame.x + position.x,
      screenFrame.y + position.y,
      position.width,
      position.height
    );

    this.backend.popClip();
  }
};
