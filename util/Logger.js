const { promises } = require("fs");
const { join } = require("path");

class Logger {
  #logDirPath = join(__dirname, "..", "log");
  #timeLog = join(this.#logDirPath, "time-log.txt");
  #observeLog = join(this.#logDirPath, "observe-log.txt");
  #requestCounter = 0;
  #userAgents = new Set();

  constructor() {
    this.intervalId;
    this.observeDelay = 1000 * 60;
  }

  set setLogFileName(value = "log.txt") {
    if (typeof value !== "string") {
      throw new Error("Argument must be a string.");
    }
    this.#timeLog = join(__dirname, "..", value);
  }
  set setObserveDelay(value = 3000) {
    if (typeof value !== "number") {
      throw new Error("Value must be a number.");
    }
    if (value === Infinity || Number.isNaN(value)) {
      throw new Error("Value must not be an Infinity or NaN");
    }
    this.observeDelay = value;
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
  writeObserveLogData() {
    const content = `\n incoming requests: ${
      this.#requestCounter
    };\n unique user-agents: ${[...this.#userAgents]
      .map(agent => agent)
      .join(",\n")}.`;
    promises.writeFile(this.#observeLog, content).catch(err => {
      throw new Error(err);
    });
  }
  startObserve() {
    const observe = this.writeObserveLogData.bind(this);
    this.intervalId = setInterval(observe, this.observeDelay);
  }
  handleIncomingRequest(req) {
    this.#requestCounter++;
    this.#userAgents.add(req.headers["user-agent"]);
  }
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
