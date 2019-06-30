const expect = require("unexpected");
const path = require("path");

const mochaDominate = require("../lib/mochaDominate");

const TESTDATA = path.join(__dirname, "..", "testdata");

describe("mochaDominate", () => {
  describe("prepareHook", () => {
    describe("when executed in a nested directory", () => {
      it("should find the nearest config to the execution directory", () => {
        const exampleproject = path.join(TESTDATA, "exampleproject");
        const output = mochaDominate.prepareHook({
          cwd: exampleproject,
          configFile: "package.json"
        });

        expect(output, "to equal", {
          exts: [".js", ".less"],
          extsToExec: {},
          extsToIgnore: [".less"]
        });
      });
    });

    describe("when transform modules are specified", () => {
      it("should require the transform", () => {
        const exampleproject = path.join(TESTDATA, "exampletransform");
        const output = mochaDominate.prepareHook({
          cwd: exampleproject,
          configFile: "package.json"
        });

        expect(output, "to exhaustively satisfy", {
          exts: [".js", ".less"],
          extsToExec: {
            ".less": {
              process: expect.it("to be a function")
            }
          },
          extsToIgnore: []
        });
      });
    });
  });
});
