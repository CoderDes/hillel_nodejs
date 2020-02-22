const pathModule = require("path");

const { convertArgToArray } = require("./convertToArray.js");

function checkFileExtension(file, requiredExtensions) {
  requiredExtensions = convertArgToArray(requiredExtensions);

  const fileExt = pathModule.extname(file);
  let isFileWithTargetExt = false;

  for (ext of requiredExtensions) {
    if (ext === fileExt) {
      isFileWithTargetExt = true;
    }
  }

  return isFileWithTargetExt;
}

module.exports = checkFileExtension;
