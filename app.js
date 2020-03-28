const http = require("http");
const { createReadStream, accessSync, appendFileSync } = require("fs");
const { join, resolve } = require("path");

const FileType = require("file-type");

const { page, clientScriptPath } = require("./assets/pageString.js");
const Logger = require("./util/Logger.js");

const assetsPath = new RegExp("^/assets", "i");

// TODO: handle error code in util function
const logger = new Logger();

async function router(servData) {
  const { request, response } = servData;
  const { method, url } = request;
  const cleanUrl = new URL(url, `http://${request.headers.host}`);
  try {
    if (method === "GET") {
      const { pathname } = cleanUrl;

      if (pathname === "/") {
        console.log("PASS REGEXP IN ROOT");
        response.setHeader("Content-type", "text/html");
        response.statusCode = 200;
        response.statusMessage = "Success";
        response.write(page);
        response.end();
        return;
      }
      if (assetsPath.test(pathname)) {
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
          response.statusCode = 404;
          response.statusMessage = "Not found";
          response.write("Error. Possibly, such file doesn't exist.");
          response.end();
        });

        response.once("pipe", () => {
          logger.logMode = "time";
          logger.createLogFile(join(__dirname, "assets", "log-time.txt"));
          logger.timer.startCount(new Date());
        });

        response.once("unpipe", () => {
          logger.timer.endCount(new Date());
          response.end();
        });

        response.on("close", () => {
          logger.generateLogMessage(response);
          logger.logMode = "observe";
        });
        return;
      }
      response.statusCode = 404;
      response.statusMessage = "Not found";
      response.write("Error");
      response.end();
      // TODO: logging here too
    }
    if (method === "POST") {
    }
    if (method === "PUT") {
    }
    if (method === "DELETE") {
    }
  } catch (err) {
    response.statusCode = 500;
    response.statusMessage = "Internal error";
    response.write("Something went wrong. \n");
    response.end(`Error: ${err.message}`);
  }
}

const server = http.createServer((request, response) => {
  const serverData = {
    request,
    response,
    server: server
  };

  try {
    // TODO: maybe we don't need so much data any more here
    router(serverData);
  } catch (err) {
    throw new Error(err.message);
  }
});

server.once("listening", (request, response) => {
  const serverData = {
    request,
    response,
    server: server
  };
  logger.observeInterval = 5 * 1000;
  logger.initObserve(serverData);
});

server.on("close", () => {
  logger.removeObserve();
});

server.listen(3000, "localhost", () => {
  console.log("SERVER IS RUNNING");
});
