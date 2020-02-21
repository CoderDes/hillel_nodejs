const { argv } = require("yargs");

const first = require("./first.js");
const { second } = require("./second.js");
require("./third.js");

first(argv);
// second();
// third();
