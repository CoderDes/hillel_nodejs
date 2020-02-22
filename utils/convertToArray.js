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

module.exports.convertArgToArray = convertArgToArray;
