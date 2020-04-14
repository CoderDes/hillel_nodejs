const fs = require("fs");
const { join } = require("path");
const FileType = require("file-type");

const assetsPath = join(__dirname, "..", "assets");

exports.checkAssetsDir = function () {
  return fs.promises.access(assetsPath);
};
exports.getAssetsContent = function () {
  return fs.promises.readdir(assetsPath, { withFileTypes: true });
};
exports.createAssetsDir = function () {
  return fs.promises.mkdir(assetsPath);
};
exports.getAssetsPath = function () {
  return assetsPath;
};
exports.getFileType = async function (file) {
  const { name } = file;
  const filePath = join(__dirname, "..", "assets", name);

  const stream = fs.createReadStream(filePath);
  const type = await FileType.fromStream(stream);

  return type;
};
