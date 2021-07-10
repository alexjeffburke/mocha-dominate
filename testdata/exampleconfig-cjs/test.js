const assert = require("assert");

describe("exampleconfig", () => {
  it("should ignore less", () => {
    assert.deepEqual(require("./example.less"), { cssModule: true });
  });
});
