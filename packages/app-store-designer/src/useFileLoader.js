import React from "react";

export default ({ onFileLoaded }) => {
  const [filesLoading, setFilesLoading] = React.useState();

  const loadFile = file => {
    setFilesLoading(s => s + 1);
    let didResolve = false;
    const image = new Image();
    const uri = URL.createObjectURL(file);
    image.onload = () => {
      if (!didResolve) {
        didResolve = true;
        setFilesLoading(s => s - 1);
        const { name, width, height } = image;
        onFileLoaded({ uri, name, width, height });
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

  const loadFiles = files => {
    for (let i = 0; i < files.length; i += 1) {
      loadFile(files[i]);
    }
  };

  return { filesLoading, loadFiles };
};
