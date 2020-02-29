const pathModule = require("path");

const { convertArgToArray } = require("./convertToArray.js");

function checkFileExtension(file, requiredExtensions) {
  requiredExtensions = convertArgToArray(requiredExtensions);

  if (!requiredExtensions.length) {
    throw new Error("Please, pass at least one extension to search.");
  }

  const fileExt = pathModule.extname(file);

  return requiredExtensions.includes(fileExt);
}

module.exports = checkFileExtension;
