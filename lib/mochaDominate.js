const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

const preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

addHook(
  code => {
    return [preamble, code].join("\n");
  },
  { exts: [".js"] }
);
