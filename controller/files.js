const fs = require("fs");
const { join } = require("path");

const { FilesDataModel, FilesModel } = require("../model/Files.js");
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

logger
  .checkLogDirExist()
  .catch(err => {
    return logger.createLogDir();
  })
  .then(() => {
    console.log("Log directory exists.");
    return logger.checkLogFileExist();
  })
  .catch(err => {
    return logger.createLogFile();
  })
  .then(() => {
    console.log("Log file exists.");
  });

exports.getAllFilesWithExtension = async (req, res) => {
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

    res.once("pipe", () => {
      timer.startTime();
      console.log("RESPONSE STARTED");
    });
    res.on("error", () => {
      timer.end();
      console.log("RESPONSE ERROR");
    });
    res.once("close", () => {
      const logData = {};
      logData.startTime = timer.start;
      logData.endTime = timer.end;
      logData.duration = timer.calcStartEndDiff();
      logger.writeLogData(logData);
      console.log("RESPONSE CLOSED BY CLIENT");
    });
    res.once("finish", () => {
      timer.endTime();
      console.log("RESPONSE FINISHED");
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
