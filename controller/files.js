const { join } = require("path");

const { FilesDataModel, FilesModel } = require("../model/Files.js");
const {
  checkAssetsDir,
  createAssetsDir,
  getAssetsContent,
  getFileType,
} = require("../util/files.js");

exports.getAllFiles = ext => {};

exports.loadFilesToDB = async () => {
  try {
    await checkAssetsDir();
  } catch (err) {
    await createAssetsDir();
  }

  const dirElems = await getAssetsContent();

  if (dirElems.length) {
    dirElems.forEach(async (elem, index) => {
      if (elem.isFile()) {
        const { ext, mime } = await getFileType(elem);
        const fileDataDoc = await FilesDataModel.create({
          name: elem.name,
          ext: ext,
          mime: mime,
        });

        fileDataDoc.save();
        // ===========
        const fileBuffer = Buffer.from(
          join(__dirname, "..", "assets", elem.name),
        );
        const fileDoc = await FilesModel.create({
          name: elem.name,
          buffer: fileBuffer,
        });

        fileDoc.save();
      }
    });
    return;
  }
  throw new Error(
    "Assets directory is empty. Please, add files to assets directory.",
  );
};
