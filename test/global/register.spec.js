const assert = require("assert");

describe("mocha-dominate/register", () => {
  it("should have a global $jsdom", () => {
    // eslint-disable-next-line no-undef
    assert.ok($jsdom);
  });

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

  describe("when used with other hooks", () => {
    let someThing;

    beforeEach(() => {
      someThing = {};
    });

    it("should run the other beforeEach", () => {
      assert.ok(typeof someThing === "object");
    });
  });
});
