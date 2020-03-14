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

myFinder.on("stated", this.parse(this.initialPath));

myFinder.on("file", filePath => {
  clearTimeout(this.timerId);
  this.handleFile(filePath);
  this.timerId = setTimeout(() => {
    this.emit("processing", this.checked);
    this.emit("finished");
  }, 2000);
});

myFinder.on("directory", dirPath => this.handleDirectory(dirPath));

myFinder.on("processing", checked => {
  console.log(
    `Were checked ${checked.files} files, ${checked.directories} directories.`
  );
});

myFinder.on("finished", () => console.log("PARSING IS FINISHED"));
