const fs = require("fs");
const pathModule = require("path");
const chalk = require("chalk");

function checkFileExtension(file, requiredExtensions) {
  // TODO: check if it a file

  const fileExt = pathModule.extname(file);
  let isFileWithTargetExt = false;

  for (ext of requiredExtensions) {
    if (ext === fileExt) {
      isFileWithTargetExt = true;
    }
  }

  return isFileWithTargetExt;
}

let colorCounter = 0;
function defineColorToDraw(colors) {
  if (colors.length - 1 === colorCounter) {
    colorCounter = 0;
  }

  return colors[colorCounter++];
}

function drawFileName(file, colors) {
  console.log(chalk[defineColorToDraw(colors)](file));
}

function first(args) {
  const { ext = [], colors = ["red", "green", "blue"], deep = 0, path } = args;
  const absolutePathToDirectory = pathModule.resolve("/home/eugene", path);
  // TODO: convert string to array EXT

  fs.access(absolutePathToDirectory, err => {
    if (err) {
      throw new Error(err.message);
    }

    fs.readdir(absolutePathToDirectory, (err, files) => {
      if (err) {
        throw new Error(err.message);
      }

      files.forEach(file => {
        if (checkFileExtension(file, ext)) {
          drawFileName(file, colors);
        }
      });
    });
  });
}

module.exports = first;
