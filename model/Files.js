const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017", {
  dbName: "filesDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const filesDB = mongoose.connection;

filesDB.on("error", () => {
  console.error("Connection error:");
});

filesDB.on("open", () => {
  console.log("WE ARE CONNECTED TO DB");
});

// TODO: find out how to set indexes in modern way (not deprecated)
const fileDataSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true, index: true },
  ext: { type: String, require: true },
  mime: { type: String, require: true },
});

const filesSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  buffer: { type: Buffer, require: true, unique: true },
});

const FilesDataModel = mongoose.model("FilesData", fileDataSchema, "filesData");
const FilesModel = mongoose.model("Files", filesSchema, "files");

module.exports = {
  FilesDataModel,
  FilesModel,
};
