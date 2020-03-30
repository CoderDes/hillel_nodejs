const { createReadStream, accessSync, appendFileSync } = require("fs");
const { join, resolve } = require("path");

const FileType = require("file-type");

const { page, clientScriptPath } = require("../assets/pageString.js");

// TODO: move routing logic here
const Logger = require("./Logger");

class Router {
  #assetsPathRegExp = new RegExp("^/assets", "i");
  #props;

  getServerData(data) {
    // console.log("SERVER DATA", data);
    this.#props = { ...data };
  }

  run() {
    const { request } = this.#props;
    if (!request) {
      return;
    }
    // console.log("ROUTER PROPS", this.#props);
    // console.log("REQUEST", this.#props.request);
    this.handleMethod(this.#props.request);
  }

  handleMethod(request) {
    try {
      const { method } = request;
      switch (method) {
        case "GET":
          console.log("CASE GET");
          this.handleGet(request);
          break;
        case "POST":
          this.handlePost(request);
          break;
        case "PUT":
          this.handlePut(request);
          break;
        case "DELETE":
          this.handleDelete(request);
          break;
        default:
          this.handleError();
      }
    } catch (err) {
      this.handleError(err, "Something wrong with request method.");
    }
  }
  handleGet(request) {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const { pathname } = parsedUrl;
    console.log("HANDLE GET");
    if (pathname === "/") {
      console.log("ROOT IN HANDLE GET");
      this.response.setHeader("Content-type", "text/html");
      this.response.statusCode = 200;
      this.response.statusMessage = "Success";
      this.response.write(page);
      this.response.end();
      return;
    }

    if (this.#assetsPathRegExp.test(pathname)) {
      const filePath = join(__dirname, pathname);

      accessSync(filePath);

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
      this.response.once("pipe", () => {
        logger.logMode = "time";
        logger.createLogFile(join(__dirname, "assets", "log-time.txt"));
        logger.timer.startCount(new Date());
      });

      this.response.once("unpipe", () => {
        logger.timer.endCount(new Date());
        response.end();
      });

      this.response.on("close", () => {
        console.log("RESPONSE CLOSED");
        logger.generateLogMessage(response);
        logger.logMode = "observe";
      });
      return;
    }
  }
  handlePost(request) {}
  handlePut(request) {}
  handleDelete(request) {}
  handleError(err, responseMessage) {
    console.log("ERROR", err);
    // TODO write real statuses to response
    // this.response.statusCode = code;
    // this.response.statusMessage = status;
    // this.response.write(`${message}.\n`)
    // this.response.end();
    // throw new Error(`Error: ${code}. ${message}`);
  }
}

module.exports = Router;
