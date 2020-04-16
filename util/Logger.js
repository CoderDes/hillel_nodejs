const { promises } = require("fs");
const { join } = require("path");

class Logger {
  #logDirPath = join(__dirname, "..", "log");
  #logFileName = "log.txt";

  set setLogFileName(value) {
    this.#logFileName = value;
  }
  createLogDir() {
    return promises.mkdir(this.#logDirPath);
  }
  checkLogDirExist() {
    return promises.access(this.#logDirPath);
  }
  checkLogFileExist() {
    return promises.access(join(this.#logDirPath, this.#logFileName));
  }
  createLogFile() {
    return promises.writeFile(join(this.#logDirPath, this.#logFileName), "");
  }
  writeLogData({ start, end, duration }) {
    const content = `
        startAt: ${start};
        endAt: ${end};
        duration: ${duration};
      `;
    return promises.appendFile(this.#logFileName, content);
  }
}

module.exports = Logger;
