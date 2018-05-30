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

  const x = layout.x + (layout.width - width) / 2;
  const y = layout.y + (layout.height - height) / 2;

  return { x, y, width, height };
};
