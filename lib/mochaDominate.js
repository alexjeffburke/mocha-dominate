const { addHook } = require("pirates");
const path = require("path");

const configLoaders = require("./configLoaders");
const findFirstDirFor = require("./findFirstDirFor");

const isExt = ext => /^[.][a-z]+/.test(ext);

const optsToConfigLoaders = opts => {
  const loaders = [];

  if (opts.configModule) {
    loaders.push(configLoaders.js(opts.configModule));
  }

  if (opts.configFile) {
    loaders.push(configLoaders.json(opts.configFile, "mocha-dominate"));
  }

  return loaders;
};

const resolveConfig = opts => {
  let options;
  const rootDir = findFirstDirFor(opts.cwd, "package.json");
  if (rootDir) {
    optsToConfigLoaders(opts).some(configLoader => {
      options = configLoader(rootDir);
      return !!options;
    });
  }
  options = options || {};
  options.rootDir = rootDir;
  return options;
};

const prepareHook = opts => {
  const options = resolveConfig(opts);

  const fileExtsMap = options.transform || {};

  const exts = [];
  const extsToExec = {};
  const extsToIgnore = [];

  for (const ext of Object.keys(fileExtsMap)) {
    if (!isExt(ext)) {
      throw new Error(`invalid extension "${ext}"`);
    }

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

  return { options, exts, extsToExec, extsToIgnore };
};

const createHook = opts => {
  const { options, exts, extsToExec, extsToIgnore } = prepareHook(opts);

  const extensions = options.extensions || [];
  if (!(Array.isArray && extensions.every(isExt))) {
    throw new Error("allowed extensions array was not valid");
  }

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

  return require("./mochaHooks")(extensions);
};

module.exports = createHook;
module.exports.prepareHook = prepareHook;
