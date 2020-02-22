const { argv } = require("yargs");

const first = require("./first.js");
const { second } = require("./second.js");
require("./third.js");

const { ext = [], colors = ["red", "green", "blue"], deep = 0, path } = argv;

first({ ext, colors, deep, path });
// second();
// third();
