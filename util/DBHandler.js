const { promises, createReadStream, createWriteStream } = require("fs");
const { join } = require("path");

class DBHandler {
  #rootPath = join(__dirname, "..");
  #dbPath = join(this.#rootPath, "db.json");

  createDB() {
    promises.access(this.#dbPath).catch(err => {
      promises.writeFile(this.#dbPath, JSON.stringify({ "": "" }));
    });
  }
  checkCollection(name) {
    return new Promise((resolve, reject) => {
      const rs = createReadStream(this.#dbPath, { encoding: "utf-8" });
      let db = "";

      rs.on("data", chunk => {
        db += chunk;
      });
      rs.on("end", () => {
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
      const updatedDB = Object.assign(parsedDB, { [name]: [] });
      await promises.writeFile(this.#dbPath, JSON.stringify(updatedDB));
    } catch (err) {
      throw new Error(err.message);
    }
  }
  generateId() {
    return Math.random() * 1000;
  }
  readData({ collection, id }) {
    return new Promise((resolve, reject) => {
      if (id === "all") {
        let db = "";
        const rs = createReadStream(this.#dbPath);
        rs.on("data", chunk => {
          db += chunk;
        });
        rs.on("end", () => {
          // const collectionToGive = JSON.parse(db)[collection];
          // console.log("!!!!!!", collectionToGive);
          resolve(JSON.parse(db)[collection]);
        });
        return;
      }
    });
  }
  writeData({ collection, data }) {
    const { userName, comment } = data;
    const newCollectionElem = {};
    newCollectionElem.id = this.generateId();
    newCollectionElem.userName = userName;
    newCollectionElem.comment = comment;

    promises
      .readFile(this.#dbPath)
      .then(currentDB => {
        currentDB = JSON.parse(currentDB);

        // TODO: fix possible bug if collection is not an array;
        const updatedCollection = [...currentDB[collection]];
        updatedCollection.push(newCollectionElem);

        const updatedDB = {};
        updatedDB[collection] = updatedCollection;
        return promises.writeFile(
          this.#dbPath,
          JSON.stringify(Object.assign(currentDB, updatedDB))
        );
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }
  updateData({ collection, data }) {
    const { id, userName, comment } = data;
    return new Promise((resolve, reject) => {
      return promises
        .readFile(this.#dbPath, { encoding: "utf-8" })
        .then(data => {
          const currentDB = JSON.parse(data);
          const oldElem = currentDB[collection].find(elem => +elem.id === +id);
          const newElem = Object.assign(oldElem, { id, userName, comment });
          const updatedCollection = currentDB[collection].filter(
            elem => +elem.id !== +oldElem.id
          );
          updatedCollection.push(newElem);

          const updatedDB = {};
          updatedDB[collection] = updatedCollection;

          promises
            .writeFile(
              this.#dbPath,
              JSON.stringify(Object.assign(currentDB, updatedDB))
            )
            .then(() => {
              resolve("Message edited.");
            })
            .catch(err => console.error(err));
        });
    });
  }
  deleteData({ collection, data }) {
    const { id } = data;

    return new Promise((resolve, reject) => {
      return promises
        .readFile(this.#dbPath, { encoding: "utf-8" })
        .then(data => {
          const currentDB = JSON.parse(data);
          const updatedCollection = currentDB[collection].filter(
            elem => +elem.id !== +id
          );

          const updatedDB = {};
          updatedDB[collection] = updatedCollection;

          promises
            .writeFile(
              this.#dbPath,
              JSON.stringify(Object.assign(currentDB, updatedDB))
            )
            .then(() => {
              resolve("Message deleted.");
            })
            .catch(err => console.error(err));
        });
    });
  }
}

module.exports = DBHandler;
