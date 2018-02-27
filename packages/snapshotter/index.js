const runner = require("./runner");

runner(require.resolve("./test")).catch(console.error);
