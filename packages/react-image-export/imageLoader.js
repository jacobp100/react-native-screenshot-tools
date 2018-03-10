const fs = require("fs");
const { promisify } = require("util");
const { Image } = require("canvas-prebuilt");

module.exports = async src => {
  const imageData = await promisify(fs.readFile)(src);
  const image = new Image();
  image.src = imageData;
  const { width, height } = image;
  return { image, imageData, width, height };
};
