const assert = require("assert");

describe("exampleconfig", () => {
  it("should ignore less", () => {
    assert.deepEqual(require("./example.less"), { cssModule: true });
  });

  it("should not process the default extension", () => {
    // document should not be defined given there is no hook for JS
    assert.ok(typeof document === "undefined");
  });
});
