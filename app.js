const pathModule = require("path");
const { homedir } = require("os");
const { argv } = require("yargs");

const Finder = require("./finder.js");

const { colors = ["red", "green", "blue"], deep = 0, path, filter } = argv;
const { EXT } = process.env;

const targetPath = pathModule.resolve(homedir(), path);

const myFinder = new Finder(targetPath, deep, EXT, colors, filter);

myFinder.on("started", () => {
  myFinder.parse(targetPath);
});

myFinder.on("file", filePath => {
  clearTimeout(myFinder.timerId);
  myFinder.handleFile(filePath);
  myFinder.timerId = setTimeout(() => {
    myFinder.emit("processing", myFinder.checked);
    myFinder.emit("finished");
  }, 2000);
});

myFinder.on("directory", dirPath => myFinder.handleDirectory(dirPath));

myFinder.on("processing", checked => {
  console.log(
    `Were checked ${checked.files} files, ${checked.directories} directories.`
  );
});

myFinder.on("finished", () => console.log("PARSING IS FINISHED"));

myFinder.emit("started");
