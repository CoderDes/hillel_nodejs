const { promises } = require("fs");
const { join } = require("path");

class Logger {
  #logDirPath = join(__dirname, "..", "log");
  #logFilePath = join(this.#logDirPath, "log.txt");

  set setLogFileName(value = "log.txt") {
    if (typeof value !== "string") {
      throw new Error("Argument must be a string.");
    }
    this.#logFilePath = join(__dirname, "..", value);
  }
  createLogDir() {
    return promises.mkdir(this.#logDirPath);
  }
  checkLogDirExist() {
    return promises.access(this.#logDirPath);
  }
  checkLogFileExist() {
    return promises.access(this.#logFilePath);
  }
  createLogFile() {
    return promises.writeFile(this.#logFilePath, "");
  }
  writeLogData({ start, end, duration, status }) {
    const content = `\n startAt: ${start};\n endAt: ${end};\n duration: ${duration} sec;\n status: ${status};\n`;
    return promises.appendFile(this.#logFilePath, content);
  }
}

module.exports = Logger;
