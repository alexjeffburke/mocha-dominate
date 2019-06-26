const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

let preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

// ensure absolute path to jsdom-global so it is accessible in the nested context
preamble = preamble.replace("{jsdom-global}", require.resolve("jsdom-global"));

const createHook = opts => {
  opts = opts || {};
  const fileExtsMap = opts.exts || {};

  const exts = [".js"];
  const extsToIgnore = [];

  Object.keys(fileExtsMap).forEach(ext => {
    if (fileExtsMap[ext] === null) {
      extsToIgnore.push(ext);
    }
    exts.push(ext);
  });

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
