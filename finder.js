const fs = require("fs");
const pathModule = require("path");
const { homedir } = require("os");
const EventEmitter = require("events");

const chalk = require("chalk");
const FileType = require("file-type");

class Finder extends EventEmitter {
  constructor(dirPath = homedir(), deep = 0, colors = "green", search, name) {
    super();
    this.initialPath = dirPath;
    this.deep = deep;
    this.search = search;
    this.name = name;
    this.regexp = this.convertNameToRegExp(name);
    this.colorNumber = 0;
    this.colors = JSON.parse(colors);
    this.timerId;
    this.checked = {
      files: 0,
      directories: 0
    };
    setImmediate(() => {
      this.emit("started");
    });
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
  checkFileType(file) {
    return FileType.fromFile(file)
      .then(res => {
        return (res && res.input) || pathModule.extname(file);
      })
      .then(ext => ext)
      .catch(err => {
        throw new Error(err.message);
      });
  }
  async handleFile(filePath) {
    this.checked.files++;

    const fileType = await this.checkFileType(filePath);

    if (
      this.regexp.test(filePath) &&
      fileType === pathModule.extname(this.name)
    ) {
      this.drawFileName(filePath, this.colors);
    }
  }
  handleDirectory(dirPath) {
    this.checked.directories++;
    this.parse(dirPath);
    setImmediate(() => {
      this.emit("finished");
    });
  }
  convertNameToRegExp(name) {
    return new RegExp("^" + name.replace("*", ".+") + "$");
  }
  iterateDirectoryContent(elements, path) {
    elements.forEach(elem => {
      const { name } = elem;
      const currentPath = pathModule.resolve(path, name);
      const currentDeep = this.calcCurrentDeepness(currentPath);

      if (elem.isFile()) {
        this.emit("file", currentPath);
      }
      if ((elem.isDirectory() && !this.deep) || currentDeep < this.deep) {
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
  // TODO: create logMethod that creates logFile.txt with script running date
  //       in the name of that file and it must contain ALL CONSOLE OUPUT;
}

module.exports = Finder;
