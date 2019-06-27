const assert = require("assert");
const path = require("path");

const mochaDominate = require("../lib/mochaDominate");

const TESTDATA = path.join(__dirname, "..", "testdata");

describe("mochaDominate", () => {
  describe("prepareHook", () => {
    describe("when executed in a nested directory", () => {
      it("should find the nearest config to the execution directory", () => {
        const exampleproject = path.join(TESTDATA, "exampleproject");
        const output = mochaDominate.prepareHook(exampleproject);

        assert.deepEqual(output, {
          exts: [".js", ".less"],
          extsToIgnore: [".less"]
        });
      });
    });
  });
});
