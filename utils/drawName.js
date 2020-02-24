const chalk = require("chalk");

const { defineColorToDraw } = require("./defineColor.js");
const { convertArgToArray } = require("./convertToArray.js");

function drawFileName(file, colors) {
  colors = convertArgToArray(colors);
  console.log(chalk[defineColorToDraw(colors)](file));
}

module.exports = drawFileName;
