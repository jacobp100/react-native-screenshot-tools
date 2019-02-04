const React = require("react");

let imageLoader = null;
module.exports.setImageLoader = n => {
  imageLoader = n;
};

module.exports.View = "View";
module.exports.Text = "Text";
module.exports.Image = props => React.createElement("Image", props);
module.exports.Image.resolveAssetSource = source => {
  const absoulteFilePath =
    typeof source === "string" ? source : source.uri;

  const { width, height } =
    source.width != null && source.height != null
      ? source
      : imageLoader.sync(absoulteFilePath, global.snapshotterSettings);

  return { uri: absoulteFilePath, width, height };
};
