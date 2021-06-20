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
  options = options ? { ...options } : {};
  options.rootDir = rootDir;

  // default optional parts of the config
  options.extensions = options.extensions || [];
  options.transform = options.transform || {};

  // check any specified extensions were valid
  if (!(Array.isArray(options.extensions) && options.extensions.every(isExt))) {
    throw new Error("allowed extensions array was not valid");
  }

  const fileExtsMap = options.transform;
  for (const ext of Object.keys(fileExtsMap)) {
    if (!isExt(ext)) {
      throw new Error(`transform specified for invalid extension "${ext}"`);
    }
  }

  return options;
};

module.exports = resolveConfig;
