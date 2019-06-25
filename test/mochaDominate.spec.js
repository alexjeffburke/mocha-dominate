const assert = require("assert");

describe("mocha-dominate", () => {
  it("should have a global window", () => {
    assert.ok(window);
  });

  it("should have a global document", () => {
    assert.ok(document);

    // drop a leftover that should be cleared
    document.body.innerHTML = "<h1>teehee</h1>";
  });

  it("should not allow effects to bleed between tests", () => {
    assert.strictEqual(document.body.innerHTML, "");
  });
});
