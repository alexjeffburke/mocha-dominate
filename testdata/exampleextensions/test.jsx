const assert = require("assert");

describe("exampleconfig", () => {
  it("should ignore less", () => {
    assert.deepEqual(require("./example.less"), { cssModule: true });
  });

  it("should process the specified extension", () => {
    // document should be defined given there is a hook for JSX
    assert.ok(typeof document !== "undefined");
  });
});
