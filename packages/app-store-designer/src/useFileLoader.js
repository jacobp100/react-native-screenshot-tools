import React from "react";

export default ({ onImage, onConfig }) => {
  const [filesLoading, setFilesLoading] = React.useState(0);

  const loadImage = file => {
    setFilesLoading(s => s + 1);
    let didResolve = false;
    const image = new Image();
    const { name } = file;
    const uri = URL.createObjectURL(file);
    image.onload = () => {
      if (!didResolve) {
        didResolve = true;
        setFilesLoading(s => s - 1);
        const { width, height } = image;
        onImage({ uri, name, width, height });
      }
    };
    image.error = () => {
      if (!didResolve) {
        didResolve = true;
        setFilesLoading(s => s - 1);
      }
    };
    image.src = uri;
  };

  const loadConfig = file => {
    const reader = new FileReader();

    // This fires after the blob has been read/loaded.
    reader.addEventListener("loadend", e => {
      const text = e.srcElement.result;
      const config = JSON.parse(text);
      onConfig(config);
    });

    // Start reading the blob as text.
    reader.readAsText(file);
  };

  const loadFile = file => {
    const match = file.name.match(/\.(\w+)$/);
    const extension = match != null ? match[1] : null;
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        loadImage(file);
        break;
      case "json":
        loadConfig(file);
        break;
      default:
        break;
    }
  };

  const loadFiles = files => {
    for (let i = 0; i < files.length; i += 1) {
      loadFile(files[i]);
    }
  };

  return { filesLoading, loadFiles };
};
