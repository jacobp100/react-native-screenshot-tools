const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { Image } = require("canvas-prebuilt");

const getResolutionSpecificDescriptor = (src, settings) => {
  const defaultValue = { src, scale: 1 };
  if (!Number.isFinite(settings.dpi) || settings.dpi === 1) return defaultValue;

  const ext = path.extname(src);
  const resolutionSpecificFilename = `${src.slice(0, -ext.length)}@${
    settings.dpi
  }x${ext}`;
  return { src: resolutionSpecificFilename, scale: settings.dpi };
};

const getResolutionSpecificFilename = async (src, settings) => {
  const value = getResolutionSpecificDescriptor(src, settings);
  try {
    await promisify(fs.access)(value.src, fs.constants.F_OK);
    return value;
  } catch (e) {
    return { src, scale: 1 };
  }
};

const getResolutionSpecificFilenameSync = (src, settings) => {
  const value = getResolutionSpecificDescriptor(src, settings);
  return fs.existsSync(value.src) ? value : { src, scale: 1 };
};

const imageOf = (imageData, scale = 1) => {
  const image = new Image();
  image.src = imageData;
  const { width, height } = image;
  return { image, imageData, width: width / scale, height: height / scale };
};

/* eslint-disable class-methods-use-this */
module.exports = class NodeCanvasBackend {
  async readImage(imageFilePath, settings) {
    const { src, scale } = await getResolutionSpecificFilename(
      imageFilePath,
      settings
    );
    const imageData = await promisify(fs.readFile)(src);
    return imageOf(imageData, scale);
  }

  readImageSync(imageFilePath, settings) {
    const { src, scale } = getResolutionSpecificFilenameSync(
      imageFilePath,
      settings
    );
    const imageData = fs.readFileSync(src);
    return imageOf(imageData, scale);
  }
};
