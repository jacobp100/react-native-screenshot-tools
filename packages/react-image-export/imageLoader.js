const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { Image } = require("canvas-prebuilt");

module.exports = async src => {
  const imageData = await promisify(fs.readFile)(src);
  const img = new Image();
  img.src = imageData;
  const { width, height } = img;
  return { imageData, width, height };
};
