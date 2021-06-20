const { addHook } = require("pirates");
const path = require("path");

const resolveConfig = require("./resolveConfig");

const prepareHook = options => {
  const exts = [];
  const extsToExec = {};
  const extsToIgnore = [];

  const fileExtsMap = options.transform;
  for (const ext of Object.keys(fileExtsMap)) {
    if (fileExtsMap[ext] === null) {
      extsToIgnore.push(ext);
    } else if (typeof fileExtsMap[ext] === "string") {
      // assume we are dealing with a path in jest format
      const path = fileExtsMap[ext].replace("<rootDir>", options.rootDir);

      try {
        extsToExec[ext] = require(path);
      } catch (e) {
        throw new Error(`missing transform "${path}"`);
      }
    }
    exts.push(ext);
  }

  return { exts, extsToExec, extsToIgnore };
};

const createHook = opts => {
  const options = resolveConfig(opts);
  const { exts, extsToExec, extsToIgnore } = prepareHook(options);

  addHook(
    (code, filename) => {
      const fileExt = path.extname(filename);

      if (extsToIgnore.includes(fileExt)) {
        return "";
      }

      if (extsToExec[fileExt]) {
        return extsToExec[fileExt].process(code, filename);
      }

      return code;
    },
    { exts }
  );

  return require("./mochaHooks")(options.extensions);
};

module.exports = createHook;
module.exports.prepareHook = prepareHook;
