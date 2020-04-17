const fs = require("fs");
const { join } = require("path");

const { FilesDataModel } = require("../model/Files.js");
const {
  checkAssetsDir,
  createAssetsDir,
  getAssetsContent,
  getFileType,
} = require("../util/files.js");
const Logger = require("../util/Logger.js");
const Timer = require("../util/Timer.js");

const logger = new Logger();
const timer = new Timer();

logger.init();

exports.getAllFilesFromDB = async (req, res) => {
  const { path } = req;
  const requiredExt = path.slice(1);

  const fileDataArr = await FilesDataModel.find(
    { ext: requiredExt },
    { _id: 0, name: 1 },
  )
    .lean()
    .exec();

  const fileNamesArr = fileDataArr.map(obj => obj.name);

  // TODO: solve issue with chunked image on client
  fileNamesArr.forEach(name => {
    const rs = fs.createReadStream(join(__dirname, "..", "assets", name));
    const logData = {};

    res.once("pipe", () => {
      timer.startTime();
    });
    res.on("error", () => {
      timer.endTime();
      logData.start = timer.startFormatted;
      logData.end = timer.endFormatted;
      logData.duration = timer.calcStartEndDiff();
      logData.status = "Failed";
      res.status(500).send("Sorry, something went wrong.");
    });
    res.once("close", () => {
      logger.writeTimeLogData(logData).catch(err => {
        throw new Error(err);
      });
    });
    res.once("finish", () => {
      timer.endTime();
      logData.start = timer.startFormatted;
      logData.end = timer.endFormatted;
      logData.duration = timer.calcStartEndDiff();
      logData.status = "Success";
    });

    rs.pipe(res);
  });
};

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
        // const rs = fs.createReadStream(
        //   join(__dirname, "..", "assets", elem.name),
        // );
        // let fileData = "";

        // rs.on("data", chunk => {
        //   fileData += chunk;
        // });

        // rs.on("close", async () => {
        //   const fileDoc = await FilesModel.create({
        //     name: elem.name,
        //     file: Buffer(fileData),
        //     mime: mime,
        //   });

        //   fileDoc.save();
        // });
        // ===========
      }
    });
    return;
  }
  throw new Error(
    "Assets directory is empty. Please, add files to assets directory.",
  );
};

exports.getFiles = (req, res) => {
  const { path } = req;
  const rs = fs.createReadStream(join(__dirname, "..", path));
  rs.pipe(res);
};
