const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { Image } = require("canvas-prebuilt");

const getResolutionSpecificFilename = async (src, settings) => {
  const defaultValue = { src, scale: 1 };
  if (!Number.isFinite(settings.dpi) || settings.dpi === 1) return defaultValue;

  const ext = path.extname(src);
  const resolutionSpecificFilename = `${src.slice(0, -ext.length)}@${
    settings.dpi
  }x${ext}`;
  try {
    await promisify(fs.access)(resolutionSpecificFilename, fs.constants.F_OK);
    return { src: resolutionSpecificFilename, scale: settings.dpi };
  } catch (e) {
    return defaultValue;
  }
};

module.exports = async (imageFilePath, settings) => {
  const { src, scale } = await getResolutionSpecificFilename(
    imageFilePath,
    settings
  );
  const imageData = await promisify(fs.readFile)(src);
  const image = new Image();
  image.src = imageData;
  const { width, height } = image;
  return { image, imageData, width: width / scale, height: height / scale };
};
