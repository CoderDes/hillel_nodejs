let colorCounter = 0;
function defineColorToDraw(colors) {
  if (colors.length === colorCounter) {
    colorCounter = 0;
  }
  return colors[colorCounter++];
}

module.exports.defineColorToDraw = defineColorToDraw;
