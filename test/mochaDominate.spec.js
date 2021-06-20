const expect = require("unexpected");
const path = require("path");

const mochaDominate = require("../lib/mochaDominate");

const TESTDATA = path.join(__dirname, "..", "testdata");

describe("lib/mochaDominate", () => {
  describe("prepareHook", () => {
    describe("when specifying a null transform", () => {
      it("should list the extension as ignored", () => {
        const cwd = path.join(TESTDATA, "exampleproject");

        const output = mochaDominate.prepareHook({
          transform: { ".less": null },
          rootDir: cwd,
          extensions: []
        });

        expect(output, "to exhaustively satisfy", {
          exts: [".less"],
          extsToExec: {},
          extsToIgnore: [".less"]
        });
      });
    });

    describe("when specifying a path to a transform", () => {
      it("should require the extension and list it for exec", () => {
        const cwd = path.join(TESTDATA, "exampletransform");
        const testTransformPath = path.join(
          cwd,
          "transforms",
          "cssTransform.js"
        );
        const testTransform = require(testTransformPath);

        const output = mochaDominate.prepareHook({
          transform: { ".less": "<rootDir>/transforms/cssTransform.js" },
          rootDir: cwd,
          extensions: []
        });

        expect(output, "to equal", {
          exts: [".less"],
          extsToExec: {
            ".less": testTransform
          },
          extsToIgnore: []
        });
      });
    });
  });
});
