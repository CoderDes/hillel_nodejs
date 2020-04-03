const http = require("http");

const Logger = require("./util/Logger.js");
const Router = require("./util/Router.js");
const DBHandler = require("./util/DBHandler.js");

class Server {
  #serverProps;

  constructor(Router, Logger) {
    this.server = http.createServer(this.handleReqRes.bind(this));
    this.router = new Router();
    this.logger = new Logger();
    this.db = new DBHandler();
  }

  initialize() {
    this.server.once("listening", () => {
      this.#serverProps = {
        server: this.server,
        logger: this.logger,
        db: this.db
      };

      this.logger.observeInterval = 5 * 1000;
      this.logger.logMode = "observe";
      this.logger.initObserve(this.#serverProps);
      this.db.createDB();
    });

    this.server.on("close", () => {
      this.logger.removeObserve();
    });

    this.server.listen(3000, "localhost", () => {
      console.log("SERVER IS RUNNING.");
    });
  }

  handleReqRes(request, response) {
    this.#serverProps = Object.assign(this.#serverProps, { request, response });

    try {
      this.router.getServerData(this.#serverProps);
      this.router.run();
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

const server = new Server(Router, Logger);
server.initialize();
