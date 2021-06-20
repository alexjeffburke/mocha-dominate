const expect = require("unexpected");
const path = require("path");

const resolveConfig = require("../lib/resolveConfig");

const TESTDATA = path.join(__dirname, "..", "testdata");

describe("lib/resolveConfig", () => {
  describe("when executed in a nested directory", () => {
    it("should resolve config from the nearest file to the execution directory", () => {
      const cwd = path.join(TESTDATA, "exampleproject");

      const config = resolveConfig({
        cwd,
        configFile: "package.json"
      });

      expect(config, "to equal", {
        transform: { ".less": null },
        rootDir: cwd,
        extensions: []
      });
    });

    describe("when transform modules are specified", () => {
      it("should require the transform", () => {
        const cwd = path.join(TESTDATA, "exampletransform");

        const config = resolveConfig({
          cwd,
          configFile: "package.json"
        });

        expect(config, "to equal", {
          transform: { ".less": "<rootDir>/transforms/cssTransform.js" },
          rootDir: cwd,
          extensions: []
        });
      });
    });
  });
});
