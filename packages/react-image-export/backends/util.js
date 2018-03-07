const { lineFontSize, lineHeight } = require("../layout/textLayout");

module.exports.enumerateLines = (lines, callback) => {
  lines.reduce((top, line) => {
    const { text, attributedStyles } = line;
    const y = top + (lineHeight(line) - lineFontSize(line)) / 2;

    attributedStyles.reduce((x, { start, end, style }, i) => {
      const body =
        i === attributedStyles.length - 1
          ? text.slice(start, end).replace(/\s*$/, "")
          : text.slice(start, end);
      return callback({ x, y, body, style, i });
    }, 0);

    return top + lineHeight(line);
  }, 0);
};

module.exports.positionForImage = (image, layout, resizeMode = "contain") => {
  const widthScale = layout.width / image.width;
  const heightScale = layout.height / image.height;

  const scales = {
    cover: Math.max(widthScale, heightScale),
    contain: Math.min(widthScale, heightScale),
    repeat: 1,
    center: 1
  };

  const width =
    image.width * (resizeMode !== "stretch" ? scales[resizeMode] : widthScale);
  const height =
    image.height *
    (resizeMode !== "stretch" ? scales[resizeMode] : heightScale);

  const x = (layout.width - width) / 2;
  const y = (layout.height - height) / 2;

  return { x, y, width, height };
};
