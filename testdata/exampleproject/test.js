const assert = require("assert");

describe("exampleproject", () => {
  it("should ignore less", () => {
    assert.deepEqual(require("./example.less"), {});
  });
});
