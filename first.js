const fs = require("fs");
const path = require("path");

function first(args) {
  console.log("ARGUMENTS", args);
  const { ext = [], colors = ["red", "green", "blue"], deep = 0, path } = args;
}

module.exports = first;
