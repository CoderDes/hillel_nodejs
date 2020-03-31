const { promises, createWriteStream, createReadStream } = require("fs");
const { join } = require("path");

const Timer = require("./Timer.js");

class Logger {
  timer = new Timer();
  // TODO: create a class of Observer and move observe logic there

  #observeInterval;

  #logData = {
    timeLog: {
      filename: join(__dirname, "..", "log", "log-time.txt"),
      dataStart: "",
      dataEnd: "",
      spentTime: "",
      metaData: "",
      summaryMessage: ""
    },
    observeLog: {
      filename: join(__dirname, "..", "log", "log-observe.txt"),
      userAgents: new Set(),
      userAgentsList: "",
      requestsQuantity: 0,
      code: null,
      status: null,
      summaryMessage: ""
    },
    messageDelimeter: "\n\n"
  };

  logMode = "";

  generateLogMessage(response) {
    this.buildLogData();
    const data = this.formatLogData(response);
    this.concatMessageFromData(data);
    // TODO: create log directory if it does not exist
    this.writeLog();
  }

  buildLogData() {
    if (this.logMode === "time") {
      this.#logData.timeLog.dataStart = this.timer.startTime;
      this.#logData.timeLog.dataEnd = this.timer.endTime;
      this.#logData.timeLog.spentTime = this.timer.calcSpentTimeInSec();
    }
    if (this.logMode === "observe") {
      let {
        observeLog: { userAgents, userAgentsList }
      } = this.#logData;

      if (userAgents.size) {
        for (let agent of userAgents) {
          userAgentsList = String.prototype.concat(`${agent}\n`);
        }
      }

      this.#logData.observeLog.userAgentsList = userAgentsList;
    }
  }

  formatLogData(response) {
    const formattedData = {};
    if (this.logMode === "time" && response) {
      let {
        timeLog: { dataStart, dataEnd, spentTime },
        messageDelimeter
      } = this.#logData;

      formattedData.dataStart = `Response started at ${dataStart}.\n`;
      formattedData.dataEnd = `Response ended at ${dataEnd}.\n`;
      formattedData.spentTime = `Time spent is ${spentTime} sec.\n`;
      formattedData.metaData = `Response status: ${response.statusCode}. Response message: ${response.statusMessage}.`;
      formattedData.messageDelimeter = messageDelimeter;
    }
    if (this.logMode === "observe") {
      let {
        observeLog: { userAgentsList, requestsQuantity, code, status },
        messageDelimeter
      } = this.#logData;

      formattedData.userAgentsList = `Unique user-agents:\n ${userAgentsList}`;
      formattedData.requestsQuantity = `Requests: ${requestsQuantity}.\n`;
      formattedData.code = `Code: ${code}.\n`;
      formattedData.status = `Status: ${status}.\n`;
      formattedData.messageDelimeter = messageDelimeter;
    }
    return formattedData;
  }

  concatMessageFromData(data) {
    if (this.logMode === "time") {
      const {
        dataStart,
        dataEnd,
        spentTime,
        metaData,
        messageDelimeter
      } = data;
      this.#logData.timeLog.summaryMessage = String.prototype.concat(
        dataStart,
        dataEnd,
        spentTime,
        metaData,
        messageDelimeter
      );
    }
    if (this.logMode === "observe") {
      const {
        userAgentsList,
        requestsQuantity,
        code,
        status,
        messageDelimeter
      } = data;
      this.#logData.observeLog.summaryMessage = String.prototype.concat(
        userAgentsList,
        requestsQuantity,
        code,
        status,
        messageDelimeter
      );
    }
  }

  set observeInterval(timeInMs) {
    this.#observeInterval = timeInMs;
  }

  createLogFile() {
    const path = this.logMode.includes("time")
      ? this.#logData.timeLog.filename
      : this.#logData.observeLog.filename;

    promises.access(path).catch(err => {
      console.log(`File ${path} doesn't exits. Create.`);
      writeFileSync(path, "");
    });
  }

  writeLog() {
    const path = this.logMode.includes("time")
      ? this.#logData.timeLog.filename
      : this.#logData.observeLog.filename;
    const data = this.logMode.includes("time")
      ? this.#logData.timeLog.summaryMessage
      : this.#logData.observeLog.summaryMessage;

    const writeStream = createWriteStream(path);
    writeStream.write(data);

    promises
      .appendFile(path, data)
      .then(() => {
        // console.log("DATA LOGGED")
      })
      .catch(err => console.error(err));
  }

  handleObserve() {
    // console.log("OBSERVE...");
    this.generateLogMessage();
  }

  initObserve(params) {
    // console.log("INIT OBSERVER");
    const { server, response } = params;
    this.createLogFile(this.#logData.observeLog.filename);

    server.on("request", reqData => {
      this.logMode = "observe";
      const userAgent = reqData.headers["user-agent"];

      this.#logData.observeLog.userAgents.add(userAgent);
      this.#logData.observeLog.requestsQuantity++;
    });

    const intervalParams = {
      cb: this.handleObserve.bind(this),
      delay: this.#observeInterval
    };
    this.timer.generateInterval(intervalParams);
  }

  removeObserve() {
    this.logMode = "";
    this.observeInterval(0);
    this.timer.eraseInterval();
  }
}

module.exports = Logger;
