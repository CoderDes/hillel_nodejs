const { promises, createReadStream, createWriteStream } = require("fs");
const { join } = require("path");

class DBHandler {
  #rootPath = join(__dirname, "..");
  #dbPath = join(this.#rootPath, "db.json");

  createDB() {
    promises.access(this.#dbPath).catch(err => {
      promises.writeFile(this.#dbPath);
    });
  }
  checkCollection(name) {
    // TODO: fix bug with erasing of content db.json
    return new Promise((resolve, reject) => {
      let db = "";
      const rs = createReadStream(this.#dbPath, { encoding: "utf-8" });

      rs.on("data", chunk => {
        db += chunk;
        console.log("chunk", chunk);
      });
      rs.on("close", () => {
        console.log("READABLE CLOSED", db);
        db = JSON.parse(db);
        const isExist = name in db;
        resolve(isExist);
      });
    });
  }

  async createCollection(name) {
    console.log("DB CREATE COLLECTION");

    const isCollectionExist = await this.checkCollection(name);
    if (isCollectionExist) {
      console.log("COLLECTION ALREADY EXISTS", name);
      return;
    }
    const dbReadStream = createReadStream(this.#dbPath, { encoding: "utf-8" });
    const dbWriteSteam = createWriteStream(this.#dbPath);
    let currentDB = "";
    dbReadStream.on("open", () => console.log("FUCK"));
    dbReadStream.on("data", chunk => {
      currentDB += chunk;
    });
    dbReadStream.on("close", () => {
      console.log("READ STREAM CLOSED");
      currentDB = JSON.parse(currentDB);
      console.log("TYPE OF CURRENT DB", typeof currentDB);
    });
  }
  generateId() {
    return Math.random() * 1000;
  }
  readData(data) {}
  writeData(data) {
    const objToWrite = {};
    objToWrite.id = this.generateId();
    objToWrite[data.fieldName] = data.value;

    promises.access();
  }
  updateData(data) {}
  deleteData(data) {}
}

module.exports = DBHandler;
