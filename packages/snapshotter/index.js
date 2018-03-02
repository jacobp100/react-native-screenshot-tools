const jest = require("jest");

jest.run([
  "--preset",
  "react-native",
  "--testMatch",
  "**/__snapshotter__/**/*.js",
  "--testRunner",
  require.resolve("./testRunner"),
  "--reporters",
  require.resolve("./reporter")
]);
