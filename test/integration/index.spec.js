const expect = require("unexpected");
const path = require("path");
const { spawn } = require("child_process");

const BASE_DIR = path.join(__dirname, "..", "..");
const MOCHA_BIN = path.join(BASE_DIR, "node_modules", ".bin", "mocha");
const TESTDATA = path.join(BASE_DIR, "testdata");

function spawnMochaInDir(cwd, args) {
  const spawnedCli = spawn(MOCHA_BIN, args, {
    cwd
  });

  const p = new Promise((resolve, reject) => {
    let sawExit = false;
    let stdout = "";
    let stderr = "";

    spawnedCli.stdout.on("data", chunk => {
      stdout += chunk.toString("utf8");
    });

    spawnedCli.stderr.on("data", chunk => {
      stderr += chunk.toString("utf8");
    });

    const makeError = code => {
      const error = new Error("spawnCli error");
      error.code = code;
      error.stdout = stdout;
      error.stderr = stderr;
      return error;
    };

    spawnedCli.on("error", err => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      reject(makeError(null));
    });

    spawnedCli.on("exit", code => {
      if (sawExit) {
        return;
      }

      sawExit = true;

      if (code) {
        reject(makeError(code));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

  p._spawn = spawnedCli;

  return p;
}

describe("integration", () => {
  it("should work for exampleproject", () => {
    const cwd = path.join(TESTDATA, "exampleproject");

    return spawnMochaInDir(cwd, ["-r", "../../register"]);
  });

  it("should work for exampletransform", () => {
    const cwd = path.join(TESTDATA, "exampletransform");

    return spawnMochaInDir(cwd, ["-r", "../../register"]);
  });

  it("should bail on missing transform", () => {
    const cwd = path.join(TESTDATA, "exampletransform-bad");

    return expect(
      () => spawnMochaInDir(cwd, ["-r", "../../register"]),
      "to be rejected"
    ).then(err => {
      expect(
        err.stderr,
        "to contain",
        `missing transform "${cwd}/transforms/cssTransform.js"`
      );
    });
  });

  it("should work for exampleconfig", () => {
    const cwd = path.join(TESTDATA, "exampleconfig");

    return spawnMochaInDir(cwd, ["-r", "../../register"]);
  });

  it("should bail on invalid extension", () => {
    const cwd = path.join(TESTDATA, "exampleconfig-bad");

    return expect(
      () => spawnMochaInDir(cwd, ["-r", "../../register"]),
      "to be rejected"
    ).then(err => {
      expect(err.stderr, "to contain", `invalid extension "less"`);
    });
  });

  describe("when using custom extensions", () => {
    it("should ignore missing extension (JS)", () => {
      const cwd = path.join(TESTDATA, "exampleextensions");

      return spawnMochaInDir(cwd, ["-r", "../../register", "test.js"]);
    });

    it("should handle listed extension (JSX)", () => {
      const cwd = path.join(TESTDATA, "exampleextensions");

      return spawnMochaInDir(cwd, ["-r", "../../register", "test.jsx"]);
    });
  });
});
