const fs = require("fs");
const pathModule = require("path");
const chalk = require("chalk");

// TODO: to the separate module
function convertArgToArray(argument) {
  if (Array.isArray(argument)) {
    return argument;
  }

  return argument
    .replace(/'/g, "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .split(",")
    .map(elem => elem.trim());
}

// TODO: to the separate module
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

// TODO: to the separate module
let colorCounter = 0;
function defineColorToDraw(colors) {
  if (colors.length === colorCounter) {
    colorCounter = 0;
  }
  return colors[colorCounter++];
}

// TODO: to the separate module
function drawFileName(file, colors) {
  colors = convertArgToArray(colors);
  console.log(chalk[defineColorToDraw(colors)](file));
}

let currentDeepness = 1;
function first(args) {
  const { ext, colors, deep, path } = args;
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
        const currentPath = pathModule.resolve(absolutePathToDirectory, file);
        fs.stat(currentPath, (err, stats) => {
          if (err) {
            throw new Error(err.message);
          }
          if (stats.isDirectory()) {
            // currentDeepness++;
            first({ ext, colors, deep, path: currentPath });
          }
          if (stats.isFile()) {
            if (checkFileExtension(file, ext)) {
              drawFileName(file, colors);
            }
          }
        });
      });
    });
  });
}

module.exports = first;
