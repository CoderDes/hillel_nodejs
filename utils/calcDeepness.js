const pathModule = require("path");
const { argv } = require("yargs");

function calcCurrentDeepness(filePath) {
  const initialDirectory = pathModule.resolve(process.env.HOME, argv.path);
  const relativePath = pathModule.relative(filePath, initialDirectory);
  return relativePath.split(pathModule.sep).length;
}

module.exports = calcCurrentDeepness;
