const { createReadStream, promises } = require("fs");

const FileType = require("file-type");

class ResponseHandler {
  constructor(response) {
    this.response = response;
  }

  sendResponseWithPage(statusCode, statusMessage, htmlPage) {
    console.log("RESPONSE WITH PAGE");
    this.response.setHeader("Content-type", "text/html");
    this.response.statusCode = statusCode;
    this.response.statusMessage = statusMessage;
    this.response.write(htmlPage);
    this.response.end();
  }
  sendResponseWithFile(filePath, props) {
    const { logger } = props;

    promises
      .access(filePath)
      .then(() => {
        const rs = createReadStream(filePath);
        // TODO: implement listener cleanup
        rs.once("data", async chunk => {
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
        });

        rs.on("error", err => {
          this.handleError(err, "Error. Possibly, such file doesn't exist.");
        });
        this.response.once("pipe", () => {
          logger.logMode = "time";
          logger.createLogFile();
          logger.timer.startCount(new Date());
        });

        this.response.once("unpipe", () => {
          logger.timer.endCount(new Date());
          this.response.end();
        });

        this.response.on("close", () => {
          // TODO: handle cases with closed responses
          // console.log("RESPONSE CLOSED");
        });

        this.response.on("finish", () => {
          logger.generateLogMessage(this.response);
          logger.logMode = "observe";
          this.response.end();
        });
      })
      .catch(err => {
        console.dir(err);
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
    console.log("RESPONSE WITH JSON DATA");
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
