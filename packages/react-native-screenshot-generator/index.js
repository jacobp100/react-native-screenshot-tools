const path = require("path");
const threads = require("threads");
const devices = require("./devices");
const logger = require("./logger");

const pool = new threads.Pool();

let currentLog = 0;
const logs = new Array(devices.length).fill(null);
const logUpto = index => log => {
  logs[index] = log;

  const nextLogs = logs.slice(currentLog, index + 1);
  const canLog = nextLogs.every(l => l != null);
  if (canLog) {
    nextLogs.forEach(logger);
    currentLog = index + 1;
  }

  return log;
};

const runTest = (device, i) =>
  new Promise((res, rej) => {
    pool
      .run(path.join(__dirname, "/runner/index.js"))
      .send(device)
      .on("done", res)
      .on("error", rej);
  }).then(logUpto(i));

Promise.all(devices.map(runTest)).then(() => {
  pool.killAll();
}, console.log);
