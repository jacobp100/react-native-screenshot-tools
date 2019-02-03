module.exports = ({
  renderBackend,
  fontLoader,
  imageLoader,
  rasterizeText = false
}) => ({
  setUp: (...args) => renderBackend.setUp(...args),
  tearDown: (...args) => renderBackend.tearDown(...args),
  pushTransform: (...args) => renderBackend.pushTransform(...args),
  popTransform: (...args) => renderBackend.popTransform(...args),
  pushAlpha: (...args) => renderBackend.pushAlpha(...args),
  popAlpha: (...args) => renderBackend.popAlpha(...args),
  pushTintColor: (...args) => renderBackend.pushTintColor(...args),
  popTintColor: (...args) => renderBackend.popTintColor(...args),
  beginClip: (...args) => renderBackend.beginClip(...args),
  pushClip: (...args) => renderBackend.pushClip(...args),
  popClip: (...args) => renderBackend.popClip(...args),
  beginShape: (...args) => renderBackend.beginShape(...args),
  commitShape: (...args) => renderBackend.commitShape(...args),
  drawImage: (...args) => renderBackend.drawImage(...args),
  fillLines: (...args) => {
    if (rasterizeText) {
      fontLoader.fillLinesIntoBackend(renderBackend, ...args);
    } else {
      renderBackend.fillLines(...args);
    }
  },
  addFont: (...args) => {
    if (fontLoader != null) fontLoader.addFont(...args);
  },
  loadFont: async (...args) => {
    if (fontLoader != null) await fontLoader.loadFont(...args);
  },
  measureText: (...args) =>
    fontLoader != null
      ? fontLoader.measureText(...args)
      : renderBackend.measureText(...args),
  readImage: (...args) => imageLoader.readImage(...args)
});
