/* global Image */

/* eslint-disable class-methods-use-this */
module.exports = class BrowserBackend {
  readImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const { width, height } = image;
        const imageData = ""; // TODO
        resolve({ image, imageData, width, height });
      };
      image.onerror = () => reject();
      image.src = src;
    });
  }
};
