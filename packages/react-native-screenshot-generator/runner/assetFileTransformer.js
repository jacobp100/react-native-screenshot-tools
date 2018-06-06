const createCacheKeyFunction = require("fbjs-scripts/jest/createCacheKeyFunction");

module.exports = {
  // Mocks asset requires to return the filename. Makes it possible to test that
  // the correct images are loaded for components. Essentially
  // require('img1.png') becomes `Object { "absoluteFilePath": 'path/to/img1.png' }` in
  // the Jest snapshot.
  process: (_, filename) =>
    `module.exports = {
      absoluteFilePath: ${JSON.stringify(filename)}
    };`,
  getCacheKey: createCacheKeyFunction([__filename])
};
