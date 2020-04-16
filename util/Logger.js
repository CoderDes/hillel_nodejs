const { promises } = require("fs");
const { join } = require("path");

class Logger {
  #logDirPath = join(__dirname, "..", "log");
  #timeLog = join(this.#logDirPath, "time-log.txt");
  #observeLog = join(this.#logDirPath, "observe-log.txt");

  set setLogFileName(value = "log.txt") {
    if (typeof value !== "string") {
      throw new Error("Argument must be a string.");
    }
    this.#timeLog = join(__dirname, "..", value);
  }
  createLogDir() {
    return promises.mkdir(this.#logDirPath);
  }
  checkLogDirExist() {
    return promises.access(this.#logDirPath);
  }
  checkLogFileExist(type) {
    const path = type === "observe" ? this.#timeLog : this.#observeLog;
    return promises.access(path);
  }
  createLogFile(type) {
    const path = type === "observe" ? this.#timeLog : this.#observeLog;
    return promises.writeFile(path, "");
  }
  writeObserveLogData() {}
  writeTimeLogData({ start, end, duration, status }) {
    const content = `\n startAt: ${start};\n endAt: ${end};\n duration: ${duration} sec;\n status: ${status};\n`;
    return promises.appendFile(this.#timeLog, content);
  }
  init() {
    this.checkLogDirExist()
      .catch(err => {
        return this.createLogDir();
      })
      .then(() => {
        console.log("Log directory exists.");
        return this.checkLogFileExist("time");
      })
      .catch(err => {
        return this.createLogFile("time");
      })
      .then(() => {
        return this.checkLogFileExist("observe");
      })
      .catch(err => {
        return this.createLogFile("observe");
      })
      .then(() => {
        console.log("Log files exists.");
      });
  }
}

module.exports = Logger;
