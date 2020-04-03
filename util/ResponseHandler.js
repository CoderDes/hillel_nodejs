const { createReadStream, promises } = require("fs");

const FileType = require("file-type");

class ResponseHandler {
  constructor(response) {
    this.response = response;
  }

  sendResponseWithPage(statusCode, statusMessage, htmlPage) {
    this.response.setHeader("Content-type", "text/html");
    this.response.statusCode = statusCode;
    this.response.statusMessage = statusMessage;
    this.response.write(htmlPage);
    this.response.end();
  }
  sendResponseWithFile(filePath, props) {
    const { logger } = props;

    const errorListener = err => {
      this.handleError(err, "Error. Possibly, such file doesn't exist.");
    };

    const pipeListener = () => {
      logger.timer.endCount(new Date());
      this.response.end();
    };

    const unpipeListener = () => {
      logger.logMode = "time";
      logger.createLogFile();
      logger.timer.startCount(new Date());
    };

    promises
      .access(filePath)
      .then(() => {
        const rs = createReadStream(filePath);

        const firstDataChunk = async chunk => {
          const fileTypeData = await FileType.fromBuffer(chunk);
          if (fileTypeData) {
            this.response.setHeader("Content-type", fileTypeData.mime);
          } else {
            this.response.setHeader("Content-type", "application/json");
          }

          this.response.statusCode = 200;
          this.response.statusMessage = "Success";
          this.response.write(chunk);
          rs.pipe(this.response);
        };

        const listenersCleanup = () => {
          rs.off("data", firstDataChunk);
          rs.off("error", errorListener);
          this.response.off("pipe", pipeListener);
          this.response.off("unpipe", unpipeListener);
        };

        rs.once("data", firstDataChunk);
        rs.on("error", errorListener);
        this.response.once("pipe", pipeListener);
        this.response.once("unpipe", unpipeListener);
        this.response.on("finish", () => {
          logger.generateLogMessage(this.response);
          logger.logMode = "observe";
          this.response.end();
          listenersCleanup();
        });
      })
      .catch(err => {
        this.sendResponseWithError(500, err);
      });
  }
  sendResponseWithText(statusCode, statusMessage, textMessage) {
    this.response.setHeader("Content-type", "text/plain");
    this.response.statusCode = statusCode;
    this.response.statusMessage = statusMessage;
    this.response.write(textMessage);
    this.response.end();
  }
  sendResponseWithJson(statusCode, statusMessage, data) {
    this.response.setHeader("Content-type", "application/json");
    this.response.statusCode = statusCode;
    this.response.statusMessage = statusMessage;
    this.response.write(JSON.stringify(data));
    this.response.end();
  }
  sendResponseWithError(statusCode, error) {
    this.response.setHeader("Content-type", "text/plain");
    this.response.statusCode = statusCode;
    this.response.statusMessage = statusMessage;
    this.response.write(error.message);
    this.response.end();
  }
}

module.exports = ResponseHandler;
