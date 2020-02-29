const pathModule = require("path");
const { homedir } = require("os");
const { argv } = require("yargs");

function calcCurrentDeepness(filePath) {
  const initialDirectory = pathModule.resolve(homedir(), argv.path);
  const relativePath = pathModule.relative(filePath, initialDirectory);
  return relativePath.split(pathModule.sep).length;
}

module.exports = calcCurrentDeepness;
