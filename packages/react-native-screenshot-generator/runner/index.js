const jest = require("jest-cli");

module.exports = (settings, done) => {
  const config = {
    preset: "react-native",
    haste: {
      defaultPlatform: settings.platform,
      platforms: ["android", "ios", "native"],
      providesModuleNodeModules: ["react-native"]
    },
    transform: {
      "^.+\\.js$": require.resolve("babel-jest"),
      "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$": require.resolve(
        "./assetFileTransformer.js"
      )
    },
    testMatch: ["**/__snapshotter__/**/*.js?(x)", "**/?(*.)+(snap).js?(x)"],
    testRunner: require.resolve("./testRunner"),
    reporters: [require.resolve("./dummyReporter")],
    testEnvironmentOptions: settings
  };

  jest
    .runCLI(
      {
        config: JSON.stringify(config),
        runInBand: true
      },
      [process.cwd()]
    )
    .then(results => done(results));
};
