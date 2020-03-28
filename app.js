const http = require("http");
const { createReadStream, accessSync, appendFileSync } = require("fs");
const { join, resolve } = require("path");

const FileType = require("file-type");

const { page, clientScriptPath } = require("./assets/pageString.js");
const Logger = require("./util/Logger.js");
const Router = require("./util/Router.js");

class Server {
  #serverData;

  constructor(Router, Logger) {
    this.server = http.createServer();
    this.router = new Router();
    this.logger = new Logger();
  }

  initialize() {
    this.server.on("listening", (request, response) => {
      this.#serverData = {
        request,
        response,
        server: this.server,
        logger: this.logger
      };

      try {
        this.router.initialize(this.#serverData);
      } catch (err) {
        throw new Error(err.message);
      }
    });

    this.server.once("listening", (request, response) => {
      this.logger.observeInterval = 5 * 1000;
      this.logger.initObserve(this.#serverData);
    });

    this.server.on("close", () => {
      this.logger.removeObserve();
    });

    this.server.listen(3000, "localhost", () => {
      console.log("Server is running...");
    });
  }
}

const server = new Server(Router, Logger);
server.initialize();
