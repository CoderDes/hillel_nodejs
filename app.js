const { argv } = require("yargs");

const first = require("./first.js");
const { second } = require("./second.js");
require("./third.js");

const { colors = ["red", "green", "blue"], deep = 0, path } = argv;

first({ colors, deep, path });
// second();
// third();
