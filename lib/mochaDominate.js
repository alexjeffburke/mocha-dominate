const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

let preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

// ensure absolute path to jsdom-global so it is accessible in the nested context
preamble = preamble.replace("{jsdom-global}", require.resolve("jsdom-global"));

addHook(
  code => {
    return [preamble, code].join("\n");
  },
  { exts: [".js"] }
);
