const fs = require("fs");
const path = require("path");

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

module.exports = findFirstDirFor;
