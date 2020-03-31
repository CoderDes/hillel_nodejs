const { createReadStream, promises } = require("fs");
const { join } = require("path");

const FileType = require("file-type");

const { page, notFound } = require("../assets/pageString.js");

class Router {
  #assetsPathRegExp = new RegExp("^/assets", "i");
  #messagesPathRegExp = new RegExp("^/messages", "i");
  #clientPathRegExp = new RegExp("/client", "i");
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
      response.end();
    } else if (
      this.#assetsPathRegExp.test(pathname) ||
      this.#clientPathRegExp.test(pathname)
    ) {
      const filePath = join(this.#rootDir, pathname);
      const { logger } = this.#props;

      promises
        .access(filePath)
        .then(() => {
          const rs = createReadStream(filePath);

          rs.once("data", async chunk => {
            const fileTypeData = await FileType.fromBuffer(chunk);
            if (fileTypeData) {
              response.setHeader("Content-type", fileTypeData.mime);
            } else {
              response.setHeader("Content-type", "application/json");
            }
            response.statusCode = 200;
            response.statusMessage = "Success";
            response.write(chunk);
            rs.pipe(response);
          });

          rs.on("error", err => {
            this.handleError(err, "Error. Possibly, such file doesn't exist.");
          });
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
    } else {
      response.setHeader("Content-type", "text/html");
      response.statusCode = 404;
      response.statusMessage = "Not Found.";
      response.write(notFound);
      response.end();
    }
  }
  handlePost(request, response) {
    console.log("POST");
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = parsedUrl;

    if (this.#messagesPathRegExp.test(pathname)) {
      this.#props.db.createCollection("new");
    }
  }
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
