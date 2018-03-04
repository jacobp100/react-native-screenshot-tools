const jest = require("jest");

const devices = [
  {
    name: "1x-test",
    width: 320,
    height: 568,
    dpi: 1
  },
  {
    name: "iPhone-SE",
    width: 320,
    height: 568,
    dpi: 2
  },
  {
    name: "iPhone-6",
    width: 375,
    height: 667,
    dpi: 2
  },
  {
    name: "iPhone-6-Plus",
    width: 375,
    height: 667,
    dpi: 3
  },
  {
    name: "iPhone-7-Plus",
    width: 414,
    height: 736,
    dpi: 3
  },
  {
    name: "iPhone-X",
    width: 375,
    height: 812,
    dpi: 3
  }
];

devices.reduce(async (p, settings) => {
  await p;

  const config = {
    preset: "react-native",
    testMatch: ["**/__snapshotter__/**/*.js"],
    testRunner: require.resolve("./testRunner"),
    reporters: [require.resolve("./reporter")],
    testEnvironmentOptions: settings
  };

  return jest.run(["--config", JSON.stringify(config)]);
}, Promise.resolve());
