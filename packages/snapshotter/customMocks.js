// console.log(require("react-native"));
// Object.assign(
//   require("react-native"),
//   require("js-versions-of-native-components")
// );
const JS = require("js-versions-of-native-components");

jest.doMock("Switch", () => JS.Switch);
