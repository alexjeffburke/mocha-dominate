exports.mochaHooks = require("./lib/mochaDominate")({
  cwd: process.cwd(),
  configFile: "package.json",
  configModule: "mocha-dominate.config.js"
});
