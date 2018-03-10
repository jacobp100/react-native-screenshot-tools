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
    this.backend.drawImage(this.image, screenFrame, this.props.resizeMode);
  }
};
