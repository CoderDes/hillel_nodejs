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
      // TODO: добавить проверку на пустоту файла. Проверить размер файла
      const rs = createReadStream(this.#dbPath, { encoding: "utf-8" });

      rs.on("data", chunk => {
        db += chunk;
        console.log("chunk", chunk);
      });
      rs.on("open", () => {
        console.log("OLD READABLE OPENED");
      });
      rs.on("end", () => {
        console.log("OLD READABLE END", db);
        rs.destroy();
        db = JSON.parse(db);
        const isExist = name in db;
        resolve(isExist);
      });
    });
  }
  handleEmptyDBFile() {
    return new Promise((resolve, reject) => {
      console.log("HANDLE EMPTY FILE");
      const ws = createWriteStream(this.#dbPath);
      const obj = JSON.stringify({ dump: "dump" });
      console.log("LOL", typeof obj);
      ws.write(obj);
      ws.end();
      // ws.on("finish", () => {
      //   console.log("EMPTY DATA WRITE FLUSHED");
      // });
      ws.on("end", () => {
        console.log("EMPTY DATA WRITE END");
        resolve();
      });
    });
  }
  async createCollection(name) {
    console.log("DB CREATE COLLECTION");
    const stat = await promises.stat(this.#dbPath);
    if (!stat.size) {
      await this.handleEmptyDBFile();
    }
    const isCollectionExist = await this.checkCollection(name);
    if (isCollectionExist) {
      console.log("COLLECTION ALREADY EXISTS", name);
      return;
    }
    console.log("=======================");
    const dbReadStream = createReadStream(this.#dbPath, { encoding: "utf-8" });
    const dbWriteSteam = createWriteStream(this.#dbPath);
    let currentDB = "";
    dbReadStream.on("open", () => console.log("NEW READ STREAM IS OPENED"));
    dbReadStream.on("data", chunk => {
      // NOTHING RECIEVE HERE. WHY?
      console.log("NEW READABLE DATA", chunk);
      currentDB += chunk;
    });
    dbReadStream.on("end", () => {
      console.log("NEW READ STREAM CLOSED");
      console.log("DB ON NEW CLOSED READ STREAM", currentDB);
      currentDB = JSON.parse(currentDB);
      currentDB[name] = {};
      console.log("TYPE OF CURRENT DB", typeof currentDB);
      dbWriteSteam.write(JSON.stringify(currentDB));
      dbWriteSteam.on("finish", () => {
        console.log("DB COLLECTION CREATED", name);
      });
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
