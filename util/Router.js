const { createReadStream, promises, appendFileSync } = require("fs");
const { join, resolve } = require("path");

const FileType = require("file-type");

const { page, clientScriptPath } = require("../assets/pageString.js");

class Router {
  #assetsPathRegExp = new RegExp("^/assets", "i");
  #messagesPathRegExp = new RegExp("^/messages", "i");
  #props;
  #rootDir = join(__dirname, "..");

  getServerData(data) {
    this.#props = { ...data };
  }

  run() {
    const { request, response } = this.#props;

    if (!request) {
      return;
    }

    this.handleMethod(request, response);
  }

  handleMethod(request, response) {
    try {
      const { method } = request;
      switch (method) {
        case "GET":
          this.handleGet(request, response);
          break;
        case "POST":
          this.handlePost(request, response);
          break;
        case "PUT":
          this.handlePut(request, response);
          break;
        case "DELETE":
          this.handleDelete(request, response);
          break;
      }
    } catch (err) {
      const { response } = this.#props;
      const errData = {
        err,
        message: "Something wrong with request method.",
        response
      };
      this.handleError(errData);
    }
  }
  handleGet(request, response) {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = parsedUrl;

    if (pathname === "/") {
      console.log("ROOT", pathname);
      response.setHeader("Content-type", "text/html");
      response.statusCode = 200;
      response.statusMessage = "Success";
      response.write(page);
      response.on("finish", () => {
        console.log("ROOT RESPONSE FINISHED");
      });
      response.on("close", () => {
        console.log("ROOT RESPONSE CLOSED");
      });
      response.end("THE END");
      return;
    }
    if (this.#assetsPathRegExp.test(pathname)) {
      const filePath = join(this.#rootDir, pathname);
      const { logger } = this.#props;

      // TODO: refactor to async access
      // accessSync(filePath);
      promises
        .access(filePath)
        .then(() => {
          const rs = createReadStream(filePath);

          rs.once("data", async chunk => {
            const fileTypeData = await FileType.fromBuffer(chunk);
            response.setHeader("Content-type", fileTypeData.mime);
            response.statusCode = 200;
            response.statusMessage = "Success";
            response.write(chunk);
            rs.pipe(response);
          });

          rs.on("error", err => {
            this.handleError(err, "Error. Possibly, such file doesn't exist.");
          });
          // TODO: check differences from 'close' and 'finish'
          response.once("pipe", () => {
            logger.logMode = "time";
            logger.createLogFile();
            logger.timer.startCount(new Date());
          });

          response.once("unpipe", () => {
            logger.timer.endCount(new Date());
            response.end();
          });

          response.on("close", () => {
            // TODO: handle cases with closed responses
            console.log("RESPONSE CLOSED");
          });

          response.on("finish", () => {
            console.log("RESPONSE FINISHED");
            logger.generateLogMessage(response);
            logger.logMode = "observe";
            response.end();
          });
        })
        .catch(err => {
          console.dir(err);
        });
      return;
    }
  }
  handlePost(request) {}
  handlePut(request) {}
  handleDelete(request) {}
  handleError(data) {
    const { err, message, response } = data;

    response.statusCode = 500;
    response.end(`Error: ${message}`);

    console.error(`ERROR: ${err.message}`);
  }
}

module.exports = Router;
