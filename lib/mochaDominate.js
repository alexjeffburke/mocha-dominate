const { addHook } = require("pirates");
const fs = require("fs");
const path = require("path");

const configLoaders = require("./configLoaders");
const findFirstDirFor = require("./findFirstDirFor");

let preamble = fs.readFileSync(
  path.join(__dirname, "templates/preamble"),
  "utf8"
);

// ensure absolute path to jsdom-global so it is accessible in the nested context
preamble = preamble.replace("{jsdom-global}", require.resolve("jsdom-global"));

const optsToConfigLoaders = opts => {
  const loaders = [];

  if (opts.configFile) {
    loaders.push(configLoaders.json(opts.configFile, "mocha-dominate"));
  }

  return loaders;
};

const prepareHook = opts => {
  let options;

  const rootDir = findFirstDirFor(opts.cwd, "package.json");
  if (rootDir) {
    optsToConfigLoaders(opts).some(configLoader => {
      options = configLoader(rootDir);
      return !!options;
    });
  }

  options = options || {};

  const fileExtsMap = options.transform || {};
  const exts = [".js"];
  const extsToExec = {};
  const extsToIgnore = [];

  Object.keys(fileExtsMap).forEach(ext => {
    if (fileExtsMap[ext] === null) {
      extsToIgnore.push(ext);
    } else if (typeof fileExtsMap[ext] === "string") {
      // assume we are dealing with a path in jest format
      const path = fileExtsMap[ext].replace("<rootDir>", rootDir);

      try {
        extsToExec[ext] = require(path);
      } catch (e) {
        throw new Error("missing transform");
      }
    }
    exts.push(ext);
  });

  return { exts, extsToExec, extsToIgnore };
};

const createHook = opts => {
  const { exts, extsToExec, extsToIgnore } = prepareHook(opts);

  addHook(
    (code, filename) => {
      const fileExt = path.extname(filename);

      if (extsToIgnore.includes(fileExt)) {
        return "";
      }

      if (extsToExec[fileExt]) {
        return extsToExec[fileExt].process(code, filename);
      }

      return [preamble, code].join("\n");
    },
    { exts }
  );
};

module.exports = createHook;
module.exports.prepareHook = prepareHook;
