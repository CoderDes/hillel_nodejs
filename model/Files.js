const mongoose = require("../database/connect.js");
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
