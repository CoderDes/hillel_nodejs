const { join } = require("path");

const ResponseHandler = require("./ResponseHandler.js");
const { page, notFound } = require("../assets/pageString.js");

class Router {
  #path = {
    rootDir: join(__dirname, ".."),
    assetsPathRegExp: new RegExp("^/assets", "i"),
    messagesPathRegExp: new RegExp("^/messages", "i"),
    clientPathRegExp: new RegExp("/client", "i")
  };
  #props;
  #responseHandler;

  getServerData(data) {
    this.#props = { ...data };
  }

  run() {
    const { request, response } = this.#props;

    if (!request) {
      return;
    }

    this.#responseHandler = new ResponseHandler(response);

    this.handleMethod(request, response);
  }

  handleMethod(request) {
    try {
      const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
      const { method } = request;
      const { pathname } = parsedUrl;

      switch (method) {
        case "GET":
          this.handleGet(pathname);
          break;
        case "POST":
          this.handlePost(request, pathname);
          break;
        case "PUT":
          this.handlePut(request, pathname);
          break;
        case "DELETE":
          this.handleDelete(request, pathname);
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
  async handleGet(pathname) {
    if (pathname === "/") {
      this.#responseHandler.sendResponseWithPage(200, "Success", page);
    } else if (
      this.#path.assetsPathRegExp.test(pathname) ||
      this.#path.clientPathRegExp.test(pathname)
    ) {
      const filePath = join(this.#path.rootDir, pathname);
      this.#responseHandler.sendResponseWithFile(filePath, this.#props);
    } else if (this.#path.messagesPathRegExp.test(pathname)) {
      const data = await this.#props.db.readData({
        collection: "messages",
        id: "all"
      });
      this.#responseHandler.sendResponseWithJson(200, "Success", data);
    } else {
      this.#responseHandler.sendResponseWithPage(404, "Not Found.", notFound);
    }
  }
  getRequestBody(request) {
    return new Promise((resolve, reject) => {
      let body = "";
      request.on("data", chunk => {
        body += chunk;
      });
      request.on("end", () => {
        resolve(JSON.parse(body));
      });
    });
  }
  async handlePost(request, pathname) {
    if (this.#path.messagesPathRegExp.test(pathname)) {
      await this.#props.db.createCollection("messages");

      const body = await this.getRequestBody(request);
      const responseMessage = await this.#props.db.writeData({
        collection: "messages",
        data: body
      });

      this.#responseHandler.sendResponseWithText(
        200,
        "Success",
        responseMessage
      );
    }
  }
  async handlePut(request, pathname) {
    if (this.#path.messagesPathRegExp.test(pathname)) {
      const body = await this.getRequestBody(request);
      const responseMessage = await this.#props.db.updateData({
        collection: "messages",
        data: body
      });

      this.#responseHandler.sendResponseWithText(
        200,
        "Success",
        responseMessage
      );
    }
  }
  async handleDelete(request, pathname) {
    if (this.#path.messagesPathRegExp.test(pathname)) {
      const body = await this.getRequestBody(request);
      const responseMessage = await this.#props.db.deleteData({
        collection: "messages",
        data: body
      });

      this.#responseHandler.sendResponseWithText(
        200,
        "Success",
        responseMessage
      );
    }
  }
  handleError(data) {
    const { err } = data;

    this.#responseHandler.sendResponseWithError(
      500,
      "Internal error.",
      `ERROR: ${err.message}`
    );

    console.error(`ERROR: ${err.message}`);
  }
}

module.exports = Router;
