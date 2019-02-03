const createRenderer = require("./reconciler");

const defaultSettings = {
  width: 500,
  height: 500,
  dpi: 2,
  systemFont: "Open Sans"
};

module.exports = async (backend, jsx, settings) => {
  const instance = createRenderer(jsx, backend, {
    ...defaultSettings,
    ...settings
  });

  await instance.root.layout();

  backend.setUp();
  await instance.root.render();
  backend.tearDown();

  instance.unmount();

  return backend;
};
