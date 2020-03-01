const pathModule = require("path");
const { homedir } = require("os");
const { argv } = require("yargs");

const Finder = require("./finder.js");

const { colors = ["red", "green", "blue"], deep = 0, path, filter } = argv;
const { EXT } = process.env;

const myFinder = new Finder(
  pathModule.resolve(homedir(), path),
  deep,
  EXT,
  colors,
  filter
);
