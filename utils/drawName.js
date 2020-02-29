const chalk = require("chalk");

const { convertArgToArray } = require("./convertToArray.js");

let colorNumber = 0;
function drawFileName(file, colors) {
  colors = convertArgToArray(colors);
  colorNumber = colorNumber === colors.length - 1 ? 0 : colorNumber + 1;
  console.log(chalk.keyword(colors[colorNumber])(file));
}

module.exports = drawFileName;
