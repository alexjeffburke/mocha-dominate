const assert = require("assert");

describe("exampletransform", () => {
  it("should transform less", () => {
    assert.deepEqual(require("./example.less"), { cssModule: true });
  });
});
