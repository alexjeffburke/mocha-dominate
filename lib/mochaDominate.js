const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

let preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

// ensure absolute path to jsdom-global so it is accessible in the nested context
preamble = preamble.replace("{jsdom-global}", require.resolve("jsdom-global"));

const findFirstDirFor = (baseDir, searchFile) => {
  let currentDir = baseDir;
  let resultDir = null;

  do {
    try {
      fs.statSync(path.join(baseDir, searchFile));

      resultDir = currentDir;
    } catch (e) {
      currentDir = path.join(currentDir, "..");
    }
  } while (resultDir === null);

  return resultDir;
};

const prepareHook = cwd => {
  const dir = findFirstDirFor(cwd, "package.json");
  let opts = {};
  if (dir) {
    try {
      const file = path.join(dir, "package.json");
      const data = JSON.parse(fs.readFileSync(file, "utf8"));

      if (data["mocha-dominate"]) {
        opts = data["mocha-dominate"];
      }
    } catch (e) {}
  }

  const fileExtsMap = opts.transform || {};

  const exts = [".js"];
  const extsToIgnore = [];

  Object.keys(fileExtsMap).forEach(ext => {
    if (fileExtsMap[ext] === null) {
      extsToIgnore.push(ext);
    }
    exts.push(ext);
  });

  return { exts, extsToIgnore };
};

const createHook = cwd => {
  const { exts, extsToIgnore } = prepareHook(cwd);

  addHook(
    (code, filename) => {
      if (extsToIgnore.includes(path.extname(filename))) {
        return "";
      }

      return [preamble, code].join("\n");
    },
    { exts }
  );
};

module.exports = createHook;
module.exports.prepareHook = prepareHook;
