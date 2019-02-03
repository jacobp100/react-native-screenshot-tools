const fontkit = require("fontkit-browserified");
const FontKitBackend = require("./fontKitBackend");
const { keyForStyle, keyForFont } = require("./util");

const titleCase = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

module.exports = class FetchFontLoader extends FontKitBackend {
  constructor(fetch = global.fetch) {
    super();
    this.fetch = fetch;
    this.customFonts = {};
    this.googleFonts = {};
  }

  // eslint-disable-next-line
  async init() {}

  async downloadFont(src) {
    const response = await this.fetch(src);
    const buffer = await response.arrayBuffer();
    const font = fontkit.create(buffer);
    return font;
  }

  async addFont(src) {
    const font = await this.downloadFont(src);
    const key = keyForFont(font);

    if (this.customFonts[key] != null) {
      throw new Error(`Duplicate definition for font: ${key}`);
    }

    this.customFonts[key] = font;
  }

  hasFontForStyle(style) {
    const key = keyForStyle(style);
    if (this.customFonts[key]) return true;
    if (this.googleFonts[key]) return true;
    return false;
  }

  getLoadedFont(style) {
    const key = keyForStyle(style);

    if (this.customFonts[key]) return this.customFonts[key];
    if (this.googleFonts[key]) return this.googleFonts[key];
    throw new Error(`No font defined for ${key}`);
  }

  async loadFont(style) {
    const key = keyForStyle(style);

    if (this.customFonts[key]) return;
    if (this.googleFonts[key]) return;

    // TODO: Handle variants, use somebody else's url
    const src = `https://code.thisarmy.com/fontsinfo/woffs/${style.familyName
      .split(/s+/)
      .map(titleCase)
      .join("")}`;
    const font = await this.loadFont(src);
    this.googleFonts[key] = font;
  }
};
