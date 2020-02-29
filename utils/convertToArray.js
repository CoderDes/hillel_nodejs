function convertArgToArray(argument) {
  if (Array.isArray(argument)) {
    return argument;
  }

  return JSON.parse(argument);
}

module.exports.convertArgToArray = convertArgToArray;
