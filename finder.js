const fs = require("fs");
const pathModule = require("path");
const { homedir } = require("os");
const EventEmitter = require("events");

const chalk = require("chalk");

class Finder extends EventEmitter {
  constructor(
    dirPath = homedir(),
    deep = 0,
    ext = [],
    colors = "green",
    filter = ""
  ) {
    super();
    this.initialPath = dirPath;
    this.deep = deep;
    this.ext = JSON.parse(ext);
    this.filter = filter;
    this.colorNumber = 0;
    this.colors = JSON.parse(colors);
    this.timerId;
    this.checked = {
      files: 0,
      directories: 0
    };
  }
  checkPath(path) {
    try {
      fs.accessSync(path);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  calcCurrentDeepness(elemPath) {
    const relativePath = pathModule.relative(elemPath, this.initialPath);
    return relativePath.split(pathModule.sep).length;
  }
  drawFileName(fileName, colors) {
    this.colorNumber =
      this.colorNumber === colors.length - 1 ? 0 : this.colorNumber + 1;
    console.log(chalk.keyword(colors[this.colorNumber])(fileName));
  }
  checkFileExtension(file, requiredExtensions) {
    if (!requiredExtensions.length) {
      throw new Error("Please, pass at least one extension to search.");
    }

    const fileExt = pathModule.extname(file);

    return requiredExtensions.includes(fileExt);
  }
  handleFile(filePath) {
    this.checked.files++;
    if (this.filter && !filePath.includes(this.filter)) {
      return;
    }
    if (this.checkFileExtension(filePath, process.env.EXT)) {
      this.drawFileName(filePath, this.colors);
    }
  }
  handleDirectory(dirPath) {
    this.checked.directories++;
    this.parse(dirPath);
  }
  iterateDirectoryContent(elements, path) {
    elements.forEach(elem => {
      const { name } = elem;
      const currentPath = pathModule.resolve(path, name);
      const currentDeep = this.calcCurrentDeepness(currentPath);

      if (elem.isFile()) {
        this.emit("file", currentPath);
      }
      if ((elem.isDirectory() && !this.deep) || currentDeep <= this.deep) {
        this.emit("directory", currentPath);
      }
    });
  }
  readDirectory(path) {
    try {
      return fs.readdirSync(path, { withFileTypes: true });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  parse(path) {
    this.checkPath(path);
    const dirElems = this.readDirectory(path);
    this.iterateDirectoryContent(dirElems, path);
  }
}

module.exports = Finder;
