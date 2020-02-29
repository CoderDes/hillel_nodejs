const fs = require("fs");
const pathModule = require("path");

const checkFileExtension = require("./utils/checkExtension.js");
const calcCurrentDeepness = require("./utils/calcDeepness.js");
const drawFileName = require("./utils/drawName.js");

function first(args) {
  const { colors, deep, path } = args;
  const absolutePathToDirectory = pathModule.resolve(process.env.HOME, path);

  fs.access(absolutePathToDirectory, err => {
    if (err) {
      throw new Error(err.message);
    }

    fs.readdir(absolutePathToDirectory, (err, files) => {
      if (err) {
        throw new Error(err.message);
      }

      files.forEach(file => {
        const absolutePathToCurrentFile = pathModule.resolve(
          absolutePathToDirectory,
          file
        );

        const currentDeep = calcCurrentDeepness(absolutePathToCurrentFile);

        fs.stat(absolutePathToCurrentFile, (err, stats) => {
          if (err) {
            throw new Error(err.message);
          }
          if ((stats.isDirectory() && !deep) || currentDeep <= deep) {
            first({ colors, deep, path: absolutePathToCurrentFile });
          }
          if (stats.isFile()) {
            if (checkFileExtension(file, process.env.EXT)) {
              drawFileName(file, colors);
            }
          }
        });
      });
    });
  });
}

module.exports = first;
