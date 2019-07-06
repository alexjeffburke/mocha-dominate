const fs = require("fs");
const path = require("path");

exports.json = (configFile, configKey) => rootDir => {
  try {
    const file = path.join(rootDir, configFile);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));

    if (data && data[configKey]) {
      return data[configKey];
    }
  } catch (e) {
    // ignore
  }

  return null;
};
