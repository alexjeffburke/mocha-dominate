const jsdomGlobal = require("global-jsdom");
const path = require("path");

const mochaDominateSymbol = Symbol("mocha-dominate");

module.exports = function createMochaHooks(extensions) {
  const hooks = {};

  hooks.beforeEach = function() {
    const ext = path.extname(this.currentTest.file || "");
    if (ext && extensions.length > 0 && !extensions.includes(ext)) {
      return;
    }
    this[mochaDominateSymbol] = jsdomGlobal();
  };

  hooks.afterEach = function() {
    if (this[mochaDominateSymbol]) {
      this[mochaDominateSymbol]();
    }
  };

  return hooks;
};
