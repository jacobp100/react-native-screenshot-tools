const jest = require("jest");

const config = {
  testMatch: ["**/__snapshotter__/**/*.js"],
  testRunner: require.resolve("./testRunner"),
  reporters: [require.resolve("./reporter")],
  testEnvironmentOptions: { dpi: 2 }
};

jest.run(["--preset", "react-native", "--config", JSON.stringify(config)]);
