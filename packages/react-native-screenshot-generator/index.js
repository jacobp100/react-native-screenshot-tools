const jest = require("jest");

const devices = [
  {
    name: "1x-test",
    width: 320,
    height: 568,
    dpi: 1,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "iPhone-SE",
    width: 320,
    height: 568,
    dpi: 2,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "iPhone-6",
    width: 375,
    height: 667,
    dpi: 2,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "iPhone-6-Plus",
    width: 375,
    height: 667,
    dpi: 3,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "iPhone-7-Plus",
    width: 414,
    height: 736,
    dpi: 3,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "iPhone-X",
    width: 375,
    height: 812,
    dpi: 3,
    systemFont: "San Francisco",
    platform: "ios"
  },
  {
    name: "Some-Android-Phone",
    width: 320,
    height: 568,
    dpi: 2,
    systemFont: "Roboto",
    platform: "android"
  }
];

/* eslint-disable no-console */
devices
  .reduce(async (p, settings) => {
    await p;

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
      testMatch: ["**/__snapshotter__/**/*.js"],
      testRunner: require.resolve("./testRunner"),
      reporters: [require.resolve("./reporter")],
      testEnvironmentOptions: settings
    };

    return jest.run(["--config", JSON.stringify(config)]);
  }, Promise.resolve())
  .catch(e => console.error(e));
