const path = require("path");
const glob = require("glob");
const { default: fontkit } = require("fontkit-browserified");
const FontKitBackend = require("./fontKitBackend");
const { keyForStyle, keyForFont } = require("./util");

module.exports = class LocalFontLoader extends FontKitBackend {
  constructor() {
    super();
    this.fonts = {};
  }

  async init() {
    glob
      .sync(path.join(__dirname, "**/*.{otf,ttf}"))
      .forEach(filename => this.addFont(filename));
  }

  async addFont(filename) {
    const font = fontkit.openSync(filename);
    const key = keyForFont(font);

    if (this.fonts[key] != null) {
      throw new Error(`Duplicate definition for font: ${key}`);
    }

    this.fonts[key] = font;
  }

  hasFontForStyle(style) {
    const key = keyForStyle(style);
    const font = this.fonts[key];
    return font != null;
  }

  getLoadedFont(style) {
    const key = keyForStyle(style);
    const font = this.fonts[key];
    if (font == null) {
      throw new Error(`No font defined for ${key}`);
    }
    return font;
  }

  async loadFont(style) {
    this.getLoadedFont(style);
  }
};
