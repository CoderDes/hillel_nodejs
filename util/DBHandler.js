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
    return new Promise((resolve, reject) => {
      const rs = createReadStream(this.#dbPath, { encoding: "utf-8" });
      let db = "";

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
      const ws = createWriteStream(this.#dbPath);
      const obj = JSON.stringify({ dump: "dump" });
      console.log("LOL", typeof obj);
      ws.write(obj);
      ws.end();
      ws.on("end", () => {
        console.log("EMPTY DATA WRITE END");
        resolve();
      });
    });
  }
  async createCollection(name) {
    try {
      const stat = await promises.stat(this.#dbPath);
      if (!stat.size) {
        await this.handleEmptyDBFile();
      }
      const isCollectionExist = await this.checkCollection(name);
      if (isCollectionExist) {
        return;
      }
      const currentDB = await promises.readFile(this.#dbPath);
      const parsedDB = JSON.parse(currentDB);
      const updatedDB = Object.assign(parsedDB, { [name]: {} });
      await promises.writeFile(this.#dbPath, JSON.stringify(updatedDB));
    } catch (err) {
      throw new Error(err.message);
    }
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
