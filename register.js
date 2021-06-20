const resolveConfig = require("./lib/resolveConfig");

const config = resolveConfig({
  cwd: process.cwd(),
  configFile: "package.json",
  configModule: "mocha-dominate.config.js"
});

const hookEach = () => {
  const hooks = require("./lib/mochaHooks")(config.extensions);

  beforeEach(hooks.beforeEach);
  afterEach(hooks.afterEach);
};
exports.hookEach = hookEach;

exports.mochaHooks = require("./lib/mochaDominate")(config);
